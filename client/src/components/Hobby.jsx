import React, { useState } from "react";

import { AiOutlinePlus } from "react-icons/ai";
import { NoProfile } from "../assets";
import { CiImageOff } from "react-icons/ci";
const Hobby = ({}) => {
  return (
    <div className="z-50 absolute  w-full h-full bg-bgColor/70">
      <div className="w-full h-full flex justify-center items-center">
        <div className="w-1/2 h-3/4 rounded-2xl flex justify-center items-center">
          {
            <div className="py-4 w-full h-full flex flex-col justify-center items-center gap-3 rounded-3xl object-contain">
              <div className="flex  w-full h-fit rounded-xl justify-center items-center grow-0">
                <div className="h-full overflow-hidden">
                  <img
                    src={NoProfile}
                    alt="Something wrong"
                    className="rounded-2xl object-contain max-w-full h-100 "
                    onClick={() => {}}
                  />
                </div>

                {/* <div className="text-ascent-1 w-60 h-60 flex justify-center items-center bg-primary rounded-xl">
                    <CiImageOff size={30} />
                  </div> */}

                <div
                  onClick={() => {}}
                  className="rotate-45 cursor-pointer absolute right-7 top-7 bg-secondary rounded-full opacity-70 w-10 h-10 text-white flex justify-center items-center"
                >
                  <AiOutlinePlus
                    size={30}
                    className="text-ascent-1 font-thin"
                  />
                </div>
              </div>
            </div>
            // {bg-[#000000]}
          }
        </div>
      </div>
    </div>
  );
};
export default Hobby;
