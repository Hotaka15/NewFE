import React, { useEffect, useRef, useState } from "react";
import { TbSocial } from "react-icons/tb";
import { useDispatch, useSelector } from "react-redux";
import { Link, Navigate, useNavigate } from "react-router-dom";
import TextInput from "./TextInput";
import CustomButton from "./CustomButton";
import { PiSignOut } from "react-icons/pi";
import { useForm } from "react-hook-form";

import { MdDarkMode } from "react-icons/md";

import { FaTools } from "react-icons/fa";
import { IoNotifications } from "react-icons/io5";

import { setTheme } from "../redux/theme";
import { Logout, Setnotification, UserLogin } from "../redux/userSlice";
import { fetchNotifications, fetchPosts } from "../until";
import Notification from "./Notification";
import { MdOutlineGTranslate } from "react-icons/md";
import { FaFacebookMessenger } from "react-icons/fa";
import { UpdateProfile } from "../redux/userSlice";
import { GoSun } from "react-icons/go";
import { IoMdSettings } from "react-icons/io";
import { NoProfile } from "../assets";
import { notifetchNotifications } from "../until/noti";
import { postsearchfetchPosts } from "../until/post";
import { IoLogOut } from "react-icons/io5";
import { Oval } from "react-loader-spinner";
import { useTranslation } from "react-i18next";
import {
  searchUserName,
  userapiRequest,
  usergetlistUserInfo,
} from "../until/user";
import Loading from "./Loading";
import { botsuggestsearchRequest } from "../until/bot";
import { useTransition } from "react";
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

  console.log(user?.friends);
  console.log(user);

  // const handlegetFriend = async() => {
  //   const res = await
  // }
  const fetchlistUser = async () => {
    try {
      const list = user?.friends.join(",");
      console.log(list);
      const res = await usergetlistUserInfo(user?.token, list);
      console.log(res);
      setListUser(res && res);
    } catch (error) {
      console.log(error);
    }
  };

  const handleInputChange = async (e) => {
    const value = e.target.value;
    const wordCount = value.split(/\s+/).filter(Boolean).length;
    if (wordCount <= wordLimit && wordCount >= 0) {
      console.log(wordCount);

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
            console.log(res);
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
    console.log(data);
    const key = data?.search;
    console.log(key);

    if (key != "" && !key.startsWith("@searchuser")) {
      try {
        // await postsearchfetchPosts(user.token, dispatch, "", key ? key : "");
        navigate(`/search/${key ? key : ""}`);
      } catch (error) {
        console.log(error);
      }
    } else if (key != "" && key.startsWith("@searchuser")) {
      try {
        // await postsearchfetchPosts(user.token, dispatch, "", key ? key : "");
        navigate(
          `/searchuser/${key ? key.replace(/^@searchuser\s*/, "") : ""}`
        );
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
      console.log(res);
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

      console.log(res);
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

    console.log("submits");
  };

  console.log(user?.statusActive);

  useEffect(() => {
    fetchNotification();
    fetchlistUser();
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
                {listUser &&
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
            {theme == "dark" ? <GoSun size={25} /> : <MdDarkMode size={25} />}
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
            className=" px-3 py-3 text-ascent-1 rounded-full hidden lg:flex bg-ascent-3/30 cursor-pointer hover:bg-ascent-3/70"
            onClick={() => {
              dispatch(Setnotification(!notification));
              fetchNotification();
            }}
          >
            <IoNotifications size={25} />
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
          <div className=" right-20 z-50 absolute w-fit overflow-auto border rounded-xl text-ascent-1 h-fit border-[#66666690] justify-center flex flex-col">
            <Link to={"/profile/" + user?._id} className="flex gap-2">
              <div className="w-full px-10 text-center py-3 font-medium cursor-pointer bg-primary hover:bg-bgColor  flex flex-col justify-evenly">
                <div className="flex justify-center items-center">
                  <img
                    src={user?.profileUrl ?? NoProfile}
                    className="w-10 h-10 object-cover rounded-full px-1 py-1 z-10"
                    onClick={() => {
                      setAvatar();
                    }}
                  />
                  {t("Profile")}
                </div>
              </div>
            </Link>
            {/* <div
              className="w-full text-center py-3 font-medium cursor-pointer bg-primary hover:bg-bgColor  flex justify-evenly"
              onClick={() => {
                onSubmit();
              }}
            >
              <div className="flex justify-center items-center">
                Active: {user?.statusActive ? "ON" : "OFF"}
              </div>
            </div> */}
            <div
              className="w-full text-center py-3 font-medium cursor-pointer bg-primary hover:bg-bgColor  flex justify-evenly"
              onClick={() => dispatch(UpdateProfile(true))}
            >
              <div className="flex justify-center items-center">
                <IoMdSettings size={25} />
                {t("Setting")}
              </div>
            </div>
            <div
              className="w-full text-center py-3 font-medium cursor-pointer bg-primary hover:bg-bgColor flex justify-evenly"
              onClick={() => handleLogout()}
            >
              <div className="flex justify-center items-center ">
                <IoLogOut size={25} />
                (t{"Logout"})
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TopBar;
