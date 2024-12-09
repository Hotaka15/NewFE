import React, { useState } from "react";
import { postfetchPosts } from "../until/post";
import { useDispatch, useSelector } from "react-redux";

const Postrange = () => {
  const { posts } = useSelector((state) => state.posts);
  const [page, setpage] = useState(1);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const fetchPost = async () => {
    try {
      await postfetchPosts(user?.token, dispatch, page);
      //   setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="">
      {/* {posts?.length > 0 ? (
        posts?.map((post) => (
          <PostCard
            key={post._id}
            posts={post}
            user={user}
            deletePost={handleDeletePost}
            likePost={handleLikePost}
          />
        ))
      ) : (
        <div className="flex w-full h-full items-center justify-center">
          <p className="text-lg text-ascent-2">No Post Available</p>
        </div>
      )} */}
    </div>
  );
};
export default Postrange;
