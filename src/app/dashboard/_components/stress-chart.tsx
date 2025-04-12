import { Card, CardContent } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export function StressChart({
  data,
}: {
  data: { day: string; stress: number }[];
}) {
  return (
    <Card>
      <CardContent className="p-4">
        <h4 className="mb-2 text-sm font-medium text-gray-600">
          Prediksi Stres
        </h4>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" fontSize={10} />
            <YAxis
              fontSize={10}
              domain={[1, 3]}
              ticks={[1, 2, 3]}
              tickFormatter={(val) =>
                val === 1 ? "Rendah" : val === 2 ? "Sedang" : "Tinggi"
              }
            />
            <Tooltip
              formatter={(value: number) =>
                value === 1 ? "Rendah" : value === 2 ? "Sedang" : "Tinggi"
              }
            />
            <Line
              type="monotone"
              dataKey="stress"
              stroke="#8884d8"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
