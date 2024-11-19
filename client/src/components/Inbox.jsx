import React, { useState } from "react";
import { NoProfile } from "../assets";
const UserCard = ({ user, event, onUser }) => {
  // console.log(12313141413);
  const eventc = event;
  const changec = onUser;
  //   const handle = () => {
  //     eventc();
  //     changec();
  //   };
  //   const handlepage = (id) => {
  //     setPage(id);
  //   };
  //   const onchangepage = async (id) => {
  //     await handlepage(id);
  //     position();
  //   };
  return <div></div>;
  // <div
  //   className="w-full gap-4 flex py-5 px-5 rounded-2xl hover:bg-ascent-3/30 items-center"
  //   onClick={() => {
  //     handle();
  //   }}
  // >
  //   <img
  //     src={user?.profileUrl ?? NoProfile}
  //     alt={user?.firstName}
  //     className="w-14 h-14 object-cover rounded-full"
  //   />
  //   <div className="flex-col w-full flex h-full justify-center">
  //     <div className="flex justify-between">
  //       <span className="text-ascent-1">
  //         {user.firstName} {user.lastName}
  //       </span>
  //       <span className="text-ascent-2 ">{user.time}</span>
  //     </div>
  //     <span className="text-ascent-2">
  //       {user?.chat.length > 30
  //         ? user?.chat.slice(0, 30) + "..."
  //         : user?.chat}
  //     </span>
  //   </div>
  // </div>
};
const Inbox = () => {
  const [listmanager, setListmanager] = useState([
    {
      createdAt: "2024-09-14T06:57:38.122Z",
      email: "toan6858@gmail.com",
      firstName: "Nguyễn",
      following: [],
      friends: [],
      lastName: "Takt",
      location: "VietNam",
      chat: "Vậy anh sẽ cân nhắc thêm. Cảm ơn em.",
      profileUrl:
        "https://res.cloudinary.com/dr91wukb1/image/upload/v1730531001/SOCIALMEDIA/g2og0hxbfrh56oiadfum.png",
      role: "Admin",
      statusActive: true,
      token:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NmU1MzNlMmI1MTQ1NTlhODA2ZjdmYzMiLCJleHAiOjE3NDYyNzEwMzEsImlhdCI6MTczMDcxOTAzMX0.ZgRy1JRcgxzPFRQSeMZlMYO-uSJprZLdrh1isI0P7Dg",
      updatedAt: "2024-11-02T07:05:03.542Z",
      verified: true,
      views: [],
      __v: 2,
      _id: "66e533e2b514559a806f7fc3",
      page: 1,
      time: "10AM",
    },
    {
      createdAt: "2024-09-14T06:57:38.122Z",
      email: "toan6858@gmail.com",
      firstName: "joshua",
      following: [],
      friends: [],
      lastName: "smith",
      location: "VietNam",
      chat: " Ok, phòng họp 3 rất phù hợp. Vậy là mình sẽ họp vào thứ Hai lúc 10h sáng tại phòng họp 3 nhé.",
      role: "Admin",
      statusActive: true,
      token:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NmU1MzNlMmI1MTQ1NTlhODA2ZjdmYzMiLCJleHAiOjE3NDYyNzEwMzEsImlhdCI6MTczMDcxOTAzMX0.ZgRy1JRcgxzPFRQSeMZlMYO-uSJprZLdrh1isI0P7Dg",
      updatedAt: "2024-11-02T07:05:03.542Z",
      verified: true,
      views: [],
      __v: 2,
      _id: "66e533e2b514559a806f7fc3",
      page: 2,
      time: "6PM",
    },
    {
      createdAt: "2024-09-14T06:57:38.122Z",
      email: "toan6858@gmail.com",
      firstName: "Nguyễn",
      following: [],
      friends: [],
      lastName: "Huy",
      location: "VietNam",
      chat: "See you soon!",
      role: "Admin",
      statusActive: true,
      token:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NmU1MzNlMmI1MTQ1NTlhODA2ZjdmYzMiLCJleHAiOjE3NDYyNzEwMzEsImlhdCI6MTczMDcxOTAzMX0.ZgRy1JRcgxzPFRQSeMZlMYO-uSJprZLdrh1isI0P7Dg",
      updatedAt: "2024-11-02T07:05:03.542Z",
      verified: true,
      views: [],
      __v: 2,
      _id: "66e533e2b514559a806f7fc3",
      page: 3,
      time: "9AM",
    },
  ]);
  const [userinfo, setUserinfo] = useState(listmanager[0]);
  return (
    <div></div>
    // <div>
    //   <div
    //     className="w-1/5 lg:w-1/5 h-full bg-primary md:flex flex-col gap-1
    //     overflow-y-auto rounded-xl grow-0"
    //   >
    //     <div>
    //       <div className="w-full font-bold text-ascent-1 text-3xl px-5 py-5">
    //         Chat
    //       </div>
    //       <div className="w-full flex flex-col items-center px-4">
    //         <input
    //           type="text"
    //           className="px-5 bg-secondary text-ascent-2 rounded-full w-full border border-[#66666690]
    //         outline-none text-sm
    //          py-2 placeholder:text-ascent-2"
    //           placeholder="Search"
    //         />
    //       </div>
    //     </div>

    //     <div className="w-full h-full gap-3 flex flex-col pt-2">
    //       {listmanager.map((user) => {
    //         return (
    //           <UserCard
    //             user={user}
    //             event={() => {
    //               onchangepage(user?.page);
    //             }}
    //             onUser={() => {
    //               userChat(user);
    //             }}
    //           />
    //         );
    //       })}

    //     </div>
    //   </div>
    //   <div className="flex-1 h-full bg-primary px-4 flex flex-col gap-6 overflow-y-auto rounded-lg justify-between">

    //     <div className="flex w-full justify-between mt-3 border-b border-[#66666645] pb-3 select-none ">
    //       <div className="text-ascent-1 font-bold text-3xl">
    //         <div className=" flex text-ascent-1 text-sm items-center gap-1">
    //           <img
    //             src={userinfo?.profileUrl ?? NoProfile}
    //             alt="post image"
    //             className="w-14 h-14 shrink-0 object-cover rounded-full "
    //           ></img>
    //           <div className="flex items-center w-full h-full">
    //             <span className="align-middle">
    //               {userinfo?.firstName} {userinfo?.lastName}
    //             </span>
    //           </div>
    //         </div>
    //       </div>
    //       <div className="flex justify-center items-center">
    //         <IoCallSharp className="text-ascent-1 " size={25} />
    //       </div>
    //     </div>

    //     {/* Phần nội dung của khung chat */}
    //     <div id="window_chat" className="flex-1 h-3/4 overflow-auto">
    //       {/* Danh sách tin nhắn */}
    //       <div className="flex flex-col gap-2 h-full">
    //         <div ref={myDivRef} className="flex items-center w-full">
    //           {/* <div className="bg-gray-300 rounded-full h-8 w-8 flex items-center justify-between text-ascent-2"></div> */}
    //           {page == 1 && <Pagechat_1 />}
    //           {page == 2 && <Pagechat_2 />}
    //           {page == 3 && <Pagechat_3 />}
    //         </div>
    //       </div>
    //     </div>

    //     {/* Phần nhập tin nhắn */}
    //     <div className="relative flex flex-col items-start">
    //       <div className="absolute bottom-20 right-20">
    //         {showPicker && (
    //           <Picker className="" theme={theme} onEmojiClick={onEmojiClick} />
    //         )}
    //       </div>
    //       {review && (
    //         <div className="relative flex h-20 w-20 bg-bgColor rounded-2xl overflow-hidden mx-2 my-2">
    //           <div className="overflow-hidden ">
    //             <img
    //               src={review}
    //               className="h-20 w-20 object-contain cursor-pointer"
    //               onClick={() => {
    //                 setReviewcheck(!reviewcheck);
    //                 setReview(review);
    //               }}
    //             />
    //           </div>
    //           <div
    //             onClick={() => {
    //               setReview(null);
    //               // setTemp(null);
    //             }}
    //             className="rotate-45 cursor-pointer absolute right-1 top-1 bg-[#000000] rounded-full opacity-70 w-1/3 h-1/3 text-white flex justify-center items-center"
    //           >
    //             <AiOutlinePlus size={15} className="font-thin" />
    //           </div>
    //         </div>
    //       )}

    //       <div className="flex w-full mb-3 justify-center items-center">
    //         <div
    //           className="h-full w-fit text-ascent-1 px-1 py-2 flex justify-center items-center"
    //           onClick={() => {}}
    //         >
    //           <label className="bg-primary rounded-xl cursor-pointer">
    //             <CiCirclePlus size={35} />
    //             <input
    //               type="file"
    //               className="hidden"
    //               accept=".jpg, .png, .jpeg"
    //               onInput={(e) => {
    //                 e.target.files[0] && handlebg(e);
    //               }}
    //             />
    //           </label>
    //         </div>

    //         <div className=" overflow-hidden w-full h-full flex justify-center items-center border bg-bgColor rounded-full focus:outline-none focus:ring focus:border-blue">
    //           <input
    //             type="text"
    //             value={chat}
    //             onChange={(e) => {
    //               setChat(e.target.value);
    //             }}
    //             placeholder="Type your message..."
    //             className="w-full flex-1 py-2 px-5 text-ascent-1 rounded-full bg-bgColor focus:outline-0 text-wrap"
    //           />
    //           <div
    //             className="h-full w-fit text-ascent-1 px-1 py-2 flex justify-center items-center  "
    //             onClick={() => {
    //               setShowPicker(!showPicker);
    //             }}
    //           >
    //             <MdEmojiEmotions size={35} />
    //           </div>
    //         </div>

    //         <button className="bg-blue-500 text-white px-4 py-2 rounded-md ml-2 bg-blue ">
    //           Send
    //         </button>
    //       </div>
    //     </div>
    //   </div>
    // </div>
  );
};
export default Inbox;
