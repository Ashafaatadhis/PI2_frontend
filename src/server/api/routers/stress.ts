import { z } from "zod";
import { subDays, format } from "date-fns";

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

    const fromDate = subDays(new Date(), 6); // 7 hari ke belakang

    // Prediksi Stres
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

    const stress = stresRaw.map(
      (item: {
        dailyActivity: { tanggal: string | number | Date };
        prediksi: string;
      }) => ({
        day: format(item.dailyActivity.tanggal, "EEE"), // Misalnya: Mon
        stress:
          item.prediksi === "Rendah" ? 1 : item.prediksi === "Sedang" ? 2 : 3,
      }),
    );

    // Aktivitas Harian
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
      day: format(item.tanggal, "EEE"),
      sleep: item.jamTidur,
      screen: item.screenTime,
    }));

    // Streak (misalnya hitung dari tanggal-tanggal streak)
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
      day: format(item.tanggal, "EEE"),
      streak: index + 1, // atau kamu bisa hitung streak dari logic backend
    }));

    return {
      stress,
      activity,
      streak,
    };
  }),
  checkToday: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()); // 2025-04-12 00:00:00
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1); // 2025-04-13 00:00:00

    // Cari aktivitas untuk hari ini beserta level emosi
    const existing = await ctx.db.dailyActivity.findFirst({
      where: {
        userId,
        tanggal: {
          gte: today, // mulai dari jam 00:00 hari ini
          lt: tomorrow, // sebelum jam 00:00 besok
        },
      },
      select: {
        prediksiStres: true, // Ambil level emosi dari prediksi
        tanggal: true, // Ambil tanggal untuk konfirmasi
      },
    });

    return {
      hasSubmitted: !!existing,
      level: existing ? existing.prediksiStres : null, // Mengembalikan level, jika ada
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

      // Cek apakah sudah isi hari ini
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()); // 2025-04-12 00:00:00
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1); // 2025-04-13 00:00:00

      const existing = await ctx.db.dailyActivity.findFirst({
        where: {
          userId,
          tanggal: {
            gte: today, // mulai dari jam 00:00 hari ini
            lt: tomorrow, // sebelum jam 00:00 besok
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
          tanggal: now,
          jamTidur: input.sleepHours,
          screenTime: input.screenTime,
          waktuOlahraga: input.exerciseTime,
          waktuBelajar: input.studyHours,
          jumlahTugas: input.assignmentCount,
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

      // Cek streak kemarin
      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);

      const yesterdayStreak = await ctx.db.streak.findFirst({
        where: {
          userId,
          tanggal: {
            gte: yesterday,
            lt: new Date(yesterday.getTime() + 24 * 60 * 60 * 1000),
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
          tanggal: now,
        },
      });

      return {
        result: prediksiLevel,
        confidence: result.confidence,
        continuedStreak: !!yesterdayStreak,
      };
    }),
});
