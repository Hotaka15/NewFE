import React, { useEffect, useState } from "react";

import UserTiitle from "./UserTiitle";
import CustomButton from "./CustomButton";
import { IoIosAddCircle } from "react-icons/io";
import { useSelector } from "react-redux";
import Cookies from "js-cookie";
import { MdClose } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { userfriendSuggest } from "../until/user";
import { NoProfile } from "../assets";
const CreateGroup = ({ setCreatg }) => {
  const { user } = useSelector((state) => state.user);
  const [listsuggest, setListsuggest] = useState([]);
  const [listAdd, setListAdd] = useState([]);
  const navigate = useNavigate();
  const fetchSuggestFriends = async () => {
    try {
      const res = await userfriendSuggest(user?.token, user);
      if (res?.status === "failed") {
        Cookies.set("message", res?.message, { expires: 7 });
        navigate("/error");
      }
      console.log(res);
      setListsuggest(res?.suggestedFriends);
    } catch (error) {
      console.log(error);
    }
  };

  const handdlelistadd = (id) => {
    console.log(listAdd);
    const lista = [...listAdd];
    lista.push(id);
    console.log(id);

    setListAdd(lista);
  };
  useEffect(() => {
    fetchSuggestFriends();
  }, []);
  return (
    <div className="absolute w-full h-full bg-secondary/30 z-50 ">
      <div className="w-full h-full flex justify-center items-center">
        <div className="bg-primary px-3 py-3 flex flex-col gap-4 w-1/5 h-[60%] rounded-2xl">
          <div className="w-full flex px-3 pb-3 border-b border-[#66666645]">
            <span className="text-ascent-1 w-full flex items-center justify-between text-xl font-medium ">
              Create Group
              <div
                className="text-ascent-1 h-full flex items-center cursor-pointer"
                onClick={() => {
                  setCreatg(false);
                }}
              >
                <MdClose size={25} />
              </div>
            </span>
          </div>

          <div className="flex w-full justify-start items-center gap-3">
            <span className="text-ascent-1">Name </span>
            <input
              type="text"
              className="bg-secondary px-2 py-2 rounded-2xl w-full"
              placeholder="Name"
            />
          </div>
          <div className="flex w-full justify-start items-center gap-3">
            <span className="text-ascent-1">Description </span>
            <input
              type="text"
              className="bg-secondary px-2 py-2 rounded-2xl w-full"
              placeholder="Description"
            />
          </div>

          <span className="text-ascent-1">Member</span>
          <input
            type="text"
            className="bg-secondary px-2 py-2 rounded-2xl"
            placeholder="Search"
          />
          <div className="content-start border-b border-[#66666645] pb-2 h-1/4 bg-primary gap-2 overflow-y-auto flex flex-wrap justify-center ">
            {listsuggest &&
              listsuggest.map((suggest) => {
                return (
                  <div
                    onClick={() => {
                      handdlelistadd(suggest?._id);
                    }}
                    key={suggest?._id}
                    className="w-fit h-fit bg-secondary px-2 py-1 text-ascent-1 flex gap-2 justify-center items-center rounded-3xl"
                  >
                    <img
                      src={
                        suggest?.profileUrl ? suggest?.profileUrl : NoProfile
                      }
                      alt=""
                      className="h-5 w-5 rounded-full object-cover"
                    />
                    {suggest?.firstName}
                    <IoIosAddCircle />
                  </div>
                );
              })}
          </div>
          <div className="h-1/4 flex flex-wrap gap-2 overflow-y-auto content-start">
            {listAdd &&
              listAdd.map((useradd) => {
                return <UserTiitle useradd={useradd} />;
              })}
          </div>

          <div className="w-full flex justify-end">
            <CustomButton
              tittle="Submit"
              containerStyles="bg-blue w-fit px-2 py-2 rounded-xl text-white"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateGroup;
