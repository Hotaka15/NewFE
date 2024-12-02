import axios from "axios";

const API_URL = "http://localhost:3001/api";

export const API = axios.create({
  baseURL: API_URL,
  responseType: "json",
});

const API_URLP = "http://localhost:3002/api";

export const APIp = axios.create({
  baseURL: API_URLP,
  responseType: "json",
});

export const dbapiRequestP = async ({ url, token, data, method }) => {
  try {
    // console.log(url, token, data, method);
    const result = await APIp(url, {
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

export const dbapiRequest = async ({ url, token, data, method }) => {
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

export const ageDashboard = async () => {
  try {
    const res = await dbapiRequest({
      url: "/stat/age-stats",
    });
    console.log(res);
    return res;
  } catch (error) {
    console.log(error);
  }
};
export const genderDashboard = async () => {
  try {
    const res = await dbapiRequest({
      url: "/stat/gender-stats",
    });
    console.log(res);
    return res;
  } catch (error) {
    console.log(error);
  }
};
export const monthregisterDashboard = async () => {
  try {
    const res = await dbapiRequest({
      url: "/stat/registration-stats?timePeriod=month",
    });
    console.log(res);
    return res;
  } catch (error) {
    console.log(error);
  }
};
export const userDashboard = async () => {
  try {
    const res = await dbapiRequest({
      url: "/stat/user-stats",
    });
    console.log(res);
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const reportsbyreasonDashboard = async () => {
  try {
    const res = await dbapiRequestP({
      url: "/stat/reports-by-reason",
    });
    console.log(res);
    return res;
  } catch (error) {
    console.log(error);
  }
};
export const reportsbypostDashboard = async () => {
  try {
    const res = await dbapiRequestP({
      url: "/stat/reports-by-post",
    });
    console.log(res);
    return res;
  } catch (error) {
    console.log(error);
  }
};
export const dayreportDashboard = async () => {
  try {
    const res = await dbapiRequestP({
      url: "/stat/reports-by-date?groupBy=month",
    });
    console.log(res);
    return res;
  } catch (error) {
    console.log(error);
  }
};
