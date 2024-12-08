import React, { useCallback, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux/es/hooks/useSelector";
import Cookies from "js-cookie";
import { FaUserFriends } from "react-icons/fa";
import { IoBookmark } from "react-icons/io5";
import { MdGroups } from "react-icons/md";
import { FaVideo } from "react-icons/fa";
import { RiMemoriesFill } from "react-icons/ri";
import { FaFacebookMessenger } from "react-icons/fa";
import { MdEvent } from "react-icons/md";
import {
  CustomButton,
  EditProfile,
  EditFix,
  FriendsCard,
  Loading,
  PostCard,
  TopBar,
  Post,
  Lastactive,
} from "../components";

// import { requests, suggest } from "../assets/data";
import { Link, redirect, useNavigate } from "react-router-dom";
import { NoProfile } from "../assets";
import { BsPersonFillAdd, BsFiletypeGif } from "react-icons/bs";
import { useForm } from "react-hook-form";
import { BiImages, BiSolidVideo } from "react-icons/bi";
import {
  apiRequest,
  checktoken,
  deletePost,
  fetchNotifications,
  fetchPosts,
  getUserInfo,
  handFileUpload,
  likePost,
  sendFriendRequest,
  uploadVideo,
} from "../until";
import { dispatch } from "../redux/store";
import { Logout, UpdatePost } from "../redux/userSlice";
import { useDispatch } from "react-redux";
import { UserLogin } from "../redux/userSlice";
import { friends } from "../assets/data";
import {
  searchUserName,
  useracceptFriendRequest,
  userapiRequest,
  userfriendSuggest,
  usergetUserInfo,
  usersendFriendRequest,
} from "../until/user";
import {
  postdeletePost,
  postfetchPosts,
  postlikePost,
  postrenewfetchPosts,
} from "../until/post";
import { debounce } from "lodash";
import { CheckedPosts, SetPosts, UpdatePosts } from "../redux/postSlice";
import { io } from "socket.io-client";
import { useSocket } from "../context/SocketContext";
import { useTranslation } from "react-i18next";
const NewFeed = () => {
  const { posts } = useSelector((state) => state.posts);

  // const [postlist, setPostlist] = useState();

  const { user, edit, notification, post } = useSelector((state) => state.user);
  const [friendRequest, setfriendRequest] = useState([]);

  const [suggestedFriends, setsuggestedFriends] = useState();
  const [errMsg, seterrMsg] = useState("");
  const [page, setPage] = useState(1);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(false);
  const [search, setSearch] = useState("");
  const [posting, setPosting] = useState(false);
  const [picreview, setPicreview] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [trigger, setTrigger] = useState(false);
  const socket = useSocket();
  const timeoutIds = {};
  // console.log(user);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const handlePostSubmit = async (data) => {
    setPosting(true);
    setPreview(false);
    seterrMsg("");

    try {
      // if (file.type === "video/mp4") {
      //   console.log(file);
      //   const uri = file && (await uploadVideo(file));
      // } else {
      //   console.log(file);
      //   const uri = file && (await handFileUpload(file));
      // }
      const uri = file && (await handFileUpload(file));

      const newData = uri ? { ...data, image: uri } : data;
      const res = await apiRequest({
        url: "/posts/create-post",
        data: newData,
        token: user?.token,
        method: "POST",
      });
      if (res?.status === "failed") {
        seterrMsg(res);
      } else {
        reset({
          description: "",
        });
        setFile(null);
        seterrMsg("");
        await fetchPost();
      }
      setPosting(false);
      setFile(null);
      setPreview(false);
    } catch (error) {
      console.log(error);
      setPosting(false);
    }
  };

  // const handlePreview = async (file) => {
  //   if (file) {
  //     console.log(file);
  //     await setFile(file);
  //     setPreview(true);
  //   }
  // };

  //console.log(user);

  const fetchPost = async () => {
    try {
      setIsFetching(true);
      await postfetchPosts(user?.token, dispatch, page);
      setLoading(false);
      setIsFetching(false);
    } catch (error) {
      console.log(error);
    }
  };
  // const fetchPostpage = async () => {
  //   try {
  //     await postfetchPosts(user?.token, dispatch);
  //     setLoading(false);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  const handleLikePost = async (uri) => {
    await postlikePost({ uri: uri, token: user?.token });
    // await fetchPost();
  };
  const handleDeletePost = async (id) => {
    await postdeletePost(id, user?.token);
    setLoading(true);
    setPage(1);
    setTrigger(!trigger);
    // await fetchPost();
  };

  const test = async () => {
    //console.log(user);
    const res = await checktoken({
      token: user?.token,
    });
    if (res?.status === "failed") {
      const message = res?.message?.message;
      console.log(res?.message);
      Cookies.set("message", message, { expires: 7 });
      dispatch(Logout());
      navigate("/login");
      // navigate("/error");
    }
    //console.log(res);
  };
  const fetchFriendRequest = async () => {
    try {
      const res = await userapiRequest({
        url: "/friend-requests",
        user: user,
        token: user?.token,
        method: "GET",
      });
      console.log(res);
      if (res?.status === "failed") {
        Cookies.set("message", res?.message, { expires: 7 });
        navigate("/error");
      }
      setfriendRequest(res);
    } catch (error) {
      console.log(error);
    }
  };
  // const fetchSuggestFriends = async () => {
  //   try {
  //     const res = await apiRequest({
  //       url: "/users/suggested-friends",
  //       token: user?.token,
  //       method: "POST",
  //     });
  //     if (res?.status === "failed") {
  //       Cookies.set("message", res?.message, { expires: 7 });
  //       navigate("/error");
  //     }
  //     //console.log(res);
  //     setsuggestedFriends(res);
  //   } catch (error) {
  //     //console.log(error);
  //   }
  // };

  const fetchSuggestFriends = async () => {
    try {
      const res = await userfriendSuggest(user?.token, user);
      if (res?.status === "failed") {
        Cookies.set("message", res?.message, { expires: 7 });
        navigate("/error");
      }
      console.log(res);
      setsuggestedFriends(res?.suggestedFriends);
    } catch (error) {
      //console.log(error);
    }
  };

  const handleFriendRequest = async (id) => {
    try {
      const res = await usersendFriendRequest(user.token, id);
      await fetchSuggestFriends();
      if (res?.status === "failed") {
        Cookies.set("message", res?.message, { expires: 7 });
        navigate("/error");
      }
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };

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
  const getUser = async () => {
    //console.log(user?.token);
    try {
      const res = await usergetUserInfo(user?.token, user?._id);
      const newData = { token: user?.token, ...res };

      dispatch(UserLogin(newData));
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (search === "") {
      fetchSuggestFriends();
    } else {
      try {
        console.log(`/users/search/${search}`);
        const res = await searchUserName(user?.token, search);
        console.log(res);
        setsuggestedFriends(res);
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    const sendInteraction = async (_id, postId, friendId, category) => {
      const data = {
        user_id: _id,
        friendId: friendId,
        post_id: postId,
        post_category: category ?? "music",
      };

      console.log("Emitting user_interaction:", data);
      await socket.emit("interactPost", data);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const postId = entry.target.dataset.postId;
          const friendId = entry.target.dataset.userId;
          const category = entry.target.dataset.postCategory;

          if (entry.isIntersecting) {
            if (timeoutIds[postId]) {
              clearTimeout(timeoutIds[postId]);
            }

            timeoutIds[postId] = setTimeout(() => {
              console.log(postId);
              sendInteraction(user?._id, postId, friendId, category);
              dispatch(CheckedPosts([postId]));
            }, 3000);
          } else {
            if (timeoutIds[postId]) {
              clearTimeout(timeoutIds[postId]);
              delete timeoutIds[postId];
            }
          }
        });
      },
      { threshold: 0.8 }
    );

    const divElements = document.querySelectorAll(".itempost");
    divElements.forEach((div) => observer.observe(div));

    return () => {
      observer.disconnect();
      Object.values(timeoutIds).forEach(clearTimeout);
    };
  }, [posts, loading]);

  useEffect(() => {
    if (page) {
      if (page == 1) {
        console.log("hey");
        dispatch(UpdatePosts([]));
        fetchPost();
      } else fetchPost();
    } else fetchPost();
    // fetchPost();
  }, [page, trigger]);

  const handleScroll = useCallback(
    debounce((e) => {
      const target = e.target;

      if (
        target.scrollTop + target.clientHeight >= target.scrollHeight * 0.7 &&
        !isFetching
      ) {
        setPage((prevPage) => prevPage + 1);
        console.log(page);
        console.log(posts);
      }
    }, 500),
    [isFetching]
  );

  const handlePage = async () => {
    console.log();
    setLoading(true);
    setPage(1);
    setTrigger(!trigger);
  };

  useEffect(() => {
    const postRange = document.getElementById("post_range");
    postRange.addEventListener("scroll", handleScroll);

    return () => {
      postRange.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  useEffect(() => {
    dispatch(UpdatePosts([]));
    setLoading(true);
    // test();
    // getUser();
    // fetchPost();
    fetchFriendRequest();

    // fetchNotification();
    fetchSuggestFriends();
  }, []);

  return (
    <div>
      <div
        className="home w-full px-0 lg:px-10 pb-20 2xl-40 bg-bgColor 
    lg:rounded-lg h-screen overflow-hidden"
      >
        <TopBar user={user} />

        <div className="w-full flex gap-2 lg:gap-4 pt-5 pb-10 h-full justify-between">
          {/* {LEFT} */}

          {/* {CENTTER} bg-primary */}
          <div className="w-full h-full flex justify-center items-center">
            <div
              id="post_range"
              className="no-scrollbar h-full flex-initial w-2/5  px-4 flex flex-col gap-6 overflow-y-auto rounded-lg "
            >
              {loading ? (
                <div className="w-full h-full flex items-center justify-center">
                  <Loading />
                </div>
              ) : posts?.length > 0 ? (
                posts?.map((post, index) => (
                  <div
                    className="itempost"
                    key={post._id}
                    data-post-id={post._id}
                    data-post-category={post.categories}
                    data-user-id={post.userId}
                    post={post}
                  >
                    <PostCard
                      key={index}
                      posts={post}
                      user={user}
                      deletePost={handleDeletePost}
                      likePost={handleLikePost}
                      isCheck={post?.isCheck}
                    />
                  </div>
                ))
              ) : (
                <div className="flex w-full h-full items-center justify-center">
                  <p className="text-lg text-ascent-2">
                    {t("No Post Available")}
                  </p>
                </div>
              )}
              {posts?.length > 0 && !loading && <Loading />}
            </div>
          </div>
        </div>
      </div>

      {edit && <EditFix />}
      {post && <Post setPage={handlePage} />}

      {/* {picreview && <ImageCheck />} */}
    </div>
  );
};

export default NewFeed;
