import React, { useEffect, useState } from "react";
// import { useForm } from "react-hook-form";
import { MdClose } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { AiOutlineDown } from "react-icons/ai";
import Loading from "./Loading";
import CustomButton from "./CustomButton";
import { UpdatePost, UpdateProfile, UserLogin } from "../redux/userSlice";
import { apiRequest, fetchPosts, handFileUpload } from "../until";
import { FaEarthAfrica } from "react-icons/fa6";
import { TiDeleteOutline } from "react-icons/ti";
import { CiImageOn, CiShoppingTag } from "react-icons/ci";
import { useForm } from "react-hook-form";
import { AiOutlinePlus } from "react-icons/ai";
import { NoProfile } from "../assets";
import ListCard from "./ListCard";
import { postreason } from "../until/post";
const ReportCard = ({ post, handlerp }) => {
  const [info, setInfo] = useState();
  const { user } = useSelector((state) => state.user);
  console.log(post);
  // console.log(review);
  const handlereport = async () => {
    try {
      const data = { reason: info };
      const res = await postreason(post?._id, user?.token, data);
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };
  // post?.image && setPreview(true);

  return (
    <div>
      <div className="fixed z-50 inset-0 overflow-y-auto">
        <div className="w-full h-full bg-primary/30 flex  justify-center items-center">
          <div className="w-fit h-fit bg-primary rounded-xl px-4 py-5 flex gap-3 flex-col">
            <span className="text-ascent-1 font-medium text-2xl flex justify-between">
              Report
              <button className="text-ascent-1" onClick={handlerp}>
                <MdClose size={22} />
              </button>
            </span>
            <input
              className="bg-secondary outline-none text-ascent-1 px-2 rounded-xl py-2"
              type="text"
              placeholder="Detail"
              value={info}
              onChange={(e) => setInfo(e.target.value)}
            />
            <div className="w-full flex items-end justify-end">
              <CustomButton
                tittle={"Submit"}
                onClick={handlereport}
                containerStyles="bg-blue text-white w-fit h-fit px-4 py-2 rounded-xl"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportCard;
