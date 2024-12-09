import React, { useEffect, useState } from "react";
import { BsPostcardHeartFill } from "react-icons/bs";
import { FaUser } from "react-icons/fa";
import { AiFillLike } from "react-icons/ai";
import { FaCommentAlt } from "react-icons/fa";
import PieChartRp from "./PieChartRp";
import BarRp from "./BarRp";
import { MdAdminPanelSettings } from "react-icons/md";
import RecentRp from "./RecentRp";
import { IoPeople } from "react-icons/io5";
import { FaCheckCircle } from "react-icons/fa";
import {
  ageDashboard,
  genderDashboard,
  monthregisterDashboard,
  userDashboard,
} from "../until/dashboard";
import { useTranslation } from "react-i18next";
import PieChartAge from "./PieChartAge";
const UserChart = () => {
  const [genders, setGenders] = useState([]);
  const [monthlys, setMonthlys] = useState([]);
  const [age, setAge] = useState([]);
  const { t } = useTranslation();
  const [total, setTotal] = useState([]);
  const [filter, setFilter] = useState("month");
  const fetchuserdashboard = async () => {
    const age = await ageDashboard();
    setAge(age);
    const gender = await genderDashboard();
    setGenders(gender);

    const getuser = await userDashboard();
    setTotal(getuser?.data);
  };
  const handlefill = async (filter) => {
    const monthly = await monthregisterDashboard(filter);
    setMonthlys(monthly);
  };
  useEffect(() => {
    fetchuserdashboard();
  }, []);
  useEffect(() => {
    handlefill(filter);
  }, [filter]);
  return (
    <div className="w-full h-full bg-primary py-1 flex flex-col">
      <div className="grid grid-cols-4 gap-4 mb-4">
        <div className="flex justify-center items-center h-20 text-ascent-1 rounded-2xl bg-ascent-3/10 gap-2">
          <IoPeople size={35} />
          <div>
            <div className="text-ascent-2 text-sm">{t("Total Users")}</div>
            <div className="text-ascent-1 text-xl">{total?.totalUsers}</div>
          </div>
        </div>
        <div className="flex justify-center items-center h-20 text-ascent-1 rounded-2xl bg-ascent-3/10 gap-2">
          <FaUser size={25} />
          <div>
            <div className="text-ascent-2 text-sm">{t("Regular Users")}</div>
            <div className="text-ascent-1 text-xl">
              {total?.totalRegularUsers}
            </div>
          </div>
        </div>
        <div className="flex justify-center items-center h-20 text-ascent-1 rounded-2xl bg-ascent-3/10 gap-2">
          <MdAdminPanelSettings size={40} />
          <div>
            <div className="text-ascent-2 text-sm">{t("Total Admins")}</div>
            <div className="text-ascent-1 text-xl">{total?.totalAdmins}</div>
          </div>
        </div>
        <div className="flex justify-center items-center h-20 text-ascent-1 rounded-2xl bg-ascent-3/10 gap-2">
          <FaCheckCircle size={35} />
          <div>
            <div className="text-ascent-2 text-sm">{t("Verified Users")}</div>
            <div className="text-ascent-1 text-xl">
              {total?.totalVerifiedUsers}
            </div>
          </div>
        </div>
      </div>
      <div className="w-full flex gap-4 mb-4 h-full">
        <div className="relative w-full h-full flex">
          <div className="absolute right-1 top-1 bg-primary flex   rounded-lg">
            <div
              className={`${
                filter == "month" && "bg-bgColor"
              } text-ascent-2 cursor-pointer py-1 px-2  rounded-lg`}
              onClick={() => {
                console.log("month");
                setFilter("month");
              }}
            >
              {t("Month")}
            </div>
            <div
              className={` text-ascent-2 cursor-pointer py-1 px-2 ${
                filter == "week" && "bg-bgColor"
              } rounded-lg`}
              onClick={() => {
                console.log("week");
                setFilter("week");
              }}
            >
              {t("Week")}
            </div>
            <div
              className={` text-ascent-2 cursor-pointer py-1 px-2  ${
                filter == "day" && "bg-bgColor"
              } rounded-lg`}
              onClick={() => {
                console.log("day");
                setFilter("day");
              }}
            >
              {t("Day")}
            </div>
          </div>
          <BarRp monthly={monthlys} />
        </div>
        <div className="h-full">
          <PieChartRp genders={genders} />
          <PieChartAge age={age} />
        </div>
      </div>
      <div className="w-full ">{/* <RecentRp /> */}</div>
    </div>
  );
};

export default UserChart;
