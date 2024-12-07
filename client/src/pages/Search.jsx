import React, { useEffect, useState } from "react";
import { FriendCard, FriendMain, TopBar } from "../components";
import { Link, redirect, useNavigate, useParams } from "react-router-dom";
import { NoProfile } from "../assets";
import { useSelector } from "react-redux";

import { Loading, PostCard } from "../components/index";
import { useDispatch } from "react-redux";
import {
  postdeletePost,
  postfetchPosts,
  postlikePost,
  postsearchfetchPosts,
} from "../until/post";
import { io } from "socket.io-client";
const Search = () => {
  const { keyword } = useParams();
  const [key, setKey] = useState(`${keyword}`);
  console.log("main key:" + key);

  const { user } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const { posts } = useSelector((state) => state.posts);
  const [searchPost, setSearchPost] = useState(true);
  const handleSearch = async (keyword) => {
    try {
      const data = keyword;
      console.log(data);

      if (data) {
        await postsearchfetchPosts(user.token, dispatch, "", data ? data : "");
      }

      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };
  const fetchPost = async () => {
    try {
      await postfetchPosts(user?.token, dispatch);
      setLoading(false);
      console.log(posts);
    } catch (error) {
      console.log(error);
    }
  };

  const handleLikePost = async (uri) => {
    await postlikePost({ uri: uri, token: user?.token });
  };
  useEffect(() => {
    setLoading(true);

    handleSearch(keyword);
    // fetchPost();
    let timeoutId;
    timeoutId = setTimeout(() => {
      keyword && handleSearch(keyword);
    }, 3000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [keyword]);

  useEffect(() => {
    const newSocket = io("ws://localhost:3005", {
      reconnection: true,
      transports: ["websocket"],
    });

    let userId = user?._id;
    newSocket.emit("userOnline", { userId });

    return () => {
      let userId = user?._id;
      newSocket.emit("userOffline", { userId });
      newSocket.disconnect();
    };
  }, []);

  return (
    <div>
      <div
        className="home w-full px-0 lg:px-10 pb-20 2xl-40 bg-bgColor 
lg:rounded-lg h-screen overflow-hidden"
      >
        <TopBar user={user} setKey={setKey} />
        <div className="w-full flex gap-2 lg:gap-4 pt-5 pb-10 h-full justify-between">
          <div className=" justify-center h-full flex-initial w-full flex-wrap px-4 py-4 flex gap-6 overflow-y-auto rounded-lg">
            <div>
              <div className="w-full h-fit flex flex-wrap gap-2 select-none">
                <div className="flex justify-center items-center flex-col">
                  <div className="w-full h-fit flex gap-2 flex-wrap justify-center">
                    <div className=" max-w-2xl h-fit flex flex-col">
                      {loading && searchPost ? (
                        <Loading />
                      ) : posts?.length > 0 ? (
                        posts?.map((post) => (
                          <PostCard
                            key={post._id}
                            posts={post}
                            user={user}
                            likePost={handleLikePost}
                          />
                        ))
                      ) : (
                        <div className="flex w-full h-full items-center justify-center">
                          <p className="text-lg text-ascent-2">
                            No Post Available
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Search;
