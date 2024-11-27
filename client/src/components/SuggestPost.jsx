import React, { useEffect, useRef, useState } from "react";
import { MdClose } from "react-icons/md";
import { CiEdit } from "react-icons/ci";
import Loading from "./Loading";
const SuggestPost = ({ handleisSuggest }) => {
  const [history, setHistory] = useState([]);
  const [content, setContent] = useState("");
  const [isText, setIsText] = useState(true);
  const chatWindowRef = useRef(null);

  const handlehistoryuser = () => {
    const list = [...history];
    list.push({ role: "user", text: content });
    setHistory(list);
    handleScrollToBottom();
  };
  const handlehistorybot = () => {
    const list = [...history];
    list.push({ role: "bot", text: content });
    setHistory(list);
  };
  const handlecontent = (e) => {
    setContent(e.target.value);
  };

  const handleScrollToBottom = () => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    history && handleScrollToBottom();
  }, [history]);

  return (
    <div className=" absolute w-full h-full flex flex-col items-center justify-center">
      <div className="w-full h-full bg-primary rounded-xl overflow-hidden">
        <div className="w-full flex py-2 px-4 border-b border-[#66666645]">
          <span className="w-full text-ascent-1 text-2xl font-medium select-none">
            Suggest AI
          </span>
          <div
            className="text-ascent-1 text-2xl cursor-pointer flex justify-center items-center"
            onClick={handleisSuggest}
          >
            <MdClose size={22} />
          </div>
        </div>
        <div className="flex py-2 px-4 bg-primary rounded-md select-none">
          <div
            className={`${
              isText && "bg-ascent-1/10"
            } px-2 py-1 rounded-md text-ascent-1 cursor-pointer`}
            onClick={() => {
              setIsText(true);
            }}
          >
            Text
          </div>
          <div
            className={`${
              !isText && "bg-ascent-1/10"
            } px-2 py-1 rounded-md text-ascent-1 cursor-pointer`}
            onClick={() => {
              setIsText(false);
            }}
          >
            Images
          </div>
        </div>
        <div
          id="window-chat"
          ref={chatWindowRef}
          className="h-[450px] w-full my-2 px-4 overflow-y-auto "
        >
          <div className="w-full h-full flex flex-col mt-10 justify-end">
            {history &&
              history.map((his, index) => {
                if (his?.role == "user") {
                  return (
                    <div
                      key={index}
                      className="text-ascent-1 bg-secondary rounded-xl mb-2 px-4 py-3 max-w-lg break-words self-end"
                    >
                      {his?.text}
                    </div>
                  );
                } else {
                  return (
                    <div className="flex gap-2">
                      <div
                        key={index}
                        className="text-white bg-blue rounded-xl mb-2 px-4 py-3 max-w-lg break-words self-start"
                      >
                        {his?.text}
                      </div>
                      <div
                        className="flex justify-center items-center text-ascent-1 cursor-pointer"
                        onClick={() => {
                          setContent(his?.text);
                        }}
                      >
                        <CiEdit />
                      </div>
                    </div>
                  );
                }
              })}
          </div>
        </div>
        <div className="w-full flex items-center justify-center gap-2 mb-4 px-4">
          {/* <Loading /> */}
          <input
            type="text"
            placeholder="Write something..."
            className="bg-secondary rounded-full w-4/5 outline-none px-4 py-2 text-ascent-1 border-[#66666645] border"
            value={content}
            onChange={(e) => {
              handlecontent(e);
            }}
          />
          <div
            className="bg-blue text-white px-4 py-2  rounded-xl"
            onClick={handlehistorybot}
          >
            Send
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuggestPost;
