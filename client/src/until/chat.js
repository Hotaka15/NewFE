import axios from "axios";

const API_URL = "http://localhost:3005/api/chat/message";

export const API = axios.create({
  baseURL: API_URL,
  responseType: "json",
});

export const chatapiRequest = async ({ url, token, data, method }) => {
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
    console.log("result");
    console.log(result);

    return result;
  } catch (error) {
    const err = error.response.data;

    console.log(err);

    return { status: err.status, message: err.message };
  }
};

export const chatfetchList = async (token, userId, data) => {
  console.log(token, userId, data);
  try {
    const res = await chatapiRequest({
      url: "/conversations/" + userId,
      token: token,
      method: "GET",
      data: data || {},
    });
    console.log(res);
    //   dispatch(SetPosts(res?.data?.latestPosts));
    return res;
  } catch (error) {
    console.log(error);
  }
};
