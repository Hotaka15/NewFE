import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  CustomButton,
  EditProfile,
  Loading,
  PostCard,
  TopBar,
} from "../components";
import { CoverPhot, NoProfile } from "../assets";
import { useNavigate, useParams } from "react-router-dom";
import { deletePost, likePost, apiRequest } from "../until";
import { Link } from "react-router-dom";
import { CiLocationOn } from "react-icons/ci";
import { BsBriefcase, BsFacebook, BsInstagram } from "react-icons/bs";
import { FaTwitterSquare } from "react-icons/fa";
import moment from "moment";
import Cookies from "js-cookie";
import { UpdateProfile } from "../redux/userSlice";
import {
  useracceptFriendRequest,
  userapiRequest,
  usergetUserInfo,
} from "../until/user";
import { postfetchuserPosts, postlikePost } from "../until/post";
import { io } from "socket.io-client";
import { useTranslation } from "react-i18next";
const FriendDetailRequest = ({ title }) => {
  const { id, key } = useParams();
  const [friend, setFriend] = useState();
  const { t } = useTranslation();
  const { user, edit } = useSelector((state) => state.user);
  const [uid, setUid] = useState(user?._id);
  const { posts } = useSelector((state) => state.posts);
  const dispatch = useDispatch();
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [friendRequest, setfriendRequest] = useState();
  const [suggestedFriends, setsuggestedFriends] = useState();
  const [userInfor, setUserInfor] = useState();
  const [banner, setBanner] = useState(user?.profileUrl ?? NoProfile);
  const navigate = useNavigate();
  const handleDelete = async (id) => {
    await deletePost(id, user.token);
    await getPosts(uid);
  };

  // const acceptFriendRequest = async (id, status) => {
  //   console.log(id);
  //   try {
  //     const res = await apiRequest({
  //       url: "/users/accept-request",
  //       token: user?.token,
  //       method: "POST",
  //       data: { rid: id, status },
  //     });
  //     console.log(res);

  //     setfriendRequest(res?.data);
  //     if (res?.status === "failed") {
  //       Cookies.set("message", res?.message, { expires: 7 });
  //       navigate("/error");
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  const acceptFriendRequest = async (id, status) => {
    try {
      const res = await useracceptFriendRequest(user?.token, id, user, status);
      fetchFriendRequest();
      if (res?.status === "failed") {
        Cookies.set("message", res?.message, { expires: 7 });
        navigate("/error");
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleSearch = async (e) => {
    e.preventDefault();
    if (search === "") {
      //   fetchSuggestFriends();
    } else {
      try {
        const res = await apiRequest({
          url: `/users/search/${search}`,
          token: user?.token,
          data: {},
          method: "POST",
        });

        // setsuggestedFriends(res);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleLikePost = async (uri) => {
    await postlikePost({ uri: uri, token: user?.token });
    // await getPosts(uid);
  };
  // const getPosts = async (id) => {
  //   let uri = "/posts/get-user-post/" + id;
  //   await fetchPosts(user.token, dispatch, uri);
  //   setLoading(false);
  // };
  const getPosts = async (uri, res) => {
    await postfetchuserPosts(user.token, res, dispatch, uri);
    setLoading(false);
  };
  // const getUser = async (id) => {
  //   console.log(id);

  //   const res = await getUserInfo(user?.token, id);
  //   setBanner(res?.profileUrl);
  //   setUserInfor(res);
  // };

  const getUser = async (userid) => {
    try {
      const res = await usergetUserInfo(user?.token, userid);
      getPosts(userid, res);
      const newData = { token: user?.token, ...res };
      // setBanner(res?.profileUrl);
      if (res?.cover_photo) {
        setBanner(res.cover_photo);
      } else if (res?.profileUrl) {
        setBanner(res.profileUrl);
      } else {
        setBanner(CoverPhot);
      }
      setUserInfor(res);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchSuggestFriends = async () => {
    try {
      const res = await apiRequest({
        url: "/users/suggested-friends",
        token: user?.token,
        method: "POST",
      });
      if (res?.status === "failed") {
        Cookies.set("message", res?.message, { expires: 7 });
        navigate("/error");
      }

      setsuggestedFriends(res);
    } catch (error) {
      //console.log(error);
    }
  };

  // const fetchFriendRequest = async () => {
  //   try {
  //     const res = await apiRequest({
  //       url: "/users/get-friend-request",
  //       token: user?.token,
  //       method: "POST",
  //     });
  //     console.log(res);
  //     if (res?.status === "failed") {
  //       Cookies.set("message", res?.message, { expires: 7 });
  //       navigate("/error");
  //     }
  //     setfriendRequest(res?.data);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };
  const fetchFriendRequest = async () => {
    try {
      const res = await userapiRequest({
        url: "/friend-requests",
        user: user,
        token: user?.token,
        method: "GET",
      });

      if (res?.status === "failed") {
        Cookies.set("message", res?.message, { expires: 7 });
        navigate("/error");
      }
      setfriendRequest(res);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setLoading(true);
    getUser(user?._id);
    fetchFriendRequest();
    // fetchSuggestFriends();
    // getPosts(user?._id);
  }, [id]);

  return (
    <div className="home w-full bg-bgColor text-ascent-1 overflow-hidden lg:rounded-lg h-screen items-center px-0 lg:px-10 select-none">
      <TopBar user={user} />
      <div className="w-full h-full flex justify-center pt-5 pb-32">
        <div className="bg-primary h-full w-1/5 rounded-lg">
          <div className="w-full h-full flex flex-col gap-4 pt-4 px-4 select-none overflow-auto">
            <span className="text-xl font-semibold">{t("Friend Request")}</span>
            <form
              className="hidden md:flex items-center justify-center gap-5"
              onSubmit={(e) => handleSearch(e)}
            >
              {/* <TextInput
                      styles="w-full rounded-l-full py-5"
                      placeholder="What's on your mind...."
                      register={register("search")}
                    /> */}

              {/* <CustomButton
                      tittle="search"
                      type="submit"
                      containerStyles="bg-[#0444a4] text-white px-5 py-1 mt-2 rounded-full"
                    /> */}

              {/* <button
                onClick={() => {}}
                type={"submit"}
                className={`inline-flex items-center text-base bg-[#0444a4] text-white px-5 py-1 mt-2 rounded-full`}
              >
                search
              </button> */}
            </form>
            {friendRequest ? (
              friendRequest.map((friend) => {
                return (
                  <div
                    className="w-full flex gap-4 items-center cursor-pointer"
                    onClick={() => {
                      setLoading(true);
                      getUser(friend?.sender?._id);
                      setUid(friend?.sender?._id);
                      // getPosts(friend?.sender?._id);
                    }}
                  >
                    <img
                      src={friend?.sender?.profileUrl ?? NoProfile}
                      alt={friend?.sender?.firstName}
                      className="w-16 h-16 object-cover rounded-full"
                    />
                    <div className="flex-1">
                      <p className="text-base  font-medium text-ascent-1">
                        {friend?.sender?.firstName} {friend?.sender?.lastName}
                      </p>
                      <span className="text-sm text-ascent-2">
                        {friend?.sender?.profession ?? t("No Profession")}
                      </span>
                    </div>
                    <div className="flex gap-1 sm:flex-col">
                      <CustomButton
                        onClick={() => {
                          acceptFriendRequest(friend?._id, "accepted");
                        }}
                        containerStyles="bg-blue px-3 rounded-xl py-1 text-white"
                        tittle={t("accept")}
                      />
                      <CustomButton
                        onClick={() => {
                          acceptFriendRequest(friend?._id, "rejected");
                        }}
                        containerStyles="bg-ascent-3/20 px-3 rounded-xl py-1 text-ascent-1 flex items-center justify-center"
                        tittle={t("Delete")}
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              <div></div>
            )}
            {/* {(() => {
              const items = [];
              for (let i = 0; i < 20; i++) {
                items.push(
                  <div
                    className="w-full flex gap-4 items-center cursor-pointer"
                    onClick={() => {
                      getUser(friend?._id);
                      setUid(friend?._id);
                      getPosts(friend?._id);
                    }}
                  >
                    <img
                      src={user?.profileUrl ?? NoProfile}
                      alt={user?.firstName}
                      className="w-16 h-16 object-cover rounded-full"
                    />
                    <div className="flex-1">
                      <p className="text-base font-medium text-ascent-1">
                        {user?.firstName} {user?.lastName}
                      </p>
                      <span className="text-sm text-ascent-2">
                        {user?.profession ?? "No Profession"}
                      </span>
                    </div>
                    <CustomButton
                      onClick={() => {}}
                      containerStyles="bg-blue px-3 rounded-xl py-1 text-white"
                      tittle="Unfriend"
                    />
                  </div>
                );
              }
              return items;
            })()} */}
          </div>
        </div>
        <div className="h-full w-3/4 flex flex-col items-center overflow-auto rounded-xl">
          {/* <div className="flex flex-col h-screen w-8/12 items-center overflow-hidden bg-primary">
            <Loading />
          </div> */}
          {loading ? (
            <Loading />
          ) : (
            userInfor && (
              <div className="flex flex-col h-screen w-8/12 items-center overflow-y-auto rounded-xl">
                <div className="flex w-full h-1/4 bg-secondary relative select-none">
                  <img
                    src={banner ?? NoProfile}
                    alt="Banner Image"
                    className="object-cover h-full w-full
              overflow-hidden rounded-xl z-0"
                  />
                </div>

                <div className="select-none relative text-ascent-1 w-full rounded-xl mb-2 py-7 text-center bg-primary pb-8 border-b-2 border-[#66666645] flex flex-col items-center">
                  <div className="">
                    <img
                      src={userInfor?.profileUrl ?? NoProfile}
                      alt={userInfor?.email}
                      className="object-cover h-52 w-52 
                rounded-full relative bottom-12 overflow-hidden border-8 border-bgColor text-ascent-2"
                    />
                  </div>
                  <div className="select-none relative font-bold text-4xl bottom-4">
                    {userInfor?.firstName} {userInfor?.lastName}
                  </div>
                </div>
                <div className="w-full flex gap-2 ">
                  <div className="w-2/3 h-full">
                    <div className="w-full h-full bg-primary px-4 flex flex-col gap-6 overflow-y-auto rounded-xl  items-center">
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
                        {/* <div className="flex gap-2 items-center text-ascent-2">
                          <CiLocationOn className="text-xl text-ascent-1" />
                          <span>{userInfor?.location ?? ""}</span>
                        </div> */}

                        <div className="flex gap-2 items-center text-ascent-2">
                          <BsBriefcase className="text-lg text-ascent-1" />
                          <span>{userInfor?.profession ?? ""}</span>
                        </div>
                        <div className="w-full flex flex-col gap-2 py-4 border-b border-[#66666645]">
                          {/* <p className="text-xl text-ascent-1 font-semibold">
                            {userInfor?.friends?.length} {t("Friends")}
                          </p> */}
                          {/* <div className="flex items-center justify-between w-full">
                            <span className="text-ascent-2">
                              {t("Who viewed your profile")}
                            </span>
                            <span className="text-ascent-1 text-lg">
                              {userInfor?.views?.length}
                            </span>
                          </div> */}

                          <span className="text-base text-blue">
                            {userInfor?.statusActive
                              ? "Verified Account"
                              : "Block"}
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
            )
          )}
        </div>

        {/* <div className="h-full w-3/4 flex flex-col items-center overflow-auto rounded-xl">
          <div className="text-ascent-2 w-1/2 h-full bg-primary justify-center flex items-center rounded-xl">
            Choose one
          </div>
        </div> */}

        {edit && <EditProfile />}
      </div>
    </div>
  );
};

export default FriendDetailRequest;
