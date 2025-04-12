import { z } from "zod";

export const stressFormSchema = z.object({
  sleepHours: z
    .number({ required_error: "Sleep Hours is required" })
    .min(0, "Tidak boleh negatif")
    .max(24, "Maksimal 24 jam"),
  screenTime: z
    .number({ required_error: "Screen Time is required" })
    .min(0, "Tidak boleh negatif")
    .max(24, "Maksimal 24 jam"),
  exerciseTime: z
    .number({ required_error: "Exercise Time is required" })
    .min(0, "Tidak boleh negatif")
    .max(24, "Maksimal 24 jam"),
  studyHours: z
    .number({ required_error: "Study Hours is required" })
    .min(0, "Tidak boleh negatif")
    .max(24, "Maksimal 24 jam"),
  assignmentCount: z
    .number({ required_error: "Assignment Count is required" })
    .min(0, "Tidak boleh negatif")
    .max(20, "Wah kebanyakan tugasnya, maksimal 20 ya 😵‍💫"),
});

export type StressFormValues = z.infer<typeof stressFormSchema>;
