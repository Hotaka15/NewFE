import React, { useState } from "react";
import { NoProfile } from "../assets";
import moment from "moment";
import { Logout, Setnotification } from "../redux/userSlice";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { SlOptions } from "react-icons/sl";
import { notideleteNotifications, notireadNotifications } from "../until/noti";
import { TiDelete } from "react-icons/ti";
import { GoDotFill } from "react-icons/go";
import { MdDelete } from "react-icons/md";
import { useTranslation } from "react-i18next";
const Notification = ({ notify, fetchNotification }) => {
  console.log(notify);
  const [all, setAll] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { user } = useSelector((state) => state.user);
  // const [bg, setBG] = useState();
  const [isAll, setIsAll] = useState(true);
  const [listNotification, setListNotifications] = useState([...notify]);
  // const check = () => {
  //   all ? setBG("bg-blue") : setBG(" hover:bg-ascent-3");
  // };

  const handlelist = () => {
    setIsAll(false);
    const list = notify.filter((noti) => !noti.isRead);
    setListNotifications(list);
  };
  const handlelistAll = () => {
    setIsAll(true);
    setListNotifications(notify);
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

  const handleDelete = async (_id) => {
    try {
      const token = user?.token;
      const res = await notideleteNotifications({ token, _id });
      await fetchNotification();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="relative w-full shadow-sm rounded-xl bg-primary h-fit py-3">
      <div
        className="flex flex-col text-2xl text-ascent-1 
              mx-6 gap-2 mb-2"
      >
        <span className="font-medium pb-4">{t("Notifications")}</span>
        <div className="font-normal text-base pb-2">
          <span
            onClick={() => {
              handlelistAll();
            }}
            className={`w-fit  px-3 py-1 rounded-full cursor-pointer ${
              isAll ? "bg-blue text-white" : "text-ascent-1"
            }`}
          >
            {t("All")}
          </span>
          <span
            onClick={() => {
              handlelist();
            }}
            className={`w-fit  px-3 py-1 rounded-full cursor-pointer ${
              !isAll ? "bg-blue text-white" : "text-ascent-1"
            }`}
          >
            Unread
          </span>
        </div>
      </div>

      {listNotification ? (
        <div className="w-full flex flex-col gap-4 pb-2 ">
          {!showAll &&
            listNotification &&
            listNotification.length > 0 &&
            listNotification
              ?.slice(0, 4)
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
                    className="flex gap-2 items-center justify-between px-6 relative "
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
                    <div
                      className="px-1 py-1 hover:bg-bgColor flex rounded-lg absolute right-4 top-0"
                      onClick={() => {
                        handleDelete(_id);
                      }}
                    >
                      <MdDelete size={20} />
                    </div>
                  </div>
                )
              )}
          {showAll &&
            listNotification.length > 0 &&
            listNotification?.map(
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
                  className="flex gap-2 items-center justify-between px-6 relative"
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
                  <div
                    className="px-1 py-1 hover:bg-bgColor flex rounded-lg absolute right-4 top-0"
                    onClick={() => {
                      handleDelete(_id);
                    }}
                  >
                    <MdDelete size={20} />
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
              {t("SHOW MORE")}
            </div>
          )}
        </div>
      ) : (
        <div className="w-full flex flex-col gap-4 pb-2 justify-center items-center text-ascent-2">
          {t("No Notifications")}
        </div>
      )}
    </div>
  );
};

export default Notification;
