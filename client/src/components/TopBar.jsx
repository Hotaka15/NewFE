import React, { useEffect, useRef, useState } from "react";
import { TbSocial } from "react-icons/tb";
import { useDispatch, useSelector } from "react-redux";
import { Link, Navigate, useNavigate } from "react-router-dom";
import TextInput from "./TextInput";
import CustomButton from "./CustomButton";

import { useForm } from "react-hook-form";

import { MdDarkMode } from "react-icons/md";

import { FaTools } from "react-icons/fa";
import { IoNotifications } from "react-icons/io5";
import { TfiAngleRight } from "react-icons/tfi";
import { setTheme } from "../redux/theme";
import { Logout, Setnotification, UserLogin } from "../redux/userSlice";

import Notification from "./Notification";
import { MdOutlineGTranslate } from "react-icons/md";
import { FaFacebookMessenger } from "react-icons/fa";
import { UpdateProfile } from "../redux/userSlice";

import { IoMdSettings } from "react-icons/io";
import { NoProfile } from "../assets";
import { notifetchNotifications } from "../until/noti";

import { IoLogOut } from "react-icons/io5";
import { Oval } from "react-loader-spinner";
import { useTranslation } from "react-i18next";
import {
  searchUserName,
  userapiRequest,
  usergetlistUserInfo,
} from "../until/user";
import { PiSunDimFill } from "react-icons/pi";
import { useSocket } from "../context/SocketContext";
const TopBar = ({ user, setKey }) => {
  const { theme } = useSelector((state) => state.theme);
  const { notification, edit } = useSelector((state) => state.user);
  const [notifications, setNotifications] = useState([]);
  const { i18n } = useTranslation();
  const [profilecard, setProfilecard] = useState();
  const [ava, setAva] = useState();
  const [value, setvalue] = useState("");
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState("");
  const [listUser, setListUser] = useState([]);
  const [listSearchUser, setListSearchUser] = useState([]);
  const [loading, setLoading] = useState(true);
  const debounceTimeout = useRef(null);
  const socket = useSocket();
  const wordLimit = 100;
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const handleTheme = () => {
    const themeValue = theme === "light" ? "dark" : "light";

    dispatch(setTheme(themeValue));
  };

  const setAvatar = () => {
    setAva(!ava);
  };

  const changelanguage = () => {
    const key = i18n.language == "vi" ? "en" : "vi";
    i18n.changeLanguage(key);
  };

  // const handlegetFriend = async() => {
  //   const res = await
  // }
  const fetchlistUser = async () => {
    try {
      const list = user?.friends.join(",");

      const res = await usergetlistUserInfo(user?.token, list);

      setListUser(res && res);
    } catch (error) {
      console.log(error);
    }
  };

  const handleInputChange = async (e) => {
    const value = e.target.value;
    const wordCount = value.split(/\s+/).filter(Boolean).length;
    if (wordCount <= wordLimit && wordCount >= 0) {
      setInputValue(value);
    }

    if (value.startsWith("@user")) {
      setLoading(true);
      try {
        if (debounceTimeout.current) {
          clearTimeout(debounceTimeout.current);
        }

        debounceTimeout.current = setTimeout(async () => {
          try {
            const prompt = value.replace(/^@user\s*/, "");
            // const res = await botsuggestsearchRequest(prompt);
            const res = await searchUserName(user?.token, prompt);
            setListSearchUser(res && res.slice(0, 5));
          } catch (error) {
            console.log(error);
          }
        }, 1000);

        // const prompt = value.replace(/^@searchuser\s*/, "");
        // const res = await botsuggestsearchRequest(prompt);
        // setListSearchUser(res && res?.info);
        // console.log(res);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSearch = async (data) => {
    const key = data?.search;

    if (
      key != "" &&
      !key.startsWith("@searchuser") &&
      !key.startsWith("@user")
    ) {
      try {
        navigate(`/search/${key ? key : ""}`);
      } catch (error) {
        console.log(error);
      }
    } else if (key != "" && key.startsWith("@searchuser")) {
      try {
        navigate(
          `/searchuser/${key ? key.replace(/^@searchuser\s*/, "") : ""}`
        );
      } catch (error) {
        console.log(error);
      }
    } else if (key != "" && key.startsWith("@user")) {
      try {
        navigate(`/user/${key ? key.replace(/^@user\s*/, "") : ""}`);
      } catch (error) {
        console.log(error);
      }
    }
  };
  const handleLogout = () => {
    setAva(!ava);
    dispatch(Logout());
    navigate("/login");
  };

  const fetchNotification = async () => {
    const newData = {
      userId: user?._id,
    };
    try {
      const res = await notifetchNotifications({
        token: user?.token,
        userId: user?._id,
        dispatch,
        data: newData,
      });

      setNotifications(res);
    } catch (error) {
      console.log(error);
    }
  };

  const onSubmit = async () => {
    try {
      const res = await userapiRequest({
        url: "",
        data: {
          statusActive: !user?.statusActive,
        },
        method: "PUT",
        token: user?.token,
      });

      if (res?.status === "failed") {
      } else {
        const newUser = { token: user?.token, ...res };

        setTimeout(() => {
          dispatch(UpdateProfile(false));
        }, 3000);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchNotification();
    fetchlistUser();
    socket.on("receiveNotification", (notification) => {
      fetchNotification();
    });
  }, []);
  return (
    <div className="flex-col flex items-end select-none ">
      <div
        className="topbar w-full flex items-center justify-between py-3
  md:py-3 px-4 bg-primary"
      >
        <Link to="/" className="flex gap-2 items-center">
          <div className="p-1 md:p-2 bg-[#065ad8] rounded text-white">
            <TbSocial />
          </div>
          <span className="text-xl md:text-2xl text-[#065ad8] rounded ">
            SOCIAL MEIDA
          </span>
        </Link>
        {/* <FaTools /> */}
        {/* <div className="hidden md:flex items-center justify-center ">
          <input
            type="text"
            className=" bg-secondary rounded border border-[#66666690] 
            outline-none text-sm text-ascent-1 
            px-4 placeholder:text-ascent-2 w-[18rem] lg:w-[38rem] rounded-l-full py-3"
            placeholder="Search..."
            value={value}
            onChange={(e) => {
              setvalue(e.target.value);
            }}
          />
          <Link
            to={`/search/${value}`}
            onClick={() => {
              console.log("Topbar" + value);
              handleSearch(value);
              // handleSearch(value);
              // {
              //   handle ? handle(value) : "";
              // }
            }}
          >
            <CustomButton
              tittle="search"
              type="submit"
              containerStyles="bg-[#0444a4] text-white px-6 py-2.5 rounded-r-full"
            />
          </Link>
        </div> */}
        <div className="relative ">
          <form
            className="hidden md:flex items-center justify-center"
            onSubmit={handleSubmit(handleSearch)}
          >
            {/* <TextInput
              placeholder="Search..."
              styles="w-[18rem] lg:w-[38rem] rounded-l-full py-3"
              register={register("search")}
            /> */}
            <input
              className={`bg-secondary rounded border border-[#66666690] 
            outline-none text-sm text-ascent-1 
            px-4 py-3 placeholder:text-ascent-2 w-[18rem] lg:w-[38rem] rounded-l-full `}
              placeholder={t("Search post or @user,@searchuser")}
              type="text"
              {...register("search")}
              value={inputValue}
              onChange={(e) => {
                handleInputChange(e);
              }}
            />

            <CustomButton
              tittle={t("Search")}
              type="submit"
              containerStyles="bg-[#0444a4] text-white px-6 py-2.5  rounded-r-full"
            />
          </form>
          {inputValue.startsWith("@") &&
            !inputValue.startsWith("@user") &&
            !inputValue.startsWith("@searchuser") && (
              <div className="absolute top-full rounded-lg mt-4 w-full max-h-60 h-fit overflow-auto shadow-xl bg-secondary">
                {listUser.length > 0 &&
                  listUser
                    .filter(
                      (item) =>
                        // item.firstName.toLowerCase() ===
                        // inputValue.slice(1).toLowerCase()
                        (inputValue.slice(1).length > 0 &&
                          item.firstName
                            .toLowerCase()
                            .includes(inputValue.slice(1).toLowerCase())) ||
                        item.lastName
                          .toLowerCase()
                          .includes(inputValue.slice(1).toLowerCase()) ||
                        (item.firstName + " " + item.lastName)
                          .toLowerCase()
                          .includes(inputValue.slice(1).toLowerCase()) ||
                        (item.lastName + " " + item.firstName)
                          .toLowerCase()
                          .includes(inputValue.slice(1).toLowerCase())
                    )
                    .map((item) => {
                      return (
                        <Link key={item._id} to={`profile/${item._id}`}>
                          <div className="px-5 py-2 text-ascent-1 flex items-center gap-2">
                            <img
                              src={item.profileUrl ?? NoProfile}
                              className="rounded-full object-cover h-5 w-5"
                            />
                            {item.firstName} {item.lastName}
                          </div>
                        </Link>
                      );
                    })}
                {/* <div className="w-full py-5 flex items-center justify-center">
                <Oval
                  visible={true}
                  height="30"
                  width="30"
                  color="blue"
                  ariaLabel="oval-loading"
                  wrapperStyle={{}}
                  wrapperClass=""
                />
              </div> */}
              </div>
            )}

          {inputValue.startsWith("@") &&
            inputValue.startsWith("@user") &&
            !inputValue.startsWith("@searchuser") && (
              <div className="absolute top-full rounded-lg mt-4 w-full max-h-60 h-fit overflow-auto shadow-xl bg-secondary">
                {listSearchUser &&
                  listSearchUser.length > 0 &&
                  listSearchUser.map((item) => {
                    return (
                      <Link key={item._id} to={`profile/${item._id}`}>
                        <div className="px-5 py-2 text-ascent-1 flex items-center gap-2">
                          <img
                            src={item.profileUrl ?? NoProfile}
                            className="rounded-full object-cover h-5 w-5"
                          />
                          {item.firstName} {item.lastName}
                        </div>
                      </Link>
                    );
                  })}
                {loading && (
                  <div className="w-full py-5 flex items-center justify-center">
                    <Oval
                      visible={true}
                      height="30"
                      width="30"
                      color="blue"
                      ariaLabel="oval-loading"
                      wrapperStyle={{}}
                      wrapperClass=""
                    />
                  </div>
                )}
              </div>
            )}
        </div>

        {/* {ICON} */}

        <div className="flex gap-4 items-center text-ascent-1 text-md md:text-xl">
          {user?.role === "Admin" && (
            <div className="px-3 py-3 text-ascent-1 rounded-full hidden lg:flex bg-ascent-3/30 cursor-pointer hover:bg-ascent-3/70">
              <Link to={`/admin`}>
                <FaTools size={25} />
              </Link>
            </div>
          )}

          <button
            className="px-3 py-3 text-ascent-1 rounded-full bg-ascent-3/30 cursor-pointer hover:bg-ascent-3/70"
            onClick={() => handleTheme()}
          >
            {theme == "dark" ? (
              <PiSunDimFill size={25} />
            ) : (
              <MdDarkMode size={25} />
            )}
          </button>
          <div
            className=" px-3 py-3 text-ascent-1 rounded-full hidden lg:flex bg-ascent-3/30 cursor-pointer hover:bg-ascent-3/70"
            onClick={() => {
              changelanguage();
            }}
          >
            <MdOutlineGTranslate size={25} />
          </div>
          <div
            onClick={() => {
              navigate(`/chat`);
            }}
            className="px-3 py-3 text-ascent-1 rounded-full hidden lg:flex bg-ascent-3/30 cursor-pointer hover:bg-ascent-3/70"
          >
            <FaFacebookMessenger size={25} />
            {/* <Link to={`/chat/${user?._id}`}>
              <FaFacebookMessenger size={25} />
            </Link> */}
          </div>
          <div
            className="relative px-3 py-3 text-ascent-1 rounded-full hidden lg:flex bg-ascent-3/30 cursor-pointer hover:bg-ascent-3/70"
            onClick={() => {
              dispatch(Setnotification(!notification));
              // fetchNotification();
            }}
          >
            <IoNotifications size={30} />
            {notifications &&
              notifications.filter((noti) => !noti.isRead).length > 0 && (
                <div className="w-4 h-4 rounded-full flex items-center justify-center absolute top-2 right-2 bg-[#e22222] text-sm text-white">
                  {notifications.filter((noti) => !noti.isRead).length < 10
                    ? notifications.filter((noti) => !noti.isRead).length
                    : "9+"}
                </div>
              )}
          </div>
          <img
            src={user?.profileUrl ?? NoProfile}
            className="w-14 h-14 object-cover rounded-full px-1 py-1 z-10"
            onClick={() => {
              setAvatar();
            }}
          />

          {/* <CustomButton
            onClick={() => dispatch(Logout())}
            tittle={"Logout"}
            containerStyles={
              "text-sm text-ascent-1 px-4 md:px-6 py-1 md:py-2 border border-[#666] rounded-full"
            }
          /> */}
        </div>
      </div>

      {notification && (
        <div className="">
          <div className=" top-20 right-20 z-50 absolute w-1/5 overflow-auto h-2/3 rounded-xl text-ascent-1 justify-center flex">
            <Notification
              notify={notifications}
              fetchNotification={fetchNotification}
            />
          </div>
        </div>
      )}
      {ava && (
        <div className="bg-primary">
          <div className=" right-20 z-50 absolute w-1/6 overflow-auto border rounded-xl text-ascent-1 h-fit border-[#66666690] justify-center flex flex-col">
            <Link to={"/profile/" + user?._id} className="flex gap-2 w-full">
              <div
                className="w-full px-4 text-center py-3 font-medium cursor-pointer bg-primary hover:bg-bgColor
                             flex flex-col justify-evenly"
              >
                <div className="w-full flex justify-start items-center gap-2">
                  <img
                    src={user?.profileUrl ?? NoProfile}
                    className="w-10 h-10 object-cover rounded-full z-10"
                    onClick={() => {
                      setAvatar();
                    }}
                  />
                  {t("Profile")}
                </div>
              </div>
            </Link>
            <div
              className="w-full text-center py-3 font-medium cursor-pointer bg-primary hover:bg-bgColor flex px-4"
              onClick={() => dispatch(UpdateProfile(true))}
            >
              <div className="flex justify-start items-center w-full gap-2">
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-ascent-3/30 cursor-pointer hover:bg-ascent-3/70 ">
                  <IoMdSettings size={30} />
                </div>

                {t("Setting")}
              </div>
              <div className="flex h-full text-ascent-2 py-2 items-center justify-center">
                <TfiAngleRight size={20} />
              </div>
            </div>
            <div
              className="w-full text-center py-2 font-medium cursor-pointer bg-primary hover:bg-bgColor flex px-4"
              onClick={() => handleLogout()}
            >
              <div className="flex justify-start items-center w-full gap-2">
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-ascent-3/30 cursor-pointer hover:bg-ascent-3/70 ">
                  <IoLogOut size={30} />
                </div>

                {t("Logout")}
              </div>
              <div className="flex h-full text-ascent-2 py-2 items-center justify-center">
                <TfiAngleRight size={20} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TopBar;
