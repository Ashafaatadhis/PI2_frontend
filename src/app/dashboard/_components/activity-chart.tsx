import { Card, CardContent } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export function ActivityChart({
  data,
}: {
  data: { day: string; sleep: number; screen: number }[];
}) {
  return (
    <Card>
      <CardContent className="p-4">
        <h4 className="mb-2 text-sm font-medium text-gray-600">
          Aktivitas Harian
        </h4>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" fontSize={10} />
            <YAxis fontSize={10} />
            <Tooltip />
            <Bar dataKey="sleep" fill="#3b82f6" name="Tidur" />
            <Bar dataKey="screen" fill="#f87171" name="Screen" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
