import React from "react";
// import { friends } from "../assets/data";
import { Link } from "react-router-dom";
import { NoProfile } from "../assets";
import { Login } from "../pages";
import FriendCardf from "./FriendCardf";

const FriendsCard = ({ friend }) => {
  console.log(friend);
  return (
    <div>
      <div className="w-full shadow-sm rounded-lg">
        <div className="flex items-center justify-between text-lg text-ascent-2 bp-2 ">
          {/* <span>{friend?.length}</span> */}
        </div>
        {friend.map((friend) => (
          <FriendCardf friend={friend} />
        ))}
      </div>
    </div>
  );
};

export default FriendsCard;
