"use client";

import { DayStreak } from "./_components/day-streak";
import EmotionCalendar from "./_components/emotion-calendar";

const StreakPage = () => {
  return (
    <div className="space-y-6 p-6">
      <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
        Streak Tracker
      </h3>

      <div className="grid gap-4 lg:grid-cols-2">
        <EmotionCalendar />
        <DayStreak />
      </div>
    </div>
  );
};

export default StreakPage;
