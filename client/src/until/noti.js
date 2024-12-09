import axios from "axios";

const API_URL = `http://localhost:${process.env.REACT_APP_NOTI_PORT}/api/notifi`;

export const API = axios.create({
  baseURL: API_URL,
  responseType: "json",
});

export const notiapiRequest = async ({ url, token, data, method }) => {
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
    // console.log(result);

    return result?.data;
  } catch (error) {
    const err = error.response.data;

    console.log(err);

    return { status: err.status, message: err.message };
  }
};

export const notifetchNotifications = async ({
  token,
  dispatch,
  userId,
  data,
}) => {
  // console.log(token, userId);

  try {
    const res = await notiapiRequest({
      url: "",
      token: token,
      method: "GET",
      data: data || {},
    });
    // console.log(res);
    //dispatch(SetPosts(res?.data));
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const notireadNotifications = async ({ token, _id }) => {
  console.log(_id);

  try {
    const res = await notiapiRequest({
      url: `/${_id}/read`,
      token: token,
      method: "PUT",
      data: {},
    });
    // console.log(res);
    //dispatch(SetPosts(res?.data));
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const notideleteNotifications = async ({ token, _id }) => {
  console.log(_id);

  try {
    const res = await notiapiRequest({
      url: `/${_id}`,
      token: token,
      method: "DELETE",
      data: {},
    });
    // console.log(res);
    //dispatch(SetPosts(res?.data));
    return res;
  } catch (error) {
    console.log(error);
  }
};
