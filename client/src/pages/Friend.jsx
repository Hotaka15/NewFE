import React, { useEffect, useState, useTransition } from "react";
import { FriendCardSuggest, Loading, TopBar } from "../components";
import { Link, useNavigate } from "react-router-dom";
import { NoProfile } from "../assets";
import { useSelector } from "react-redux";
import Cookies from "js-cookie";
import { FaUserFriends } from "react-icons/fa";
import { GiHidden, GiThreeFriends } from "react-icons/gi";
import { FaAngleRight } from "react-icons/fa";
import { apiRequest, sendFriendRequest } from "../until";

import FriendCardRequest from "../components/FriendCardRequest";
import {
  useracceptFriendRequest,
  userapiRequest,
  userfriendSuggest,
  usersendFriendRequest,
} from "../until/user";
import { io } from "socket.io-client";
import { useTranslation } from "react-i18next";
const Friend = () => {
  const [right, setRight] = useState(false);
  const [left, setLeft] = useState(true);
  const { user } = useSelector((state) => state.user);
  const [checkr, setCheckr] = useState("");
  const [suggestedFriends, setsuggestedFriends] = useState([]);
  const [checkl, setCheckl] = useState("hidden");
  const [friendRequest, setfriendRequest] = useState([]);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const check = () => {
    let position = document.getElementById("request");
    let position2 = document.getElementById("fr");

    position.scrollLeft <= 25 ? setCheckl("hidden") : setCheckl("");
    // position.scrollLeft == position.scrollWidth - position.clientWidth
    position.scrollLeft >= position.scrollHeight
      ? setCheckr("hidden")
      : setCheckr("");
  };

  const scrollhidde = () => {
    let position = document.getElementById("request");
    let position2 = document.getElementById("fr");
    position.scrollWidth <= position2.clientWidth
      ? setCheckr("hidden")
      : setCheckr("");
  };
  const crollright = () => {
    let position = document.getElementById("request");
    position.scrollLeft += 200;

    position.scrollLeft == 0 ? setCheckl("hidden") : setCheckl("");
    position.scrollLeft >= position.scrollWidth - position.clientWidth - 200
      ? setCheckr("hidden")
      : setCheckr("");
  };
  const crollleft = () => {
    let position = document.getElementById("request");

    position.scrollLeft -= 200;
    position.scrollLeft < 100 ? setCheckl("hidden") : setCheckl("");
    position.scrollLeft <= position.scrollWidth - position.clientWidth - 200
      ? setCheckr("")
      : setCheckr("hidden");
  };

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

  const fetchSuggestFriends = async () => {
    try {
      const res = await userfriendSuggest(user?.token, user);
      if (res?.status === "failed") {
        Cookies.set("message", res?.message, { expires: 7 });
        navigate("/error");
      }

      setsuggestedFriends(res?.suggestedFriends);
    } catch (error) {}
  };

  const handleFriendRequest = async (id) => {
    try {
      const res = await usersendFriendRequest(user.token, id);
      await fetchSuggestFriends();
      if (res?.status === "failed") {
        Cookies.set("message", res?.message, { expires: 7 });
        navigate("/error");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const acceptFriendRequest = async (id, status) => {
    try {
      const res = useracceptFriendRequest(user?.token, id, user, status);
      fetchFriendRequest();
      if (res?.status === "failed") {
        Cookies.set("message", res?.message, { expires: 7 });
        navigate("/error");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    scrollhidde();
  }, [crollright]);
  useEffect(() => {
    // scrollhidde();
    fetchSuggestFriends();
    fetchFriendRequest();
  }, []);

  return (
    <div>
      <div
        className="home w-full px-0 lg:px-10 pb-20 2xl-40 bg-bgColor 
lg:rounded-lg h-screen overflow-hidden"
      >
        <TopBar user={user} />
        <div className="w-full flex gap-2 lg:gap-4 pt-5 pb-10 h-full justify-between">
          <div className="w-1/5 h-full md:flex flex-col gap-6 overflow-y-auto flex-initial bg-primary rounded-lg">
            <div className="bg-primary w-full h-fit rounded-lg flex flex-col gap-3 overflow-hidden">
              <Link
                to={"/friendrequest"}
                className="flex gap-2 hover:bg-ascent-3/30 w-full px-6 py-2"
              >
                <span className="text-base font-medium text-ascent-1 flex items-center gap-2">
                  <div className="w-10 h-10 flex items-center justify-center">
                    <FaUserFriends size={30} />
                  </div>
                  {t("Friend Request")}
                </span>
              </Link>

              <Link
                to={"/friendsuggest"}
                className="flex gap-2 hover:bg-ascent-3/30 w-full px-6 py-2"
              >
                <span className="text-base font-medium text-ascent-1 flex items-center gap-2">
                  <div className="w-10 h-10 flex items-center justify-center  ">
                    <FaUserFriends size={30} />
                  </div>
                  {t("Suggestions")}
                </span>
              </Link>
              <Link
                to={"/frienddetails"}
                className="flex gap-2 hover:bg-ascent-3/30 w-full px-6 py-2"
              >
                <span className="text-base font-medium text-ascent-1 flex items-center gap-2">
                  <div className="w-10 h-10 flex items-center justify-center  ">
                    <GiThreeFriends size={30} />
                  </div>
                  {t("All Friends")}
                </span>
              </Link>
            </div>
          </div>
          <div className=" justify-center h-full flex-initial w-4/5 flex-wrap px-4 py-4 flex gap-6 overflow-y-auto rounded-lg">
            <div>
              <div
                id="fr"
                className="flex flex-col gap-2 h-fit relative select-none"
              >
                <div className="w-full flex items-end justify-between">
                  <span className="text-ascent-1 font-bold text-3xl">
                    {t("Friend Requests")}
                  </span>
                  <Link to={"/friendrequest"}>
                    <span className=" hover:underline hover:underline-offset-2 text-blue font-medium text-xl">
                      {t("See more")}
                    </span>
                  </Link>
                </div>

                <div
                  onClick={() => {
                    crollright();
                    check();
                  }}
                  className={`${checkr} absolute text-white bg-[#000000]/50 rounded-full w-12 h-12 flex justify-center cursor-pointer items-center bottom-1/2 right-4`}
                >
                  <FaAngleRight size={30} />
                </div>
                <div
                  onClick={() => {
                    crollleft();
                    check();
                  }}
                  className={` ${checkl} absolute text-white rotate-180 bg-[#000000]/50 rounded-full w-12 h-12 flex justify-center cursor-pointer items-center bottom-1/2 left-4`}
                >
                  <FaAngleRight size={30} />
                </div>
                {friendRequest.length > 0 ? (
                  <div
                    id="request"
                    className=" flex w-full h-full justify-start grow-0 overflow-x-auto gap-2 scroll-smooth rounded-xl overflow-hidden"
                  >
                    {/* <div className="absolute w-full h-full bg-primary rounded-xl flex justify-center items-center text-lg text-ascent-2">
                      No Request
                    </div> */}

                    {friendRequest?.map((friend) => (
                      <div className=" overflow-hidden shrink-0">
                        <FriendCardRequest
                          user={user}
                          fetchFriendRequest={fetchFriendRequest}
                          setfriendRequest={setfriendRequest}
                          friend={friend}
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div
                    id="request"
                    className="relative flex w-full h-full justify-start grow-0 overflow-x-auto gap-2 scroll-smooth rounded-xl overflow-hidden"
                  >
                    <div className="absolute w-full h-full bg-primary rounded-xl flex justify-center items-center text-lg text-ascent-2">
                      {t("No Request")}
                    </div>
                    <div className="h-fit w-fit flex-shrink-0">
                      <FriendCardRequest />
                    </div>
                  </div>
                )}
              </div>
              <div className="w-full h-fit flex flex-wrap gap-2 select-none">
                <div className="w-full flex items-end justify-between">
                  <span className="text-ascent-1 font-bold text-3xl">
                    {t("People you may know")}
                  </span>
                  <Link to={"/friendsuggest"}>
                    <span className=" hover:underline hover:underline-offset-2 text-blue font-medium text-xl">
                      {t("See more")}
                    </span>
                  </Link>
                </div>

                <div className="flex justify-start items-center flex-col w-full">
                  <div className="w-3/4  h-fit flex gap-4 flex-wrap">
                    {suggestedFriends && suggestedFriends.length > 0 ? (
                      suggestedFriends.map((friend, index) => {
                        return (
                          <div key={index} className="w-44 h-fit">
                            <FriendCardSuggest
                              user={user}
                              fetchSuggestFriends={fetchSuggestFriends}
                              friend={friend}
                            />
                          </div>
                        );
                      })
                    ) : (
                      <div>
                        <div className="w-full h-full bg-primary rounded-2xl ">
                          <Loading />
                        </div>
                        <div className="w-full h-fit flex gap-2 flex-wrap">
                          {(() => {
                            const items = [];
                            for (let i = 0; i < 10; i++) {
                              items.push(
                                <div className="w-44 h-fit">
                                  <FriendCardRequest
                                    key={i}
                                    friend={user}
                                    title={t("Add")}
                                  />
                                </div>
                              );
                            }
                            return items;
                          })()}
                        </div>
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
  );
};

export default Friend;
