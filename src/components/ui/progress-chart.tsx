"use client";

import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import { ProgressoMensal } from '@/lib/mock-data';

interface ProgressChartProps {
  data: ProgressoMensal[];
}

export function ProgressChart({ data }: ProgressChartProps) {
  return (
    <div className="flex items-center justify-center w-full h-full">
      <LineChart width={300} height={300} data={data} margin={{ top: 16, right: 24, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis dataKey="mes" stroke="#6b7280" />
        <YAxis stroke="#6b7280" />
        <Tooltip
          contentStyle={{ background: '#fff', borderRadius: 8, border: '1px solid #e5e7eb', color: '#111' }}
          labelStyle={{ color: '#111' }}
        />
        <Legend />
        <Line type="monotone" dataKey="temasRevisados" name="Temas Revisados" stroke="#2563eb" strokeWidth={2} dot={{ r: 4 }} />
        <Line type="monotone" dataKey="tempoEstudo" name="Tempo de Estudo (h)" stroke="#16a34a" strokeWidth={2} dot={{ r: 4 }} />
        <Line type="monotone" dataKey="taxaAcerto" name="Taxa de Acerto (%)" stroke="#f59e42" strokeWidth={2} dot={{ r: 4 }} />
      </LineChart>
    </div>
  );
} 