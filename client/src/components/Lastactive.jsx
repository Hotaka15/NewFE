import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

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
    <div className="w-full shadow-sm border-b border-ascent-2 pb-5">
      <div
        className="flex items-center justify-between text-sm text-ascent-1 
            pb-2 "
      >
        <span className="font-medium text-lg text-ascent-2">
          Last Activities
        </span>
      </div>

      {notifications?.slice(0, 3).map((notification, index) => (
        <Link to={`${notifications[index]?.redirectUrl}`}>
          <div className="w-full flex gap-4 items-center cursor-pointer py-2 hover:bg-ascent-3/30  px-2">
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
