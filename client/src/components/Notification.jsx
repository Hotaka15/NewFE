import React, { useState } from "react";
import { NoProfile } from "../assets";
import moment from "moment";
import { Logout, Setnotification } from "../redux/userSlice";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { SlOptions } from "react-icons/sl";
import { notireadNotifications } from "../until/noti";
import { GoDotFill } from "react-icons/go";
const Notification = ({ notify, fetchNotification }) => {
  console.log(notify);
  const [all, setAll] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const [bg, setBG] = useState();
  const check = () => {
    all ? setBG("bg-blue") : setBG(" hover:bg-ascent-3");
  };

  const handleRead = async (_id) => {
    try {
      const token = user?.token;
      const res = await notireadNotifications({ token, _id });
      await fetchNotification();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="relative w-full shadow-sm rounded-full  py-5">
      <div
        className="flex flex-col text-2xl text-ascent-1 
              mx-6 gap-2 mb-2"
      >
        <span className="font-medium "> Notification</span>
        {/* <div className="font-normal text-base">
          <span
            className={`w-fit  px-3 py-1 text-ascent-1 rounded-full hover:bg-bgColor cursor-pointer ${bg}`}
          >
            All
          </span>
          <span
            className={`w-fit  px-3 py-1 text-ascent-1 rounded-full hover:bg-bgColor cursor-pointer ${bg}`}
          >
            Unread
          </span>
        </div> */}
      </div>
      <div className="w-full flex flex-col gap-4 pb-2 ">
        {!showAll &&
          notify.length > 0 &&
          notify
            ?.slice(0, 6)
            .map(
              ({
                _id,
                message: content,
                senderInfo: from,
                isRead,
                createdAt,
                redirectUrl,
              }) => (
                <div
                  key={_id}
                  className="flex gap-2 items-center justify-between px-6 "
                >
                  <div
                    onClick={() => {
                      dispatch(Setnotification(false));
                      handleRead(_id);
                    }}
                    className="w-full flex gap-4 items-center "
                  >
                    <Link to={`${redirectUrl}`} className="flex gap-4">
                      <img
                        src={from?.avatar ?? NoProfile}
                        alt={from?.name}
                        className="w-12 h-12  object-cover rounded-full"
                      />
                      <div className="flex-1 ">
                        <p className="text-base font-bold text-ascent-1 flex">
                          {from?.name}{" "}
                          {!isRead && (
                            <div className="text-ascent-2 flex justify-center items-center">
                              <GoDotFill />
                            </div>
                          )}
                        </p>

                        <span className="text-sm text-ascent-2 ">
                          {content
                            ? content?.length > 50
                              ? content.slice(0, 50) + "..."
                              : content
                            : "Wrong"}
                        </span>
                        <span className="hidden md:flex text-ascent-2 text-xs">
                          {moment(createdAt ?? "2023-05-25").fromNow()}
                        </span>
                      </div>
                    </Link>
                  </div>
                  <div className="px-1 py-1 hover:bg-bgColor rounded-lg">
                    <SlOptions />
                  </div>
                </div>
              )
            )}
        {showAll &&
          notify.length > 0 &&
          notify?.map(
            ({
              _id,
              message: content,
              senderInfo: from,
              createdAt,
              redirectUrl,
            }) => (
              <div
                key={_id}
                className="flex gap-2 items-center justify-between px-6 "
              >
                <div
                  onClick={() => {
                    dispatch(Setnotification(false));
                  }}
                  className="w-full flex gap-4 items-center "
                >
                  <Link to={`${redirectUrl}`} className="flex gap-4">
                    <img
                      src={from?.avatar ?? NoProfile}
                      alt={from?.name}
                      className="w-12 h-12  object-cover rounded-full"
                    />
                    <div className="flex-1 ">
                      <p className="text-base font-bold text-ascent-1 ">
                        {from?.name}
                      </p>

                      <span className="text-sm text-ascent-2 ">
                        {content
                          ? content?.length > 50
                            ? content.slice(0, 50) + "..."
                            : content
                          : "Wrong"}
                      </span>
                      <span className="hidden md:flex text-ascent-2 text-xs">
                        {moment(createdAt ?? "2023-05-25").fromNow()}
                      </span>
                    </div>
                  </Link>
                </div>
                <div className="px-1 py-1 hover:bg-bgColor rounded-lg">
                  <SlOptions />
                </div>
              </div>
            )
          )}
        {!showAll && (
          <div
            onClick={() => {
              setShowAll(true);
            }}
            className="w-full flex justify-center items-start text-blue"
          >
            SHOW MORE
          </div>
        )}
      </div>
    </div>
  );
};

export default Notification;
