export const LegendCalendar = () => {
  return (
    <div className="flex justify-center gap-4 pt-2 text-sm">
      <div className="flex items-center gap-2">
        <div className="h-3 w-3 rounded-full bg-green-300" />
        <span>Rendah</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="h-3 w-3 rounded-full bg-yellow-300" />
        <span>Sedang</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="h-3 w-3 rounded-full bg-red-300" />
        <span>Tinggi</span>
      </div>
    </div>
  );
};
