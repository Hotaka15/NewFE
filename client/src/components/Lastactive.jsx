import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaAndroid } from "react-icons/fa";
import { NoProfile } from "../assets";
import moment from "moment";
import { notifetchNotifications } from "../until/noti";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useSocket } from "../context/SocketContext";
const Lastactive = () => {
  const [notifications, setNotifications] = useState([]);
  const { t } = useTranslation();
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const socket = useSocket();
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
    socket.on("receiveNotification", (notification) => {
      fetchNotification();
    });
  }, []);
  return (
    <div className="w-full shadow-sm  pb-5">
      {/* border-b border-ascent-2 */}
      <div
        className="flex items-center justify-between text-sm text-ascent-1 
            pb-2 "
      >
        <span className="font-medium text-lg text-ascent-2">
          {t("Last Activities")}
        </span>
      </div>

      {notifications &&
        notifications.length > 0 &&
        notifications?.slice(0, 3).map((notification, index) => (
          <Link key={index} to={`${notifications[index]?.redirectUrl}`}>
            <div className="w-full flex gap-4 items-center cursor-pointer py-2 hover:bg-ascent-3/30  px-2">
              {/* <img
                src={notifications[index]?.senderInfo?.avatar ?? NoProfile}
                alt={notifications[index]?.senderInfo?.name}
                className="w-10 h-10 object-cover rounded-full"
              /> */}
              {notifications[index]?.senderInfo?.userId == "system" ? (
                <FaAndroid size={40} className="text-[#065ad8]" />
              ) : (
                <img
                  src={notifications[index]?.senderInfo?.avatar ?? NoProfile}
                  alt={notifications[index]?.senderInfo?.name}
                  className="w-10 h-10 object-cover rounded-full"
                />
              )}
              <div className="flex-1">
                <p className="text-base font-medium text-ascent-1">
                  {/* {user?.lastName}{" "} */}
                  <span className="text-sm text-ascent-2">
                    {notifications[index]?.message ?? ""}
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
