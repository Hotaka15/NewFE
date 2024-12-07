import React, { useEffect, useState } from "react";
import { BsPostcardHeartFill } from "react-icons/bs";
import { FaUser } from "react-icons/fa";
import { AiFillLike } from "react-icons/ai";
import { FaCommentAlt } from "react-icons/fa";
import PieChartRp from "./PieChartRp";
import BarRp from "./BarRp";
import RecentRp from "./RecentRp";
import {
  dayreportDashboard,
  reportsbypostDashboard,
  reportsbyreasonDashboard,
} from "../until/dashboard";
import PieChartRpP from "./PieChartRpP";
import BarRpP from "./BarRpP";
import { useSelector } from "react-redux";
import Reportlist from "./ReportList";

const Chart = () => {
  const { user } = useSelector((state) => state?.user);
  const [resaon, SetReason] = useState([]);
  const [month, setMonth] = useState([]);
  const [bypost, setBypost] = useState([]);
  const [filter, setFilter] = useState("month");
  const fetchdashboard = async () => {
    const byreason = await reportsbyreasonDashboard();

    SetReason(byreason);
    const bypost = await reportsbypostDashboard();
    setBypost(bypost);
  };
  const handlefill = async (filter) => {
    const report = await dayreportDashboard(filter);
    setMonth(report);
  };
  useEffect(() => {
    fetchdashboard();
  }, []);
  useEffect(() => {
    handlefill(filter);
  }, [filter]);
  // useEffect(() => {}, []);
  return (
    <div className="w-full h-full bg-primary py-4 ga">
      {/* <div className="grid grid-cols-4 gap-4 mb-4">
        <div className="flex justify-center items-center h-20 text-ascent-1 rounded-2xl bg-ascent-3/10 gap-2">
          <BsPostcardHeartFill size={30} />
          <div>
            <div className="text-ascent-2 text-sm">Total Posts:</div>
            <div className="text-ascent-1 text-xl">234</div>
          </div>
        </div>
        <div className="flex justify-center items-center h-20 text-ascent-1 rounded-2xl bg-ascent-3/10 gap-2">
          <FaUser size={25} />
          <div>
            <div className="text-ascent-2 text-sm">Total Users:</div>
            <div className="text-ascent-1 text-xl">277</div>
          </div>
        </div>
        <div className="flex justify-center items-center h-20 text-ascent-1 rounded-2xl bg-ascent-3/10 gap-2">
          <AiFillLike size={25} />
          <div>
            <div className="text-ascent-2 text-sm">Total Likes:</div>
            <div className="text-ascent-1 text-xl">50</div>
          </div>
        </div>
        <div className="flex justify-center items-center h-20 text-ascent-1 rounded-2xl bg-ascent-3/10 gap-2">
          <FaCommentAlt size={25} />
          <div>
            <div className="text-ascent-2 text-sm">Total Comments:</div>
            <div className="text-ascent-1 text-xl">70</div>
          </div>
        </div>
      </div> */}
      <div className="w-full h-1/2 flex gap-4 mb-4">
        <div className="relative w-full ">
          <div className="absolute right-1 top-1 bg-primary flex   rounded-lg">
            <div
              className={` text-ascent-2 cursor-pointer py-1 px-2 ${
                filter == "year" && "bg-bgColor"
              } rounded-lg`}
              onClick={() => {
                console.log("year");
                setFilter("year");
              }}
            >
              Year
            </div>
            <div
              className={`${
                filter == "month" && "bg-bgColor"
              } text-ascent-2 cursor-pointer py-1 px-2  rounded-lg`}
              onClick={() => {
                console.log("month");
                setFilter("month");
              }}
            >
              Month
            </div>
            <div
              className={` text-ascent-2 cursor-pointer py-1 px-2 ${
                filter == "day" && "bg-bgColor"
              } rounded-lg`}
              onClick={() => {
                console.log("day");
                setFilter("day");
              }}
            >
              Day
            </div>
          </div>
          <BarRpP month={month} />
        </div>

        <PieChartRpP resaon={resaon} />
      </div>
      <div className="w-full flex h-1/2 justify-center shrink-0">
        {/* <RecentRp /> */}
        <Reportlist user={user} sl={true} />
      </div>
    </div>
  );
};

export default Chart;
