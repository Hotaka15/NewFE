import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminaprrovePostreport, admingetPostreport } from "../until/admin";
import Loading from "./Loading";
import { postapiRequest } from "../until/post";
import { usergetUserpInfo } from "../until/user";
const Rowtb = ({ report, user, fetchReport }) => {
  const nevigate = useNavigate();
  const [getreport, setGetreport] = useState();
  const handlereportapprove = async (postid) => {
    const res = await adminaprrovePostreport(user?.token, postid);
    fetchReport();
    console.log(res);
  };

  const handlereportdelete = async (postid) => {
    const res = await adminaprrovePostreport(user?.token, postid);
    fetchReport();
    console.log(res);
  };

  //   const fetchReport = async () => {
  //     console.log(user);

  //     const res = await admingetPostreport(user?.token);
  //     console.log(res);
  //     const getpost = setListreport(res);
  //     setLoading(false);
  //   };

  const getUser = async (userId) => {
    try {
      const res = await usergetUserpInfo(user?.token, userId);
      console.log(res);
      return res;
    } catch (error) {
      console.log(error);
    }
  };

  const getPost = async (_id) => {
    try {
      const res = await postapiRequest({
        url: `/${_id}`,
        token: user?.token,
        method: "GET",
      });
      console.log(res);
      const userpost = await getUser(res?.userId);

      setGetreport({
        userId: res?.userId,
        createdAt: res?.createdAt.split("T")[0],
        username: userpost?.firstName,
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getPost(report.postId);
  }, []);
  return (
    <tr key={report.postId}>
      <th
        onClick={() => {
          nevigate(`/post/${report.postId}`);
        }}
        className="border border-[#66666645] py-2 px-3 underline underline-offset-2 cursor-pointer"
      >
        {report.postId}
      </th>
      <th className="border border-[#66666645] py-2 px-3">
        {report.reportCount}
      </th>
      <th className="border border-[#66666645] py-2 px-3 text-wrap">
        {report && report.reasons.map((rp) => rp + ", ")}
      </th>
      <th className="select-none  border border-[#66666645] py-2 px-3">
        <div className="flex justify-center gap-2">
          <div
            onClick={() => {
              handlereportapprove(report.postId);
            }}
            className="px-4 rounded-lg py-1 bg-blue cursor-pointer text-white"
          >
            Approve
          </div>
          <div
            onClick={() => {
              handlereportdelete(report.postId);
            }}
            className="px-4 rounded-lg py-1 bg-[#ff0015b2] cursor-pointer text-white"
          >
            Delete
          </div>
        </div>
      </th>
    </tr>
  );
};

export default Rowtb;
