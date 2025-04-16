import { z } from "zod";
import { subDays, format } from "date-fns";

import { DateTime } from "luxon";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import type { StresLevel } from "@prisma/client";
import { env } from "@/env";

type PredictionResponse = {
  tingkat_stres: number;
  confidence: [number, number, number];
};

export const stressRouter = createTRPCRouter({
  getHistory: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.prediksiStres.findMany({
      where: { userId: ctx.session.user.id },
      orderBy: { id: "desc" },
      take: 5,
      include: {
        dailyActivity: true,
      },
    });
  }),
  getSummary: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;

    // Ambil timezone user
    const user = await ctx.db.user.findUnique({
      where: { id: userId },
    });
    if (!user || !user.timezone) throw new Error("Timezone tidak ditemukan.");
    const timezone = user.timezone;

    // Hitung 7 hari terakhir berdasarkan zona waktu user
    const fromDate = DateTime.now()
      .setZone(timezone)
      .minus({ days: 6 })
      .startOf("day")
      .toJSDate();

    // --- Prediksi Stres ---
    const stresRaw = await ctx.db.prediksiStres.findMany({
      where: {
        userId,
        dailyActivity: {
          tanggal: {
            gte: fromDate,
          },
        },
      },
      include: {
        dailyActivity: true,
      },
      orderBy: {
        dailyActivity: {
          tanggal: "asc",
        },
      },
    });

    const stress = stresRaw.map((item) => {
      const day = DateTime.fromJSDate(item.dailyActivity.tanggal)
        .setZone(timezone)
        .toFormat("EEE"); // e.g., Mon

      return {
        day,
        stress:
          item.prediksi === "Rendah" ? 1 : item.prediksi === "Sedang" ? 2 : 3,
      };
    });

    // --- Aktivitas Harian ---
    const activityRaw = await ctx.db.dailyActivity.findMany({
      where: {
        userId,
        tanggal: {
          gte: fromDate,
        },
      },
      orderBy: {
        tanggal: "asc",
      },
    });

    const activity = activityRaw.map((item) => ({
      day: DateTime.fromJSDate(item.tanggal).setZone(timezone).toFormat("EEE"),
      sleep: item.jamTidur,
      screen: item.screenTime,
    }));

    // --- Streak ---
    const streakRaw = await ctx.db.streak.findMany({
      where: {
        userId,
        tanggal: {
          gte: fromDate,
        },
      },
      orderBy: {
        tanggal: "asc",
      },
    });

    const streak = streakRaw.map((item, index) => ({
      day: DateTime.fromJSDate(item.tanggal).setZone(timezone).toFormat("EEE"),
      streak: index + 1,
    }));

    return {
      stress,
      activity,
      streak,
    };
  }),
  checkToday: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;

    // Ambil timezone dari user
    const user = await ctx.db.user.findUnique({
      where: { id: userId },
    });
    if (!user || !user.timezone) throw new Error("Timezone tidak ditemukan.");
    const timezone = user.timezone;

    // Hitung awal dan akhir hari ini berdasarkan timezone user
    const startOfToday = DateTime.now().setZone(timezone).startOf("day");
    const endOfToday = startOfToday.plus({ days: 1 });

    const startOfTodayUTC = startOfToday.toUTC().toJSDate();
    const endOfTodayUTC = endOfToday.toUTC().toJSDate();

    console.log("Waktu Cek:", {
      lokal: {
        start: startOfToday.toISO(),
        end: endOfToday.toISO(),
      },
      UTC: {
        start: startOfTodayUTC.toISOString(),
        end: endOfTodayUTC.toISOString(),
      },
    });

    // Cari aktivitas hari ini berdasarkan waktu UTC yang dikonversi dari zona waktu user
    const existing = await ctx.db.dailyActivity.findFirst({
      where: {
        userId,
        tanggal: {
          gte: startOfTodayUTC,
          lt: endOfTodayUTC,
        },
      },
      select: {
        prediksiStres: true,
        tanggal: true,
      },
    });

    return {
      hasSubmitted: !!existing,
      level: existing ? existing.prediksiStres : null,
    };
  }),

  predictAndSave: protectedProcedure
    .input(
      z.object({
        sleepHours: z.number(),
        screenTime: z.number(),
        exerciseTime: z.number(),
        studyHours: z.number(),
        assignmentCount: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      // Ambil timezone user dari database
      const user = await ctx.db.user.findUnique({
        where: { id: userId },
      });
      if (!user || !user.timezone) throw new Error("Timezone tidak ditemukan.");

      const timezone = user.timezone;

      // Dapatkan awal & akhir hari ini sesuai timezone user
      const todayStart = DateTime.now()
        .setZone(timezone)
        .startOf("day")
        .toJSDate();
      const todayEnd = DateTime.now().setZone(timezone).endOf("day").toJSDate();

      // Cek apakah user sudah mengisi hari ini
      const existing = await ctx.db.dailyActivity.findFirst({
        where: {
          userId,
          tanggal: {
            gte: todayStart,
            lte: todayEnd,
          },
        },
      });

      if (existing) {
        throw new Error("Kamu sudah mengisi aktivitas harian hari ini.");
      }

      // Kirim ke FastAPI buat prediksi
      const response = await fetch(env.API_URL + "/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jam_tidur: input.sleepHours,
          screen_time: input.screenTime,
          waktu_olahraga: input.exerciseTime,
          waktu_belajar: input.studyHours,
          jumlah_tugas: input.assignmentCount,
        }),
      });

      const result = (await response.json()) as PredictionResponse;

      const prediksiLevel: StresLevel =
        result.tingkat_stres === 0
          ? "Rendah"
          : result.tingkat_stres === 1
            ? "Sedang"
            : "Tinggi";

      // Simpan aktivitas harian
      const activity = await ctx.db.dailyActivity.create({
        data: {
          userId,
          jamTidur: input.sleepHours,
          screenTime: input.screenTime,
          waktuOlahraga: input.exerciseTime,
          waktuBelajar: input.studyHours,
          jumlahTugas: input.assignmentCount,
          tanggal: new Date(), // Atau pakai DateTime.now().setZone(timezone).toJSDate() jika mau konsisten
        },
      });

      // Simpan hasil prediksi
      await ctx.db.prediksiStres.create({
        data: {
          userId,
          dailyActivityId: activity.id,
          prediksi: prediksiLevel,
          probRendah: result.confidence[0],
          probSedang: result.confidence[1],
          probTinggi: result.confidence[2],
        },
      });

      // Dapatkan awal & akhir hari kemarin sesuai timezone user
      const yesterdayStart = DateTime.now()
        .setZone(timezone)
        .minus({ days: 1 })
        .startOf("day")
        .toJSDate();

      const yesterdayEnd = DateTime.now()
        .setZone(timezone)
        .minus({ days: 1 })
        .endOf("day")
        .toJSDate();

      const yesterdayStreak = await ctx.db.streak.findFirst({
        where: {
          userId,
          tanggal: {
            gte: yesterdayStart,
            lte: yesterdayEnd,
          },
        },
      });

      // Kalau streak kemarin nggak ada, berarti reset -> hapus semua streak sebelumnya
      if (!yesterdayStreak) {
        await ctx.db.streak.deleteMany({
          where: { userId },
        });
      }

      // Tambah streak hari ini
      await ctx.db.streak.create({
        data: {
          userId,
          tanggal: new Date(), // Bisa disesuaikan juga dengan timezone
        },
      });

      return {
        result: prediksiLevel,
        confidence: result.confidence,
        continuedStreak: !!yesterdayStreak,
      };
    }),
});
