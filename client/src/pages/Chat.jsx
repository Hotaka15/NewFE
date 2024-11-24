import React, {
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import {
  FriendsCard,
  ProfileCard,
  TextInput,
  TopBar,
  ImageCheck,
  UserTiitle,
  CustomButton,
  Loading,
} from "../components";
import Cookies from "js-cookie";
import { SlOptionsVertical } from "react-icons/sl";
import { IoIosAddCircle } from "react-icons/io";
import { IoIosContact } from "react-icons/io";
import { useSelector } from "react-redux";
import { MdClose } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import { AiOutlinePlus } from "react-icons/ai";
import { CiCircleCheck } from "react-icons/ci";
import { BsBriefcase } from "react-icons/bs";
import {
  formatDistanceToNow,
  differenceInHours,
  parseISO,
  differenceInMinutes,
  differenceInDays,
} from "date-fns";
import { FaVideo } from "react-icons/fa";
import { IoIosChatbubbles, IoIosSettings, IoMdContact } from "react-icons/io";
import { IoCallSharp } from "react-icons/io5";
import { MdEmojiEmotions } from "react-icons/md";
import { CiCirclePlus } from "react-icons/ci";
import Picker from "emoji-picker-react";
import { BgImage, NoProfile } from "../assets";

import { io } from "socket.io-client";
import {
  chatfetchListpersonal,
  createConversations,
  fetchChat,
  sendMessage,
} from "../until/chat";
import {
  searchUserName,
  userfriendSuggest,
  usergetUserpInfo,
} from "../until/user";
import { debounce } from "lodash";
import { forwardRef } from "react";
import { handFileUpload } from "../until";
import CreateGroup from "../components/CreateGroup";

const RangeChat = forwardRef(
  (
    {
      user,
      userinfo,
      newChat,
      setNewChat,
      reviewcheck,
      setReviewcheck,
      review,
      setReview,
      idroom,
      socket,
      fetchList,
      fetchchatforchild,
    },
    ref
  ) => {
    const [showPicker, setShowPicker] = useState(false);
    const [listchat, setListchat] = useState([]);
    const [chat, setChat] = useState("");
    const [loading, setLoading] = useState(false);
    const { theme } = useSelector((state) => state.theme);
    const [page, setPage] = useState(1);
    const [file, setFile] = useState(null);
    console.log(user);
    console.log(idroom);
    console.log(userinfo);

    const id_1 = user?._id;
    const id_2 = userinfo?._id;
    const handlebg = (e) => {
      setFile(e.target.files[0]);
      console.log(e.target.files[0]);
      const reader = new FileReader();
      reader.onload = () => {
        setReview(reader.result);
      };
      reader.readAsDataURL(e.target.files[0]);
      // setPreview(true);
    };
    const onEmojiClick = (e) => {
      setChat((prevInput) => prevInput + e.emoji);
      setShowPicker(false);
    };
    // const position = () => {
    //   let position = document.getElementById("window_chat");
    //   console.log(position.scrollTop);
    //   console.log(position.scrollHeight);
    //   position.scrollTop = position.scrollHeight;
    // };
    const fetchchat = async (idroom) => {
      try {
        // const res = await
        const res = await fetchChat(user?.token, idroom, page);
        console.log(res);
        setListchat(res?.data?.messages);
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    };

    const handlesend = async (id_2, chat) => {
      const recipientId = id_2; // ID người nhận tin nhắn
      const privateMessage = chat;
      console.log(socket);

      await socket.emit("sendMessage", {
        idConversation: idroom,
        message: privateMessage,
      });
      fetchList();
    };

    const handleSend = async (e) => {
      try {
        e.preventDefault();
        console.log(file);

        const uri = file && (await handFileUpload(file));
        const res = await sendMessage(user?.token, idroom, id_1, chat, uri);
        handlesend(id_2, chat);
        console.log(res);
        handlePr();
        setChat("");
        await fetchchat(idroom);
      } catch (error) {
        console.log(error);
      }
    };

    const position = () => {
      let position = document.getElementById("listchat");
      // let position1 = document.getElementById("window_chatlist");
      if (position) {
        console.log(position.offsetHeight);
        console.log(position.scrollHeight);
        // console.log(position.scrollHeight);
        position.scrollTo({
          top: position.scrollHeight,
          behavior: "smooth", // Cuộn mượt
        });
      }
    };

    const handlepre = useCallback(
      debounce((e) => {
        const position = e.target;
        console.log(12312312);

        position.scrollTop < position.scrollHeight * 0.4 &&
          setPage((pre) => pre + 1);
      }, 500),
      []
    );
    const handlePr = () => {
      console.log(review, file);

      setReview(null);
      setFile(null);
    };

    useImperativeHandle(ref, () => ({
      fetchchat,
      position,
    }));
    useEffect(() => {
      setLoading(true);
      fetchchat(idroom);

      // fetchData();
    }, [idroom]);
    useEffect(() => {
      position();
    }, [loading]);

    // nhận tin nhắn
    useEffect(() => {
      // socket.on("receivePrivateMessage", (data) => {
      //   console.log(
      //     `Received private message from ${data.from}: ${data.message}`
      //   );
      //   fetchchat(idroom);
      // });

      // socket.reconnection;
      if (socket && idroom) {
        socket.on("receiveMessage", (data) => {
          console.log(data);
          fetchList();
          fetchchat(idroom);
          // fetchchatforchild(idroom);
        });
      }
      // console.log(socket);
    }, [socket, idroom]);
    return (
      <div className="flex-1 h-full bg-primary px-4 flex flex-col gap-6 overflow-y-auto rounded-lg justify-between">
        {/* Phần tiêu đề của khung chat */}
        <div className="flex w-full justify-between mt-3 border-b border-[#66666645] pb-3 select-none ">
          <div className="text-ascent-1 font-bold text-3xl">
            <div className=" flex text-ascent-1 text-sm items-center gap-1">
              <img
                src={userinfo?.profileUrl ?? NoProfile}
                alt="post image"
                className="w-14 h-14 shrink-0 object-cover rounded-full "
              ></img>
              <div className="flex items-center w-full h-full">
                <span className="align-middle">
                  {userinfo?.firstName} {userinfo?.lastName}
                </span>
              </div>
            </div>
          </div>
          <div className="flex relative justify-center items-center text-ascent-1 gap-2">
            <IoCallSharp size={25} />
            <SlOptionsVertical size={25} className="cursor-pointer" />
            {/* <div className="absolute w-40 h-40 bg-secondary border border-[#66666645] overflow-hidden rounded-2xl shadow-md top-[100%] right-0">
            <div
              // onClick={() => {
              //   setCreatg(!createg);
              // }}
              className="w-full h-1/3 text-ascent-1 flex justify-center items-center py-3 hover:bg-ascent-3/30"
            >
              Create Group
            </div>
            <div
              // onClick={() => {
              //   setRoleo(!roleo);
              // }}
              className="w-full h-1/3 text-ascent-1 flex justify-center items-center py-3 hover:bg-ascent-3/30"
            >
              Manager
            </div>
            <div
              // onClick={() => {
              //   setAddu(!addu);
              // }}
              className="w-full h-1/3 text-ascent-1 flex justify-center items-center py-3 hover:bg-ascent-3/30"
            >
              Add User
            </div>
          </div> */}
          </div>
        </div>

        {/* Phần nội dung của khung chat */}
        <div id="listchat" className="flex w-full h-3/4 overflow-y-auto">
          {/* Danh sách tin nhắn */}
          <div className="flex flex-col gap-2 h-full w-full">
            <div className="flex items-center w-full">
              {/* ref={myDivRef} */}
              {/* <div className="bg-gray-300 rounded-full h-8 w-8 flex items-center justify-between text-ascent-2"></div> */}
              {/* {page == 1 && <Pagechat_1 />}
            {page == 2 && <Pagechat_2 />}
            {page == 3 && <Pagechat_3 />} */}
              {/* <Pagechat_1 /> */}
              {loading ? (
                <div className=" w-full h-full flex justify-center items-start">
                  <Loading />
                </div>
              ) : idroom ? (
                <PageChat listchat={listchat} socket={socket} />
              ) : (
                <div className="text-ascent-2 text-xl w-full h-full flex justify-center items-start">
                  Select Conversation
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Phần nhập tin nhắn */}
        <div className="relative flex flex-col items-start">
          <div className="absolute bottom-20 right-20">
            {showPicker && (
              <Picker className="" theme={theme} onEmojiClick={onEmojiClick} />
            )}
          </div>
          {review && (
            <div className="relative flex h-20 w-20 bg-bgColor rounded-2xl overflow-hidden mx-2 my-2">
              <div className="overflow-hidden ">
                <img
                  src={review}
                  className="h-20 w-20 object-contain cursor-pointer"
                  onClick={() => {
                    setReviewcheck(!reviewcheck);
                    setReview(review);
                  }}
                />
              </div>
              <div
                onClick={() => {
                  // setReview(null);
                  handlePr();
                  // setTemp(null);
                }}
                className="rotate-45 cursor-pointer absolute right-1 top-1 bg-[#000000] rounded-full opacity-70 w-1/3 h-1/3 text-white flex justify-center items-center"
              >
                <AiOutlinePlus size={15} className="font-thin" />
              </div>
            </div>
          )}

          <div className="flex w-full mb-3 justify-center items-center">
            <div
              className="h-full w-fit text-ascent-1 px-1 py-2 flex justify-center items-center"
              onClick={() => {}}
            >
              <label className="bg-primary rounded-xl cursor-pointer">
                <CiCirclePlus size={35} />
                <input
                  type="file"
                  className="hidden"
                  accept=".jpg, .png, .jpeg"
                  onInput={(e) => {
                    e.target.files[0] && handlebg(e);
                  }}
                />
              </label>
            </div>
            <form className="w-full flex" onSubmit={(e) => handleSend(e)}>
              <div className=" overflow-hidden w-full h-full flex justify-center items-center border bg-bgColor rounded-full focus:outline-none focus:ring focus:border-blue">
                <input
                  type="text"
                  value={chat}
                  onChange={(e) => {
                    setChat(e.target.value);
                  }}
                  placeholder="Type your message..."
                  className="w-full flex-1 py-2 px-5 text-ascent-1 rounded-full bg-bgColor focus:outline-0 text-wrap"
                />
                <div
                  className="h-full w-fit text-ascent-1 px-1 py-2 flex justify-center items-center  "
                  onClick={() => {
                    setShowPicker(!showPicker);
                  }}
                >
                  <MdEmojiEmotions size={35} />
                </div>
              </div>

              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded-md ml-2 bg-blue "
              >
                Send
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }
);

const UserCard = forwardRef(
  (
    {
      user,
      event,
      itemchat,
      hanldeUserchat,
      socket,
      conversationId,
      fetchList,
      fetchchats,
    },
    ref
  ) => {
    const [avatar, setAvatar] = useState();
    console.log("UserCard");
    const userId = user?._id;
    const [time, setTime] = useState("");
    console.log(itemchat);
    const id = itemchat?.members
      ? itemchat.members.find((member) => member !== user?._id)
      : itemchat?._id;
    // const eventc = event;

    const joinroom = async (userId, conversationId) => {
      console.log(conversationId);
      await socket.emit("joinGroup", { userId, groupId: conversationId });
      // socket.on("receiveMessage", (data) => {
      //   console.log(data);
      //   fetchList();
      //   ref.current.fetchchat(conversationId);
      //   ref.current.position();
      // });
    };

    // useEffect(() => {
    //   return () => {
    //     socket.emit("leaveGroup", { userId, groupId: conversationId });
    //     console.log(
    //       `Sent leaveGroup event with userId: ${userId} and groupId: ${conversationId}`
    //     );
    //   };
    // }, [conversationId]);
    useEffect(() => {
      joinroom(userId, conversationId);
      return () => {
        socket.emit("leaveGroup", { userId, groupId: conversationId });
        console.log(
          `Sent leaveGroup event with userId: ${userId} and groupId: ${conversationId}`
        );
      };
    }, [conversationId]);

    const handleTime = () => {
      if (itemchat?.lastMessage?.timestamp) {
        const date = parseISO(itemchat.lastMessage.timestamp);
        const now = new Date();

        // Tính tổng số phút giữa hai thời điểm
        const totalMinutesDifference = differenceInMinutes(now, date);
        if (totalMinutesDifference < 60) {
          // Nếu dưới 1 giờ, hiển thị số phút
          setTime(`${totalMinutesDifference}m`);
        } else if (totalMinutesDifference < 1440) {
          // 1440 phút = 24 giờ
          // Nếu dưới 24 giờ, hiển thị giờ và phút
          const hours = Math.floor(totalMinutesDifference / 60);
          const minutes = totalMinutesDifference % 60;

          setTime(`${hours}h`);
        } else {
          // Nếu trên 24 giờ, hiển thị số ngày
          // const daysDifference = formatDistanceToNow(date, { addSuffix: true });
          // setTime(`${daysDifference}d`);
          const daysDifference = differenceInDays(now, date);
          setTime(`${daysDifference} day${daysDifference > 1 ? "s" : ""}`);
        }
      } else {
        return;
      }
    };

    const handle = () => {
      // eventc();
      console.log(user);

      hanldeUserchat(avatar);
    };
    const getUser = async () => {
      try {
        const res = await usergetUserpInfo(user?.token, id);
        console.log(res);

        setAvatar(res);
      } catch (error) {
        console.log(error);
      }
    };
    useEffect(() => {
      getUser();
      handleTime();
    }, []);
    // console.log(user);
    return (
      <div
        className="w-full gap-4 flex py-5 px-5  hover:bg-ascent-3/30 items-center"
        onClick={() => {
          handle();
        }}
      >
        <img
          src={avatar?.profileUrl ?? NoProfile}
          alt={avatar?.firstName}
          className="w-14 h-14 object-cover rounded-full"
        />
        <div className="flex-col w-full flex h-full justify-center">
          <div className="flex justify-between">
            <span className="text-ascent-1">
              {avatar?.firstName} {avatar?.lastName}
            </span>
            <span className="text-ascent-2 ">{time}</span>
          </div>
          <span className="text-ascent-2">
            {itemchat?.lastMessage
              ? itemchat?.lastMessage?.content?.length > 30
                ? itemchat?.lastMessage?.content.slice(0, 30) + "..."
                : itemchat?.lastMessage?.content
              : "New chat"}
          </span>
        </div>
      </div>
    );
  }
);

const PageChat = ({ listchat, socket }) => {
  const { user } = useSelector((state) => state.user);

  console.log(listchat);
  {
    /* <div className="w-full flex justify-center">
        <span className="text-ascent-1 ">20/10/2024</span>
      </div> */
  }
  const handleTime = (timestamp) => {
    // console.log(timestamp);

    if (timestamp) {
      const date = parseISO(timestamp);
      const now = new Date();

      // Tính tổng số phút giữa hai thời điểm
      const totalMinutesDifference = differenceInMinutes(now, date);
      if (totalMinutesDifference < 60) {
        // Nếu dưới 1 giờ, hiển thị số phút
        return `${totalMinutesDifference}m`;
      } else if (totalMinutesDifference < 1440) {
        // 1440 phút = 24 giờ
        // Nếu dưới 24 giờ, hiển thị giờ và phút
        const hours = Math.floor(totalMinutesDifference / 60);
        const minutes = totalMinutesDifference % 60;

        return `${hours}h`;
      } else {
        // Nếu trên 24 giờ, hiển thị số ngày
        // const daysDifference = formatDistanceToNow(date, { addSuffix: true });
        // setTime(`${daysDifference}d`);
        const daysDifference = differenceInDays(now, date);
        return `${daysDifference} day${daysDifference > 1 ? "s" : ""}`;
      }
    } else {
      return "Error";
    }
  };

  const handlescroll = () => {
    let position = document.getElementById("window_chat");
    let position1 = document.getElementById("window_chatlist");
    if (position) {
      console.log(position);

      console.log(position.scrollTop);
      console.log(position.scrollHeight);
      console.log("offsetHeight:", position.offsetHeight);
      // position1.scrollTo({
      //   top: 500,
      //   behavior: "smooth", // Cuộn mượt
      // });
      position.scrollTop = position.scrollHeight;
      setTimeout(() => {
        console.log(position.scrollTop);
      }, 100);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      handlescroll(); // Đảm bảo cuộn sau khi DOM được render đầy đủ
    }, 1000);
  }, []);

  return (
    <div
      id="window_chatlist"
      className="w-full h-full flex justify-center items-start grow-0"
    >
      {listchat?.length > 0 ? (
        <div id="window_chat" className="flex flex-col gap-2 w-full ">
          {listchat
            ?.slice() // Tạo một bản sao của mảng
            .reverse()
            ?.map((chat) => {
              return chat?.senderId == user?._id ? (
                <div className="w-full flex  justify-end">
                  <div className="flex flex-col items-end">
                    <div className="bg-blue p-2 border rounded-xl ml-2 max-w-2xl">
                      <p className="text-justify text-white px-2 py-1">
                        {chat?.text}
                      </p>
                      <div className="flex justify-end w-full text-white text-xs pt-1 py-2 ">
                        {handleTime(chat?.timestamp)}
                      </div>
                    </div>
                    {chat?.file_url && (
                      <img
                        src={chat?.file_url}
                        alt=""
                        className="w-96 p-2 ml-2 rounded-3xl object-cover"
                      />
                    )}
                  </div>
                </div>
              ) : (
                <div className="w-full">
                  <div className="bg-[#66666645] p-2 border rounded-xl ml-2 max-w-2xl w-fit">
                    <p className="text-justify text-ascent-1 px-2 py-1 w-fit">
                      {chat?.text}
                    </p>
                    <div className="flex justify-end w-full text-ascent-2 text-xs pt-1 py-2">
                      {handleTime(chat?.timestamp)}
                    </div>
                  </div>
                  {chat?.file_url && (
                    <img
                      src={chat?.file_url}
                      alt="chat?.file_url"
                      className="w-96 p-2 ml-2 rounded-3xl object-cover"
                    />
                  )}
                </div>
              );
            })}

          <div className="w-full flex justify-center"></div>

          <div className="w-full flex text-ascent-2 text-xs font-normal items-center justify-end gap-2">
            <CiCircleCheck />
            Seen
          </div>
        </div>
      ) : (
        <div className="text-ascent-2 text-xl w-full h-full flex justify-center items-start">
          New Conversation
        </div>
      )}
    </div>
  );
};

const Pagechat_1 = () => {
  return (
    <div className="flex flex-col gap-2 w-full overflow-auto h-full">
      <div className="w-full">
        <div className="bg-[#66666645] p-2 border rounded-xl ml-2 max-w-2xl w-fit">
          <p className="text-justify text-ascent-1 px-2 py-1 w-fit">
            Chào anh/chị, em có thể giúp gì cho anh/chị?
          </p>
          <div className="flex justify-end w-full text-ascent-2 text-xs pt-1 py-2">
            9AM
          </div>
        </div>
      </div>

      {/* <div className="w-full flex justify-center">
        <span className="text-ascent-1 ">20/10/2024</span>
      </div> */}
      <div className="w-full flex justify-center"></div>
      <div className="w-full flex justify-end">
        <div className="bg-blue p-2 border rounded-xl ml-2 max-w-2xl">
          <p className="text-justify text-white px-2 py-1">
            Dạ, anh/chị quan tâm đến dòng nào ạ? Hiện tại bên em có rất nhiều
            mẫu điện thoại với camera chất lượng cao như Samsung Galaxy S23,
            iPhone 14 Pro Max,...
          </p>
          <div className="flex justify-end w-full text-white text-xs pt-1 py-2 ">
            9AM
          </div>
        </div>
      </div>
      <div className="w-full">
        <div className="bg-[#66666645] p-2 border rounded-xl ml-2 max-w-2xl w-fit">
          <p className="text-justify text-ascent-1 px-2 py-1 w-fit">
            Em giới thiệu cho anh chiếc nào pin trâu với, anh hay đi công tác.
          </p>
          <div className="flex justify-end w-full text-ascent-2 text-xs pt-1 py-2">
            9AM
          </div>
        </div>
      </div>

      <div className="w-full flex justify-center"></div>
      <div className="w-full flex justify-end">
        <div className="bg-blue p-2 border rounded-xl ml-2 max-w-2xl">
          <p className="text-justify text-white px-2 py-1">
            Chào em, em tư vấn cho anh một chiếc điện thoại chụp hình đẹp với.
          </p>
        </div>
      </div>

      <div className="w-full">
        <div className="bg-[#66666645] p-2 border rounded-xl ml-2 max-w-2xl w-fit">
          <p className="text-justify text-ascent-1 px-2 py-1 w-fit">
            Dạ, với nhu cầu của anh thì em khuyên anh nên tham khảo dòng Samsung
            Galaxy A series hoặc iPhone 13. Hai dòng này đều có pin rất tốt và
            nhiều tính năng hữu ích.
          </p>
          <div className="flex justify-end w-full text-ascent-2 text-xs pt-1 py-2">
            9AM
          </div>
        </div>
      </div>

      <div className="w-full flex justify-center"></div>
      <div className="w-full flex justify-end">
        <div className="bg-blue p-2 border rounded-xl ml-2 max-w-2xl">
          <p className="text-justify text-white px-2 py-1">
            Vậy em cho anh so sánh hai dòng này với nhau được không?
          </p>
        </div>
      </div>
      <div className="w-full">
        <div className="bg-[#66666645] p-2 border rounded-xl ml-2 max-w-2xl w-fit">
          <p className="text-justify text-ascent-1 px-2 py-1 w-fit">
            Dạ được ạ, Samsung Galaxy A series thường có giá thành phải chăng
            hơn, trong khi iPhone 13 thì hệ điều hành ổn định và bảo mật cao
            hơn.
          </p>
          <div className="flex justify-end w-full text-ascent-2 text-xs pt-1 py-2">
            9AM
          </div>
        </div>
      </div>

      <div className="w-full flex justify-center"></div>
      <div className="w-full flex justify-end">
        <div className="bg-blue p-2 border rounded-xl ml-2 max-w-2xl">
          <p className="text-justify text-white px-2 py-1">
            Vậy anh sẽ cân nhắc thêm. Cảm ơn em.
          </p>
        </div>
      </div>
      <div className="w-full flex text-ascent-2 text-xs font-normal items-center justify-end gap-2">
        <CiCircleCheck />
        Seen
      </div>
    </div>
  );
};

const Pagechat_2 = () => {
  return (
    <div className="flex flex-col gap-2 w-full overflow-auto h-full">
      <div className="w-full">
        <div className="bg-[#66666645] p-2 border rounded-xl ml-2 max-w-2xl w-fit">
          <p className="text-justify text-ascent-1 px-2 py-2 w-fit">
            Mình nghĩ chúng ta nên có một cuộc họp để bàn về dự án X. Bạn có
            rảnh vào thứ Tư tuần sau không? Cụ thể là tầm 2h chiều thì sao?
          </p>
        </div>
      </div>
      <div className="w-full">
        <div className="bg-[#66666645] p-2 border rounded-xl ml-2 max-w-2xl w-fit">
          <p className="text-justify text-ascent-1 px-2 py-2 w-fit">
            Thứ Tư tuần sau thì mình hơi bận rồi. Thứ Hai lúc 10h sáng hoặc thứ
            Ba lúc 14h chiều thì mình đều có thể sắp xếp.
          </p>
        </div>
        {/* <img src={BgImage} alt="" className="w-1/3 p-2 ml-2 rounded-3xl" /> */}
      </div>

      <div className="w-full flex justify-center">
        <span className="text-ascent-1 ">20/10/2024</span>
      </div>
      <div className="w-full flex justify-center"></div>
      <div className="w-full flex justify-end">
        <div className="bg-blue p-2 border rounded-xl ml-2 max-w-2xl">
          <p className="text-justify text-white px-2 py-2">
            Thứ Hai lúc 10h sáng nghe ổn đó. Phòng họp 3 có sẵn không nhỉ? Phòng
            đó khá yên tĩnh và đầy đủ tiện nghi.
          </p>
        </div>
      </div>
      <div className="w-full flex justify-end">
        <div className="bg-blue p-2 border rounded-xl ml-2 max-w-2xl">
          <p className="text-justify text-white px-2 py-2">
            Ok, phòng họp 3 rất phù hợp. Vậy là mình sẽ họp vào thứ Hai lúc 10h
            sáng tại phòng họp 3 nhé.
          </p>
        </div>
      </div>
    </div>
  );
};

const Pagechat_3 = () => {
  return (
    <div className="flex flex-col gap-2 w-full overflow-auto h-full">
      <div className="w-full">
        <div className="bg-[#66666645] p-2 border rounded-xl ml-2 max-w-2xl w-fit">
          <p className="text-justify text-ascent-1 px-2 py-2 w-fit">
            Này Bình, mình rảnh trưa nay nè. Đi ăn trưa không?
          </p>
        </div>
      </div>
      <div className="w-full">
        <div className="bg-[#66666645] p-2 border rounded-xl ml-2 max-w-2xl w-fit">
          <p className="text-justify text-ascent-1 px-2 py-2 w-fit">
            Có chỗ mới khai trương gần công ty mình, nghe nói đồ ăn ngon lắm!
          </p>
        </div>
        <img src={BgImage} alt="" className="w-1/3 p-2 ml-2 rounded-3xl" />
      </div>

      <div className="w-full flex justify-center">
        <span className="text-ascent-1 ">20/10/2024</span>
      </div>
      <div className="w-full flex justify-center"></div>
      <div className="w-full flex justify-end">
        <div className="bg-blue p-2 border rounded-xl ml-2 max-w-2xl">
          <p className="text-justify text-white px-2 py-2">
            Uh, hay quá đi! Mình cũng đói meo rồi.
          </p>
        </div>
      </div>
      <div className="w-full flex justify-end">
        <div className="bg-blue p-2 border rounded-xl ml-2 max-w-2xl">
          <p className="text-justify text-white px-2 py-2">
            Mình đi nhé! Khoảng 12h mình qua đón bạn.
          </p>
        </div>
      </div>
      <div className="w-full flex justify-end">
        <div className="bg-blue p-2 border rounded-xl ml-2 max-w-2xl">
          <p className="text-justify text-white px-2 py-2">
            À, bạn muốn ăn gì đặc biệt không? Mình đặt trước luôn.
          </p>
        </div>
      </div>
      <div className="w-full">
        <div className="bg-[#66666645] p-2 border rounded-xl ml-2 max-w-2xl w-fit">
          <p className="text-justify text-ascent-1 px-2 py-2 w-fit">
            Ok, mình không kén ăn đâu. Bạn quyết định đi.
          </p>
        </div>
      </div>
      <div className="w-full">
        <div className="bg-[#66666645] p-2 border rounded-xl ml-2 max-w-2xl w-fit">
          <p className="text-justify text-ascent-1 px-2 py-2 w-fit">
            Nhưng mà mình thích ăn đồ Nhật lắm đấy.
          </p>
        </div>
      </div>
      <div className="w-full">
        <div className="bg-[#66666645] p-2 border rounded-xl ml-2 max-w-2xl w-fit">
          <p className="text-justify text-ascent-1 px-2 py-2 w-fit">
            Nếu có sushi hoặc ramen thì tuyệt vời luôn.💕
          </p>
        </div>
      </div>
      <div className="w-full flex justify-end">
        <div className="bg-blue p-2 border rounded-xl ml-2 max-w-2xl">
          <p className="text-justify text-white px-2 py-2">
            Yên tâm, mình nhớ rồi. Mình sẽ đặt một bàn ở quán sushi đó.
          </p>
        </div>
      </div>
      <div className="w-full flex justify-end">
        <div className="bg-blue p-2 border rounded-xl ml-2 max-w-2xl">
          <p className="text-justify text-white px-2 py-2">
            Gặp bạn lúc 12h nhé!
          </p>
        </div>
      </div>
      <div className="w-full">
        <div className="bg-[#66666645] p-2 border rounded-xl ml-2 max-w-2xl w-fit">
          <p className="text-justify text-ascent-1 px-2 py-2 w-fit">
            Ok, hẹn gặp bạn lúc 12h.
          </p>
        </div>
      </div>
      <div className="w-full">
        <div className="bg-[#66666645] p-2 border rounded-xl ml-2 max-w-2xl w-fit">
          <p className="text-justify text-ascent-1 px-2 py-2 w-fit">
            À, nhớ mang theo ví đấy nhé, kẻo lại tranh nhau trả tiền.
          </p>
        </div>
      </div>
      <div className="w-full flex justify-end">
        <div className="bg-blue p-2 border rounded-xl ml-2 max-w-2xl">
          <p className="text-justify text-white px-2 py-2">
            Haha, yên tâm đi. Mình mang theo đủ rồi.
          </p>
        </div>
      </div>
      <div className="w-full flex justify-end">
        <div className="bg-blue p-2 border rounded-xl ml-2 max-w-2xl">
          <p className="text-justify text-white px-2 py-2">See you soon!</p>
        </div>
      </div>
    </div>
  );
};

const Chat = () => {
  const { user, edit } = useSelector((state) => state.user);
  const { id } = useParams();

  const [showPicker, setShowPicker] = useState(false);
  const [review, setReview] = useState();
  const [reviewcheck, setReviewcheck] = useState(false);
  const myDivRef = useRef(null);
  const [page, setPage] = useState(1);
  const [createg, setCreatg] = useState(false);
  const [manageru, setManageru] = useState(false);
  const [block, setBlock] = useState(false);
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
  const [listsuggest, setListsuggest] = useState();
  const [socket, setSocket] = useState();
  const [listchat, setListchat] = useState([]);
  const [addu, setAddu] = useState(false);
  const [roleo, setRoleo] = useState(false);
  const [userinfo, setUserinfo] = useState();
  const navigate = useNavigate();
  const [fetchchats, setFetchchats] = useState();
  const [search, setSearch] = useState("");
  const [newChat, setNewChat] = useState(false);
  const [idroom, setIdroom] = useState();
  const childRef = useRef();
  const [type, setType] = useState("inbox");
  const userChat = (user) => {
    setUserinfo(user);
  };
  const id_1 = user?._id;

  // console.log(user);

  const handlepage = (id) => {
    setPage(id);
  };

  // const onchangepage = async (id) => {
  //   await handlepage(id);
  //   position();
  // };

  const fetchList = async () => {
    try {
      const userId = user?._id;
      const res = await chatfetchListpersonal(user?.token, userId);
      res?.message == "Conversation not found"
        ? setListchat([])
        : setListchat(res?.data);
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };
  const handleSearch = async (e) => {
    e.preventDefault();
    if (search === "") {
      fetchList();
      fetchSuggestFriends();
    } else {
      try {
        console.log(`/users/search/${search}`);
        const res = await searchUserName(user?.token, search);
        console.log(res);
        setListchat(res);
        // setsuggestedFriends(res);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const fetchSuggestFriends = async () => {
    try {
      const res = await userfriendSuggest(user?.token, user);
      if (res?.status === "failed") {
        Cookies.set("message", res?.message, { expires: 7 });
        navigate("/error");
      }
      console.log(res);
      setListsuggest(res?.suggestedFriends);
    } catch (error) {
      console.log(error);
    }
  };
  const hanldeUserchat = async (user) => {
    console.log(user);
    userChat(user);

    console.log(id_1);

    const id_2 = user?._id;
    try {
      const res = await createConversations(user?.token, id_1, id_2);
      console.log(res);
      setIdroom(res);
    } catch (error) {
      console.log(error);
    }

    // for (const item of listchat) {
    //   if (item.members && item.members.includes(user?._id)) {
    //     log("true");

    //     // setNewChat(true);
    //     break;
    //   } else {
    //     try {
    //       console.log(id_2);

    //       const res = await createConversations(user?.token, id_1, id_2);
    //       console.log(res);
    //     } catch (error) {
    //       console.log(error);
    //     }
    //   }
    //}
  };

  // useEffect(() => {
  //   const socketConnect = io("http://localhost:3005", {
  //     auth: { token: user?.token },
  //   });
  //   return socketConnect.disconnect();
  // }, []);

  const fetchchatforchild = async (idroom) => {
    await childRef.current.fetchchat(idroom);
    console.log(idroom);
    childRef.current.position();
  };

  // const newSocket = io("ws://localhost:3005", {
  //   reconnection: true,
  //   transports: ["websocket"],
  // });
  useEffect(() => {
    // position();
    const newSocket = io("ws://localhost:3005", {
      reconnection: true,
      transports: ["websocket"],
    });
    setSocket(newSocket);
    let userId = id_1;
    newSocket.emit("userOnline", { userId });

    fetchList();
    fetchSuggestFriends();

    // newSocket.on("receiveMessage", (data) => {
    //   console.log(data);
    //   fetchList();
    //   fetchchatforchild();

    // });

    return () => {
      newSocket.emit("userOffline", { id_1 });
      newSocket.disconnect();
    };
  }, []);
  useEffect(() => {
    console.log("trigger");
    console.log(idroom);
    // newSocket.on("receiveMessage", (data) => {
    //   console.log(data);
    //   fetchList();
    //   fetchchatforchild(idroom);
    // });
  }, [idroom]);
  return (
    <div className="flex">
      <div
        className="flex flex-col home w-full px-0 lg:px-10  2xl-40 bg-bgColor 
    lg:rounded-lg h-screen overflow-hidden"
      >
        <TopBar user={user} />
        <div className="w-full flex gap-2 lg:gap-4 pt-5 pb-32 h-full shrink-0">
          {/* {LEFT} */}
          <div className="h-full w-20 rounded-xl bg-primary overflow-hidden flex flex-col justify-between">
            <div className="w-full  gap-7 flex flex-col items-center content-end justify-start py-5 ">
              <div className="hover:bg-ascent-3/30 py-1 px-1 rounded-xl">
                <IoIosChatbubbles className="text-ascent-1 " size={30} />
              </div>
              <div className="hover:bg-ascent-3/30 py-1 px-1 rounded-xl">
                <IoIosContact className="text-ascent-1 " size={30} />
              </div>
              <div className="hover:bg-ascent-3/30 py-1 px-1 rounded-xl">
                <FaVideo className="text-ascent-1 " size={25} />
              </div>

              {/* <IoIosSettings className=" text-ascent-1 " size={30} /> */}
            </div>

            <div className=" w-full bg-primary flex justify-center items-end py-5">
              <div className="hover:bg-ascent-3/30 py-1 px-1 rounded-xl">
                <IoIosSettings className=" text-ascent-1 " size={30} />
              </div>
            </div>
          </div>
          <div
            className="w-1/5 lg:w-1/5 h-full bg-primary md:flex flex-col gap-1
        overflow-y-auto overflow-x-hidden rounded-xl grow-0"
          >
            <div>
              <div className="w-full font-bold text-ascent-1 text-3xl px-5 py-5">
                Chat
              </div>
              <div className="w-full flex flex-col items-center px-4">
                <form
                  className="hidden md:flex w-full items-center justify-center gap-5"
                  onSubmit={(e) => handleSearch(e)}
                >
                  <input
                    type="text"
                    className="px-5 bg-secondary text-ascent-2 rounded-full w-full border border-[#66666690] 
        outline-none text-sm  
         py-2 placeholder:text-ascent-2"
                    placeholder="Search"
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </form>
              </div>
            </div>
            <div className="w-full h-fit flex gap-2 mx-4 mt-2">
              <div
                className="text-ascent-1 bg-ascent-3/30 rounded-full px-3 py-1 cursor-pointer"
                onClick={() => {
                  setType("inbox");
                }}
              >
                Inbox
              </div>
              <div
                className="text-ascent-1 bg-ascent-3/30 rounded-full px-3 py-1 cursor-pointer"
                onClick={() => {
                  setType("group");
                }}
              >
                Group
              </div>
            </div>
            {type == "group" && (
              <div className="w-full flex justify-center items-center  px-4 pt-2 cursor-pointer">
                <div
                  className="bg-blue text-white w-full flex justify-center items-center py-2 rounded-xl cursor-pointer"
                  onClick={() => {
                    setCreatg(true);
                  }}
                >
                  Create Group
                </div>
              </div>
            )}

            <div className="w-full h-2/3 gap-3 flex flex-col pt-2">
              {listchat && listchat.length > 0 ? (
                listchat.map((itemchat) => {
                  return (
                    <UserCard
                      key={itemchat?._id}
                      user={user}
                      socket={socket}
                      itemchat={itemchat}
                      conversationId={itemchat?._id}
                      fetchList={fetchList}
                      ref={childRef}
                      // event={() => {
                      //   onchangepage(user?.page);
                      // }}
                      hanldeUserchat={hanldeUserchat}
                      // onUser={() => {
                      //   hanldeUserchat(user);
                      // }}
                    />
                  );
                })
              ) : (
                <div className="w-full text-ascent-2 h-1/3 flex justify-center items-center text-xl ">
                  Conversation not found
                </div>
              )}
              <div className="w-full text-ascent-1 flex justify-center items-start text-xl flex-col">
                <div className="w-full px-5 text-xl">Suggest</div>
                {/* {listsuggest &&
                  listsuggest?.length > 0 &&
                  listsuggest?.map((user) => {
                    return (
                      <UserCard
                        key={user?._id}
                        user={user}
                        onUser={() => {
                          hanldeUserchat(user);
                        }}
                      />
                    );
                  })} */}
              </div>
            </div>
            {/* <FriendsCard friends={user?.friends} /> */}
          </div>
          <RangeChat
            user={user}
            userinfo={userinfo}
            newChat={newChat}
            setNewChat={setNewChat}
            reviewcheck={reviewcheck}
            setReviewcheck={setReviewcheck}
            review={review}
            setReview={setReview}
            idroom={idroom}
            fetchList={fetchList}
            socket={socket}
            ref={childRef}
            fetchchatforchild={fetchchatforchild}
          />
        </div>
      </div>
      {/* Xem trước ảnh */}
      {reviewcheck && (
        <div className="absolute z-50 w-full h-full">
          <ImageCheck
            img={review}
            review={reviewcheck}
            setReview={setReviewcheck}
          />
        </div>
      )}
      {/* CREATGROUP */}
      {createg && <CreateGroup setCreatg={setCreatg} />}
      {/* ADD member */}
      {addu && (
        <div className="absolute w-full h-full bg-secondary/30 z-50 ">
          <div className="w-full h-full flex justify-center items-center">
            <div className="bg-primary px-3 py-3 flex flex-col gap-4 w-1/6 h-[40%] rounded-2xl">
              <div className="w-full flex px-3 pb-3 border-b border-[#66666645]">
                <span className="text-ascent-1 w-full flex items-center justify-between text-xl font-medium ">
                  Add member
                  <div
                    className="text-ascent-1 h-full flex items-center cursor-pointer"
                    onClick={() => {
                      setAddu(!addu);
                    }}
                  >
                    <MdClose size={25} />
                  </div>
                </span>
              </div>

              <input
                type="text"
                className="bg-secondary px-4 py-2 rounded-2xl outline-none text-ascent-1"
                placeholder="Search"
              />
              <div className="content-start border-b border-[#66666645] pb-2 h-1/4 bg-primary gap-2 overflow-y-auto flex flex-wrap ">
                <div className="w-fit h-fit bg-secondary px-2 py-1 text-ascent-1 flex gap-2 justify-center items-center rounded-3xl">
                  <img
                    src={user?.profileUrl}
                    alt=""
                    className="h-5 w-5 rounded-full object-cover"
                  />
                  {user?.firstName}
                  <IoIosAddCircle />
                </div>
                <div className="w-fit h-fit bg-secondary px-2 py-1 text-ascent-1 flex gap-2 justify-center items-center rounded-3xl">
                  <img
                    src={user?.profileUrl}
                    alt=""
                    className="h-5 w-5 rounded-full object-cover"
                  />
                  {user?.firstName}
                  <IoIosAddCircle />
                </div>
                <div className="w-fit h-fit bg-secondary px-2 py-1 text-ascent-1 flex gap-2 justify-center items-center rounded-3xl">
                  <img
                    src={user?.profileUrl}
                    alt=""
                    className="h-5 w-5 rounded-full object-cover"
                  />
                  {user?.firstName}
                  <IoIosAddCircle />
                </div>
                <div className="w-fit h-fit bg-secondary px-2 py-1 text-ascent-1 flex gap-2 justify-center items-center rounded-3xl">
                  <img
                    src={user?.profileUrl}
                    alt=""
                    className="h-5 w-5 rounded-full object-cover"
                  />
                  {user?.firstName}
                  <IoIosAddCircle />
                </div>
                <div className="w-fit h-fit bg-secondary px-2 py-1 text-ascent-1 flex gap-2 justify-center items-center rounded-3xl">
                  <img
                    src={user?.profileUrl}
                    alt=""
                    className="h-5 w-5 rounded-full object-cover"
                  />
                  {user?.firstName}
                  <IoIosAddCircle />
                </div>
                <div className="w-fit h-fit bg-secondary px-2 py-1 text-ascent-1 flex gap-2 justify-center items-center rounded-3xl">
                  <img
                    src={user?.profileUrl}
                    alt=""
                    className="h-5 w-5 rounded-full object-cover"
                  />
                  {user?.firstName}
                  <IoIosAddCircle />
                </div>
                <div className="w-fit h-fit bg-secondary px-2 py-1 text-ascent-1 flex gap-2 justify-center items-center rounded-3xl">
                  <img
                    src={user?.profileUrl}
                    alt=""
                    className="h-5 w-5 rounded-full object-cover"
                  />
                  {user?.firstName}
                  <IoIosAddCircle />
                </div>
                <div className="w-fit h-fit bg-secondary px-2 py-1 text-ascent-1 flex gap-2 justify-center items-center rounded-3xl">
                  <img
                    src={user?.profileUrl}
                    alt=""
                    className="h-5 w-5 rounded-full object-cover"
                  />
                  {user?.firstName}
                  <IoIosAddCircle />
                </div>
                <div className="w-fit h-fit bg-secondary px-2 py-1 text-ascent-1 flex gap-2 justify-center items-center rounded-3xl">
                  <img
                    src={user?.profileUrl}
                    alt=""
                    className="h-5 w-5 rounded-full object-cover"
                  />
                  {user?.firstName}
                  <IoIosAddCircle />
                </div>
                <div className="w-fit h-fit bg-secondary px-2 py-1 text-ascent-1 flex gap-2 justify-center items-center rounded-3xl">
                  <img
                    src={user?.profileUrl}
                    alt=""
                    className="h-5 w-5 rounded-full object-cover"
                  />
                  {user?.firstName}
                  <IoIosAddCircle />
                </div>
                <div className="w-fit h-fit bg-secondary px-2 py-1 text-ascent-1 flex gap-2 justify-center items-center rounded-3xl">
                  <img
                    src={user?.profileUrl}
                    alt=""
                    className="h-5 w-5 rounded-full object-cover"
                  />
                  {user?.firstName}
                  <IoIosAddCircle />
                </div>
                <div className="w-fit h-fit bg-secondary px-2 py-1 text-ascent-1 flex gap-2 justify-center items-center rounded-3xl">
                  <img
                    src={user?.profileUrl}
                    alt=""
                    className="h-5 w-5 rounded-full object-cover"
                  />
                  {user?.firstName}
                  <IoIosAddCircle />
                </div>
                <div className="w-fit h-fit bg-secondary px-2 py-1 text-ascent-1 flex gap-2 justify-center items-center rounded-3xl">
                  <img
                    src={user?.profileUrl}
                    alt=""
                    className="h-5 w-5 rounded-full object-cover"
                  />
                  {user?.firstName}
                  <IoIosAddCircle />
                </div>
                <div className="w-fit h-fit bg-secondary px-2 py-1 text-ascent-1 flex gap-2 justify-center items-center rounded-3xl">
                  <img
                    src={user?.profileUrl}
                    alt=""
                    className="h-5 w-5 rounded-full object-cover"
                  />
                  {user?.firstName}
                  <IoIosAddCircle />
                </div>
                <div className="w-fit h-fit bg-secondary px-2 py-1 text-ascent-1 flex gap-2 justify-center items-center rounded-3xl">
                  <img
                    src={user?.profileUrl}
                    alt=""
                    className="h-5 w-5 rounded-full object-cover"
                  />
                  {user?.firstName}
                  <IoIosAddCircle />
                </div>
                <div className="w-fit h-fit bg-secondary px-2 py-1 text-ascent-1 flex gap-2 justify-center items-center rounded-3xl">
                  <img
                    src={user?.profileUrl}
                    alt=""
                    className="h-5 w-5 rounded-full object-cover"
                  />
                  {user?.firstName}
                  <IoIosAddCircle />
                </div>
              </div>
              <div className="h-1/4 flex flex-wrap items-start gap-2 overflow-y-auto content-start">
                <UserTiitle />
                <UserTiitle />
                <UserTiitle />
                <UserTiitle />
                <UserTiitle />
              </div>

              <div className="w-full flex justify-end items-end">
                <CustomButton
                  tittle="Submit"
                  containerStyles="bg-blue w-fit px-2 py-2 rounded-xl text-white"
                />
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Manager member */}
      {/* <div className="absolute w-full h-full bg-secondary/30 z-50 ">
        <div className="w-full h-full flex justify-center items-center">
          <div className="bg-primary px-3 py-3 flex flex-col gap-4 w-1/6 h-1/2 rounded-2xl">
            <div className="w-full flex px-3 pb-3 border-b border-[#66666645]">
              <span className="text-ascent-1 w-full flex items-center justify-between text-xl font-medium ">
                Manager member
                <div className="text-ascent-1 h-full flex items-center cursor-pointer">
                  <MdClose size={25} />
                </div>
              </span>
            </div>

            <input
              type="text"
              className="bg-secondary px-4 py-2 rounded-2xl outline-none text-ascent-1"
              placeholder="Search"
            />
            <div className=" border-b content-start border-[#66666645] pb-2 h-3/4 bg-primary gap-2 overflow-y-auto flex flex-col ">
              <div className="w-full relative h-fit bg-secondary px-2 py-2 text-ascent-1 flex gap-2 justify-between items-center rounded-3xl">
                <div className="flex justify-center items-center gap-3">
                  <img
                    src={user?.profileUrl ? user?.profileUrl : NoProfile}
                    alt=""
                    className="h-16 w-16 rounded-full object-cover"
                  />
                  {user?.firstName} {user?.lastName}
                </div>

                <SlOptionsVertical className="mr-2" />
                <div className="absolute w-40 h-20 top-[80%] right-6 z-50 select-none">
                  <div className="w-full h-full bg-secondary border border-[#66666645] overflow-hidden rounded-2xl shadow-md top-[100%] right-0">
                    <div
                      onClick={() => {}}
                      className="w-full h-1/2 text-ascent-1 flex justify-center items-center py-3 hover:bg-ascent-3/30"
                    >
                      Change Role
                    </div>
                    <div className="w-full h-1/2 text-ascent-1 flex justify-center items-center py-3 hover:bg-ascent-3/30">
                      Delete
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full flex justify-end">
              <CustomButton
                tittle="Close"
                containerStyles="bg-blue w-fit px-2 py-2 rounded-xl text-white"
              />
            </div>
          </div>
        </div>
      </div> */}
      {/*ROLE*/}
      {roleo && (
        <div className="absolute w-full h-full bg-secondary/30 z-50 ">
          <div className="w-full h-full flex justify-center items-center">
            <div className="bg-primary px-3 py-3 flex flex-col gap-4 w-1/6 h-1/2 rounded-2xl">
              <div className="w-full flex px-3 pb-3 border-b border-[#66666645]">
                <span className="text-ascent-1 w-full flex items-center justify-between text-xl font-medium ">
                  Manager member
                  <div
                    className="text-ascent-1 h-full flex items-center cursor-pointer"
                    onClick={() => {
                      setRoleo(!roleo);
                    }}
                  >
                    <MdClose size={25} />
                  </div>
                </span>
              </div>

              <input
                type="text"
                className="bg-secondary px-4 py-2 rounded-2xl outline-none text-ascent-1"
                placeholder="Search"
              />
              <div className=" border-b content-start border-[#66666645] pb-2 h-3/4 bg-primary gap-2 overflow-y-auto flex flex-col ">
                <div className="w-full relative h-fit bg-secondary px-2 py-2 text-ascent-1 flex gap-2 justify-between items-center rounded-3xl">
                  <div className="flex justify-center items-center gap-3">
                    <img
                      src={user?.profileUrl ? user?.profileUrl : NoProfile}
                      alt=""
                      className="h-16 w-16 rounded-full object-cover"
                    />
                    {user?.firstName} {user?.lastName}
                  </div>

                  <SlOptionsVertical className="mr-2" />
                  <div className="absolute w-40 h-20 top-[80%] right-6 z-50 select-none">
                    <div className="w-full h-full bg-secondary border border-[#66666645] overflow-hidden rounded-2xl shadow-md top-[100%] right-0">
                      <div
                        onClick={() => {}}
                        className="w-full h-1/2 text-ascent-1 flex justify-center items-center py-3 hover:bg-ascent-3/30"
                      >
                        Change Role
                      </div>
                      <div className="w-full h-1/2 text-ascent-1 flex justify-center items-center py-3 hover:bg-ascent-3/30">
                        Delete
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div
                className="w-full flex justify-end"
                onClick={() => {
                  setRoleo(!roleo);
                }}
              >
                <CustomButton
                  tittle="Close"
                  containerStyles="bg-blue w-fit px-2 py-2 rounded-xl text-white"
                />
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Ratio */}
      {/* {addu && (
        <div className="absolute w-full h-full bg-secondary/30 z-50 ">
          <div className="w-full h-full flex justify-center items-center">
            <div className="bg-primary px-3 py-3 flex flex-col gap-4 w-1/6 h-1/3 rounded-2xl">
              <div className="w-full flex px-3 pb-3 border-b border-[#66666645]">
                <span className="text-ascent-1 w-full flex items-center justify-between text-xl font-medium ">
                  Role
                  <div
                    className="text-ascent-1 h-full flex items-center cursor-pointer"
                    onClick={() => {
                      setAddu(!addu);
                    }}
                  >
                    <MdClose size={25} />
                  </div>
                </span>
              </div>

              <div className=" border-b content-start border-[#66666645] pb-2 h-3/4 bg-primary gap-2 overflow-y-auto flex flex-col ">
                <label
                  htmlFor="admin"
                  className="w-full text-ascent-1 flex gap-3  px-4 py-4 hover:bg-ascent-3/30 rounded-xl "
                >
                  <input
                    type="radio"
                    id="admin"
                    name="role"
                    value="Admin"
                    checked
                  />
                  <label htmlFor="admin">Admin</label>
                </label>
                <label
                  htmlFor="member"
                  className="w-full text-ascent-1 flex gap-3  px-4 py-4 hover:bg-ascent-3/30 rounded-xl "
                >
                  <input type="radio" id="member" name="role" value="Member" />
                  <label htmlFor="member">Member</label>
                </label>
              </div>

              <div className="w-full flex justify-end">
                <CustomButton
                  tittle="Close"
                  containerStyles="bg-blue w-fit px-2 py-2 rounded-xl text-white"
                />
              </div>
            </div>
          </div>
        </div>
      )} */}
    </div>
  );
};

export default Chat;
