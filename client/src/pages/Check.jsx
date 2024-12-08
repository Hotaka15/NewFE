import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { checksafelink } from "../until/checkapi";
import { Loading } from "../components";
import { TailSpin } from "react-loader-spinner";
import { after } from "lodash";
import { useTranslation } from "react-i18next";
const Check = () => {
  const [searchParams] = useSearchParams();
  const url = searchParams.get("url");
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkLink(url);
  }, []);
  return (
    <div className="w-screen h-screen bg-[#000000] flex items-center justify-center">
      {notSafe && (
        <div className="text-ascent-2 w-1/6 h-1/5 border border-ascent-2 rounded-xl flex flex-col px-3 py-4">
          <div className="w-full flex items-center justify-center h-full text-xl font-bold">
            {t("The link address is not safe.")}
          </div>
          <div className="py-2 flex items-center justify-center bg-ascent-3/30 rounded-md">
            <a href={url}>{t("Do you want to continue?")}</a>
          </div>
        </div>
      )}

      {loading && (
        <TailSpin
          visible={true}
          height="80"
          width="80"
          color="blue"
          ariaLabel="tail-spin-loading"
          radius="1"
          wrapperStyle={{}}
          wrapperClass=""
        />
      )}
      {/* {notSafe && (
        <div>
          The{" "}
          <a className="text-blue underline " href={url}>
            link
          </a>{" "}
          is not safe.
        </div>
      )} */}
    </div>
  );
};

export default Check;
