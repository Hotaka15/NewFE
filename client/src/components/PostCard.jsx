import React, { useEffect, useState, useTransition } from "react";
import { Link } from "react-router-dom";
import { NoProfile } from "../assets";
import moment from "moment";
import { BiComment, BiLike, BiSolidLike } from "react-icons/bi";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { useForm } from "react-hook-form";
import TextInput from "./TextInput";
import Loading from "./Loading";
import { IoBookmark } from "react-icons/io5";
import { MdEdit } from "react-icons/md";
import CustomButton from "./CustomButton";
import { postComments } from "../assets/data";
import { apiRequest } from "../until";
import { SlOptions } from "react-icons/sl";
import { GoBookmarkSlashFill } from "react-icons/go";
import { useDispatch, useSelector } from "react-redux";
import Editpost from "./Editpost";
import { postapiRequest, postdeletePost, postlikePost } from "../until/post";
import { usergetUserInfo, usergetUserpInfo } from "../until/user";
import ReportCard from "./ReportCard";

import { aichecktext } from "../until/ai";
import { FaEye } from "react-icons/fa";
import VideoPlayer from "./VideoPlayer";
import NewEdit from "./NewEdit";
const getPostComments = async (id, user) => {
  // console.log(user?.token);

  try {
    const res = await postapiRequest({
      token: user?.token,
      url: `/${id}/comments`,
      method: "GET",
    });

    return res?.data;
  } catch (error) {
    console.log(error);
  }
};

const CommentForm = ({ user, postid, id, replyAt, getComments }) => {
  //console.log(user, id, replyAt, getComments);
  // console.log(id);

  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    mode: "onChange",
  });
  const onSubmit = async (data) => {
    // console.log(data);
    // console.log(replyAt);

    setLoading(true);
    setErrMsg("");
    try {
      const URL = !replyAt
        ? `/${postid}/comment/`
        : `/${postid}/comment?commentId=` + id;
      // console.log(URL);
      const newData = {
        comment: data?.comment,
        from: user?.firstName + " " + user?.lastName,
        replyAt: replyAt,
      };
      const chat = data?.comment;

      const result = await aichecktext(chat);

      if (!result) {
        setErrMsg("");
        const res = await postapiRequest({
          url: URL,
          data: newData,
          token: user?.token,
          method: "POST",
        });
        // console.log(res);

        if (res?.status === "failed") {
          setErrMsg(res);
        } else {
          reset({
            comment: "",
          });
          setErrMsg("");
          await getComments();
        }
      } else {
        setErrMsg("Sensitive");
      }

      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full border-b border-[#66666645]"
    >
      <div className="w-full flex items-center gap-2 py-4">
        <img
          src={user?.profileUrl ?? NoProfile}
          alt="User Image"
          className="w-10 h-10 rounded-full object-cover"
        />

        <TextInput
          name="comment"
          styles="w-full rounded-full py-3"
          placeholder={replyAt ? `Reply @${replyAt}` : "Comment this post"}
          register={register("comment", {
            required: "Comment can't be empty",
          })}
          error={errors.comment ? errors.comment.message : ""}
        />
      </div>
      {errMsg && (
        <span
          role="alert"
          className={`text-sm 
            text-[#f64949fe] mt-0.5`}
        >
          {errMsg}
        </span>
      )}

      <div className="flex items-end justify-end pb-2">
        {loading ? (
          <Loading />
        ) : (
          <CustomButton
            tittle={"Submit"}
            type="submit"
            containerStyles="bg-[#0444a4] text-white py-1 px-3 rounded-full font-semibold text-sm"
          />
        )}
      </div>
    </form>
  );
};

const ReplyCard = ({ reply, user, handleLike }) => {
  // console.log(reply);

  const [userP, setUserP] = useState();
  const getUser = async () => {
    try {
      const res = await usergetUserInfo(user?.token, reply?.userId);
      // console.log(res);

      setUserP(res);
      // dispatch(UserLogin(newData));
      // console.log(res);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getUser();
  }, []);
  return (
    <div className="w-full py-3">
      <div className="flex gap-3 items-center mb-1">
        <Link to={"/profile/" + reply?.userId?._id}>
          <img
            src={userP?.profileUrl ?? NoProfile}
            alt={userP?.firstName}
            className="w-10 h-10 rounded-full object-cover"
          />
        </Link>

        <div>
          <Link to={"/profile/" + userP?._id}>
            <p className="font-medium text-base text-ascent-1">
              {userP?.firstName} {userP?.lastName}
            </p>
          </Link>
          <span className="text-ascent-2 text-sm">
            {moment(reply?.createAt).fromNow()}
          </span>
        </div>
      </div>
      <div className="ml-12">
        <p className="text-ascent-2">{reply?.comment}</p>
        <div className="mt-2 flex gap-6">
          <p
            className="flex gap-2 items-center text-base text-ascent-2
            cursor-pointer"
            // onClick={handleLike}
          >
            {reply?.likes?.includes(user?._id) ? (
              <BiSolidLike size={20} color="blue" />
            ) : (
              <BiLike size={20} />
            )}
            {reply?.likes?.length} Likes
          </p>
        </div>
      </div>
    </div>
  );
};

const Opt = ({ post, onClick, report, handlerp }) => {
  const { user } = useSelector((state) => state.user);
  const [save, setSave] = useState(false);
  // console.log(post);
  // console.log(user?._id);
  const handlereport = report;
  // const handle = () => {
  //   const report = report
  // }
  return (
    <div className="w-fit bg-bgColor">
      {/* <span
        onClick={() => {
          setSave(!save);
        }}
        className=" flex  bg-primary justify-start items-center px-3 py-4 gap-2 hover:bg-ascent-3/30"
      >
        {save ? (
          <div className="text-ascent-1 flex justify-start items-center w-full gap-2">
            <GoBookmarkSlashFill />
            <div className="text-ascent-1 flex flex-col">
              <span>Save</span>
              <span className="text-xs text-ascent-2">
                Add this to your saveed items.
              </span>
            </div>
          </div>
        ) : (
          <div className="text-ascent-1 flex justify-start items-center w-full gap-2">
            <IoBookmark />

            <div className="text-ascent-1 flex flex-col">
              <span>Unsave</span>
              <span className="text-xs text-ascent-2">
                Remove this form your saved item.
              </span>
            </div>
          </div>
        )}
      </span> */}
      {post?.userId == user?._id && (
        <span
          onClick={onClick}
          className="text-ascent-1 flex  bg-primary justify-start items-center px-3 py-4 gap-2 hover:bg-ascent-3/30"
        >
          <MdEdit />
          Edit
        </span>
      )}
      <div>
        <span
          onClick={handlerp}
          className="text-ascent-1 flex  bg-primary justify-start items-center px-3 py-4 gap-2 hover:bg-ascent-3/30"
        >
          <MdEdit />
          <div className="text-ascent-1 flex flex-col">
            <span>Report</span>
            <span className="text-xs text-ascent-2">
              We won't let {post?.userId?.lastName} know who reported this.
            </span>
          </div>
        </span>
      </div>
    </div>
  );
};

const PostCard = ({ posts, user, deletePost, likePost, isCheck, socket }) => {
  const [showAll, setShowAll] = useState(0);
  const [showReply, setshowReply] = useState(0);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [post, setPost] = useState(posts);
  const [option, setOption] = useState(false);
  const [replyComments, setReplyComments] = useState(0);
  const [showComments, setShowComments] = useState(0);
  const [editp, setEditp] = useState(false);
  const [editpost, setEditpost] = useState();
  const dispatch = useDispatch();
  const [reportdetail, setReportdetail] = useState(false);
  const [upost, setUpost] = useState();
  const [isLiking, setIsLiking] = useState(false);
  const [isreport, setIsreport] = useState(false);

  const handleupdatepost = (res) => {
    setPost(res);
  };

  const getPost = async () => {
    try {
      const res = await postapiRequest({
        url: `/${posts?._id}`,
        token: user?.token,
        method: "GET",
      });
      // console.log(res);

      setPost(res);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeletePost = async (id) => {
    try {
      await postdeletePost(id, user?.token);

      setIsreport(true);
    } catch (error) {
      console.log(error);
    }

    // await fetchPost();
  };

  const handlerpdetail = () => {
    setReportdetail(!reportdetail);
  };

  const handlerfpdetail = () => {
    setReportdetail(!reportdetail);
    setIsreport(true);
  };

  const getComments = async (id) => {
    setReplyComments(0);
    try {
      const result = await postapiRequest({
        url: `/${id}/comments`,
        token: user?.token,
      });

      setComments(result?.comments);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };
  const handleLike = async (uri) => {
    try {
      if (isLiking) return; // Nếu đang trong quá trình "like", không làm gì
      setIsLiking(true);
      await likePost(uri);
      await getComments(post?._id);
      await getPost();
    } catch (error) {
      console.log(error);
    } finally {
      setIsLiking(false);
    }
  };
  const report = () => {
    setOption(!option);
  };

  const getUser = async () => {
    try {
      const res = await usergetUserpInfo(user?.token, post?.userId);
      // const newData = { token: user?.token, ...res };
      setUpost(res);
      // dispatch(UserLogin(newData));
      // console.log(res);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {}, []);

  useEffect(() => {
    getPost();
  }, []);
  useEffect(() => {
    getUser();
  }, []);

  return (
    <div>
      {!isreport && (
        <div className="mb-2 bg-primary p-4 rounded-xl">
          <div className="flex gap-3 items-center mb-2">
            <Link to={"/profile/" + post?.userId}>
              <img
                src={upost?.profileUrl ?? NoProfile}
                alt={upost?.firstName}
                className="w-12 h-12  object-cover rounded-full"
              />
            </Link>

            <div className="relative w-full flex justify-between select-none">
              <div className="">
                <Link to={"/profile/" + upost?._id}>
                  <p className="font-medium text-lg text-ascent-1">
                    {upost?.firstName} {upost?.lastName}
                  </p>
                </Link>
                {/* <span className="text-ascent-2">{post?.userId?.location}</span> */}
                {/* <span className="md:hidden flex text-ascent-2">
              {moment(post?.createdAt ?? "2023-05-25").fromNow()}
            </span> */}
                <span className="hidden md:flex text-ascent-2">
                  {moment(post?.createdAt ?? "2023-05-25").fromNow()}
                  <div className="w-2"></div>
                  {/* {isCheck && (
                    <div className="flex justify-center items-center">
                      {" "}
                      <FaEye />
                    </div>
                  )} */}
                </span>
              </div>
              {/* <span className="hidden md:flex text-ascent-2">
            {moment(post?.createdAt ?? "2023-05-25").fromNow()}
          </span> */}

              <div
                className="text-ascent-1 h-fit px-2 py-1 rounded-lg hover:bg-ascent-3/30"
                onClick={() => {
                  setOption(!option);
                }}
                // report={report}
              >
                <SlOptions size={20} />
              </div>
              {option && (
                <div className="absolute right-0 top-10 rounded-2xl overflow-hidden border border-[#66666645] shadow-xl z-50">
                  <Opt
                    post={post}
                    onClick={() => {
                      setEditp(!editp);
                    }}
                    handlerp={handlerpdetail}
                    report={report}
                  />
                </div>
              )}
            </div>
          </div>

          <div>
            <Link to={"/post/" + post?._id}>
              <p className="text-ascent-2">
                {showAll === post?._id
                  ? post?.description
                  : post?.description.slice(0, 300)}
                {post?.description?.length > 301 &&
                  (showAll === post?._id ? (
                    <span
                      className="text-blue ml-2 font-medium curson-pointer"
                      onClick={() => setShowAll(0)}
                    >
                      Show Less
                    </span>
                  ) : (
                    <span
                      className="text-blue ml-2 font-medium curson-pointer"
                      onClick={() => setShowAll(post?._id)}
                    >
                      Show More
                    </span>
                  ))}
              </p>
            </Link>
            {post?.urlVideo && (
              <div className="h-full flex justify-center items-center mt-1 ">
                <VideoPlayer source={post?.urlVideo} />
                {/* <video controls width="650px">
                  <source src={post?.urlVideo} type="video/mp4" />
                  Your browser does not support the video tag.
                </video> */}
              </div>
            )}
            {post?.image && (
              <div className="h-full flex justify-center items-center mt-1">
                <img
                  src={post?.image}
                  alt="post image"
                  className="max-h-96 mt-2 rounded-lg "
                ></img>
              </div>
            )}

            <div className="flex justify-start gap-2 mt-1 w-full px-5 items-center text-ascent-1 ">
              <FaEye /> {post?.viewers && post?.viewers.length} views
            </div>
          </div>

          <div
            className="mt-1 flex justify-between items-center  
      text-ascent-2 text-base border-t border-[#66666645]"
          >
            <p
              className="flex gap-2 items-center text-base cursor-pointer select-none hover:bg-ascent-3/10 px-3 py-2 rounded-lg"
              onClick={() => {
                handleLike(post?._id + "/like");
                // getPost();
              }}
            >
              {post?.likes?.includes(user?._id) ? (
                <BiSolidLike size={20} color="blue" />
              ) : (
                <BiLike size={20} />
              )}
              {post?.likes?.length} Likes
            </p>

            <p
              className="flex gap-2 items-center text-base cursor-pointer select-none hover:bg-ascent-3/10 px-3 py-2 rounded-lg"
              onClick={() => {
                setShowComments(showComments === post._id ? null : post._id);
                getComments(post?._id);
              }}
            >
              <BiComment size={20} />
              {post?.comments?.length} Comments
            </p>
            {user?._id === post?.userId && (
              <div
                className="flex gap-1 items-center text-base cursor-pointer select-none hover:bg-ascent-3/10 px-3 py-2 rounded-lg"
                onClick={() => handleDeletePost(post?._id)}
              >
                <MdOutlineDeleteOutline size={20} />
                <span>Delete</span>
              </div>
            )}
          </div>

          {/* {COMMENT} */}

          {showComments === post?._id && (
            <div className="w-full mt-4 border-t border-[#66666645] pt-4">
              <CommentForm
                user={user}
                postid={post?._id}
                getComments={() => getComments(post?._id)}
              />
              {loading ? (
                <Loading />
              ) : comments?.length > 0 ? (
                comments?.map((comment) => (
                  <div className="w-full py-2" key={comment?._id}>
                    <div className="flex gap-3 items-center mb-1">
                      <Link to={"/profile/" + comment?.userId?._id}>
                        <img
                          src={comment?.user?.profileUrl ?? NoProfile}
                          alt={comment?.user?.firstName}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      </Link>
                      <div>
                        <Link to={"/profile/" + comment?.user?._id}>
                          <p className="font-medium text-base text-ascent-1">
                            {comment?.user?.firstName} {comment?.user?.lastName}
                          </p>
                        </Link>
                        <span className="text-ascent-2 text-sm">
                          {moment(comment?.createdAt ?? "2023-05-25").fromNow()}
                        </span>
                      </div>
                    </div>

                    <div className="ml-12">
                      <p className="text-ascent-2">{comment?.comment}</p>
                      <div className="mt-2 flex gap-6">
                        <p
                          className="flex gap-2 items-center text-base
                    text-ascent-2 cursor-pointer"
                          onClick={() =>
                            handleLike("/posts/like-comment/" + comment?._id)
                          }
                        >
                          {" "}
                          {comment?.likes?.includes(user?._id) ? (
                            <BiSolidLike size={20} color="blue" />
                          ) : (
                            <BiLike size={20} />
                          )}
                          {comment?.likes?.length} Likes
                        </p>
                        <span
                          onClick={() => setReplyComments(comment?._id)}
                          className="text-blue cursor-pointer"
                        >
                          Reply
                        </span>
                      </div>

                      {replyComments === comment?._id && (
                        <CommentForm
                          user={user}
                          postid={post?._id}
                          id={comment?._id}
                          replyAt={comment?.user?.lastName}
                          getComments={() => getComments(post?._id)}
                        />
                      )}
                    </div>

                    {/* {REPLIES} */}
                    <div className="py-2 px-8 mt-6">
                      {comment?.replies?.length > 0 && (
                        <p
                          className="text-base text-ascent-1 cursor-pointer"
                          onClick={() =>
                            setshowReply(
                              showReply === comment?.replies?._id
                                ? 0
                                : comment?.replies?._id
                            )
                          }
                        >
                          Show Replies ({comment?.replies?.length})
                        </p>
                      )}
                      {showReply === comment?.replies?._id &&
                        comment?.replies?.map((reply) => (
                          <ReplyCard
                            reply={reply}
                            user={user}
                            key={reply?._id}
                            handleLike={
                              () => {}
                              // handleLike(
                              //   "/posts/like-comment/" +
                              //     comment?._id +
                              //     "/" +
                              //     reply?._id
                              // )
                            }
                          />
                        ))}
                    </div>
                  </div>
                ))
              ) : (
                <span className="flex text-sm py-4 text-ascent-2 text-center">
                  No comments, be first to comment
                </span>
              )}
            </div>
          )}
        </div>
      )}
      {/* {editp && <Editpost onClick={()=>{setEditp(!editp)} }/>} */}

      {/* {editp && (
        <Editpost
          post={post}
          setPost={handleupdatepost}
          onClick={() => {
            setEditp(!editp);
          }}
        />
      )}
       */}
      {editp && (
        <NewEdit
          post={post}
          setPost={handleupdatepost}
          onClick={() => {
            setEditp(!editp);
          }}
        />
      )}
      {reportdetail && <ReportCard post={post} handlerp={handlerfpdetail} />}
    </div>
  );
};

export default PostCard;
