// components/EmotionCalendar.tsx
"use client";

import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { format, parseISO } from "date-fns";

import { api } from "@/trpc/react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { LegendCalendar } from "./legend-calendar";

const EmotionCalendar = () => {
  const { data = [], isLoading } = api.streak.getLogs.useQuery(); // [{ tanggal: "2025-04-02", level: "sedang" }, ...]

  const logsMap = Object.fromEntries(
    data.map((d) => [
      format(d.tanggal, "yyyy-MM-dd"), // fix timezone
      d.level,
    ]),
  );
  console.log(logsMap);
  return (
    <Card className="w-full rounded-xl p-4 shadow-md">
      <CardContent className="space-y-4 p-0">
        {isLoading ? (
          <Skeleton className="h-80 w-full rounded-md bg-gray-200" />
        ) : (
          <>
            <Calendar
              className="calendar-clean !w-full !rounded-none !border-none"
              tileClassName={({ date, view }) => {
                if (view === "month") {
                  const key = format(date, "yyyy-MM-dd");
                  const level = logsMap[key];
                  return level ? `emotion-${level}` : null;
                }
              }}
            />
            <LegendCalendar />
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default EmotionCalendar;
