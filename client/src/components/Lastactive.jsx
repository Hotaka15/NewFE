import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchNotifications } from "../until";
import { NoProfile } from "../assets";
import moment from "moment";
import { notifetchNotifications } from "../until/noti";
import { Link } from "react-router-dom";
const Lastactive = () => {
  const [notifications, setNotifications] = useState();
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const fetchNotification = async () => {
    try {
      const res = await notifetchNotifications({
        token: user?.token,
        userId: user?._id,
        dispatch,
      });
      console.log(res);
      setNotifications(res);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchNotification();
  }, []);
  return (
    <div className="w-full bg-primary shadow-sm rounded-lg  py-5">
      <div
        className="flex items-center justify-between text-sm text-ascent-1 
            pb-2 border-b border-[#66666645f]  mx-6"
      >
        <span className="font-medium">Last Activities</span>
      </div>
      {/* <div className="w-full flex gap-4 items-center cursor-pointer">
        <img
          src={user?.profileUrl ?? NoProfile}
          alt={user?.firstName}
          className="w-10 h-10 object-cover rounded-full"
        />
        <div className="flex-1">
          <p className="text-base font-medium text-ascent-1">
            {user?.firstName} {user?.lastName}
          </p>
          <span className="text-sm text-ascent-2">
            {user?.profession ?? "No Profession"}
          </span>
        </div>
      </div> */}

      {notifications?.slice(0, 3).map((notification, index) => (
        <Link to={`${notifications[index]?.redirectUrl}`}>
          <div className="w-full flex gap-4 items-center cursor-pointer py-2 hover:bg-ascent-3/30 rounded-xl px-6">
            <img
              src={notifications[index]?.senderInfo?.avatar ?? NoProfile}
              alt={notifications[index]?.senderInfo?.name}
              className="w-10 h-10 object-cover rounded-full"
            />
            <div className="flex-1">
              <p className="text-base font-medium text-ascent-1">
                {/* {user?.lastName}{" "} */}
                <span className="text-sm text-ascent-2">
                  {notifications[index]?.message ?? "No Profession"}
                </span>
              </p>
              <span className="hidden md:flex text-ascent-2 text-xs">
                {moment(
                  notifications[index].createdAt ?? "2023-05-25"
                ).fromNow()}
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default Lastactive;
