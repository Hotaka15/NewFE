import React, { useEffect, useState } from "react";
import { DefaultPlayer as Video } from "react-html5video";
import "react-html5video/dist/styles.css";
import { useTranslation } from "react-i18next";
const VideoPlayer = ({ source }) => {
  console.log(source);
  const { t } = useTranslation();

  return (
    <div className="rounded-lg overflow-hidden">
      <Video
        // autoPlay
        // loop
        muted
        controls={["PlayPause", "Seek", "Time", "Volume", "Fullscreen"]}
        onCanPlayThrough={() => {
          // Do stuff
        }}
      >
        <source src={source} type="video/mp4" />
        {t("Your browser does not support the video tag.")}
        {/* <track
      label="English"
      kind="subtitles"
      srcLang="en"
      src={source}
      default
    /> */}
      </Video>
    </div>
  );
};
export default VideoPlayer;
