import React, { useEffect, useRef, useState } from "react";
import { MdClose } from "react-icons/md";
import CustomButton from "./CustomButton";
import { SlOptionsVertical } from "react-icons/sl";
import { useSelector } from "react-redux";
import { GroupImg, NoProfile } from "../assets";
import { chatfetchDetail } from "../until/chat";
import { usergetUserInfo } from "../until/user";
import { Link } from "react-router-dom";
import { changeRoleGroup, deleteMemberGroup } from "../until/group";

// const UserDetail = ({}) => {
//   return (
//     <div className="w-full h-full bg-primary absolute z-20">
//       <img src={NoProfile} className="object-cover h-16 w-16" />
//       <img src={NoProfile} className="object-cover h-16 w-16" />
//     </div>
//   );
// };

const UserCard = ({ token, setChangeRole, user, isAdmin, setInfo }) => {
  const [choose, setChoose] = useState(false);
  const chooseRef = useRef(null);
  const [infor, setInfor] = useState();
  const buttonRef = useRef(null);
  console.log(token);

  const getInfor = async () => {
    const id = user;
    const res = await usergetUserInfo(token, id);
    console.log(res);
    setInfor(res);
  };

  const handle = () => {
    setChangeRole(true);
    setInfo(infor);
  };

  useEffect(() => {
    getInfor();
  }, []);

  // useEffect(() => {
  //   const handleClickOutside = (event) => {
  //     // Kiểm tra nếu click bên ngoài dropdown và button
  //     if (
  //       chooseRef.current &&
  //       !chooseRef.current.contains(event.target) && // Nếu click không phải trong dropdown
  //       buttonRef.current &&
  //       !buttonRef.current.contains(event.target) // Nếu click không phải trong button mở dropdown
  //     ) {
  //       setChoose(false); // Đóng dropdown
  //     }
  //   };

  //   // Thêm event listener
  //   document.addEventListener("click", handleClickOutside);

  //   return () => {
  //     // Cleanup: Gỡ bỏ event listener khi component unmount
  //     document.removeEventListener("click", handleClickOutside);
  //   };
  // }, []);
  return (
    <div className="w-full relative h-fit bg-secondary px-2 py-2 text-ascent-1 flex gap-2 justify-between items-center rounded-3xl">
      <div className="flex justify-center items-center gap-3 select-none">
        <img
          src={infor?.profileUrl ?? NoProfile}
          alt=""
          className="h-12 w-12 rounded-full object-cover"
        />
        {infor?.firstName} {infor?.lastName}
      </div>

      <SlOptionsVertical
        className="mr-2 cursor-pointer"
        ref={buttonRef}
        // onClick={() => {
        //   setChoose(!choose);
        // }}
        onClick={() => {
          handle();
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

export default function Managergroup({ setRoleo, idroom }) {
  console.log(idroom);
  const [member, setMember] = useState([]);
  const { user } = useSelector((state) => state.user);
  const [changeRole, setChangeRole] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [role, setRole] = useState();
  const [info, setInfo] = useState();
  const [listadmin, setListadmin] = useState([]);
  const [isSuccess, setIsSuccess] = useState(false);
  const [inforRoom, setInforRoom] = useState();
  const token = user?.token;
  const getDetail = async (idroom) => {
    const res = await chatfetchDetail(user?.token, idroom);
    console.log(res);
    if (res) {
      setInforRoom(res?.data);
      setListadmin([...res?.data?.admins]);
      const array = [...res?.data?.admins];
      setIsAdmin(array.includes(user?._id));
      console.log(array.includes(user?._id));
      setMember(res?.data?.members);
    }
  };

  const handleDelete = async (_id) => {
    try {
      const id_1 = user?._id;
      const id_2 = _id;

      const res = await deleteMemberGroup(user?.token, idroom, id_1, id_2);
      await getDetail(idroom);
      setChangeRole(false);
      setIsSuccess(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handlechangeRole = async (_id) => {
    console.log("asdj");

    console.log(_id, role);
    console.log(user?._id);

    try {
      const id_1 = user?._id;
      const id_2 = _id;
      const res = await changeRoleGroup(user?.token, idroom, id_1, id_2, role);
      console.log(res);
      console.log(typeof res.status);
      res.status == 200 && setIsSuccess(true);
      getDetail(idroom);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getDetail(idroom);
  }, []);

  return (
    <div className="w-full h-full flex justify-center items-center">
      <div className="fixed inset-0 transition-opacticy">
        <div className="absolute inset-0 bg-[#000] opacity-70 z-0"></div>
      </div>
      <div className="absolute bg-primary px-3 py-3 flex flex-col gap-4 w-1/5 h-1/2 rounded-2xl">
        <div className="w-full flex px-3 ">
          <span className="text-ascent-1 w-full flex items-center justify-end text-xl font-medium ">
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
        <div className="w-full flex flex-col items-center ">
          <div className="w-fit h-fit bg-white rounded-full">
            <img
              src={GroupImg}
              className="w-20 h-20 object-cover rounded-full"
            />
          </div>
          <span className="text-ascent-1 text-2xl font-semibold mt-2">
            {inforRoom?.name}
          </span>
        </div>

        {/* <input
          type="text"
          className="bg-secondary px-4 py-2 rounded-2xl outline-none text-ascent-1"
          placeholder="Search"
        /> */}
        <div className="w-full px-2">
          <span className="text-ascent-2">Member:</span>
        </div>
        <div className=" border-b content-start border-[#66666645] pb-2 h-3/4 bg-primary gap-2 overflow-y-auto flex flex-col ">
          {member &&
            member.map((user) => {
              return (
                <UserCard
                  key={user._id}
                  token={token}
                  setChangeRole={setChangeRole}
                  user={user}
                  isAdmin={isAdmin}
                  setInfo={setInfo}
                />
              );
            })}
          {/* <UserCard setChangeRole={setChangeRole} user={user} />
          <UserCard setChangeRole={setChangeRole} user={user} /> */}
        </div>

        {/* <div
          className="w-full flex justify-end"
          onClick={() => {
            setRoleo(false);
          }}
        >
          <CustomButton
            tittle="Close"
            containerStyles="bg-blue w-fit px-2 py-2 rounded-xl text-white select-none"
          />
        </div> */}
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
                setIsSuccess(false);
              }}
            >
              <MdClose size={25} />
            </div>
            <div className="relative h-1/3 overflow-auto w-full flex ">
              <img
                src={info.profileUrl ?? NoProfile}
                className="w-full object-cover blur-lg"
              />
            </div>
            <div className="w-full relative bottom-6 flex flex-col items-center">
              <img
                src={info.profileUrl ?? NoProfile}
                className="object-cover h-20 w-20 rounded-full"
              />
              <span className="text-ascent-1">
                {info.firstName} {info.lastName}
              </span>
            </div>
            <div className="w-full px-4 cursor-pointer relative bottom-4">
              <a
                href={`http://localhost:3000/profile/${info?._id}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="font-normal select-none text-ascent-1 w-full hover:bg-ascent-3/30 flex justify-center text-base py-1 bg-secondary rounded-lg ">
                  PROFILE
                </div>
              </a>
            </div>
            {!isAdmin && (
              <div className="px-4 relative bottom-4">
                <div className="text-ascent-2 mp-2 py-3">
                  Role: {listadmin.includes(info._id) ? "Admin" : "Member"}
                </div>

                {/* <div className="px-6 w-full text-ascent-2">
                  {listadmin.includes(info._id) ? "Admin" : "Member"}
                </div> */}
              </div>
            )}
            {isAdmin && (
              <div className="px-4 relative bottom-4">
                <span className="text-ascent-2 mp-2">Select role:</span>

                <select
                  defaultValue={
                    listadmin.includes(info._id) ? "admin" : "member"
                  }
                  onChange={(e) => setRole(e.target.value)}
                  className="text-ascent-1 rounded-lg outline-none w-full bg-secondary  border border-[#66666690] px-4 py-3"
                >
                  <option value="admin">Admin</option>
                  <option value="member">Member</option>
                </select>
              </div>
            )}

            {isAdmin && (
              <div className="w-full flex justify-between px-4 absolute bottom-5">
                <CustomButton
                  tittle="Delete"
                  onClick={() => {
                    handleDelete(info._id);
                  }}
                  containerStyles="bg-[#ff0015b2] w-fit px-2 py-2 rounded-xl text-white"
                />

                {!isSuccess && (
                  <CustomButton
                    onClick={() => {
                      handlechangeRole(info._id);
                    }}
                    tittle="Update"
                    containerStyles="bg-blue w-fit px-2 py-2 rounded-xl text-white"
                  />
                )}
                {isSuccess && (
                  <div className="px-3 text-[#2ba150fe] flex justify-center items-center">
                    Success
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
