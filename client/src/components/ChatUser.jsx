import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux/es/hooks/useSelector";
import { NoProfile } from "../assets";
import { usergetUserInfo } from "../until/user";
import Loading from "./Loading";
const ChatUser = ({ id }) => {
  const { user } = useSelector((state) => state.user);
  const [infor, setInfor] = useState(null);
  const getUser = async (id) => {
    try {
      const res = await usergetUserInfo(user?.token, id);

      setInfor(res);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUser(id);
  }, []);

  return (
    <div className="w-full h-full bg-transparent text-ascent-1 flex justify-start">
      {infor && (
        <div className="flex items-center justify-center w-fit gap-2 mb-2">
          <img
            src={infor?.profileUrl || NoProfile}
            className="w-7 h-7 object-cover rounded-lg"
            alt=""
          />
          <span className="text-ascent-2">{infor?.firstName}</span>
        </div>
      )}
    </div>
  );
};
export default ChatUser;
