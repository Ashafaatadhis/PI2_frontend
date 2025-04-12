import { featureSelection } from "@/data/feature-selection";

// components/FeatureSection.tsx
export const FeatureSection = () => (
  <section className="bg-white/60 px-4 py-20">
    <h3 className="mb-12 text-center text-4xl font-bold text-blue-700">
      What You’ll Get
    </h3>
    <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 text-center md:grid-cols-3">
      {featureSelection.map((feat, i) => (
        <div key={i} className="flex flex-col items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-200 text-2xl font-bold text-blue-700 shadow-md">
            {feat.title[0]}
          </div>
          <h4 className="text-xl font-semibold text-blue-800">{feat.title}</h4>
          <p className="text-gray-600">{feat.desc}</p>
        </div>
      ))}
    </div>
  </section>
);
