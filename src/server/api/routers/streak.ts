import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

import { DateTime } from "luxon";

export const streakRouter = createTRPCRouter({
  getCurrent: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;

    const user = await ctx.db.user.findUnique({ where: { id: userId } });
    if (!user?.timezone) throw new Error("Timezone tidak ditemukan.");

    const timezone = user.timezone;

    const allStreaks = await ctx.db.streak.findMany({
      where: { userId },
      orderBy: { tanggal: "asc" },
    });

    const today = DateTime.now().setZone(timezone).startOf("day");

    const filledToday = allStreaks.some((s) => {
      const tanggal = DateTime.fromJSDate(new Date(s.tanggal))
        .setZone(timezone)
        .startOf("day");
      return tanggal.equals(today);
    });

    const count = allStreaks.length;

    const recent = allStreaks
      .filter((s) => {
        const tanggal = DateTime.fromJSDate(new Date(s.tanggal))
          .setZone(timezone)
          .startOf("day");
        const diff = today.diff(tanggal, "days").days;
        return diff >= 0 && diff <= 6;
      })
      .map(
        (s) =>
          DateTime.fromJSDate(new Date(s.tanggal)).setZone(timezone).weekday %
          7, // Senin = 1, Minggu = 7 → % 7 biar Minggu = 0
      );

    return {
      count,
      filledToday,
      recent,
    };
  }),
  getLogs: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;

    const logs = await ctx.db.prediksiStres.findMany({
      where: {
        userId,
      },
      select: {
        prediksi: true,
        dailyActivity: {
          select: {
            tanggal: true,
          },
        },
      },
      orderBy: {
        dailyActivity: {
          tanggal: "asc",
        },
      },
    });

    // Format output-nya biar enak buat kalender
    return logs.map((log) => ({
      tanggal: log.dailyActivity.tanggal, // yyyy-mm-dd
      level: log.prediksi.toLowerCase(), // biar konsisten "rendah" | "sedang" | "tinggi"
    }));
  }),
});
