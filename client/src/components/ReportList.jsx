import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminaprrovePostreport, admingetPostreport } from "../until/admin";
import Loading from "./Loading";
const Reportlist = ({ user, sl }) => {
  const nevigate = useNavigate();
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
  console.log(listreport);
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
    console.log(res);
    setListreport(res);
    setLoading(false);
  };
  useEffect(() => {
    fetchReport();
  }, []);
  return (
    <div className="px-4 py-2 h-full overflow-x-auto">
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
                id Post
              </th>
              <th className="border border-ascent-1 bg-[#66666645] py-1 px-4">
                Report count
              </th>
              <th className="border border-ascent-1 bg-[#66666645] py-1 px-4">
                Reasson
              </th>
              <th className="border border-ascent-1 bg-[#66666645] py-1 px-4">
                Action
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
              listreport.slice(0, 5).map((report) => (
                <tr>
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
              ))}
            {!sl &&
              listreport &&
              listreport.map((report) => (
                <tr>
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
              ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Reportlist;
