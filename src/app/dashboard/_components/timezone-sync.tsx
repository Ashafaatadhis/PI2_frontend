"use client";

import { useEffect } from "react";
import { api } from "@/trpc/react";

export function TimezoneSync() {
  const mutation = api.user.updateTimezone.useMutation();

  useEffect(() => {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const saved = localStorage.getItem("user_tz");

    if (saved !== timezone) {
      mutation.mutate({ timezone });
      localStorage.setItem("user_tz", timezone);
    }
  }, []);

  return null;
}
