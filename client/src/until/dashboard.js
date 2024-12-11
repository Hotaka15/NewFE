import axios from "axios";

const API_URL = process.env.REACT_APP_UR_STAT_PORT;
console.log(API_URL);

export const API = axios.create({
  baseURL: API_URL,
  responseType: "json",
});

const API_URLP = process.env.REACT_APP_UR_STAT_POST_PORT;
console.log(API_URLP);

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

    return res;
  } catch (error) {
    console.log(error);
  }
};
export const monthregisterDashboard = async (filter) => {
  try {
    const res = await dbapiRequest({
      url: `/stat/registration-stats?timePeriod=${filter}`,
    });

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

    return res;
  } catch (error) {
    console.log(error);
  }
};
export const dayreportDashboard = async (filter) => {
  try {
    const res = await dbapiRequestP({
      url: `/stat/reports-by-date?groupBy=${filter}`,
    });

    return res;
  } catch (error) {
    console.log(error);
  }
};
