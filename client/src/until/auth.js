import axios from "axios";

const API_URL = "http://localhost:3003/api/auth";

export const API = axios.create({
  baseURL: API_URL,
  responseType: "json",
});

export const authapiRequest = async ({ url, token, data, method }) => {
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
