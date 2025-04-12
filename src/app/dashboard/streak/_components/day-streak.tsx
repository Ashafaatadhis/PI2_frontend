import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { api } from "@/trpc/react";
import { Flame } from "lucide-react";

const getBadge = (count: number) => {
  if (count >= 365) return "🔥 Legendary (365-day streak!)";
  if (count >= 180) return "💎 Diamond (180-day streak)";
  if (count >= 90) return "🥇 Gold (90-day streak)";
  if (count >= 30) return "🥈 Silver (30-day streak)";
  if (count >= 7) return "🥉 Bronze (7-day streak)";
  if (count >= 3) return "🌟 Rising Star (3-day streak)";
  return null;
};

const getNextBadge = (count: number) => {
  if (count < 3) return { label: "🌟 Rising Star", goal: 3 };
  if (count < 7) return { label: "🥉 Bronze", goal: 7 };
  if (count < 30) return { label: "🥈 Silver", goal: 30 };
  if (count < 90) return { label: "🥇 Gold", goal: 90 };
  if (count < 180) return { label: "💎 Diamond", goal: 180 };
  if (count < 365) return { label: "🔥 Legendary", goal: 365 };
  return null;
};

const quotes = [
  "Small steps every day lead to big results 💪",
  "Stay consistent, not perfect.",
  "You’re building something amazing 🔥",
  "One day at a time — you got this!",
];

const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const DayStreak = () => {
  const { data, isLoading } = api.streak.getCurrent.useQuery();
  const streak = data?.count ?? 0;
  const filledToday = data?.filledToday ?? false;
  const recentDays = data?.recent ?? [];
  const badge = getBadge(streak);
  const nextBadge = getNextBadge(streak);
  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

  return (
    <Card className="w-full rounded-xl shadow-md">
      <CardContent className="space-y-4 pt-6 text-center">
        {isLoading ? (
          <Skeleton className="h-80 w-full rounded-md bg-gray-200" />
        ) : (
          <>
            <div className="flex items-center justify-center space-x-2">
              <Flame className="animate-pulse text-orange-500" />
              <p className="text-2xl font-bold text-orange-600">
                {streak} Day Streak
              </p>
            </div>

            <p className="text-muted-foreground text-sm">
              Keep going! Don’t break the chain 🔗
            </p>

            {filledToday ? (
              <p className="text-sm text-green-600">
                ✅ Hari ini sudah tercatat!
              </p>
            ) : (
              <p className="text-sm text-red-500">
                ⏰ Belum mengisi aktivitas hari ini. Jangan lupa ya!
              </p>
            )}

            {badge && (
              <p className="text-sm font-medium text-indigo-600">
                🎉 Badge Unlocked: {badge}
              </p>
            )}

            {nextBadge && (
              <div className="space-y-2 pt-2">
                <p className="text-sm text-gray-600">
                  Progress menuju <strong>{nextBadge.label}</strong> ({streak}/
                  {nextBadge.goal})
                </p>
                <Progress value={(streak / nextBadge.goal) * 100} />
              </div>
            )}

            <div className="mt-4 space-y-2">
              <p className="text-sm font-medium text-gray-600">
                🔄 Weekly Streak
              </p>
              <div className="flex justify-center gap-2">
                {days.map((day, index) => (
                  <div
                    key={day}
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-full border text-xs",
                      recentDays.includes(index)
                        ? "bg-orange-500 text-white"
                        : "bg-muted text-gray-400",
                    )}
                  >
                    {day[0]}
                  </div>
                ))}
              </div>
            </div>

            <p className="pt-4 text-center text-sm text-gray-500 italic">
              “{randomQuote}”
            </p>
          </>
        )}
      </CardContent>
    </Card>
  );
};
