import axios from "axios";
import { SetPosts } from "../redux/postSlice";

const API_URL = "http://localhost:3002/api/posts";

export const API = axios.create({
  baseURL: API_URL,
  responseType: "json",
});

export const postapiRequest = async ({ url, token, data, method }) => {
  try {
    console.log(url, token, data, method);
    const result = await API(url, {
      method: method || "GET",
      data: data,
      headers: {
        "content-type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
    });
    console.log(result);

    return result?.data;
  } catch (error) {
    const err = error.response.data;

    console.log(err);

    return { status: err.status, message: err.message };
  }
};

export const postfetchPosts = async (token, dispatch, limit) => {
  // console.log("Data: " + data);
  console.log(limit);

  try {
    const res = await postapiRequest({
      // url: limit ? "/newsfeed?page=1&limit=" + limit : "/newsfeed",
      url: "/newsfeed",
      token: token,
      method: "GET",
    });
    console.log(res);
    console.log(typeof res?.data?.latestPosts);

    dispatch(SetPosts(res?.data?.latestPosts));
    return;
  } catch (error) {
    console.log(error);
  }
};

export const postedit = async (postId, token, newData) => {
  console.log(postId, token, newData);

  try {
    const res = await postapiRequest({
      url: postId,
      token: token,
      data: newData,
      method: "PUT",
    });
    console.log(res);
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const postreason = async (_id, token, data) => {
  console.log(data);
  console.log(_id);

  try {
    const res = await postapiRequest({
      url: _id + "/report",
      token: token,
      data: data,
      method: "POST",
    });
    console.log(res);
  } catch (error) {
    console.log(error);
  }
};

export const postfetchuserPosts = async (token, user, dispatch, uri, data) => {
  // console.log(token, user, dispatch, uri, data);
  const userId = user?._id;
  try {
    const res = await postapiRequest({
      url: "/user/" + userId,
      token: token,
      user: user,
      method: "GET",
      data: data || {},
    });
    console.log(res);
    dispatch(SetPosts(res));
    return;
  } catch (error) {
    console.log(error);
  }
};

export const postlikePost = async ({ uri, token }) => {
  try {
    console.log(uri);

    const res = await postapiRequest({
      url: uri,
      token: token,
      method: "PUT",
    });
    console.log(res);
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const postdeletePost = async (id, token) => {
  try {
    const res = await postapiRequest({
      url: id,
      token: token,
      method: "DELETE",
    });
    return;
  } catch (error) {
    console.log(error);
  }
};

export const postsearchfetchPosts = async (token, dispatch, uri, data) => {
  // console.log("Data: " + data);
  try {
    const res = await postapiRequest({
      url: "/search?keyword=" + data,
      token: token,
      method: "GET",
      data: data || {},
    });
    console.log(res);
    dispatch(SetPosts(res?.posts));
    return;
  } catch (error) {
    console.log(error);
  }
};
