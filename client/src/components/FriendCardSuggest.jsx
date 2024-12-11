import React, { useState } from "react";

import { NoProfile } from "../assets";
import CustomButton from "./CustomButton";

import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

import { usersendFriendRequest } from "../until/user";
import { useTranslation } from "react-i18next";
const FriendCardSuggest = ({ user, fetchSuggestFriends, friend }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [sended, setSended] = useState(false);
  // const handleFriendRequest = async (id) => {
  //   try {
  //     const res = await sendFriendRequest(user.token, id);
  //     await fetchSuggestFriends();
  //     if (res?.status === "failed") {
  //       Cookies.set("message", res?.message, { expires: 7 });
  //       navigate("/error");
  //     }
  //     // console.log(res);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  const handleFriendRequest = async (id) => {
    try {
      const res = await usersendFriendRequest(user.token, id);
      await fetchSuggestFriends();
      if (res?.status === "failed") {
        Cookies.set("message", res?.message, { expires: 7 });
        navigate("/error");
      }
      setSended(true);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <div className="bg-primary overflow-hidden border h-fit w-full rounded-lg border-[#66666645]">
        <img
          src={friend?.profileUrl ?? NoProfile}
          alt="Error"
          className="w-44 h-44  object-cover"
        />
        <div className="w-full h-full py-3 flex flex-col justify-center items-center font-bold gap-5">
          <span
            className="text-ascent-1 cursor-pointer"
            onClick={() => {
              navigate("/profile/" + friend?._id);
            }}
          >
            {friend?.firstName} {friend?.lastName}
          </span>
          <div className="w-4/5">
            {!sended ? (
              <CustomButton
                tittle={t("Add")}
                onClick={() => handleFriendRequest(friend?._id)}
                containerStyles="text-white bg-blue w-full rounded-lg inline-flex justify-center py-2"
              />
            ) : (
              <CustomButton
                tittle={t("Sent")}
                containerStyles="text-ascent-2 bg-secondary w-full rounded-lg inline-flex justify-center py-2"
              />
            )}
            {/* <CustomButton
              tittle="Delete"
              onClick={() => acceptFriendRequest(friend?._id, "Denied")}
              // onClick={handle}
              containerStyles="text-ascent-1 bg-ascent-3/10 w-full rounded-lg inline-flex justify-center px-5 py-2"
            /> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FriendCardSuggest;
