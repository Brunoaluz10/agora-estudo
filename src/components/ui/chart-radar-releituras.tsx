"use client";

import { TrendingUp } from "lucide-react";
import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts";

interface ChartRadarReleiturasProps {
  data: { area: string; releituras: number }[];
}

export function ChartRadarReleituras({ data }: ChartRadarReleiturasProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 mb-8">
      <div className="items-center pb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Radar de Releituras</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">Quantidade de releituras por especialidade</p>
      </div>
      <div className="flex justify-center pb-0">
        <RadarChart data={data} outerRadius={80} width={300} height={300}>
          <PolarGrid gridType="circle" />
          <PolarAngleAxis dataKey="area" />
          <Radar
            dataKey="releituras"
            fill="#f59e42"
            fillOpacity={0.6}
            dot={{ r: 4, fillOpacity: 1 }}
          />
        </RadarChart>
      </div>
      <div className="flex-col gap-2 text-sm mt-4">
        <div className="flex items-center gap-2 leading-none font-medium">
          Radar atualizado em tempo real <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground flex items-center gap-2 leading-none">
          Por especialidade
        </div>
      </div>
    </div>
  );
} 