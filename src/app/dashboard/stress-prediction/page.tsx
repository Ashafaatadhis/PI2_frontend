"use client";

import StressForm from "./_components/stress-form";

const StressPredictionPage = () => {
  return (
    <div className="ml-8 space-y-6 p-6">
      <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
        Stress Prediction
      </h3>

      <StressForm />
    </div>
  );
};

export default StressPredictionPage;
