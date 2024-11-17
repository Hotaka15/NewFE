import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import {
  CustomButton,
  ImageCheck,
  Loading,
  TextInput,
  TopBar,
} from "../components";
import { apiRequest, deletePost, fetchPosts, likePost } from "../until";
import moment from "moment";
import { useForm } from "react-hook-form";
import { NoProfile } from "../assets";
import { BiComment, BiLike, BiSolidLike } from "react-icons/bi";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { postapiRequest, postdeletePost, postlikePost } from "../until/post";
import { usergetUserInfo, usergetUserpInfo } from "../until/user";

const getPostComments = async (id) => {
  try {
    const res = await apiRequest({
      url: "/posts/comments/" + id,
      method: "GET",
    });

    return res?.data;
  } catch (error) {
    console.log(error);
  }
};

const CommentForm = ({ user, postid, id, replyAt, getComments }) => {
  //console.log(user, id, replyAt, getComments);
  console.log(id);

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
    console.log(data);
    console.log(replyAt);

    setLoading(true);
    setErrMsg("");
    try {
      const URL = !replyAt
        ? `/${postid}/comment/`
        : `/${postid}/comment?commentId=` + id;
      console.log(URL);
      const newData = {
        comment: data?.comment,
        from: user?.firstName + " " + user?.lastName,
        replyAt: replyAt,
      };
      const res = await postapiRequest({
        url: URL,
        data: newData,
        token: user?.token,
        method: "POST",
      });
      console.log(res);

      if (res?.status === "failed") {
        setErrMsg(res);
      } else {
        reset({
          comment: "",
        });
        setErrMsg("");
        await getComments();
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
      {errMsg?.message && (
        <span
          role="alert"
          className={`text-sm ${
            errMsg?.status === "failed"
              ? "text-[#f64949fe]"
              : "text-[#2ba150fe]"
          } mt-0.5`}
        >
          {errMsg?.message}
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
  console.log(reply);

  const [userP, setUserP] = useState();
  const getUser = async () => {
    try {
      const res = await usergetUserInfo(user?.token, reply?.userId);
      console.log(res);

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
            onClick={handleLike}
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

const PostPage = () => {
  const { user, edit } = useSelector((state) => state.user);
  const { id } = useParams();
  const [post, setPost] = useState();
  const [showAll, setShowAll] = useState(0);
  const [showReply, setshowReply] = useState(0);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [replyComments, setReplyComments] = useState(0);
  const [showComments, setShowComments] = useState(0);
  const [reviewcheck, setReviewcheck] = useState(false);
  const [upost, setUpost] = useState();
  const dispatch = useDispatch();
  const [ploading, setpLoading] = useState(true);

  const fetchPost = async () => {
    try {
      await fetchPosts(user?.token, dispatch);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };
  const handleLike = async (uri) => {
    console.log(uri);
    const token = user?.token;
    await postlikePost({ uri: uri, token: user?.token });
    // await likePost({ uri, token });
    await getPost();
    await getComments(post?._id);
  };

  const handleDeletePost = async (id) => {
    await postdeletePost(id, user?.token);
    // window.location.replace("/");
  };

  const handleLikePost = async (uri) => {
    await postlikePost({ uri: uri, token: user?.token });
    await fetchPost();
  };

  const getPost = async () => {
    try {
      const res = await postapiRequest({
        url: `/${id}`,
        token: user?.token,
        method: "GET",
      });
      getUser(res?.userId);
      setPost(res);

      console.log(res);
      setpLoading(false);
      // if (res?.status === "failed") {
      //     Cookies.set("message", res?.message, { expires: 7 });
      //     navigate("/error");
      //   }
      //   setfriendRequest(res?.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getUser = async (userId) => {
    console.log("post id " + userId);
    try {
      const res = await usergetUserpInfo(user?.token, userId);
      // const newData = { token: user?.token, ...res };
      setUpost(res);
      // dispatch(UserLogin(newData));
      // console.log(res);
    } catch (error) {
      console.log(error);
    }
  };

  const getComments = async (id) => {
    // console.log(id);

    setReplyComments(0);
    try {
      const result = await postapiRequest({
        url: `/${id}/comments`,
        token: user?.token,
      });
      console.log(result);

      setComments(result?.comments);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getPost();
    getComments(id);
  }, []);
  return (
    <div className="">
      {ploading ? (
        <div className="h-screen w-full flex justify-center items-center bg-bgColor">
          <Loading />
        </div>
      ) : (
        <div className="flex">
          <div
            className="home w-full px-0 lg:px-10 py-10 2xl-40 bg-bgColor 
lg:rounded-lg h-screen overflow-hidden"
          >
            {/* <TopBar user={user} /> */}
            <div className="w-full h-full overflow-auto flex justify-center gap-7">
              <div className="h-fit max-h-full bg-primary w-1/2 flex flex-col rounded-lg px-7 py-7 justify-start ">
                <div className="flex gap-3 items-center mb-2">
                  <Link to={"/profilefix/" + upost?._id}>
                    <img
                      src={upost?.profileUrl ?? NoProfile}
                      alt={upost?.firstName}
                      className="w-12 h-12 md:w-14 md:h-14 object-cover rounded-full"
                    />
                  </Link>

                  <div className="w-full flex justify-between overflow-auto">
                    <div className="">
                      <Link to={"/profilefix/" + upost?._id}>
                        <p className="font-medium text-lg text-ascent-1">
                          {upost?.firstName} {upost?.lastName}
                        </p>
                      </Link>
                      <span className="text-ascent-2">{upost?.location}</span>
                      <span className="md:hidden flex text-ascent-2">
                        {moment(post?.createdAt ?? "2023-05-25").fromNow()}
                      </span>
                    </div>

                    <span className="hidden md:flex text-ascent-2">
                      {moment(post?.createdAt ?? "2023-05-25").fromNow()}
                    </span>
                  </div>
                </div>
                <p className="text-ascent-2">{post?.description}</p>
                {post?.image && (
                  <div
                    onClick={() => {
                      setReviewcheck(!reviewcheck);
                    }}
                    className="bg-secondary cursor-pointer rounded-2xl h-full w-full flex grow-0 justify-center items-center overflow-hidden"
                  >
                    <img
                      src={post?.image}
                      alt="post image"
                      className="object-contain mt-2 rounded-lg "
                    ></img>
                  </div>
                )}

                <div
                  className="mt-4 flex justify-between items-center px-3 py-2 
      text-ascent-2 text-base border-t border-[#66666645]"
                >
                  <p
                    className="flex gap-2 items-center text-base cursor-pointer"
                    onClick={() => handleLike(post?._id + "/like")}
                  >
                    {post?.likes?.includes(user?._id) ? (
                      <BiSolidLike size={20} color="blue" />
                    ) : (
                      <BiLike size={20} />
                    )}
                    {post?.likes?.length} Likes
                  </p>

                  {/* <p
                  className="flex gap-2 items-center text-base cursor-pointer"
                  onClick={() => {
                    setShowComments(
                      showComments === post._id ? null : post._id
                    );
                    getComments(post?._id);
                  }}
                >
                  <BiComment size={20} />
                  {post?.comments?.length} Comments
                </p> */}
                  {user?._id === upost?._id && (
                    <Link to={"/"}>
                      <div
                        className="flex gap-1 items-center text-base cursor-pointer"
                        onClick={() => handleDeletePost(post?._id)}
                      >
                        <MdOutlineDeleteOutline size={20} />
                        <span>Delete</span>
                      </div>
                    </Link>
                  )}
                </div>
              </div>
              {/* LEFT */}
              <div className="h-full bg-primary w-1/3  rounded-lg px-7 py-7 gap-7 overflow-auto">
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
                      <div
                        className="w-full py-2 overflow-auto"
                        key={comment?._id}
                      >
                        <div className="flex gap-3 items-center mb-1">
                          <Link to={"/profile/" + comment?.user?._id}>
                            <img
                              src={comment?.user?.profileUrl ?? NoProfile}
                              alt={comment?.user?.firstName}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          </Link>
                          <div>
                            <Link to={"/profile/" + comment?.user?._id}>
                              <p className="font-medium text-base text-ascent-1">
                                {comment?.user?.firstName}{" "}
                                {comment?.user?.lastName}
                              </p>
                            </Link>
                            <span className="text-ascent-2 text-sm">
                              {moment(
                                comment?.createdAt ?? "2023-05-25"
                              ).fromNow()}
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
                                handleLike(
                                  "/posts/like-comment/" + comment?._id
                                )
                              }
                            >
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
                                handleLike={() =>
                                  handleLike(
                                    "/posts/like-comment/" +
                                      comment?._id +
                                      "/" +
                                      reply?._id
                                  )
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
              </div>
            </div>
          </div>

          {reviewcheck && (
            <div className="w-full h-full absolute flex justify-center items-center overflow-hidden">
              {/* <div className="h-full overflow-hidden"> */}
              <ImageCheck
                img={post?.image}
                review={reviewcheck}
                setReview={setReviewcheck}
              />
              {/* </div> */}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PostPage;
