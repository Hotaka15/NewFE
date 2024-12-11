import axios from "axios";

const API_URL = process.env.REACT_APP_UR_GROUP_PORT;
console.log(API_URL);

export const API = axios.create({
  baseURL: API_URL,
  responseType: "json",
});

export const groupapiRequest = async ({ url, token, data, method }) => {
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
    // console.log("result");
    // console.log(result);

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

    return res;
  } catch (error) {
    console.log(error);
  }
};

export const changeRoleGroup = async (token, idroom, id_1, id_2, role) => {
  try {
    const res = await groupapiRequest({
      url: "/change-role",
      token: token,
      data: {
        adminId: id_1,
        conversationId: idroom,
        memberId: id_2,
        newRole: role,
      },
      method: "PUT",
    });

    return res;
  } catch (error) {
    console.log(error);
  }
};

export const addMemberGroup = async (token, id_1, idroom, listAdd) => {
  try {
    const res = await groupapiRequest({
      url: "/add-member",
      token: token,
      data: {
        userId: id_1,
        groupId: idroom,
        newMembers: listAdd,
      },
      method: "POST",
    });

    return res;
  } catch (error) {
    console.log(error);
  }
};

export const deleteMemberGroup = async (token, idroom, id_1, id_2) => {
  try {
    const res = await groupapiRequest({
      url: "/remove-member",
      token: token,
      data: {
        adminId: id_1,
        conversationId: idroom,
        memberId: id_2,
      },
      method: "DELETE",
    });

    return res;
  } catch (error) {
    console.log(error);
  }
};
