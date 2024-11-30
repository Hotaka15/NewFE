import axios from "axios";

const API_URL = "http://localhost:3007/group";

export const API = axios.create({
  baseURL: API_URL,
  responseType: "json",
});

export const groupapiRequest = async ({ url, token, data, method }) => {
  console.log(data);

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
    const err = error;

    console.log(err.response.data);
    return err.response.data;

    // return { status: err.status, message: err.message };
  }
};

export const createGroup = async (
  token,
  userId,
  name,
  description,
  listAdd
) => {
  try {
    const res = await groupapiRequest({
      url: "/",
      token: token,
      data: {
        userId: userId,
        groupName: name,
        groupDescription: description,
        isPrivate: false,
        members: listAdd,
      },
      method: "POST",
    });
    console.log(res);
    //   dispatch(SetPosts(res?.data?.latestPosts));
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const sendMessageGroup = async (token, idroom, id_1, chat, uri) => {
  try {
    const res = await groupapiRequest({
      url: "/message/group",
      token: token,
      data: {
        conversationId: idroom,
        senderId: id_1,
        text: chat,
        fileUrl: uri || "",
      },
      method: "POST",
    });
    console.log(res);

    return res;
  } catch (error) {
    console.log(error);
  }
};
