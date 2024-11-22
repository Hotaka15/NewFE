import axios from "axios";

const API_URL = "http://localhost:3007/chat";

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
    const err = error;

    console.log(err.response.data);
    return err.response.data;

    // return { status: err.status, message: err.message };
  }
};

export const chatfetchListpersonal = async (token, userId) => {
  console.log(token, userId);
  try {
    const res = await chatapiRequest({
      url: "/conversations/" + userId,
      token: token,
      method: "GET",
    });
    console.log(res);
    //   dispatch(SetPosts(res?.data?.latestPosts));
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const fetchChat = async (token, id, page) => {
  console.log(id);
  try {
    const res = await chatapiRequest({
      url: `/conversations/${id}/messages?limit=20&page=${page}`,
      token: token,
      method: "GET",
    });
    console.log(res);
    //   dispatch(SetPosts(res?.data?.latestPosts));
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const fetchConversations = async (token, id) => {
  console.log(id);
  try {
    const res = await chatapiRequest({
      url: `/conversations/${id}`,
      token: token,
      method: "GET",
    });
    console.log(res);
    //   dispatch(SetPosts(res?.data?.latestPosts));
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const createConversations = async (token, id_1, id_2) => {
  try {
    const res = await chatapiRequest({
      url: "/message/create",
      token: token,
      data: {
        userIds: `${id_1},${id_2}`,
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

export const sendMessage = async (token, id_1, id_2) => {
  try {
    const res = await chatapiRequest({
      url: "/message/send",
      token: token,
      data: {
        conversationId: "6734929e6630bd00b48b0916",
        senderId: "63c1b5f1e4b0d7ef9a7f3c0d",
        text: "Hello, this is a test message",
        fileUrl: "https://example.com/testfile.png",
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

export const seenMessage = async (token, id_1, id_2) => {
  try {
    const res = await chatapiRequest({
      url: "/message/send",
      token: token,
      data: {
        messageId: "673ca18fe4f3f5028188065e",
        userId: "63c1b5f1e4b0d7ef9a7f3c0e",
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
