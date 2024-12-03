import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux/es/hooks/useSelector";
import { IoMdCloseCircle } from "react-icons/io";
import { usergetUserInfo } from "../until/user";
import { NoProfile } from "../assets";
const AddUserCard = ({ useradd }) => {
  const { user } = useSelector((state) => state.user);
  const [avatar, setAvatar] = useState();
  const id = useradd;
  console.log(user);
  const getUser = async (id) => {
    const res = await usergetUserInfo(user?.token, id);
    console.log(res);
    setAvatar(res);
  };
  useEffect(() => {
    console.log(useradd);

    getUser(id);
  }, [useradd]);
  return (
    <div className="w-fit h-fit bg-secondary px-2 py-1 text-ascent-1 flex gap-2 justify-center items-center rounded-3xl">
      <img
        src={avatar?.profileUrl || NoProfile}
        alt=""
        className="h-5 w-5 object-cover rounded-full"
      />
      {avatar?.firstName}
      <div className="text-ascent-1 cursor-pointer">
        <IoMdCloseCircle />
      </div>
    </div>
  );
};
export default AddUserCard;
