"use client";

import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
} from "recharts";

const data = [
  {
    subject: "Frontend",
    profile: 85,
    market: 90,
  },
  {
    subject: "UI/UX",
    profile: 70,
    market: 75,
  },
  {
    subject: "Data Analysis",
    profile: 60,
    market: 80,
  },
  {
    subject: "Cloud",
    profile: 55,
    market: 85,
  },
  {
    subject: "Soft Skills",
    profile: 90,
    market: 70,
  },
  {
    subject: "Management",
    profile: 65,
    market: 60,
  },
];

export function CompetencyRadar() {
  return (
    <div className="h-[350px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
          <PolarGrid stroke="#e5e7eb" />
          <PolarAngleAxis
            dataKey="subject"
            tick={{ fill: "#6b7280", fontSize: 12 }}
          />
          <PolarRadiusAxis
            angle={30}
            domain={[0, 100]}
            tick={{ fill: "#9ca3af", fontSize: 10 }}
          />
          <Radar
            name="Tu Perfil"
            dataKey="profile"
            stroke="#000000"
            fill="#000000"
            fillOpacity={0.3}
            strokeWidth={2}
          />
          <Radar
            name="Demanda Mercado"
            dataKey="market"
            stroke="#22c55e"
            fill="#22c55e"
            fillOpacity={0.2}
            strokeWidth={2}
            strokeDasharray="5 5"
          />
          <Legend
            wrapperStyle={{
              paddingTop: "20px",
            }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
