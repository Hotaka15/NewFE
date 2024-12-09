import React, { useState } from "react";
// import { friends } from "../assets/data";
import { Link } from "react-router-dom";
import { NoProfile } from "../assets";
import { Login } from "../pages";
import FriendCardf from "./FriendCardf";
import { useTranslation } from "react-i18next";
import CustomButton from "./CustomButton";

const FriendDRq = ({
  friend,
  setLoading,
  getUser,
  setUid,
  handleFriendRequest,
}) => {
  const { t } = useTranslation();
  const [sent, setSent] = useState(false);
  return (
    <div className="w-full flex gap-4 items-center cursor-pointer">
      <img
        onClick={() => {
          setLoading(true);
          getUser(friend?._id);
          setUid(friend?._id);
        }}
        src={friend?.profileUrl ?? NoProfile}
        alt={friend?.firstName}
        className="w-16 h-16 object-cover rounded-full"
      />
      <div
        className="flex-1"
        onClick={() => {
          setLoading(true);
          getUser(friend?._id);
          setUid(friend?._id);
        }}
      >
        <p className="text-base font-medium text-ascent-1">
          {friend?.firstName} {friend?.lastName}
        </p>
        <span className="text-sm text-ascent-2">
          {friend?.profession ?? t("No Profession")}
        </span>
      </div>
      {!sent ? (
        <CustomButton
          onClick={() => {
            setSent(true);
            handleFriendRequest(friend?._id);
          }}
          containerStyles="bg-blue px-3 rounded-xl py-1 text-white"
          tittle={t("Add")}
        />
      ) : (
        <CustomButton
          onClick={() => {}}
          containerStyles="bg-secondary px-3 rounded-xl py-1 text-ascent-2"
          tittle={t("Sent")}
        />
      )}
    </div>
  );
};

export default FriendDRq;
