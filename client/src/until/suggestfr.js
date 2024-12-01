import axios from "axios";

const API_URL = "http://localhost:3009/api/users";

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

export const smartapiRequest = async ({ url, data, method }) => {
  try {
    console.log(data, method);
    const result = await API(url, {
      method: method || "GET",
      data: data,
    });
    console.log(result);

    return result?.data;
  } catch (error) {
    const err = error;

    console.log(err);
  }
};

export const generatetext = async (prompt) => {
  try {
    const data = { prompt: prompt };
    console.log(data);

    const res = await smartapiRequest({
      url: "/generate-text",
      data: data || {},
      method: "POST",
    });
    console.log(res);
  } catch (error) {
    console.log(error);
  }
};
