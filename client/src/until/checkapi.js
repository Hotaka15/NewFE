import axios from "axios";

const API_URL = "https://api.linkpreview.net/";
const API_SAFE = "https://www.virustotal.com/api/v3/urls";
export const API = axios.create({
  baseURL: API_URL,
  responseType: "json",
});

export const APIs = axios.create({
  baseURL: API_SAFE,
  responseType: "json",
});
export const authsafeRequest = async ({ url }) => {
  try {
    console.log(url);

    const key = process.env.REACT_APP_LINK_VIRUSTOTAL_ID;
    const result = await APIs({
      method: "POST",
      headers: {
        accept: "application/json",
        "x-apikey": key,
        "content-type": "application/x-www-form-urlencoded",
      },
      data: new URLSearchParams({ url: url }),
    });
    console.log(result);
    return result;
  } catch (error) {
    console.log(error);
  }
};
export const authcheckRequest = async ({ url, method }) => {
  try {
    console.log(url, method);

    const key = process.env.REACT_APP_LINK_PREVIEW_ID;
    const result = await API(url, {
      method: method || "GET",
      headers: { "X-Linkpreview-Api-Key": key },
    });
    console.log(result?.data);
    return result?.data;
  } catch (error) {
    console.log(error);
  }
};

export const checklink = async (url) => {
  console.log(url);
  try {
    const res = await authcheckRequest({
      url: `/?q=${url}`,
      method: "GET",
    });
    console.log(res);

    return res;
  } catch (error) {
    console.log(error);
  }
};

export const checksafelink = async (url) => {
  console.log(url);
  try {
    console.log(id);
    const opkey = "7b201b61-975f-4d83-b16d-e3c71e697219";
    const res = await authsafeRequest({
      url: url,
    });
    console.log(res);

    return res.status;
  } catch (error) {
    console.log(error);
  }
  // const options = {
  //   method: "POST",
  //   headers: {
  //     accept: "application/json",
  //     "x-apikey":
  //       "c313493540156576e5ff26d3de682b86d22005ae9e4983f4689249657862a8d2",
  //     "content-type": "application/x-www-form-urlencoded",
  //   },
  //   data: new URLSearchParams({ url: url }).toString(),
  // };

  // const res = await axios("https://www.virustotal.com/api/v3/urls", options)
  //   .then((res) => res)
  //   .then((res) => console.log(res))
  //   .catch((err) => console.error(err));

  // console.log(res);
};
