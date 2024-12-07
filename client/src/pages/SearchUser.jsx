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
import { botsuggestsearchRequest } from "../until/bot";
import { usersendFriendRequest } from "../until/user";

const UserCard = ({ token, user }) => {
  const [idAdd, setIsAdd] = useState(false);

  const handleFriendRequest = async (id) => {
    try {
      console.log(token);

      const res = await usersendFriendRequest(token, id);
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="rounded-xl shadow-lg bg-ascent-3/10  h-full px-5 border border-[#66666645]">
      <div
        className="my-4 flex gap-5 w-full h-full  cursor-pointer"
        onClick={() => {}}
      >
        <Link to={"/profile/" + user?._id} className="">
          <img
            className="h-20 w-20 object-cover rounded-full"
            src={user?.profileUrl ?? NoProfile}
            alt="Avatar"
          />
        </Link>

        <div className="w-3/4">
          <Link to={"/profile/" + user?._id} className="">
            {" "}
            <div className="flex w-full gap-4">
              <div className="flex flex-col text-right">
                <span className="text-ascent-2">Name: </span>
              </div>
              <div className="w-full text-ascent-1 text-base flex flex-col items-start">
                <span className="max-h-6 overflow-hidden">
                  {user?.firstName ? user?.firstName : "?"}{" "}
                  {user?.lastName ? user?.lastName : "?"}
                </span>
              </div>
            </div>
          </Link>

          {!idAdd ? (
            <div
              onClick={() => {
                setIsAdd(true);
                handleFriendRequest(user?._id);
              }}
              className="mt-5 text-white bg-blue w-full py-2 rounded-lg flex items-center justify-center"
            >
              Add
            </div>
          ) : (
            <div className="mt-5 text-ascent-2  bg-ascent-3/30 w-full py-2 rounded-lg flex items-center justify-center">
              Added
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const SearchUser = () => {
  const { keyword } = useParams();
  const [key, setKey] = useState(`${keyword}`);
  console.log("main key:" + key);

  const { user } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const [listUser, setListUser] = useState([]);
  const handleSearch = async (keyword) => {
    try {
      const prompt = keyword;
      console.log(prompt);

      const res = await botsuggestsearchRequest(prompt);
      console.log(res);
      setListUser(res);
      setLoading(false);
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
                    <div className="w-full h-fit flex flex-col items-center justify-center shrink-0">
                      {loading ? (
                        <div className="w-full h-full">
                          <Loading />
                        </div>
                      ) : (
                        <div className="w-full grid grid-cols-2 gap-4 ">
                          {listUser &&
                            listUser.map((users) => {
                              return (
                                <UserCard token={user?.token} user={users} />
                              );
                            })}
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

export default SearchUser;
