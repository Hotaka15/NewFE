import React from "react";
import { useTranslation } from "react-i18next";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const data = [
  {
    name: "Jan",
    Likes: 4000,
    Comments: 2400,
  },
  {
    name: "Feb",
    Likes: 3000,
    Comments: 1398,
  },
  {
    name: "Mar",
    Likes: 2000,
    Comments: 9800,
  },
  {
    name: "Apr",
    Likes: 2780,
    Comments: 3908,
  },
  {
    name: "May",
    Likes: 1890,
    Comments: 4800,
  },
  {
    name: "Jun",
    Likes: 2390,
    Comments: 3800,
  },
  {
    name: "July",
    Likes: 3490,
    Comments: 4300,
  },
  {
    name: "Aug",
    Likes: 2000,
    Comments: 9800,
  },
  {
    name: "Sep",
    Likes: 2780,
    Comments: 3908,
  },
  {
    name: "Oct",
    Likes: 1890,
    Comments: 4800,
  },
  {
    name: "Nov",
    Likes: 2390,
    Comments: 3800,
  },
  {
    name: "Dec",
    Likes: 3490,
    Comments: 4300,
  },
];

export default function BarRp({ monthly }) {
  console.log(monthly);
  const { t } = useTranslation();
  return (
    <div className="h-full bg-ascent-3/10 p-4 rounded-sm  flex flex-col flex-1">
      <strong className="text-gray-700 font-medium text-ascent-1">
        {t("Reports")}
      </strong>
      <div className="mt-3 w-full flex-1 text-ascent-1 text-xs">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            width={500}
            height={300}
            data={monthly}
            margin={{
              top: 20,
              right: 10,
              left: -10,
              bottom: 0,
            }}
          >
            <CartesianGrid strokeDasharray="3 3 0 0" vertical={false} />
            <XAxis dataKey="_id" />
            <YAxis className="text-ascent-1" />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#0ea5e9" />
            {/* <Bar dataKey="Likes" fill="#ea580c" /> */}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
