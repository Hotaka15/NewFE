import axios from "axios";

const API_URL = "http://localhost:3001/api/users";

export const API = axios.create({
  baseURL: API_URL,
  responseType: "json",
});

export const userapiRequest = async ({ url, token, data, method }) => {
  try {
    // console.log(url, token, data, method);
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

export const usergetUserInfo = async (token, id) => {
  try {
    //console.log(id);
    //console.log(token);
    // const uri = id === undefined ? "/users/get-user" : "/users/get-user/" + id;
    const uri = id;
    // console.log(token);
    // console.log(uri);
    const res = await userapiRequest({
      url: uri,
      token: token,
      method: "GET",
    });
    console.log(res);
    if (res?.message === "Authetication fail") {
      localStorage.removeItem("user");
      window.alert("User session expired .Login again");
      window.location.replace("/login");
    }

    return res;
  } catch (error) {
    console.log(error);
  }
};

export const usergetUserpInfo = async (token, id) => {
  try {
    //console.log(id);
    //console.log(token);
    // const uri = id === undefined ? "/users/get-user" : "/users/get-user/" + id;
    const uri = `${id}`;
    // console.log(token);
    // console.log(uri);
    const res = await userapiRequest({
      url: uri,
      token: token,
      method: "GET",
    });
    if (res?.message === "Authetication fail") {
      localStorage.removeItem("user");
      window.alert("User session expired .Login again");
      window.location.replace("/login");
    }
    // console.log(res);

    return res;
  } catch (error) {
    console.log(error);
  }
};

export const userfriendSuggest = async (token, user) => {
  // console.log(token);

  try {
    const res = await userapiRequest({
      url: "/suggested-friends",
      token: token,
      user: user,
      method: "GET",
    });

    // console.log(res);
    return res;
  } catch (error) {
    console.log(error);
  }

  return;
};

export const searchUserName = async (token, search) => {
  try {
    const res = await userapiRequest({
      url: "/search?keyword=" + search,
      token: token,
      method: "GET",
    });

    // console.log(res);
    return res;
  } catch (error) {
    console.log(error);
  }

  return;
};

export const usergetFriends = async (token) => {
  try {
    const res = await userapiRequest({
      url: "/friends",
      token: token,
      method: "POST",
    });

    // console.log(res);
    return res;
  } catch (error) {
    console.log(error);
  }

  return;
};

export const useracceptFriendRequest = async (
  token,
  requestId,
  user,
  status
) => {
  console.log(token, requestId, user, status);
  const newdata = { requestId: requestId, newStatus: status };
  try {
    const res = await userapiRequest({
      url: "/friend-request",
      token: token,
      data: newdata,
      method: "PUT",
    });
    // console.log(res);
    return;
  } catch (error) {
    console.log(error);
  }
};

export const usersendFriendRequest = async (token, id) => {
  try {
    const res = await userapiRequest({
      url: "/friend-request/" + id,
      token: token,
      method: "POST",
    });
    // console.log(res);
    return res;
  } catch (error) {
    console.log(error);
  }
};
