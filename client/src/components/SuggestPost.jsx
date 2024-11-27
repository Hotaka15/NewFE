import React, { useState } from "react";
import { MdClose } from "react-icons/md";
const SuggestPost = ({ handleisSuggest }) => {
  const [history, setHistory] = useState([]);
  const [content, setContent] = useState("");
  const handlehistoryuser = () => {
    const list = [...history];
    list.push({ role: "user", text: content });
    setHistory(list);
  };
  const handlehistorybot = (content) => {
    const list = [...history];
    list.push({ role: "bot", text: content });
    setHistory(list);
  };
  const handlecontent = (e) => {
    setContent(e.target.value);
  };
  return (
    <div className=" absolute w-full h-full flex flex-col items-center justify-center">
      <div className="w-2/4 h-fit bg-primary rounded-xl overflow-y-auto">
        <div className="w-full flex py-2 px-4 border-b border-[#66666645]">
          <span className="w-full text-ascent-1 text-2xl">Suggest Ai</span>
          <div className="text-ascent-1 text-2xl" onClick={handleisSuggest}>
            <MdClose size={22} />
          </div>
        </div>
        <div className="h-[500px] w-full flex flex-col justify-center items-center">
          {history &&
            history.map((his) => {
              return (
                <div className="text-ascent-1 bg-secondary rounded-xl mb-2 px-4 py-3 max-w-lg break-words ">
                  {his?.text}
                </div>
              );
            })}
          <div>hey</div>
        </div>
        <div className="w-full flex items-center justify-center gap-2 mb-4">
          <input
            type="text"
            placeholder="Write something..."
            className="bg-secondary rounded-full w-2/5 outline-none px-4 py-2 text-ascent-1"
            value={content}
            onChange={(e) => {
              handlecontent(e);
            }}
          />
          <div
            className="bg-blue text-white px-4 py-2  rounded-xl"
            onClick={handlehistoryuser}
          >
            Send
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuggestPost;
