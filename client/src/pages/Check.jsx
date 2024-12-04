import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { checksafelink } from "../until/checkapi";

const Check = () => {
  const [searchParams] = useSearchParams();
  const url = searchParams.get("url");
  console.log(url);
  const [notSafe, setNotSafe] = useState(false);
  const checkLink = async (url) => {
    try {
      const res = await checksafelink(url);
      console.log(res);
      if (res == 200) {
        console.log(1);

        window.location.href = url;
      } else {
        setNotSafe(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    checkLink(url);
  }, []);
  return (
    <div>
      {notSafe && (
        <div>
          The{" "}
          <a className="text-blue underline " href={url}>
            link
          </a>{" "}
          is not safe.
        </div>
      )}
    </div>
  );
};

export default Check;
