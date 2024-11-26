import React, { useEffect, useState } from "react";
import { BsPostcardHeartFill } from "react-icons/bs";
import { FaUser } from "react-icons/fa";
import { AiFillLike } from "react-icons/ai";
import { FaCommentAlt } from "react-icons/fa";
import PieChartRp from "./PieChartRp";
import BarRp from "./BarRp";
import RecentRp from "./RecentRp";
import {
  ageDashboard,
  genderDashboard,
  monthregisterDashboard,
  userDashboard,
} from "../until/dashboard";
const UserChart = () => {
  const [genders, setGenders] = useState([]);
  const fetchuserdashboard = async () => {
    const age = await ageDashboard();
    console.log(age);
    const gender = await genderDashboard();
    setGenders(gender);
    console.log(gender);
    const monthly = await monthregisterDashboard();
    console.log(monthly);
    const getuser = await userDashboard();
    console.log(getuser);
  };
  useEffect(() => {
    fetchuserdashboard();
  }, []);
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
        <PieChartRp genders={genders} />
      </div>
      <div className="w-full ">
        <RecentRp />
      </div>
    </div>
  );
};

export default UserChart;
