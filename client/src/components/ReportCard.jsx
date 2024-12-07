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
    handlerp();
  };
  // post?.image && setPreview(true);

  return (
    <div>
      <div className="fixed z-50 inset-0 overflow-y-auto">
        <div className="w-full h-full bg-primary/30 flex  justify-center items-center">
          <div className="w-1/5 h-1/2 bg-primary rounded-xl px-4 pt-5 flex gap-3 flex-col">
            <span className="text-ascent-1 font-medium text-2xl flex justify-between">
              Report
              <button className="text-ascent-1" onClick={handlerp}>
                <MdClose size={22} />
              </button>
            </span>
            {/* <input
              className="bg-secondary outline-none text-ascent-1 px-2 rounded-xl py-2"
              type="text"
              placeholder="Detail"
              value={info}
              onChange={(e) => setInfo(e.target.value)}
            /> */}
            <div className=" border-b content-start border-[#66666645] py-2 h-3/4 bg-primary gap-2 overflow-y-auto flex flex-col ">
              <label
                htmlFor="Offensive"
                className="w-full text-ascent-1 flex gap-3  px-4 py-4 hover:bg-ascent-3/30 rounded-xl "
              >
                <input
                  type="radio"
                  id="Offensive"
                  name="report"
                  value="Offensive Language"
                  onChange={(e) => {
                    setInfo(e.target.value);
                  }}
                />
                <label htmlFor="Offensive">Offensive Language</label>
              </label>
              <label
                htmlFor="Misinformation"
                className="w-full text-ascent-1 flex gap-3  px-4 py-4 hover:bg-ascent-3/30 rounded-xl "
              >
                <input
                  type="radio"
                  id="Misinformation"
                  name="report"
                  value="Misinformation"
                  onChange={(e) => {
                    setInfo(e.target.value);
                  }}
                />
                <label htmlFor="Misinformation">Misinformation</label>
              </label>
              <label
                htmlFor="Harassment"
                className="w-full text-ascent-1 flex gap-3  px-4 py-4 hover:bg-ascent-3/30 rounded-xl "
              >
                <input
                  type="radio"
                  id="Harassment"
                  name="report"
                  onChange={(e) => {
                    setInfo(e.target.value);
                  }}
                  value="Harassment"
                />
                <label htmlFor="Harassment">Harassment</label>
              </label>
              <label
                htmlFor="Violence"
                className="w-full text-ascent-1 flex gap-3  px-4 py-4 hover:bg-ascent-3/30 rounded-xl "
              >
                <input
                  type="radio"
                  id="Violence"
                  name="report"
                  value="Violence"
                  onChange={(e) => {
                    setInfo(e.target.value);
                  }}
                />
                <label htmlFor="Violence">Violence</label>
              </label>
              <label
                htmlFor="Nudity"
                className="w-full text-ascent-1 flex gap-3  px-4 py-4 hover:bg-ascent-3/30 rounded-xl "
              >
                <input
                  type="radio"
                  id="Nudity"
                  name="report"
                  value="Nudity"
                  onChange={(e) => {
                    setInfo(e.target.value);
                  }}
                />
                <label htmlFor="Nudity">Nudity</label>
              </label>
              <label
                htmlFor="Hate_Speech"
                className="w-full text-ascent-1 flex gap-3  px-4 py-4 hover:bg-ascent-3/30 rounded-xl "
              >
                <input
                  type="radio"
                  id="Hate_Speech"
                  name="report"
                  value="Hate Speech"
                  onChange={(e) => {
                    setInfo(e.target.value);
                  }}
                />
                <label htmlFor="Hate_Speech">Hate Speech</label>
              </label>
              <label
                htmlFor="Illegal_Content"
                className="w-full text-ascent-1 flex gap-3  px-4 py-4 hover:bg-ascent-3/30 rounded-xl "
              >
                <input
                  type="radio"
                  id="Illegal_Content"
                  name="report"
                  value="Illegal Content"
                  onChange={(e) => {
                    setInfo(e.target.value);
                  }}
                />
                <label htmlFor="Illegal_Content">Illegal Content</label>
              </label>
              <label
                htmlFor="Other"
                className="w-full text-ascent-1 flex gap-3  px-4 py-4 hover:bg-ascent-3/30 rounded-xl "
              >
                <input type="radio" id="Other" name="report" value="Other" />
                <label htmlFor="Other">Other</label>
              </label>
            </div>
            <div className="w-full flex items-end justify-end">
              <CustomButton
                tittle={"Submit"}
                onClick={handlereport}
                containerStyles="bg-blue text-white w-full flex item-center justify-center h-fit px-4 py-2 rounded-xl"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportCard;
