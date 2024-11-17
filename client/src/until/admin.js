import axios from "axios";

const API_URL = "http://localhost:3001/api/admin";

export const API = axios.create({
  baseURL: API_URL,
  responseType: "json",
});

export const adminapiRequest = async ({ url, token, data, method }) => {
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

export const admingetlistUser = async ({ token }) => {
  console.log(token);

  try {
    const res = await adminapiRequest({
      url: "/users",
      token: token,
    });
    // console.log(res);
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const admingetPostreport = async (token) => {
  console.log(token);

  try {
    const res = await adminapiRequest({
      url: "/reported/posts",
      token: token,
    });
    // console.log(res);
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const adminaprrovePostreport = async (token, postid) => {
  console.log(token);

  try {
    const res = await adminapiRequest({
      url: `/${postid}` + "/approve",
      token: token,
      method: "POST",
    });
    console.log(res);
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const admindeletePostreport = async (token, postid) => {
  console.log(token);

  try {
    const res = await adminapiRequest({
      url: `/${postid}` + "/delete-violate",
      token: token,
      method: "POST",
    });
    console.log(res);
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const admindeleteUser = async ({ token, userId }) => {
  console.log(userId);

  try {
    const res = await adminapiRequest({
      url: "/users/" + userId,
      token: token,
      method: "DELETE",
    });
    console.log(res);
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const admingetUserId = async ({ token, userId }) => {
  console.log(userId);

  try {
    const res = await adminapiRequest({
      url: "/users/" + userId,
      token: token,
      method: "GET",
    });
    console.log(res);
    return res;
  } catch (error) {
    console.log(error);
  }
};
