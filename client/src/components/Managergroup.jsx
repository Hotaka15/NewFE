import React, { useEffect, useRef, useState } from "react";
import { MdClose } from "react-icons/md";
import CustomButton from "./CustomButton";
import { SlOptionsVertical } from "react-icons/sl";
import { useSelector } from "react-redux";
import { NoProfile } from "../assets";

// const UserDetail = ({}) => {
//   return (
//     <div className="w-full h-full bg-primary absolute z-20">
//       <img src={NoProfile} className="object-cover h-16 w-16" />
//       <img src={NoProfile} className="object-cover h-16 w-16" />
//     </div>
//   );
// };

const UserCard = ({ setChangeRole, user }) => {
  const [choose, setChoose] = useState(false);
  const chooseRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Kiểm tra nếu click bên ngoài dropdown và button
      if (
        chooseRef.current &&
        !chooseRef.current.contains(event.target) && // Nếu click không phải trong dropdown
        buttonRef.current &&
        !buttonRef.current.contains(event.target) // Nếu click không phải trong button mở dropdown
      ) {
        setChoose(false); // Đóng dropdown
      }
    };

    // Thêm event listener
    document.addEventListener("click", handleClickOutside);

    return () => {
      // Cleanup: Gỡ bỏ event listener khi component unmount
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);
  return (
    <div className="w-full relative h-fit bg-secondary px-2 py-2 text-ascent-1 flex gap-2 justify-between items-center rounded-3xl">
      <div className="flex justify-center items-center gap-3 select-none">
        <img
          src={user?.profileUrl ? user?.profileUrl : NoProfile}
          alt=""
          className="h-12 w-12 rounded-full object-cover"
        />
        {user?.firstName} {user?.lastName}
      </div>

      <SlOptionsVertical
        className="mr-2 cursor-pointer"
        ref={buttonRef}
        // onClick={() => {
        //   setChoose(!choose);
        // }}
        onClick={() => {
          setChangeRole(true);
        }}
      />
      {/* {choose && (
        <div
          className="absolute w-40 h-20 top-[80%] right-6 select-none z-10"
          ref={chooseRef}
        >
          <div className="w-full h-full bg-secondary border border-[#66666645] overflow-hidden rounded-2xl shadow-md top-[100%] right-0">
            <div
              onClick={() => {
                setChangeRole(true);
              }}
              className="w-full h-1/2 text-ascent-1 flex justify-center items-center py-3 hover:bg-ascent-3/30"
            >
              Change Role
            </div>
            <div className="w-full h-1/2 text-ascent-1 flex justify-center items-center py-3 hover:bg-ascent-3/30">
              Delete
            </div>
          </div>
        </div>
      )} */}
      {/* {choose && <UserDetail />} */}
    </div>
  );
};

export default function Managergroup({ setRoleo }) {
  const { user } = useSelector((state) => state.user);
  const [changeRole, setChangeRole] = useState(false);
  return (
    <div className="w-full h-full flex justify-center items-center">
      <div className="bg-primary px-3 py-3 flex flex-col gap-4 w-1/6 h-1/2 rounded-2xl">
        <div className="w-full flex px-3 pb-3 border-b border-[#66666645]">
          <span className="text-ascent-1 w-full flex items-center justify-between text-xl font-medium ">
            Manager member
            <div
              className="text-ascent-1 h-full flex items-center cursor-pointer"
              onClick={() => {
                setRoleo(false);
              }}
            >
              <MdClose size={25} />
            </div>
          </span>
        </div>

        <input
          type="text"
          className="bg-secondary px-4 py-2 rounded-2xl outline-none text-ascent-1"
          placeholder="Search"
        />
        <div className=" border-b content-start border-[#66666645] pb-2 h-3/4 bg-primary gap-2 overflow-y-auto flex flex-col ">
          <UserCard setChangeRole={setChangeRole} user={user} />
          <UserCard setChangeRole={setChangeRole} user={user} />
        </div>

        <div
          className="w-full flex justify-end"
          onClick={() => {
            setRoleo(false);
          }}
        >
          <CustomButton
            tittle="Close"
            containerStyles="bg-blue w-fit px-2 py-2 rounded-xl text-white select-none"
          />
        </div>
      </div>

      {/* {changeRole && (
        <div className="w-full h-full flex justify-center items-center absolute z-20">
          <div className="bg-primary px-3 py-3 flex flex-col gap-4 w-1/6 h-1/3 rounded-2xl">
            <div className="w-full flex px-3 pb-3 border-b border-[#66666645]">
              <span className="text-ascent-1 w-full flex items-center justify-between text-xl font-medium ">
                Role
                <div
                  className="text-ascent-1 h-full flex items-center cursor-pointer"
                  onClick={() => {
                    setChangeRole(false);
                  }}
                >
                  <MdClose size={25} />
                </div>
              </span>
            </div>

            <div className=" border-b content-start border-[#66666645] pb-2 h-3/4 bg-primary gap-2 overflow-y-auto flex flex-col ">
              <label
                htmlFor="admin"
                className="w-full text-ascent-1 flex gap-3  px-4 py-4 hover:bg-ascent-3/30 rounded-xl "
              >
                <input
                  type="radio"
                  id="admin"
                  name="role"
                  value="Admin"
                  checked
                />
                <label htmlFor="admin">Admin</label>
              </label>
              <label
                htmlFor="member"
                className="w-full text-ascent-1 flex gap-3  px-4 py-4 hover:bg-ascent-3/30 rounded-xl "
              >
                <input type="radio" id="member" name="role" value="Member" />
                <label htmlFor="member">Member</label>
              </label>
            </div>

            <div className="w-full flex justify-end">
              <CustomButton
                tittle="Close"
                containerStyles="bg-blue w-fit px-2 py-2 rounded-xl text-white"
              />
            </div>
          </div>
        </div>
      )} */}
      {changeRole && (
        <div className=" w-full h-full flex justify-center items-center absolute z-20  ">
          <div className="relative bg-primary pb-2 flex flex-col w-1/6 h-1/2 rounded-2xl overflow-hidden">
            <div
              className="absolute  top-2 cursor-pointer z-50 right-2 px-1 py-1 rounded-full bg-bgColor/30 text-ascent-1 flex items-center "
              onClick={() => {
                setChangeRole(false);
              }}
            >
              <MdClose size={25} />
            </div>
            <div className="relative h-1/3 overflow-auto w-full flex ">
              <img src={NoProfile} className="w-full object-cover blur-lg" />
            </div>
            <div className="w-full relative bottom-4 flex flex-col items-center">
              <img src={NoProfile} className="object-cover h-14 w-14" />
              <span className="text-ascent-1">Name</span>
            </div>
            <div className="w-full px-4 cursor-pointer ">
              <div className="font-normal select-none text-ascent-1 w-full hover:bg-ascent-3/30 flex justify-center text-base py-1 bg-secondary rounded-lg ">
                PROFILE
              </div>
            </div>

            <span className="text-ascent-2 px-4 ">Select role:</span>

            <div className="px-2">
              <select className="text-ascent-1 rounded-lg outline-none w-full bg-secondary  border border-[#66666690] px-4 py-3">
                <option selected value="male">
                  Member
                </option>
                <option value="female">Admin</option>
                <option value="other">Member</option>
              </select>
            </div>

            <div className="w-full flex justify-between px-4 absolute bottom-5">
              <CustomButton
                tittle="Delete"
                onClick={() => {
                  setChangeRole(false);
                }}
                containerStyles="bg-[#ff0015b2] w-fit px-2 py-2 rounded-xl text-white"
              />
              <CustomButton
                tittle="Update"
                containerStyles="bg-blue w-fit px-2 py-2 rounded-xl text-white"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
