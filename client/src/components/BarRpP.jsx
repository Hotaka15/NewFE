import React from "react";
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
    Post: 32,
    Comments: 43,
  },
  {
    name: "Feb",
    Post: 12,
    Report: 32,
  },
  {
    name: "Mar",
    Post: 43,
    Report: 12,
  },
  {
    name: "Apr",
    Post: 23,
    Report: 54,
  },
  {
    name: "May",
    Post: 43,
    Report: 21,
  },
  {
    name: "Jun",
    Post: 34,
    Report: 12,
  },
  {
    name: "July",
    Post: 76,
    Report: 12,
  },
  {
    name: "Aug",
    Post: 43,
    Report: 12,
  },
  {
    name: "Sep",
    Post: 23,
    Report: 2,
  },
  {
    name: "Oct",
    Post: 65,
    Report: 34,
  },
  {
    name: "Nov",
    Post: 23,
    Report: 12,
  },
  {
    name: "Dec",
    Post: 67,
    Report: 25,
  },
];

export default function BarRpP({ month }) {
  console.log(month);
  const updatedData =
    month &&
    month.map((item) => ({
      name: `${item._id?.year ? item._id?.year : ""}${
        item?._id?.month ? "/" + item?._id?.month : ""
      }${item?._id?.day ? "/" + item?._id?.day : ""}`,
      totalReports: item.totalReports,
    }));

  return (
    <div className="h-[25rem] bg-ascent-3/10 p-4 rounded-sm  flex flex-col flex-1">
      <strong className="text-gray-700 font-medium text-ascent-1">
        Reports
      </strong>
      <div className="mt-3 w-full flex-1 text-ascent-1 text-xs">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            width={500}
            height={300}
            data={updatedData}
            margin={{
              top: 20,
              right: 10,
              left: -10,
              bottom: 0,
            }}
          >
            <CartesianGrid strokeDasharray="3 3 0 0" vertical={false} />
            <XAxis dataKey="name" />
            <YAxis className="text-ascent-1" />
            <Tooltip />
            <Legend />
            {/* <Bar dataKey="Post" fill="#0ea5e9" /> */}
            <Bar dataKey="totalReports" fill="#ea580c" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
