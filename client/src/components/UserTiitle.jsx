import React, { useState } from "react";
import { useSelector } from "react-redux/es/hooks/useSelector";
import { IoMdCloseCircle } from "react-icons/io";
const UserTiitle = () => {
  const { user } = useSelector((state) => state.user);
  console.log(user);

  return (
    <div className="w-fit h-fit bg-secondary px-2 py-1 text-ascent-1 flex gap-2 justify-center items-center rounded-3xl">
      <img
        src={user?.profileUrl}
        alt=""
        className="h-5 w-5 object-cover rounded-full"
      />
      {user?.firstName}
      <div className="text-ascent-1 cursor-pointer">
        <IoMdCloseCircle />
      </div>
    </div>
  );
};
export default UserTiitle;
