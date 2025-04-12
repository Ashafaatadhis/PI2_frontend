"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  stressFormSchema,
  type StressFormValues,
} from "@/lib/schemas/stress-schema";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { api } from "@/trpc/react";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { Brain, RefreshCw } from "lucide-react";

export default function StressForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<StressFormValues>({
    resolver: zodResolver(stressFormSchema),
  });

  const mutation = api.stress.predictAndSave.useMutation();
  const { data: status, refetch } = api.stress.checkToday.useQuery();

  const onSubmit = (data: StressFormValues) => {
    mutation.mutate(data, {
      onSuccess: () => {
        toast.success("Prediksi berhasil!");
        reset(); // reset form setelah submit
        refetch();
      },
      onError: (err) => {
        toast.error(err.message);
      },
    });
  };

  return (
    <Card className="w-full max-w-full rounded-xl p-6 shadow-md">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {status?.hasSubmitted && (
          <p className="text-center text-sm font-medium text-yellow-600">
            Kamu sudah mengisi data hari ini. Coba lagi besok ya! ✨
          </p>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Brain className="text-blue-600" />
            <p className="font-semibold text-blue-600">Daily Activity Form</p>
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={() => reset()}
            disabled={status?.hasSubmitted}
          >
            <RefreshCw className="h-4 w-4" />
            Reset
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <Input
              type="number"
              placeholder="Sleep Hours"
              disabled={status?.hasSubmitted}
              {...register("sleepHours", { valueAsNumber: true })}
            />
            {errors.sleepHours && (
              <p className="text-sm text-red-500">
                {errors.sleepHours.message}
              </p>
            )}
          </div>

          <div>
            <Input
              type="number"
              disabled={status?.hasSubmitted}
              placeholder="Screen Time"
              {...register("screenTime", { valueAsNumber: true })}
            />
            {errors.screenTime && (
              <p className="text-sm text-red-500">
                {errors.screenTime.message}
              </p>
            )}
          </div>

          <div>
            <Input
              type="number"
              disabled={status?.hasSubmitted}
              placeholder="Exercise Time"
              {...register("exerciseTime", { valueAsNumber: true })}
            />
            {errors.exerciseTime && (
              <p className="text-sm text-red-500">
                {errors.exerciseTime.message}
              </p>
            )}
          </div>

          <div>
            <Input
              type="number"
              disabled={status?.hasSubmitted}
              placeholder="Study Hours"
              {...register("studyHours", { valueAsNumber: true })}
            />
            {errors.studyHours && (
              <p className="text-sm text-red-500">
                {errors.studyHours.message}
              </p>
            )}
          </div>

          <div>
            <Input
              type="number"
              placeholder="Assignment Count"
              disabled={status?.hasSubmitted}
              {...register("assignmentCount", { valueAsNumber: true })}
            />
            {errors.assignmentCount && (
              <p className="text-sm text-red-500">
                {errors.assignmentCount.message}
              </p>
            )}
          </div>
        </div>

        <Button
          type="submit"
          disabled={mutation.isPending || status?.hasSubmitted}
          className="w-full"
        >
          {status?.hasSubmitted
            ? "You already submitted today"
            : mutation.isPending
              ? "Predicting..."
              : "Predict Stress"}
        </Button>

        {mutation.data && (
          <div className="mt-4 rounded-md border p-4 text-lg font-semibold">
            Result: <span className="capitalize">{mutation.data.result}</span>
            <br />
            Confidence: Rendah {mutation.data.confidence[0].toFixed(2)} | Sedang{" "}
            {mutation.data.confidence[1].toFixed(2)} | Tinggi{" "}
            {mutation.data.confidence[2].toFixed(2)}
          </div>
        )}
      </form>
    </Card>
  );
}
