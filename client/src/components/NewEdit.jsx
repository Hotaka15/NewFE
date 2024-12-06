import React, { useEffect, useState } from "react";
// import { useForm } from "react-hook-form";
import { MdClose } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { AiOutlineDown } from "react-icons/ai";
import Loading from "./Loading";
import CustomButton from "./CustomButton";
import { UpdatePost, UpdateProfile, UserLogin } from "../redux/userSlice";
import { apiRequest, handFileUpload } from "../until";
import { FaEarthAfrica } from "react-icons/fa6";
import { TiDeleteOutline } from "react-icons/ti";
import { CiImageOn, CiShoppingTag } from "react-icons/ci";
import { MdImage } from "react-icons/md";
import { useForm } from "react-hook-form";
import { AiOutlinePlus } from "react-icons/ai";
import { NoProfile } from "../assets";
import ListCard from "./ListCard";
import { RiFolderVideoFill } from "react-icons/ri";
import { CiVideoOn } from "react-icons/ci";

import { TbMessageChatbot } from "react-icons/tb";
import { PiShootingStarFill } from "react-icons/pi";
import {
  postapiRequest,
  postedit,
  postfetchPosts,
  postrenewfetchPosts,
} from "../until/post";
import { aicheckpost } from "../until/ai";
import SuggestPost from "./SuggestPost";
import { userfriendSuggest, usergetFriends } from "../until/user";
import UserTiitle from "./UserTiitle";
import VideoPlayer from "./VideoPlayer";
import { generateImg, generatetext } from "../until/suggestfr";
import { FaRegCopy } from "react-icons/fa";
import { botsuggestRequest } from "../until/bot";
const NewEdit = ({ setPage, post, onClick, setPost }) => {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [errMsg, seterrMsg] = useState("");
  const [isSubmitting, setisSubmitting] = useState(false);
  const [picture, setPicuter] = useState(null);
  const [content, setContent] = useState(
    post?.description ? post.description : ""
  );
  const [images, setImages] = useState([]);
  const [preview, setPreview] = useState(false);
  const [write, setWrite] = useState(true);
  const [audience, setAudience] = useState(false);
  const [specific, setSpecific] = useState(false);
  const [file, setFile] = useState(null);
  const [posting, setPosting] = useState(false);
  const [review, setReview] = useState(post?.image ? post?.image : null);
  const [tem, setTem] = useState();
  const [lists, setLists] = useState(
    post?.specifiedUsers ? post.specifiedUsers : []
  );
  const [option, setOption] = useState(
    post?.visibility ? post.visibility : "public"
  );
  const [videoFile, setVideoFile] = useState(
    post?.urlVideo ? post?.urlVideo : null
  );
  const [videoUpload, setVideoUpload] = useState(null);
  const [err, setErr] = useState("");
  const [isSuggest, setIsSuggest] = useState(false);
  const [textsp, setTextsp] = useState("");
  const [friends, setFriends] = useState([]);
  const [counttext, setCounttext] = useState(100);
  const [suggestpost, setSuggestpost] = useState(false);
  const [isText, setIsText] = useState(true);
  const [resText, setResText] = useState("");
  const [loading, setLoading] = useState(false);
  const [resImg, setResImg] = useState(null);
  console.log(post);

  const handleTextsp = (e) => {
    console.log(e.target.value);

    const inputText = e.target.value;
    const words = inputText.trim().split(/\s+/);
    const count = words[0] === "" ? 0 : words.length;

    if (inputText && count <= 100 && counttext > 0) {
      setTextsp(inputText);
      setCounttext(100 - count);
    } else if (inputText == "") {
      setTextsp();
      setCounttext(100);
    }
  };

  const handleSendText = async (textsp) => {
    // if (textsp != "" && isText) {
    //   setLoading(true);
    //   const prompt = textsp;
    //   console.log(prompt);

    //   try {
    //     const res = await botsuggestRequest(prompt);
    //     console.log(res);
    //     // setResText(res);
    //   } catch (error) {
    //     console.log(error);
    //   }
    // }
    // if (textsp != "" && !isText) {
    //   setLoading(true);
    //   const prompt = textsp;
    //   console.log(prompt);

    //   try {
    //     const res = await generateImg(prompt);
    //     console.log(res);
    //     setResImg(res);
    //   } catch (error) {
    //     console.log(error);
    //   }
    // }

    try {
      setLoading(true);
      const prompt = textsp;
      console.log(prompt);
      const res = await botsuggestRequest(prompt);
      console.log(res);
      if (res?.type == "image prompt") {
        setIsText(false);
        setResText("");
        // await handFileUpload(`data:image/png;base64,${res?.image}`);
        setResImg(`data:image/png;base64,${res?.image}`);
      } else {
        setIsText(true);
        setResImg(null);
        setResText(res?.text);
      }
      // setResText(res);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  const handlebg = (e) => {
    setVideoUpload(null);
    setVideoFile(null);
    // console.log(e.target.files[0]);
    setFile(e.target.files[0]);
    const reader = new FileReader();
    reader.onload = () => {
      setReview(reader.result);
    };
    reader.readAsDataURL(e.target.files[0]);
    setPreview(true);
  };

  const handlebgbase64 = () => {
    setVideoUpload(null);
    setVideoFile(null);
    // console.log(e.target.files[0]);
    setFile(resImg);

    setReview(resImg);

    setPreview(true);
  };

  const pushList = (id) => {
    let memo = [...lists];
    console.log(memo);

    lists.includes(id)
      ? (memo = lists.filter((memo) => memo != id))
      : memo.push(id);

    setLists(memo);

    console.log(memo);
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const handlePreview = async (file) => {
    if (file) {
      console.log(file);
      await setFile(file);
      setPreview(true);
    }
  };

  // const {
  //   register,
  //   handleSubmit,
  //   formState: { errors },
  // } = useForm({
  //   mode: "onChange",
  //   defaultValues: { ...user },
  // });

  const handleCheck = (id, check) => {
    console.log(check);

    lists.includes(id) ? (check = true) : (check = false);
  };

  const checkpost = async (data) => {
    console.log(data);

    try {
      const res = await aicheckpost(data);
      console.log(res);
      return res?.data;
    } catch (error) {
      console.log(error);
    }
  };

  const handleFileChange = (e) => {
    setReview(null);
    setFile(null);
    const maxFileSize = 50 * 1024 * 1024;
    console.log(e.target.files[0]);
    console.log(e.target.files[0].size);

    const filevideo = e.target.files[0];
    if (filevideo) {
      if (filevideo.size > maxFileSize) {
        setErr("Video must be under 50mb");
      } else {
        // setVideoUpload(filevideo);
        // setVideoFile(URL.createObjectURL(filevideo));
        const videocheck = URL.createObjectURL(filevideo);
        const videoElement = document.createElement("video");
        videoElement.src = videocheck;
        videoElement.onloadedmetadata = () => {
          const width = videoElement.videoWidth;
          const height = videoElement.videoHeight;

          console.log("Width:", width, "Height:", height);

          // Giới hạn độ phân giải: ví dụ, giới hạn tối đa 1280x720
          if (width > 1280 || height > 720) {
            setErr("Video resolution exceeds the limit of 1280x720");
          } else {
            setErr("");
            setVideoUpload(filevideo);
            setVideoFile(URL.createObjectURL(filevideo));
          }
        };
        // setErr("");
      }
    }
  };

  const handlePostSubmit = async (data) => {
    if (content || file || videoUpload) {
      setPosting(true);

      data.visibility = option;
      console.log(data);
      // await checkpost(data);

      try {
        const uri = file && (await handFileUpload(file));
        const uriv = videoUpload && (await handFileUpload(videoUpload));
        // const datafile = uri
        //   ? { ...data, image: uri, urlVideo: "" }
        //   : uriv
        //   ? { ...data, urlVideo: uriv, image: "" }
        //   : data;
        //   let datafile;
        let datafile;
        if (review) {
          datafile = { ...data, image: uri, urlVideo: "" };
        } else if (videoFile) {
          datafile = { ...data, urlVideo: uriv, image: "" };
        } else {
          console.log(review);

          console.log(videoFile);
          datafile = { ...data, image: "", urlVideo: "" };
        }
        const newData = { ...datafile, specifiedUsers: [] };
        const token = user?.token;
        const checked = await checkpost(newData);
        console.log(checked);

        if (checked && checked?.sensitive == false) {
          setErr("");
          setPreview(false);
          const postId = post?._id;
          const res = await postedit(postId, token, newData);
          console.log(res);
          setPost(res?.updatedPost);
          const close = onClick;
          close();
        } else {
          setPosting(false);
          setErr("Sensitive content");
        }
      } catch (error) {
        console.log(error);
        setPosting(false);
      }
    }
  };

  const handleisSuggest = () => {
    setIsSuggest(!isSuggest);
  };

  const handleClose = () => {
    dispatch(UpdatePost(false));
  };
  //delete
  const handleSelect = (e) => {
    setPicuter(e.target.files[0]);
  };
  const fetchFriends = async () => {
    try {
      const res = await usergetFriends(user?.token);
      setFriends(res?.friends);
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchFriends();
  }, []);

  return (
    <div>
      <div className="fixed z-50 inset-0 overflow-y-auto">
        <div
          className="flex items-center justify-center min-h-screen pt-4
            px-4 pb-20 text-center sm:block sm:p-0"
        >
          <div className="fixed inset-0 transition-opacticy">
            <div className="absolute inset-0 bg-[#000] opacity-70"></div>
          </div>

          <span className="h-full w-full flex justify-center items-center sm:inline-block sm:align-middle sm:h-screen  select-none">
            <form onSubmit={handleSubmit(handlePostSubmit)}>
              <div
                className="inline-block align-bottom bg-primary rounded-3xl
            text-left overflow-hidden shadow-xl transform transition-all
            sm:my-10 sm:align-middle sm:max-w-md sm:w-full"
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-headline"
              >
                <div className="flex justify-between px-6 pt-5 pb-2">
                  {/* <div
                      className="text-blue"
                      onClick={() => {
                        handleisSuggest();
                      }}
                    >
                      <TbMessageChatbot size={30} />
                    </div> */}

                  <label
                    htmlFor="name"
                    className="block w-full  text-xl text-ascent-1 text-center font-bold"
                  >
                    Create Post
                  </label>

                  <button className="text-ascent-1" onClick={onClick}>
                    <MdClose size={22} />
                  </button>
                </div>
                <div className="flex flex-col relative">
                  {write && (
                    <div className="w-full h-full ">
                      <div className="w-full ">
                        <div className="px-7 flex gap-2">
                          <img
                            src={user?.profileUrl ?? NoProfile}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                          <div>
                            <span className="text-ascent-1">
                              {user?.firstName + " " + user?.lastName}
                            </span>
                            <div className="flex justify-center items-center ">
                              <div
                                className="bg-secondary text-ascent-1 text-xs px-1 py-1 opacity-70 flex justify-center items-center gap-1"
                                onClick={() => {
                                  setAudience(true);
                                  // setWrite(false);
                                }}
                              >
                                <FaEarthAfrica />
                                {option} <AiOutlineDown size={15} />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* <div className="flex justify-center items-center ">
                        <div
                          className="bg-secondary text-ascent-1 px-2 py-1 opacity-70 flex justify-center items-center gap-1"
                          onClick={() => {
                            setAudience(true);
                            // setWrite(false);
                          }}
                        >
                          <FaEarthAfrica />
                          {option} <AiOutlineDown size={15} />
                        </div>
                      </div> */}
                      <div className="flex justify-between px-2 pt-5 pb-2">
                        <label
                          htmlFor="name"
                          className="block font-medium text-xl text-ascent-1 text-left py-7 box-border"
                        ></label>
                        <div className="w-full h-full flex-col-reverse m-3 gap-80">
                          <textarea
                            {...register("description")}
                            error={
                              errors.description
                                ? errors.description.message
                                : ""
                            }
                            className="w-full h-72 bg-primary rounded-3xl border-none
            outline-none text-xl text-ascent-1 
            px-4 py-3 placeholder:text-ascent-2 placeholder:text-xl resize-none"
                            value={content}
                            placeholder="Write something about post"
                            onChange={(ev) => {
                              setContent(ev.target.value);
                            }}
                          />
                          {review && (
                            <div className="py-4 w-full flex justify-center gap-3 bg-secondary rounded-xl ">
                              <div
                                className="flex relative w-full justify-center items-center rounded-xl overflow-hidden"
                                onClick={() => {}}
                              >
                                <img
                                  src={review}
                                  alt="Something wrong"
                                  className="max-h-56"
                                />
                                <div
                                  onClick={() => {
                                    setReview(null);
                                    setFile(null);
                                  }}
                                  className="rotate-45 cursor-pointer absolute right-3 top-1 bg-[#000000] aspect-square rounded-full opacity-90 w-6 h-6 text-white flex justify-center items-center"
                                >
                                  <AiOutlinePlus />
                                </div>
                              </div>
                            </div>
                          )}
                          {videoFile && (
                            <div className="relative">
                              {/* <video controls width="400">
                                
                                <source src={videoFile} type="video/mp4" />
                                Your browser does not support the video tag.
                              </video> */}
                              <VideoPlayer source={videoFile} />
                              <div
                                onClick={() => {
                                  // setPreview(false);
                                  setVideoFile(null);
                                }}
                                className="rotate-45 cursor-pointer absolute right-2 top-2 bg-[#000000] aspect-square rounded-full opacity-90 w-6 h-6 text-white flex justify-center items-center"
                              >
                                <AiOutlinePlus />
                              </div>
                            </div>
                          )}
                          {!posting && (
                            <div className="flex gap-3 mt-2 border border-[#66666690] px-2 py-3 items-center rounded-lg justify-between">
                              {/* <div className="w-fit py-1 flex outline-1 px-3 text-[#04c922] bg-primary rounded-full outline  justify-center items-center cursor-pointer ">
                                  <CiShoppingTag />
                                  <div className="">Tags</div>
                                </div> */}
                              <div className="text-ascent-2 ">
                                Add to your post
                              </div>
                              <div className="flex gap-2 items-center">
                                <div
                                  onClick={() => {
                                    setSuggestpost(true);
                                  }}
                                  className="w-fit py-1 flex outline-1 px-3 bg-gradient-to-r from-[#0099ff] from-25% to-[#9966ff] to-60%  rounded-full outline  justify-center items-center cursor-pointer"
                                >
                                  <label className="flex items-center gap-1 text-base text-[#ffff00]  text-transparent  cursor-pointer  ">
                                    <PiShootingStarFill size={25} />
                                  </label>
                                </div>

                                <div className="w-fit py-1 flex outline-1 px-3 text-[#345cd9] bg-primary rounded-full outline  justify-center items-center cursor-pointer">
                                  <label
                                    htmlFor="imgUpload"
                                    className="flex items-center gap-1 text-base text-[#345cd9]  cursor-pointer"
                                  >
                                    <input
                                      type="file"
                                      onChange={(e) => {
                                        e.target.files[0] && handlebg(e);
                                      }}
                                      key={file ? "1" : ""}
                                      className="hidden"
                                      id="imgUpload"
                                      data-max-size="5120"
                                      accept=".jpg, .png, .jpeg"
                                    />
                                    <MdImage size={25} />
                                  </label>
                                </div>

                                <div className="w-fit py-1 flex outline-1 px-3 text-[#e30b65] bg-primary rounded-full outline  justify-center items-center cursor-pointer">
                                  <label
                                    htmlFor="videoUpload"
                                    className="flex items-center gap-1 text-base text-[#e30b65]  cursor-pointer"
                                  >
                                    <input
                                      type="file"
                                      onChange={(e) => {
                                        e.target.files[0] &&
                                          handleFileChange(e);
                                      }}
                                      key={videoUpload ? "1" : ""}
                                      className="hidden"
                                      id="videoUpload"
                                      data-max-size="5120"
                                      accept="video/mp4"
                                    />
                                    <RiFolderVideoFill size={25} />
                                  </label>
                                </div>
                              </div>
                            </div>
                          )}

                          <div className="w-full flex justify-end ">
                            {err && (
                              <div className="w-full flex justify-center text-xs items-center text-[#f64949fe]">
                                {err}
                              </div>
                            )}
                            {posting ? (
                              <div className="w-full flex justify-center items-center my-4">
                                <Loading />
                              </div>
                            ) : (
                              <CustomButton
                                type="submit"
                                Post
                                // onClick={() => {
                                //   console.log("press");
                                // }}
                                containerStyles={`inline-flex justify-center rounded-xl mt-2 bg-blue w-full
                    py-3 text-sm font-medium text-white outline-none`}
                                tittle="Post"
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  {audience && (
                    <div className="bg-primary absolute w-full h-full flex flex-col justify-between">
                      <div className="flex w-full h-full select-none overflow-y-auto my-5">
                        <div
                          className="w-full h-72 mb-20 rounded-3xl border-none
            outline-none text-xl text-ascent-1 px-5 py-3 placeholder:text-ascent-2 "
                        >
                          <label
                            htmlFor="default-radio-1"
                            className="items-center mb-4 select-none w-full bg-primary flex px-5 py-2 justify-between hover:bg-ascent-3/30 rounded-xl"
                          >
                            <label
                              htmlFor="default-radio-1"
                              className="ms-2 text-gray-900 dark:text-gray-300 font-medium"
                            >
                              Public
                              <br />
                              <span className="text-ascent-2 text-base">
                                Anyone can see
                              </span>
                            </label>
                            <input
                              id="default-radio-1"
                              type="radio"
                              value="public"
                              name="auth"
                              onChange={(e) => {
                                setOption(e.target.value);
                                setLists([]);
                              }}
                              className="w-5 h-5 text-blue-600  border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 
                            dark:ring-offset-gray-800  dark:bg-gray-700 dark:border-gray-600"
                            />
                          </label>
                          <label
                            htmlFor="default-radio-2"
                            className="items-center mb-4 select-none w-full bg-primary flex px-5 py-2 justify-between hover:bg-ascent-3/30 rounded-xl"
                          >
                            <label
                              htmlFor="default-radio-2"
                              className="ms-2 text-gray-900 dark:text-gray-300 font-medium"
                            >
                              Specific friends
                              <br />
                              <span className="text-ascent-2 text-base">
                                Only show to some friends
                              </span>
                            </label>
                            <input
                              id="default-radio-2"
                              type="radio"
                              value="specific"
                              name="auth"
                              onChange={(e) => {
                                setOption(e.target.value);
                                setSpecific(!specific);
                              }}
                              className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600"
                            />
                          </label>
                          <label
                            htmlFor="default-radio-3"
                            className="items-center mb-4 select-none w-full bg-primary flex px-5 py-2 justify-between hover:bg-ascent-3/30 rounded-xl"
                          >
                            <label
                              htmlFor="default-radio-3"
                              className="ms-2 text-gray-900 dark:text-gray-300 font-medium"
                            >
                              Friend
                              <br />
                              <span className="text-ascent-2 text-base">
                                Your friends
                              </span>
                            </label>
                            <input
                              id="default-radio-3"
                              type="radio"
                              value="friends"
                              name="auth"
                              onChange={(e) => {
                                setOption(e.target.value);
                                setLists([]);
                              }}
                              className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600"
                            />
                          </label>
                          <label
                            htmlFor="default-radio-4"
                            className="items-center mb-4 select-none w-full bg-primary flex px-5 py-2 justify-between hover:bg-ascent-3/30 rounded-xl"
                          >
                            <label
                              htmlFor="default-radio-4"
                              className="ms-2 text-gray-900 dark:text-gray-300 font-medium"
                            >
                              Only me
                              <br />
                              <span className="text-ascent-2 text-base">
                                Only show to you
                              </span>
                            </label>
                            <input
                              id="default-radio-4"
                              type="radio"
                              value="only me"
                              name="auth"
                              onChange={(e) => {
                                setOption(e.target.value);
                              }}
                              className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600"
                            />
                          </label>
                        </div>
                      </div>
                      <div className=" flex justify-between px-6">
                        <div className="w-full flex m-3 justify-between items-center">
                          <CustomButton
                            type=""
                            Post
                            onClick={() => {
                              setAudience(false);
                              setWrite(true);
                            }}
                            containerStyles={`inline-flex justify-center rounded-full underline underline-offset-2 px-8
                    py-3 text-sm font-medium text-ascent-1 outline-none`}
                            tittle="Back"
                          />
                          <div className="w-full h-full flex-col-reverse gap-80">
                            <div className="w-full flex justify-end">
                              <CustomButton
                                type=""
                                Post
                                onClick={() => {
                                  setAudience(!audience);
                                  // setWrite(!write);
                                  console.log("press");
                                }}
                                containerStyles={`inline-flex justify-center rounded-full bg-blue px-8
                    py-3 text-sm font-medium text-white outline-none`}
                                tittle="Done"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {specific && (
                    <div className="bg-primary absolute w-full h-full flex flex-col justify-between">
                      <div className="flex w-full h-full select-none overflow-y-auto my-5">
                        <div
                          className="w-full h-full mb-20 rounded-3xl border-none
          outline-none text-xl text-ascent-1 px-5 py-3 placeholder:text-ascent-2"
                        >
                          <input
                            type="text"
                            className="w-full my-2 bg-secondary outline-none px-5 py-2 rounded-full "
                            placeholder="Search"
                          />
                          <div className="w-full flex items-center justify-center">
                            <div className="flex flex-wrap gap-2 justify-center mb-2 items-center">
                              {lists.length > 0 &&
                                lists?.map((friend) => {
                                  var check = lists.includes(friend?._id);
                                  return (
                                    <div
                                      key={friend?._id}
                                      onClick={() => {
                                        pushList(friend);
                                        console.log(lists);
                                      }}
                                    >
                                      <UserTiitle useradd={friend} />
                                    </div>
                                  );
                                })}
                            </div>
                          </div>
                          <div className="w-full h-full ">
                            {friends &&
                              friends.map((friend) => {
                                var check = lists.includes(friend?._id);

                                return (
                                  <div
                                    onClick={() => {
                                      pushList(friend?._id);
                                      console.log(lists);
                                    }}
                                    className={`${
                                      check ? "bg-ascent-3/10" : ""
                                    }  items-center mb-4 select-none w-full flex px-5 py-2 justify-between hover:bg-ascent-3/30 rounded-xl`}
                                  >
                                    <div className="ms-2 text-gray-900 dark:text-gray-300 font-medium flex">
                                      <img
                                        src={friend?.profileUrl || NoProfile}
                                        alt=""
                                        className="h-12 w-12 object-cover rounded-full mr-3"
                                      />
                                      <div
                                        id={friend._id}
                                        className="h-full flex justify-center items-center"
                                      >
                                        {friend.firstName} {friend.lastName}
                                        <br />
                                        {/* <span className="text-ascent-2 text-base">
      Anyone can see
    </span> */}
                                      </div>
                                    </div>
                                    {/* <input
      id={friend._id}
      type="radio"
      value="public"
      name="auth"
      onClick={(e) => {
        // setOption(e.target.value);
        pushList(friend._id);
      }}
      className={`${}w-5 h-5 text-blue-600  border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 
dark:ring-offset-gray-800  dark:bg-gray-700 dark:border-gray-600`}
    /> */}
                                  </div>
                                  // <ListCard
                                  //   friend={friend}
                                  //   onClick={() => {
                                  //     pushList(friend);
                                  //     console.log(lists);
                                  //     // handleCheck(friend._id, check);
                                  //   }}
                                  //   check={check}
                                  //   lists={lists}
                                  // />
                                );
                              })}
                          </div>
                        </div>
                      </div>
                      <div className=" flex justify-between px-6">
                        <div className="w-full flex m-3 justify-between items-center">
                          <CustomButton
                            type=""
                            Post
                            onClick={() => {
                              setLists([]);
                              setSpecific(!specific);
                            }}
                            containerStyles={`inline-flex justify-center rounded-full underline underline-offset-2 px-8
                  py-3 text-sm font-medium text-ascent-1 outline-none`}
                            tittle="Back"
                          />
                          <div className="w-full h-full flex-col-reverse gap-80">
                            <div className="w-full flex justify-end">
                              <CustomButton
                                type=""
                                Post
                                onClick={() => {
                                  // setAudience(!audience);
                                  setSpecific(!specific);
                                  console.log("press");
                                }}
                                containerStyles={`inline-flex justify-center rounded-full bg-blue px-8
                  py-3 text-sm font-medium text-white outline-none`}
                                tittle="Done"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </form>
            {/* <div
              className="fixed bottom-10 right-10 text-ascent-1 rounded-full px-2 py-2 bg-primary/50 hover:bg-primary"
              onClick={() => {
                handleisSuggest();
              }}
            >
              <TbMessageChatbot size={40} />
            </div> */}
            {suggestpost && (
              <div className="fixed top-0 right-0 z-20 w-full h-full flex items-center justify-center">
                <div className="absolute w-full h-full bg-gradient-to-r opacity-40 from-[#0099ff] from-25% to-[#9966ff] to-60%"></div>
                <div className="w-1/4 h-2/3 bg-primary rounded-2xl z-10 overflow-hidden relative">
                  <div
                    className="text-ascent-1  py-4 px-4 flex justify-end cursor-pointer"
                    onClick={() => {
                      setSuggestpost(false);
                    }}
                  >
                    <MdClose size={22} />
                  </div>
                  <div className="px-4 w-full ">
                    <div className="w-full rounded-xl overflow-hidden border border-[#66666690] relative ">
                      <textarea
                        value={textsp}
                        onChange={(e) => {
                          handleTextsp(e);
                        }}
                        className="w-full h-52 bg-primary  border-none
            outline-none text-xl text-ascent-1 
            px-4 pt-3 placeholder:text-ascent-2 placeholder:text-xl resize-none"
                        placeholder="Write something about post"
                      />
                      <div className="flex justify-between px-4 pb-4">
                        <div className=" text-ascent-2">Word: {counttext}</div>

                        {loading && (
                          <div className="flex justify-center items-center">
                            <Loading />
                          </div>
                        )}

                        {!loading && (
                          <div className="flex justify-center items-center">
                            {/* <div className="flex py-2  bg-primary rounded-md select-none">
                              <div
                                className={`${
                                  isText && "bg-ascent-1/10"
                                } px-2 py-1 rounded-md text-ascent-1 cursor-pointer`}
                                onClick={() => {
                                  setIsText(true);
                                }}
                              >
                                Text
                              </div>
                              <div
                                className={`${
                                  !isText && "bg-ascent-1/10"
                                } px-2 py-1 rounded-md text-ascent-1 cursor-pointer`}
                                onClick={() => {
                                  setIsText(false);
                                }}
                              >
                                Images
                              </div>
                            </div> */}

                            <div
                              className="bg-blue px-2 py-1 text-white rounded-lg"
                              onClick={() => {
                                handleSendText(textsp);
                              }}
                            >
                              Submit
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    {isText && (
                      <div className="mt-10 w-full rounded-xl overflow-hidden border border-[#66666690] relative ">
                        <textarea
                          value={resText}
                          onChange={(e) => {
                            setResText(e.target.value);
                          }}
                          className="w-full h-52 bg-primary  border-none
            outline-none text-xl text-ascent-1 
            px-4 pt-3 placeholder:text-ascent-2 placeholder:text-xl resize-none"
                          placeholder="Text"
                        />
                      </div>
                    )}
                    {!isText && (
                      <div className="mt-10 w-full flex justify-center items-center rounded-xl overflow-hidden border border-[#66666690] relative ">
                        {resImg && (
                          <div className="w-full flex flex-col items-center gap-2">
                            <img
                              src={resImg}
                              className="max-h-52 object-cover rounded-lg"
                            />
                            <div
                              className="text-ascent-2 border rounded-lg border-[#66666690] px-1 py-1 flex justify-center items-center"
                              onClick={() => {
                                handlebgbase64();
                              }}
                            >
                              <FaRegCopy />
                              Copy
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </span>

          {/* &#8203; */}

          {isSuggest && (
            <div className="fixed w-[425px] h-[620px] z-10 bottom-10 right-10">
              <SuggestPost handleisSuggest={handleisSuggest} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewEdit;
