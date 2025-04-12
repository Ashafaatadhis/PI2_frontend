// app/(dashboard)/dashboard/page.tsx

"use client";

import { api } from "@/trpc/react";
import { StressChart } from "./_components/stress-chart";
import { ActivityChart } from "./_components/activity-chart";
import { StreakChart } from "./_components/streak-chart";
import { Skeleton } from "@/components/ui/skeleton";

const DashboardPage = () => {
  const { data, isLoading } = api.stress.getSummary.useQuery();

  if (isLoading || !data) {
    return (
      <div className="ml-8 space-y-6 p-6">
        <h2 className="text-2xl font-bold">Dashboard</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-[250px] w-full rounded-xl bg-gray-200" />
          <Skeleton className="h-[250px] w-full rounded-xl bg-gray-200" />
          <Skeleton className="h-[250px] w-full rounded-xl bg-gray-200" />
        </div>
      </div>
    );
  }

  return (
    <div className="ml-8 space-y-6 p-6">
      <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
        Dashboard
      </h3>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StressChart data={data.stress} />
        <ActivityChart data={data.activity} />
        <StreakChart data={data.streak} />
      </div>
    </div>
  );
};

export default DashboardPage;
