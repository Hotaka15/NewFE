import React, { useEffect, useState } from "react";
import { checklink } from "../until/checkapi";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

export default function LinkPr({ text }) {
  const [pr, setPr] = useState(null);
  const [url, setUrl] = useState("");
  const [imageUrl, setImageUrl] = useState(null);
  const { t } = useTranslation();
  const { user } = useSelector((state) => state.user);
  const fetchurl = async (url) => {
    const res = await checklink(url);
    console.log(res);
    setPr(res);
    // await fetch(`${res?.url}`)
    //   .then((response) => response.json())
    //   .then((data) => {
    //     setImageUrl(data.imageUrl);
    //   })
    //   .catch((error) => console.error("Error fetching image:", error));
    await fetch(`${res?.url}`)
      .then((response) => console.log(response))
      // .then((data) => {
      //   setImageUrl(data.imageUrl);
      // })
      .catch((error) => console.error("Error fetching image:", error));
  };

  const geturl = async (text) => {
    const regex = /https?:\/\/[^\s]+/gi;
    const match = text.match(regex);
    console.log(match);

    await fetchurl(match);
  };

  useEffect(() => {
    geturl(text);
  }, []);

  return (
    <div className="w-full h-fit bg-ascent-3/30  pb-2 cursor-pointer select-none ">
      <div className="min-w-full min-h-7">
        {pr && pr?.url && pr?.image && <img src={pr?.image} className="" />}
      </div>

      <div className="px-2">
        <a
          href={`http://localhost:3000/check?url=` + pr?.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-ascent-1 mx-2 mt-2 underline underline-offset-2 text-wrap"
        >
          {pr?.title.length > 35 ? pr?.title.slice(0, 35) + "..." : pr?.title}
        </a>
      </div>
    </div>
  );
}
