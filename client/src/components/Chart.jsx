import React, { useState } from "react";
import { BsPostcardHeartFill } from "react-icons/bs";
import { FaUser } from "react-icons/fa";
import { AiFillLike } from "react-icons/ai";
import { FaCommentAlt } from "react-icons/fa";
import PieChartRp from "./PieChartRp";
import BarRp from "./BarRp";
import RecentRp from "./RecentRp";
const Chart = () => {
  return (
    <div className="w-full h-full bg-primary py-4 ga">
      <div className="grid grid-cols-4 gap-4 mb-4">
        <div className="flex justify-center items-center h-20 text-ascent-1 rounded-2xl bg-ascent-3/10 gap-2">
          <BsPostcardHeartFill size={30} />
          <div>
            <div className="text-ascent-2 text-sm">Total Posts:</div>
            <div className="text-ascent-1 text-xl">234,234234</div>
          </div>
        </div>
        <div className="flex justify-center items-center h-20 text-ascent-1 rounded-2xl bg-ascent-3/10 gap-2">
          <FaUser size={25} />
          <div>
            <div className="text-ascent-2 text-sm">Total Users:</div>
            <div className="text-ascent-1 text-xl">234,234234</div>
          </div>
        </div>
        <div className="flex justify-center items-center h-20 text-ascent-1 rounded-2xl bg-ascent-3/10 gap-2">
          <AiFillLike size={25} />
          <div>
            <div className="text-ascent-2 text-sm">Total Likes:</div>
            <div className="text-ascent-1 text-xl">234,234234</div>
          </div>
        </div>
        <div className="flex justify-center items-center h-20 text-ascent-1 rounded-2xl bg-ascent-3/10 gap-2">
          <FaCommentAlt size={25} />
          <div>
            <div className="text-ascent-2 text-sm">Total Comments:</div>
            <div className="text-ascent-1 text-xl">234,234234</div>
          </div>
        </div>
      </div>
      <div className="w-full flex gap-4 mb-4">
        <BarRp />
        <PieChartRp />
      </div>
      <div className="w-full ">
        <RecentRp />
      </div>
    </div>
  );
};

export default Chart;
