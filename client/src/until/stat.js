import axios from "axios";

const API_URL = `http://localhost:${process.env.REACT_APP_USER_PORT}/api/stat`;
console.log(process.env.REACT_APP_USER_PORT);

export const API = axios.create({
  baseURL: API_URL,
  responseType: "json",
});

export const statapiRequest = async ({ url, token, data, method }) => {
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
