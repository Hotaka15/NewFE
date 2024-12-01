import React, { useEffect, useState } from "react";
import { checklink } from "../until/checkapi";
import { useSelector } from "react-redux";

export default function LinkPr({ text }) {
  const [pr, setPr] = useState(null);
  const [url, setUrl] = useState("");
  const [imageUrl, setImageUrl] = useState(null);
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
    // fetchurl("https://www.youtube.com/watch?v=DldSLwMeJpM");
  }, []);

  return (
    <div className="w-full h-fit bg-secondary rounded-xl pb-2 cursor-pointer select-none">
      {/* <div className="">{pr?.url && <img src={pr?.url} alt={pr?.url} />}</div> */}

      <div className="">
        <a
          href={pr?.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-ascent-1 mx-2 mt-2 underline underline-offset-2"
        >
          {pr?.title}
        </a>
      </div>
    </div>
  );
}
