import React, { useRef, useEffect } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css"; // Import CSS mặc định của Video.js

const VideoPlayer = ({ options }) => {
  const videoRef = useRef(null); // Tham chiếu đến thẻ video
  const playerRef = useRef(null); // Tham chiếu đến instance của Video.js

  useEffect(() => {
    if (videoRef.current && !playerRef.current) {
      // Khởi tạo Video.js player
      const player = videojs(videoRef.current, options);
      playerRef.current = player;
    }

    return () => {
      if (playerRef.current) {
        // Hủy player khi component bị gỡ bỏ
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, [options]);

  return (
    <div data-vjs-player>
      <video ref={videoRef} className="video-js"></video>
    </div>
  );
};

export default VideoPlayer;
