import React, { useCallback, useEffect, useRef, useState } from "react";
import { TopBar } from "../components";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

import { Loading, PostCard } from "../components/index";
import { useDispatch } from "react-redux";
import {
  postfetchPosts,
  postlikePost,
  postsearchfetchPosts,
} from "../until/post";
import { io } from "socket.io-client";
import { useTranslation } from "react-i18next";
import { debounce } from "lodash";
import { UpdatePosts } from "../redux/postSlice";
const Search = () => {
  const { keyword } = useParams();
  const [key, setKey] = useState(`${keyword}`);
  const [maxDate, setMaxDate] = useState("");
  const { t } = useTranslation();
  const { user } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const [from, setFrom] = useState(null);
  const [to, setTo] = useState(null);
  const [categori, setCategori] = useState("");
  const { posts } = useSelector((state) => state.posts);
  const [searchPost, setSearchPost] = useState(true);
  const [isFetching, setIsFetching] = useState(true);
  const [page, setPage] = useState(1);
  const keycurent = useRef({});
  const handleSearch = async (keyword, page) => {
    try {
      const data = {
        keyword: keyword,
        from: from,
        to: to,
        categori: categori,
        page: page,
      };

      if (data) {
        await postsearchfetchPosts(user.token, dispatch, "", data ? data : "");
        keycurent.current = data;
      }
      setIsFetching(false);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleLikePost = async (uri) => {
    await postlikePost({ uri: uri, token: user?.token });
  };

  const handleScroll = useCallback(
    debounce((e) => {
      const target = e.target;

      if (
        target.scrollTop + target.clientHeight >= target.scrollHeight * 0.7 &&
        !isFetching
      ) {
        // handleSearch(keyword);
        setPage((prevPage) => prevPage + 1);
      }
    }, 500),
    [isFetching, page]
  );

  useEffect(() => {
    const postRange = document.getElementById("post_range");
    postRange.addEventListener("scroll", handleScroll);

    return () => {
      postRange.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  // useEffect(() => {
  //   console.log(page);
  //   page !== 1 && handleSearch(keyword);
  // }, [page]);
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setMaxDate(today);
  }, []);

  useEffect(() => {
    page > 1 && handleSearch(keyword, page);
  }, [page]);

  useEffect(() => {
    setPage(2);
    setLoading(true);
    dispatch(UpdatePosts([]));
    handleSearch(keyword, 1);
  }, [keyword, to, from, categori]);

  // useEffect(() => {
  //   setLoading(true);

  //   handleSearch(keyword);
  //   let timeoutId;
  //   timeoutId = setTimeout(() => {
  //     keyword && handleSearch(keyword);
  //   }, 3000);

  //   return () => {
  //     clearTimeout(timeoutId);
  //   };
  // }, [keyword, to, from, categori]);
  return (
    <div>
      <div
        className="home w-full px-0 lg:px-10 pb-20 2xl-40 bg-bgColor 
lg:rounded-lg h-screen overflow-hidden"
      >
        <TopBar user={user} setKey={setKey} />
        <div className="w-full flex gap-2 lg:gap-4 pt-5 h-full justify-between">
          <div className=" justify-center h-full flex-initial w-full flex-wrap px-4 py-4 flex gap-6 rounded-lg ">
            <div className="w-full h-full">
              <div className="w-full h-full flex flex-wrap gap-2 select-none">
                <div className="flex w-full h-full items-start justify-between">
                  <div className="w-1/4 h-full text-ascent-2 bg-primary rounded-lg px-4 py-8 flex flex-col gap-4 ">
                    <span className=" text-ascent-1 font-medium text-2xl">
                      {t("Filter")}
                    </span>
                    <div className="gap-2 flex flex-col">
                      {t("Category")}:
                      <select
                        onChange={(e) => {
                          setCategori(e.target.value);
                          setPage(1);
                        }}
                        className="bg-secondary text-ascent-1 px-4 py-2 outline-none rounded-lg"
                      >
                        <option value="News and Events">
                          {t("News and Events")}
                        </option>
                        <option value="Entertainment">
                          {t("Entertainment")}
                        </option>
                        <option value="Health and Fitness">
                          {t("Health and Fitness")}
                        </option>
                        <option value="Travel">{t("Travel")}</option>
                        <option value="Fashion and Beauty">
                          {t("Fashion and Beauty")}
                        </option>
                        <option value="Technology and Innovation">
                          {t("Technology and Innovation")}
                        </option>
                        <option value="Education and Learning">
                          {t("Education and Learning")}
                        </option>
                        <option value="Business and Entrepreneurship">
                          {t("Business and Entrepreneurship")}
                        </option>
                        <option value="Lifestyle">{t("Lifestyle")}</option>
                        <option value="Art and Creativity">
                          {t("Art and Creativity")}
                        </option>
                        <option value="Environment and Nature Conservation">
                          {t("Environment and Nature Conservation")}
                        </option>
                        <option value="Love and Relationships">
                          {t("Love and Relationships")}
                        </option>
                        <option value="Pets">{t("Pets")}</option>
                      </select>
                    </div>
                    <div className="flex gap-4">
                      <div className="h-full">
                        <div className="h-1/2 flex items-center justify-end">
                          {t("From")}:
                        </div>
                        <div className="h-1/2 flex items-center justify-end">
                          {t("To")}:
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <div>
                          <input
                            type="date"
                            onChange={(e) => {
                              setFrom(e.target.value);
                              setPage(1);
                            }}
                            className="datepicker-input bg-secondary rounded-lg border border-[#66666690] text-ascent-1 px-4 py-2"
                          />
                        </div>
                        <div>
                          <input
                            type="date"
                            max={maxDate}
                            onChange={(e) => {
                              setTo(e.target.value);
                              setPage(1);
                            }}
                            className="datepicker-input bg-secondary rounded-lg border border-[#66666690] text-ascent-1 px-4 py-2"
                          />
                        </div>
                      </div>
                    </div>

                    <div
                      className=" w-full bg-secondary text-ascent-1 hover:bg-ascent-3/30 py-2 flex justify-center items-center rounded-xl"
                      onClick={() => {
                        setFrom(null);
                        setTo(null);
                        setCategori("");
                        setPage(1);
                      }}
                    >
                      {t("Clear")}
                    </div>
                  </div>
                  <div className="w-full h-full flex gap-2 flex-wrap justify-center ">
                    <div
                      id="post_range"
                      className=" max-w-2xl h-full overflow-y-auto flex flex-col"
                    >
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
                            {t("No Post Available")}
                          </p>
                        </div>
                      )}
                      {posts && posts?.length >= 10 && !loading && <Loading />}
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
