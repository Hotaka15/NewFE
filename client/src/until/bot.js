// /ai-assist/ai-process?prompt=thiết kế banber quảng cáo điện thoại
import axios from "axios";

const API_URL = "http://localhost:4000";

export const API = axios.create({
  baseURL: API_URL,
  responseType: "json",
});

export const botapiRequest = async ({ url, data, method }) => {
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

export const botsuggestRequest = async (prompt) => {
  console.log(prompt);

  try {
    const res = await botapiRequest({
      url: `/ai-assist/ai-process?prompt=thiết kế banber quảng cáo điện thoại `,
      method: "GET",
      data: {},
    });
    return res;
  } catch (error) {
    console.log(error);
  }
};
