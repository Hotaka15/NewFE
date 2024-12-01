import axios from "axios";

const API_URL = "https://api.linkpreview.net/";

export const API = axios.create({
  baseURL: API_URL,
  responseType: "json",
});

export const authcheckRequest = async ({ url, method }) => {
  try {
    console.log(url, method);
    const key = "4954b1608026ae14178a4061b0d79ce7";
    const opkey = "7b201b61-975f-4d83-b16d-e3c71e697219";
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

// import axios from "axios";

// const API_URL = "https://opengraph.io/api/1.1/site/";

// export const API = axios.create({
//   baseURL: API_URL,
//   responseType: "json",
// });

// export const authcheckRequest = async ({ url, method }) => {
//   try {
//     console.log(url, method);
//     const key = "4954b1608026ae14178a4061b0d79ce7";
//     const opkey = "7b201b61-975f-4d83-b16d-e3c71e697219";
//     const result = await API(url, {
//       method: method || "GET",
//     });
//     console.log(result);
//     // return result;
//   } catch (error) {
//     console.log(error);
//   }
// };

// export const checklink = async (url) => {
//   console.log(url);
//   try {
//     const opkey = "7b201b61-975f-4d83-b16d-e3c71e697219";
//     const res = await authcheckRequest({
//       url: `/${url}/` + opkey,
//       method: "GET",
//     });
//     console.log(res);

//     return res;
//   } catch (error) {
//     console.log(error);
//   }
// };
