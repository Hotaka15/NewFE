import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { EditProfile, Hobby, Loading, PostCard, TopBar } from "../components";
import { NoProfile } from "../assets";
import { Link, useNavigate, useParams } from "react-router-dom";

import { CiLocationOn } from "react-icons/ci";
import { BsBriefcase, BsFacebook, BsInstagram } from "react-icons/bs";
import { FaTwitterSquare } from "react-icons/fa";
import { FaFacebookMessenger } from "react-icons/fa";
import moment from "moment";
import Cookies from "js-cookie";
import { UpdateProfile } from "../redux/userSlice";
import {
  userapiRequest,
  usergetUserInfo,
  usersendFriendRequest,
} from "../until/user";
import {
  postdeletePost,
  postfetchPosts,
  postfetchuserPosts,
  postlikePost,
} from "../until/post";
import { io } from "socket.io-client";
import { handFileUpload } from "../until";
import { useTranslation } from "react-i18next";

const ProfileFix = () => {
  const { id } = useParams();
  const { user, edit } = useSelector((state) => state.user);
  const { posts } = useSelector((state) => state.posts);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const uri = "" + id;
  const [userInfor, setUserInfor] = useState(user);
  const [banner, setBanner] = useState(user?.profileUrl ?? NoProfile);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const handleLikePost = async (uri) => {
    await postlikePost({ uri: uri, token: user?.token });
    await getPosts(userInfor);
  };
  const handleDelete = async (id) => {
    await postdeletePost(id, user?.token);
    await getPosts(userInfor);
  };

  const getPosts = async (res) => {
    console.log(res);
    const data = { user: { userId: res?._id } };
    await postfetchuserPosts(user.token, res, dispatch, uri, data);
    setLoading(false);
  };
  const getUser = async () => {
    const res = await usergetUserInfo(user?.token, id);
    console.log(res);
    getPosts(res);

    setBanner(res?.profileUrl ?? NoProfile);
    setUserInfor(res);
  };

  const handleFriendRequest = async (id) => {
    try {
      const res = await usersendFriendRequest(user.token, id);
      // await fetchSuggestFriends();
      if (res?.status === "failed") {
        Cookies.set("message", res?.message, { expires: 7 });
        navigate("/error");
      }
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };

  const handleedit = () => {
    dispatch(UpdateProfile(true));
  };
  console.log(userInfor);
  const handlebg = (e) => {
    console.log(e.target.files[0]);
    const reader = new FileReader();
    reader.onload = () => {
      setBanner(reader.result);
    };
    reader.readAsDataURL(e.target.files[0]);
  };
  const onSubmit = async (e) => {
    try {
      const file = e.target.files[0];
      const uri = file && (await handFileUpload(file));
      const res = await userapiRequest({
        url: "",
        data: {
          cover_photo: uri,
        },
        method: "PUT",
        token: user?.token,
      });

      console.log(res);
      if (res?.status === "failed") {
      } else {
        const newUser = { token: user?.token, ...res };

        // dispatch(UserLogin(newUser));

        setTimeout(() => {
          dispatch(UpdateProfile(false));
        }, 3000);
      }
    } catch (error) {
      console.log(error);
    }

    console.log("submits");
  };
  useEffect(() => {
    setLoading(true);
    getUser();
  }, [id]);

  console.log(user?.friends.includes(id));

  return (
    <div className="home w-full bg-bgColor text-ascent-1 overflow-hidden lg:rounded-lg h-screen items-center px-0 lg:px-10">
      <TopBar user={user} />
      <div className="w-full h-full flex justify-center overflow-auto">
        {loading ? (
          <Loading />
        ) : (
          <div className="flex flex-col  h-screen w-8/12 items-center ">
            <div className="flex w-full h-1/4 bg-secondary relative select-none items-center justify-center">
              <img
                src={banner}
                alt="Banner Image"
                className="object-cover h-full w-full
              overflow-hidden rounded-xl z-0"
              />
              {/* {id == user?._id && (
                <label className="absolute right-4 bottom-2 z-30 bg-primary/50 px-6 py-2 rounded-xl border border-[#66666690] cursor-pointer">
                  Edit
                  <input
                    type="file"
                    className="hidden"
                    accept=".jpg, .png, .jpeg"
                    onInput={(e) => {
                      e.target.files[0] && handlebg(e);
                      onSubmit(e);
                    }}
                  />
                </label>
              )} */}
            </div>

            <div
              className="select-none relative text-ascent-1 w-full rounded-xl mb-5 text-center 
            bg-primary border-b-2 border-[#66666645] flex flex-col items-center"
            >
              <div className="flex flex-col items-center relative bottom-14">
                <label htmlFor="imgUpload" className="cursor-pointer">
                  <img
                    src={userInfor?.profileUrl ?? NoProfile}
                    alt={userInfor?.email}
                    className="object-cover h-44 w-44 
                rounded-full  overflow-hidden border-8 border-bgColor text-ascent-2"
                  />
                  {/* <input
                    type="file"
                    className="hidden"
                    id="imgUpload"
                    // onChange={(e) => handleSelect(e)}
                    accept=".jpg, .png, .jpeg"
                  /> */}
                </label>
                <div className="select-none font-bold text-4xl bottom-4">
                  {userInfor?.firstName} {userInfor?.lastName}
                </div>
              </div>
              <div className=" items-center h-14 shrink-0 w-full flex justify-start px-5 gap-2 border-t border-[#66666645]">
                <div className=" px-4 border-b border-blue h-full flex justify-center items-center rounded-lg text-blue font-medium">
                  {t("Post")}
                </div>
                <div className="text-ascent-1 px-4  h-full flex justify-center items-center rounded-lg">
                  {t("Friends")}
                </div>
              </div>

              {id == user?._id ? (
                <div
                  onClick={() => handleedit()}
                  className="absolute right-4 bottom-2 z-30 bg-primary px-3 py-2 rounded-xl border border-[#66666690] cursor-pointer"
                >
                  {t("Edit Profile")}
                </div>
              ) : (
                <div className="absolute right-4 bottom-2 flex gap-4">
                  {!user?.friends.includes(id) && (
                    <div
                      onClick={() => {
                        handleFriendRequest(id);
                      }}
                      className="text-white z-30 bg-blue px-3 py-2 rounded-xl border border-[#66666690] cursor-pointer"
                    >
                      {t("Add Friend")}
                    </div>
                  )}
                  <Link to={`/chat/${id}`}>
                    <div
                      onClick={() => {
                        handleFriendRequest(id);
                      }}
                      className="text-white z-30 flex gap-2 bg-ascent-3/30 px-3 py-2 rounded-xl border border-[#66666690] cursor-pointer"
                    >
                      <FaFacebookMessenger size={25} /> Chat
                    </div>
                  </Link>
                  {/* <div
                    onClick={() => {}}
                    className="z-30 bg-primary px-3 py-2 rounded-xl border border-[#66666690] cursor-pointer hover:bg-ascent-3/10 "
                  >
                    Follow
                  </div> */}
                </div>
              )}
            </div>
            {/* <div className="flex overflow-auto"> */}
            <div className="w-full flex gap-6 ">
              <div className="w-2/3 h-full pb-32">
                <div className="w-full h-full bg-primary px-4 flex flex-col gap-6 overflow-y-auto rounded-xl  items-center">
                  {/* <div className="w-full mx-10">
                  <Loading />
                </div> */}

                  {loading ? (
                    <div className="w-full justify-center h-full flex">
                      <Loading />
                    </div>
                  ) : posts?.length > 0 ? (
                    posts?.map((post) => (
                      <div className="w-full" key={post._id}>
                        <PostCard
                          // key={post._id}
                          posts={post}
                          user={user}
                          deletePost={handleDelete}
                          likePost={handleLikePost}
                        />
                      </div>
                    ))
                  ) : (
                    <div className="flex w-full h-full items-center justify-center">
                      <p className="text-lg text-ascent-2 ">
                        {t("No Post Available")}
                      </p>
                    </div>
                  )}
                </div>
              </div>
              <div className="text-ascent-1 rounded-xl bg-primary h-fit w-1/3 px-7">
                <div className="w-full h-fit ">
                  <div className="w-full flex flex-col gap-2 py-4 border-b border-[#66666645]">
                    <div className="flex gap-2 items-center text-ascent-2">
                      <CiLocationOn className="text-xl text-ascent-1" />
                      <span>{userInfor?.location ?? ""}</span>
                    </div>

                    <div className="flex gap-2 items-center text-ascent-2">
                      <BsBriefcase className="text-lg text-ascent-1" />
                      <span>{userInfor?.profession ?? ""}</span>
                    </div>
                    <div className="w-full flex flex-col gap-2 py-4 border-b border-[#66666645]">
                      <p className="text-xl text-ascent-1 font-semibold">
                        {userInfor?.friends?.length} {t("Friends")}
                      </p>
                      <div className="flex items-center justify-between w-full">
                        <span className="text-ascent-2">
                          {t("Who viewed your profile")}
                        </span>
                        <span className="text-ascent-1 text-lg">
                          {userInfor?.views?.length}
                        </span>
                      </div>

                      <span className="text-base text-blue">
                        {userInfor?.verified ? t("Verified Account") : " "}
                      </span>

                      <div className="flex items-center justify-between">
                        <span className="text-ascent-2">{t("Joined")}</span>
                        <span className="text-ascent-1 text-base">
                          {moment(userInfor?.createdAt).fromNow()}
                        </span>
                      </div>

                      <div className="w-full flex flex-col gap-4 py-4 pb-6">
                        <p className="text-ascent-1 text-lg font-semibold">
                          Social Profile
                        </p>
                        <div className="flex gap-2 items-center text-ascent-2">
                          <BsInstagram className="text-xl text-ascent-1" />
                          <span>Instagram</span>
                        </div>
                        <div className="flex gap-2 items-center text-ascent-2">
                          <FaTwitterSquare className="text-xl text-ascent-1" />
                          <span>Twitter</span>
                        </div>
                        <div className="flex gap-2 items-center text-ascent-2">
                          <BsFacebook className="text-xl text-ascent-1" />
                          <span>Facebook</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {edit && <EditProfile />}
      </div>
    </div>
  );
};

export default ProfileFix;
