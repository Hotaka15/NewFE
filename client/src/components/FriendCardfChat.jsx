import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { NoProfile } from "../assets";
import { Login } from "../pages";
import { usergetUserInfo } from "../until/user";
import { useSelector } from "react-redux";
import { t } from "i18next";
import { useTranslation } from "react-i18next";

const FriendCardfChat = ({ friend, hanldeUserchat }) => {
  const { user } = useSelector((state) => state.user);
  const [info, setInfo] = useState();
  const { t } = useTranslation();
  console.log(friend);
  const getInfor = async () => {
    try {
      const id = friend;
      const res = await usergetUserInfo(user?.token, id);
      console.log(res);
      setInfo(res);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getInfor();
  }, []);

  return (
    <div
      onClick={() => {
        hanldeUserchat(info);
      }}
    >
      <div className="w-full shadow-sm rounded-lg  ">
        {/* <div className="flex items-center justify-between text-ascent-1 bp-2 border-b border-[#66666645]">
          <span> Friends</span>
          <span>{friend?.length}</span>
        </div> */}

        <div className="w-full flex  gap-4 pt-4 items-center cursor-pointer">
          <img
            src={info?.profileUrl ?? NoProfile}
            className="w-10 h-10 object-cover rounded-full"
          />
          <div className="flex-1">
            <p className="text-base font-medium text-ascent-1">
              {info?.firstName} {info?.lastName}
            </p>
            <span className="text-sm text-ascent-2">
              {info?.profession ?? t("No Profession")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FriendCardfChat;
