import axios from "axios";

const API_URL = "http://localhost:3008";

export const API = axios.create({
  baseURL: API_URL,
  responseType: "json",
});

export const aiapiRequest = async ({ url, data, method }) => {
  try {
    console.log(url, data, method);
    const result = await API(url, {
      method: method || "GET",
      data: data || {},
    });
    console.log(result);

    return result;
  } catch (error) {
    const err = error;

    console.log(err);

    return { status: err.status, message: err.message };
  }
};

export const aicheckpost = async (data) => {
  console.log(data);
  const text = data?.description;
  const image_url = data?.image;
  try {
    const res = await aiapiRequest({
      url: `/check-post`,
      method: "POST",
      data: {
        text: text || "",
        image_url: image_url || "",
      },
    });
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const aichecktext = async (chat) => {
  console.log(chat);
  const text = chat;
  try {
    const res = await aiapiRequest({
      url: `/check-text`,
      method: "POST",
      data: {
        text: text || "",
      },
    });
    console.log(res);

    return res?.data?.sensitive;
  } catch (error) {
    console.log(error);
  }
};
