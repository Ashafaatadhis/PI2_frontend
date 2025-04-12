import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { startOfDay } from "date-fns";

export const streakRouter = createTRPCRouter({
  getCurrent: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;

    const allStreaks = await ctx.db.streak.findMany({
      where: { userId },
      orderBy: { tanggal: "asc" },
    });

    const today = startOfDay(new Date());
    const filledToday = allStreaks.some(
      (s) => startOfDay(new Date(s.tanggal)).getTime() === today.getTime(),
    );

    const count = allStreaks.length;

    const recent = allStreaks
      .filter((s) => {
        const date = new Date(s.tanggal);
        const diff = today.getTime() - startOfDay(date).getTime();
        return diff <= 6 * 86400000;
      })
      .map((s) => new Date(s.tanggal).getDay());

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
