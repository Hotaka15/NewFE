import React, { useEffect, useState } from "react";

import { NoProfile } from "../assets";
import CustomButton from "./CustomButton";

import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { useracceptFriendRequest, usergetUserpInfo } from "../until/user";
const FriendCardRequest = ({
  user,
  fetchFriendRequest,
  setfriendRequest,
  friend,
  title,
}) => {
  // console.log(title);
  console.log(friend);
  const [userr, setUserr] = useState();
  const navigate = useNavigate();
  const acceptFriendRequest = async (id, status) => {
    try {
      const res = await useracceptFriendRequest(user?.token, id, user, status);
      fetchFriendRequest();
      if (res?.status === "failed") {
        Cookies.set("message", res?.message, { expires: 7 });
        navigate("/error");
      }
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };
  const getUser = async () => {
    try {
      const res = await usergetUserpInfo(user?.token, friend?.sender?._id);
      // const newData = { token: user?.token, ...res };
      console.log(res);

      setUserr(res);
      // dispatch(UserLogin(newData));
      // console.log(res);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getUser();
  }, []);
  // console.log(handle);
  // const { user } = useSelector((state) => state.user);
  // handle;
  return (
    <div>
      <div className="bg-primary overflow-hidden border h-full w-full rounded-lg border-[#66666645]">
        <img
          src={userr?.profileUrl ?? NoProfile}
          alt="Error"
          className="w-44 h-44 object-cover"
        />
        <div className="w-full h-full py-3 flex flex-col justify-center items-center font-bold gap-5">
          <span
            className="text-ascent-1 cursor-pointer"
            onClick={() => {
              navigate("/profile/" + userr?._id);
            }}
          >
            {userr?.firstName} {userr?.lastName}
          </span>
          <div className="w-4/5">
            <CustomButton
              tittle="Accept"
              onClick={() => acceptFriendRequest(friend?._id, "accepted")}
              containerStyles="text-white bg-blue w-full rounded-lg inline-flex justify-center px-5 py-2"
            />
            <CustomButton
              tittle="Delete"
              onClick={() => acceptFriendRequest(friend?._id, "rejected")}
              // onClick={handle}
              containerStyles="text-ascent-1 bg-ascent-3/10 w-full rounded-lg inline-flex justify-center px-5 py-2"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FriendCardRequest;
