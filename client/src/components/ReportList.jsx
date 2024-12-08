import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminaprrovePostreport, admingetPostreport } from "../until/admin";
import Loading from "./Loading";
import { postapiRequest } from "../until/post";
import { usergetUserpInfo } from "../until/user";
import Rowtb from "./Rowtb";
import { useTranslation } from "react-i18next";
const Reportlist = ({ user, sl }) => {
  const nevigate = useNavigate();
  const { t } = useTranslation();
  const id = "67276cedbdf484bf88585a44";
  const [loading, setLoading] = useState(true);
  // const [listreport, setListreport] = useState([
  //   { id: "67276cedbdf484bf88585a44", count: 1, reason: "Spam" },
  //   { id: "67261c2ba0c876b170186b2b", count: 2, reason: "Spam" },
  //   { id: "6724d5c9dca650ec9293aed4", count: 1, reason: "Spam" },
  //   { id: "66f81e5ddc7ab3ee5796d862", count: 1, reason: "Spam" },
  //   { id: "6703badf08b250a11183a7b7", count: 1, reason: "Spam" },
  //   { id: "67010eaa85310d03039570f4", count: 1, reason: "Spam" },
  // ]);
  const [listreport, setListreport] = useState([]);
  // console.log(listreport);
  // const handlereport = (idreport) => {
  //   console.log(idreport);

  //   let list = [...listreport];

  //   list = list.filter((report) => {
  //     return report.id != idreport;
  //   });

  //   setListreport(list);
  // };

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

  const fetchReport = async () => {
    console.log(user);

    const res = await admingetPostreport(user?.token);
    const getdetal = res && (await getDetail(res));
    console.log(getdetal);

    console.log(res);
    setListreport(getdetal);
    setLoading(false);
  };

  const getDetail = async (res) => {
    const get =
      res &&
      (await Promise.all(
        res.map(async (resp) => {
          const getPostDetail = await getPost(resp?.postId);
          console.log(getPostDetail);

          return {
            ...resp,
            ...getPostDetail,
          };
        })
      ));
    return get;
  };

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

      return {
        userId: res?.userId,
        createdAt: res?.createdAt?.split("T")[0],
        username: userpost?.firstName,
      };
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchReport();
  }, []);
  return (
    <div className="px-4 py-2 h-full w-full overflow-x-auto">
      {loading ? (
        <div className="w-full h-full">
          <Loading />
        </div>
      ) : (
        <table className=" w-full gap-10 border  border-[#66666645] border-spacing-2 border-separate">
          {/* <caption class="caption-top">List Report.</caption> */}
          <thead className="text-ascent-1">
            <tr>
              <th className="border border-ascent-1 bg-[#66666645] py-1 px-4 ">
                Id
              </th>
              <th className="border border-ascent-1 bg-[#66666645] py-1 px-4">
                {t("Report count")}
              </th>
              <th className="border border-ascent-1 bg-[#66666645] py-1 px-4">
                {t("Reasson")}
              </th>
              <th className="border border-ascent-1 bg-[#66666645] py-1 px-4">
                {t("Action")}
              </th>
            </tr>
          </thead>
          <tbody className="text-ascent-1">
            {/* <tr>
            <th
              onClick={() => {
                nevigate(`/post/${id}`);
              }}
              className="border border-ascent-2 py-2"
            >
              {id}
            </th>
            <th className="border border-ascent-2 py-2">1</th>
            <th className="border border-ascent-2 py-2">Spam</th>
            <th className="select-none flex justify-center gap-2 border border-ascent-2 py-2">
              <div className="px-4 rounded-lg py-1 bg-blue cursor-pointer">
                Hold
              </div>
              <div className="px-4 rounded-lg py-1 bg-[#ff0015b2] cursor-pointer">
                Delete
              </div>
            </th>
          </tr> */}
            {sl &&
              listreport &&
              listreport.slice(0, 4).map((report) => {
                // const res = await getPost(report.postId);
                // console.log(res);

                return (
                  // <Rowtb
                  //   report={report}
                  //   user={user}
                  //   fetchReport={fetchReport}
                  // />
                  <tr key={report.postId}>
                    <th
                      onClick={() => {
                        nevigate(`/post/${report.postId}`);
                      }}
                      className="border border-[#66666645] py-2 px-3  cursor-pointer w-1/5"
                      // underline underline-offset-2
                    >
                      {/* {report.postId}  */}
                      {report.username} <br />
                      {t("Create At")}: {report.createdAt}
                    </th>
                    <th className="border border-[#66666645] py-2 px-3 w-1/12">
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
                          {t("Approve")}
                        </div>
                        <div
                          onClick={() => {
                            handlereportdelete(report.postId);
                          }}
                          className="px-4 rounded-lg py-1 bg-[#ff0015b2] cursor-pointer text-white"
                        >
                          {t("Delete")}
                        </div>
                      </div>
                    </th>
                  </tr>
                );
              })}
            {!sl &&
              listreport &&
              listreport.map((report) => (
                <tr>
                  <th
                    onClick={() => {
                      nevigate(`/post/${report.postId}`);
                    }}
                    className="border border-[#66666645] py-2 px-3 underline underline-offset-2 cursor-pointer w-1/5"
                  >
                    {/* {report.postId} */}
                    {report.username} <br />
                    {t("Create At")}: {report.createdAt}
                  </th>
                  <th className="border border-[#66666645] py-2 px-3 w-1/12">
                    {report.reportCount}
                  </th>
                  <th className="border border-[#66666645] py-2 px-3 text-wrap  ">
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
                        {t("Approve")}
                      </div>
                      <div
                        onClick={() => {
                          handlereportdelete(report.postId);
                        }}
                        className="px-4 rounded-lg py-1 bg-[#ff0015b2] cursor-pointer text-white"
                      >
                        {t("Delete")}
                      </div>
                    </div>
                  </th>
                </tr>
              ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Reportlist;
