import React, {
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import {
  TopBar,
  ImageCheck,
  UserTiitle,
  CustomButton,
  Loading,
  LinkPr,
  Managergroup,
  AddMember,
  EditFix,
  FriendsCard,
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
import { RiSendPlane2Fill } from "react-icons/ri";
import { BsBriefcase } from "react-icons/bs";
import { IoAddCircleSharp } from "react-icons/io5";
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
import { BgImage, GroupImg, NoProfile } from "../assets";

import { io } from "socket.io-client";
import {
  chatfetchListpersonal,
  createConversations,
  fetchChat,
  seenMessage,
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
import { aichecktext } from "../until/ai";
import { sendMessageGroup } from "../until/group";
import ChatUser from "../components/ChatUser";
import AddNewMember from "../components/AddNewMember";
import FriendCardf from "../components/FriendCardf";
import FriendCardfChat from "../components/FriendCardfChat";
import { useSocket } from "../context/SocketContext";

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
      type,
      fetchchatforchild,
      setRoleo,
      setAddu,
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
    const [faild, setFald] = useState([]);
    const [after, setAfter] = useState([]);
    const [onScreen, setOnscreen] = useState(false);
    const [isFetching, setIsFetching] = useState(false);
    const thisRoom = useRef("");
    const [nextchat, setNextchat] = useState([]);
    const chatWindowRef = useRef(null);
    const [toggle, setToggle] = useState(false);
    const [trigger, setTrigger] = useState(false);
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
    };
    const onEmojiClick = (e) => {
      setChat((prevInput) => prevInput + e.emoji);
      setShowPicker(false);
    };
    console.log(userinfo);

    const fetchchat = async (idroom) => {
      try {
        const res = await fetchChat(user?.token, idroom, 1);
        console.log(res);
        console.log(faild);
        try {
          console.log(res?.data?.messages[0]);
          console.log(user?._id);
          try {
            for (let message of res?.data?.messages || []) {
              console.log(message);

              let check = false;
              if (message.senderId === user?._id) {
                for (let obj of message?.readStatus) {
                  console.log(obj);

                  if (obj.status === "read" && obj.userId != user?._id) {
                    console.log(obj);
                    console.log(user?._id);

                    message.checked
                      ? message.checked.push(obj?.userId)
                      : (message.checked = [obj?.userId]);
                    check = true;
                    break;
                  }
                }
              }
              if (check) {
                break;
              }
            }
          } catch (error) {
            console.log(error);
          }

          console.log(res?.data?.messages);
          // setListchat((pre) => [...pre, ...res?.data?.messages]);
          setListchat(res?.data?.messages);
          setPage(2);
        } catch (error) {
          console.log(error);
        }
        setOnscreen(true);
        position();
        // setLoading(false);
      } catch (error) {
        console.log(error);
      }
    };

    const fetchnextchat = async (idroom) => {
      try {
        console.log(page);
        console.log(idroom);

        const res = await fetchChat(user?.token, idroom, page);
        console.log(res);

        console.log(faild);
        try {
          if (
            res?.message != "Không thể lấy tin nhắn trong hội thoại." &&
            res?.data?.remainingPages > 0
          ) {
            // const lists = [...listchat, ...res?.data?.messages];
            // setListchat((pre) => [...pre, ...res?.data?.messages]);
            setNextchat(res?.data?.messages);
          }
        } catch (error) {
          console.log(error);
        }
      } catch (error) {
        console.log(error);
      }
    };

    const fetchchatSeen = async (idroom) => {
      try {
        console.log(listchat);

        const res = await fetchChat(user?.token, idroom, 1);
        console.log(res);
        console.log(faild);
        try {
          console.log(res?.data?.messages[0]);
          console.log(user?._id);
          try {
            for (let message of res?.data?.messages || []) {
              console.log(message);

              let check = false;
              if (message.senderId === user?._id) {
                for (let obj of message?.readStatus) {
                  if (obj.status === "read") {
                    console.log(message);

                    message.checked
                      ? message.checked.push(obj?._id)
                      : (message.checked = [obj?._id]);
                    check = true;
                    break;
                  }
                }
              }
              if (check) {
                break;
              }
            }
          } catch (error) {
            console.log(error);
          }

          const listChat = [...listchat];
          console.log(listChat);

          console.log(res);

          const updatechat = listChat.map((itemA) => {
            const itemB = res?.data?.messages.find(
              (item) => item._id === itemA._id
            );
            return itemB ? { ...itemA, ...itemB } : itemA;
          });

          console.log(updatechat);

          // setListchat(res?.data?.messages);
        } catch (error) {
          console.log(error);
        }
        setOnscreen(true);
        position();
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    };

    useEffect(() => {
      const newList =
        faild && faild.length > 0
          ? [...listchat, ...faild]
              .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
              .reverse()
          : listchat;
      console.log(newList);
      setAfter(newList);
    }, [listchat, faild]);

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
        console.log(chat);

        const res = await aichecktext(chat);
        console.log(res);

        if (res) {
          setFald((pre) => [
            ...pre,
            {
              status: "failed",
              senderId: user?._id,
              text: chat,
              createdAt: new Date(),
            },
          ]);

          console.log(faild);
        } else {
          const uri = file && (await handFileUpload(file));
          const res = await sendMessage(user?.token, idroom, id_1, chat, uri);

          handlesend(id_2, chat);
          setPage(2);
          console.log(res);
        }

        handlePr();
        setChat("");
        await fetchchat(idroom);
      } catch (error) {
        console.log(error);
      }
    };
    // const positionAfter = () => {
    //   setTimeout(() => {
    //     if (chatWindowRef.current) {
    //       console.log(chatWindowRef.current.scrollHeight);
    //       console.log(chatWindowRef.current.scrollTop);
    //       console.log(chatWindowRef.current.offsetHeight);
    //       chatWindowRef.current.scrollTop =
    //         chatWindowRef.current.scrollHeight -
    //         (chatWindowRef.current.scrollHeight -
    //           chatWindowRef.current.scrollTop);

    //     }
    //   }, 1000);
    // };
    const position = () => {
      setTimeout(() => {
        if (chatWindowRef.current) {
          // console.log(chatWindowRef.current.scrollHeight);
          // console.log(chatWindowRef.current.scrollTop);
          // console.log(chatWindowRef.current.offsetHeight);
          // chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
          chatWindowRef.current.scrollTo({
            top: chatWindowRef.current.scrollHeight,
            behavior: "smooth",
          });
          setTimeout(() => {
            setLoading(false);
          }, 400);

          // chatWindowRef.current.scrollIntoView({
          //   behavior: "smooth", // Cuộn mượt
          //   block: "end", // Đảm bảo cuộn về cuối phần tử
          // });
        }
      }, 700);
    };

    const handleScroll = useCallback(
      debounce((e) => {
        const target = e.target;

        if (target.scrollTop <= target.scrollHeight * 0.4 && !isFetching) {
          setPage((prevPage) => prevPage + 1);
          console.log(page);
          // fetchnextchat(idroom);
        }
      }, 100),
      [isFetching]
    );

    // await postrenewfetchPosts(user?.token, dispatch, 1);

    useEffect(() => {
      // thisRoom.current != idroom && setPage(2);
      const postRange = document.getElementById("listchat");
      postRange.addEventListener("scroll", handleScroll);

      return () => {
        postRange.removeEventListener("scroll", handleScroll);
      };
    }, [handleScroll]);

    // const handlepre = useCallback(
    //   debounce((e) => {
    //     const position = e.target;
    //     console.log(12312312);

    //     position.scrollTop < position.scrollHeight * 0.4 &&
    //       setPage((pre) => pre + 1);
    //   }, 500),
    //   []
    // );
    const handlePr = () => {
      // console.log(review, file);

      setReview(null);
      setFile(null);
    };

    const handleloading = () => {
      setLoading(true);
    };

    useImperativeHandle(ref, () => ({
      handleloading,
    }));

    // useEffect(() => {
    //   try {
    //     if (Array.isArray(listchat) && Array.isArray(nextchat)) {
    //       const before = [...listchat];
    //       const after = [...nextchat];
    //       const lists = [...before, ...after];
    //       setListchat(lists);
    //     } else {
    //       console.error("listchat or nextchat is not an array");
    //     }
    //     // setListchat(lists);
    //   } catch (error) {
    //     console.log(error);
    //   }
    // }, [nextchat]);
    useEffect(() => {
      console.log(page);
      setLoading(true);
      // listchat && fetchnextchat(idroom);
    }, [userinfo]);

    useEffect(() => {
      // setLoading(true);
      console.log(idroom);
      if (page == 1) {
        fetchchat(idroom);
      } else {
        fetchnextchat(idroom);
      }

      thisRoom.current = idroom;
      // return () => {
      //   setPage(2);
      //   postRange.removeEventListener("scroll", handleScroll);
      // };
      // postRange.removeEventListener("scroll", handleScroll);
      // return () => {
      //   setLoading(true);
      // };
    }, [idroom, page]);

    useEffect(() => {
      console.log(nextchat);

      listchat && setListchat([...listchat, ...nextchat]);
    }, [nextchat]);

    // const scrollToBottom = debounce(() => {
    //   if (chatWindowRef.current && onScreen) {
    //     chatWindowRef.current.scrollIntoView({
    //       behavior: "smooth", // Cuộn mượt
    //       block: "end", // Đảm bảo cuộn về cuối phần tử
    //     });
    //   }
    //   setLoading(false);
    // }, 300);

    // useEffect(() => {

    //   position();

    // }, [onScreen]);

    useEffect(() => {
      console.log("trigger");
      // const listchat = [...after];
      // console.log(listchat);
      // try {
      //   // console.log(res?.data?.messages[0]);
      //   // console.log(user?._id);
      //   try {
      //     for (let message of listchat || []) {
      //       console.log(message);

      //       let check = false;
      //       if (message.senderId === user?._id) {
      //         console.log(message);
      //         console.log(user?._id);

      //         message.checked = true;
      //         // ? message.checked.push(message?.userId)
      //         // : (message.checked = [message?.userId]);
      //         check = true;
      //       }
      //       if (check) {
      //         break;
      //       }
      //     }
      //   } catch (error) {
      //     console.log(error);
      //   }

      //   console.log(res?.data?.messages);
      //   // setListchat((pre) => [...pre, ...res?.data?.messages]);
      //   setListchat(res?.data?.messages);
      //   setPage(2);
      // } catch (error) {
      //   console.log(error);
      // }
      // fetchChat(idroom);
    }, [trigger]);

    // nhận tin nhắn
    useEffect(() => {
      setFald([]);
      if (socket && idroom) {
        socket.on("receiveMessage", (data) => {
          if (data?.message && data?.message != "seen") {
            console.log(data);
            fetchList();
            fetchchat(idroom);
            setPage(1);
          } else {
            // console.log(data);
            // fetchchatSeen(idroom);
            console.log(trigger);

            setTrigger((prevTrigger) => !prevTrigger);
            // fetchList();
            // fetchchat(idroom);
            // setPage(1);
            // try {
            //   console.log(res?.data?.messages[0]);
            //   console.log(user?._id);
            //   try {
            //     for (let message of listchat || []) {
            //       console.log(message);

            //       let check = false;
            //       if (message.senderId === user?._id) {
            //         console.log(obj);
            //         console.log(user?._id);

            //         message.checked
            //           ? message.checked.push(obj?.userId)
            //           : (message.checked = [obj?.userId]);
            //         check = true;
            //       }
            //       if (check) {
            //         break;
            //       }
            //     }
            //   } catch (error) {
            //     console.log(error);
            //   }

            //   console.log(res?.data?.messages);
            //   // setListchat((pre) => [...pre, ...res?.data?.messages]);
            //   setListchat(res?.data?.messages);
            //   setPage(2);
            // } catch (error) {
            //   console.log(error);
            // }
          }

          // fetchchatforchild(idroom);
        });
      }

      // return () => {
      //   setOnscreen(false);
      // };
      // console.log(socket);
    }, [socket, idroom]);

    return (
      <div className="flex-1 h-full bg-primary px-4 flex flex-col gap-6 overflow-hidden rounded-lg justify-between relative">
        {/* Phần tiêu đề của khung chat */}
        <div className="flex w-full justify-between mt-3 border-b border-[#66666645] pb-3 select-none ">
          <div className="text-ascent-1 font-bold text-3xl">
            {type == "inbox" ? (
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
            ) : (
              <div className=" flex text-ascent-1 text-sm items-center gap-1">
                <img
                  src={GroupImg}
                  alt="post image"
                  className="w-14 h-14 shrink-0 object-cover rounded-full "
                ></img>
                <div className="flex items-center w-full h-full">
                  <span className="align-middle">{userinfo?.name}</span>
                </div>
              </div>
            )}
          </div>
          <div className="flex relative justify-center items-center text-ascent-1 gap-2">
            <IoCallSharp size={25} />
            {type == "group" && (
              <div
                className="flex items-center justify-center"
                onClick={() => {
                  setToggle(!toggle);
                }}
              >
                <SlOptionsVertical size={25} className="cursor-pointer" />
              </div>
            )}
            {toggle && (
              <div className="absolute w-40 h-30 bg-secondary border border-[#66666645] overflow-hidden rounded-2xl shadow-md top-[100%] right-0">
                {/* <div
                  onClick={() => {
                    setCreatg(!createg);
                  }}
                  className="w-full h-1/3 text-ascent-1 flex justify-center items-center py-3 hover:bg-ascent-3/30"
                >
                  Create Group
                </div> */}
                <div
                  onClick={() => {
                    setRoleo(true);
                  }}
                  className="w-full h-1/3 text-ascent-1 flex justify-center items-center py-3 hover:bg-ascent-3/30"
                >
                  Manager
                </div>
                <div
                  onClick={() => {
                    setAddu(true);
                  }}
                  className="w-full h-1/3 text-ascent-1 flex justify-center items-center py-3 hover:bg-ascent-3/30"
                >
                  Add User
                </div>
              </div>
            )}
          </div>
        </div>
        {/* {loading && (
          <div className="absolute bg-primary w-full h-3/4 flex justify-center items-start ">
            <Loading />
          </div>
        )} */}

        {/* Phần nội dung của khung chat */}

        {/* Danh sách tin nhắn */}
        <div
          id="listchat"
          ref={chatWindowRef}
          className="flex grow-0 w-full h-3/4 overflow-y-auto relative"
        >
          {idroom ? (
            <PageChat
              listchat={after}
              socket={socket}
              userinfo={userinfo}
              idroom={idroom}
              type={type}
            />
          ) : (
            <div className="w-full h-[1000px]">Select Conversation</div>
          )}

          {/* {loading ? (
            <div className=" w-full h-full flex justify-center items-start ">
              <Loading />
            </div>
          ) : } */}
        </div>

        {/* Thêm phần tử cuối cùng để cuộn đến khi cần */}
        {/* <div ref={chatEndRef} /> */}

        {/* <div className="w-full flex text-ascent-2 text-xs font-normal items-center justify-end gap-2">
          <CiCircleCheck />
          Seen
        </div> */}

        {/* Phần nhập tin nhắn */}
        <div className="relative flex flex-col items-start">
          <div className="absolute bottom-20 right-20">
            {showPicker && (
              <Picker className="" theme={theme} onEmojiClick={onEmojiClick} />
            )}
          </div>
          {review && (
            <div className="absolute bottom-full flex h-20 w-20 bg-bgColor rounded-2xl overflow-hidden mx-2 my-2">
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

          <div className="flex w-full mb-3 justify-center relative items-center">
            <div
              className="h-full w-fit text-ascent-1 px-1 py-2 flex justify-center items-center"
              onClick={() => {}}
            >
              <label className="absolute left-4 rounded-xl text-blue cursor-pointer">
                <IoAddCircleSharp size={35} />
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
              <div className="overflow-hidden w-full h-full flex justify-center items-center bg-bgColor rounded-full focus:outline-none focus:ring focus:border-blue">
                <input
                  type="text"
                  value={chat}
                  onChange={(e) => {
                    setChat(e.target.value);
                  }}
                  placeholder="Type your message..."
                  className="w-full flex-1 py-1 pl-14 pr-5 text-ascent-1 rounded-full bg-bgColor focus:outline-0 text-wrap"
                />
                <div
                  className="h-full w-fit text-ascent-1 px-3 py-2 flex justify-center items-center "
                  onClick={() => {
                    setShowPicker(!showPicker);
                  }}
                >
                  <MdEmojiEmotions size={30} />
                </div>
              </div>

              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-1 rounded-lg ml-2 bg-blue select-none"
              >
                <RiSendPlane2Fill />
              </button>
            </form>
          </div>
        </div>
        {loading && (
          <div className="absolute bg-primary w-full h-full flex justify-center items-start top-0 left-0">
            <Loading />
          </div>
        )}
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
      hanldeGroupchat,
      type,
      fetchList,
      fetchchats,
      handlemember,
    },
    ref
  ) => {
    const [avatar, setAvatar] = useState();

    const userId = user?._id;
    const [time, setTime] = useState("");
    const [idroom, setIdroom] = useState("");
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

    useEffect(() => {
      joinroom(userId, conversationId);
      console.log(conversationId, idroom);

      // return () => {
      //   if (idroom != conversationId) {
      //     console.log(idroom);

      //     socket.emit("leaveGroup", { userId, groupId: conversationId });
      //     console.log(
      //       `Sent leaveGroup event with userId: ${userId} and groupId: ${conversationId}`
      //     );
      //   }
      // };
    }, [conversationId]);

    const outRoom = async () => {
      if (idroom != conversationId) {
        console.log(idroom);
        console.log(conversationId);
        socket.emit("leaveGroup", { userId, groupId: conversationId });
        console.log(
          `Sent leaveGroup event with userId: ${userId} and groupId: ${conversationId}`
        );
      }
    };

    const handleTime = () => {
      if (itemchat?.lastMessage?.timestamp) {
        const date = parseISO(itemchat.lastMessage.timestamp);
        const now = new Date();

        const totalMinutesDifference = differenceInMinutes(now, date);
        if (totalMinutesDifference < 60) {
          setTime(`${totalMinutesDifference}m`);
        } else if (totalMinutesDifference < 1440) {
          const hours = Math.floor(totalMinutesDifference / 60);
          const minutes = totalMinutesDifference % 60;

          setTime(`${hours}h`);
        } else {
          const daysDifference = differenceInDays(now, date);
          setTime(`${daysDifference} day${daysDifference > 1 ? "s" : ""}`);
        }
      } else {
        return;
      }
    };
    const handleroom = async () => {
      await setIdroom(conversationId);
    };

    const handle = () => {
      // eventc();
      console.log(user);
      setIdroom(conversationId);
      itemchat?.type == "group" ? hanldeGroupchat() : hanldeUserchat(avatar);
      itemchat?.type == "group" && handlemember();
    };
    const getAvatar = async () => {
      try {
        const res = await usergetUserpInfo(user?.token, id);
        console.log(res);

        setAvatar(res);
      } catch (error) {
        console.log(error);
      }
    };
    useEffect(() => {
      getAvatar();
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
        {type == "inbox" ? (
          <img
            src={avatar?.profileUrl ?? NoProfile}
            alt={avatar?.firstName}
            className="w-14 h-14 object-cover rounded-full"
          />
        ) : (
          <img src={GroupImg} className="w-14 h-14 object-cover rounded-full" />
        )}

        <div className="flex-col w-full flex h-full justify-center">
          <div className="flex justify-between">
            {type == "inbox" ? (
              <span className="text-ascent-1">
                {avatar?.firstName} {avatar?.lastName}
              </span>
            ) : (
              <span className="text-ascent-1">{itemchat?.name}</span>
            )}

            <span className="text-ascent-2 ">{time}</span>
          </div>
          <span className="text-ascent-2">
            {itemchat?.lastMessage
              ? itemchat?.lastMessage?.content?.length > 20
                ? itemchat?.lastMessage?.content.slice(0, 20) + "..."
                : itemchat?.lastMessage?.content
              : "New chat"}
          </span>
        </div>
      </div>
    );
  }
);

const PageChat = ({ listchat, socket, userinfo, idroom, type }) => {
  const { user } = useSelector((state) => state.user);
  const [isme, setIsme] = useState(true);
  const [visibleChats, setVisibleChats] = useState([]);
  const chatRefs = useRef([]);

  console.log(listchat);
  const id_1 = user?._id;
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

  // const handlescroll = () => {
  //   let position = document.getElementById("window_chat");
  //   let position1 = document.getElementById("window_chatlist");

  //   if (position) {
  //     console.log(position);

  //     console.log(position.scrollTop);
  //     console.log(position.scrollHeight);
  //     console.log("offsetHeight:", position.offsetHeight);
  //     position1.scrollTo({
  //       top: 500,
  //       behavior: "smooth", // Cuộn mượt
  //     });
  //     // position.scrollTop = position.scrollHeight;
  //     setTimeout(() => {
  //       console.log(position.scrollTop);
  //     }, 100);
  //   }
  // };

  const handleSeen = async (id_1, id_2) => {
    // const check = listchat.find((item) => item?._id == id_2);
    // !check && (await seenMessage(id_1, id_2));
    console.log(id_1, id_2);

    await seenMessage(user?.token, id_1, id_2);
  };

  const checkurl = (text) => {
    const urlRegex = /https?:\/\/[^\s]+/gi;
    return urlRegex.test(text); // Trả về true nếu tồn tại URL
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const chatId = entry.target.dataset.id;
            const senderId = entry.target.dataset.senderid;
            // console.log(senderId);

            if (!visibleChats.includes(chatId)) {
              setVisibleChats((prev) => [...prev, chatId]);
              const id_2 = chatId; // Thêm ID vào danh sách visibleChats
              // handleSeen(id_1, id_2);
              console.log(id_1);

              const privateMessage = "seen";
              const result = listchat.find(
                (listchat) => listchat._id === chatId
              );
              console.log(result);
              console.log(user?._id);

              if (socket) {
                if (idroom) {
                  const found = result?.readStatus?.find(
                    (item) => item.userId === id_1 && item.status != "read"
                  );

                  console.log(found);

                  // if (result?.readStatus?.status !== "read" || "sent")
                  if (found) {
                    console.log(result);
                    handleSeen(id_1, id_2);
                    socket.emit("sendMessage", {
                      idConversation: idroom,
                      message: privateMessage,
                    });
                  }
                }
              }
              // socket &&
              //   idroom &&
              //   result?.readStatus?.status !== "read" &&
              //   socket.emit("sendMessage", {
              //     idConversation: idroom,
              //     message: privateMessage,
              //   });
            }
          }
        });
      },
      { threshold: 0.5 } // Khi ít nhất 50% phần tử hiển thị
    );

    // Gắn observer vào các phần tử có class "itemchat"
    chatRefs.current.forEach((chatElement) => {
      if (chatElement) {
        // Kiểm tra phần tử tồn tại
        observer.observe(chatElement); // Quan sát phần tử DOM
      }
    });

    return () => {
      observer.disconnect(); // Hủy observer khi component unmount
    };
  }, [listchat]);
  return (
    <div
      id="window_chatlist"
      className="w-full h-full flex justify-center items-start "
    >
      {/* <div className="absolute bg-blue overflow-y-auto">
        <h3>Visible Posts:</h3>
        <ul>
          {visibleChats.length > 0 ? (
            visibleChats.map((postId) => (
              <li key={postId}>Post ID: {postId}</li>
            ))
          ) : (
            <p>No post is visible yet.</p>
          )}
        </ul>
      </div> */}
      {listchat && listchat?.length > 0 ? (
        <div id="window_chat" className="flex flex-col gap-2 w-full h-full">
          {listchat && listchat.length > 10 && (
            <div className="mt-2">
              <Loading />
            </div>
          )}
          {listchat
            ?.slice() // Tạo một bản sao của mảng
            .reverse()
            ?.map((chat, index, listchat) => {
              return chat?.senderId == user?._id ? (
                <div
                  className="w-full flex-col flex justify-end"
                  key={chat?._id}
                >
                  <div className="flex flex-col items-end ">
                    <div
                      className={`${
                        chat?.status == "sent" || chat?.status == "read"
                          ? "bg-blue"
                          : "bg-secondary/70"
                      } p-2 rounded-xl ml-2 max-w-2xl relative group`}
                    >
                      <p
                        className={`${
                          chat?.status == "sent" || chat?.status == "read"
                            ? "text-white"
                            : "text-[#f64949fe]"
                        } text-justify  px-2 py-1 break-words`}
                      >
                        {chat?.text}
                      </p>
                      {/* {chat?.status !== "sent" ||
                        (chat?.status !== "read" && (
                          <div
                        className={`flex justify-end w-full 
                          text-[#f64949fe]
                        } text-xs pt-1 py-2 `}
                      >
                        Sensitive
                        
                      </div>
                        ))} */}

                      {/* <div
                        className={`flex justify-end w-full ${
                          chat?.status == "sent" || chat?.status == "read"
                            ? "text-white"
                            : "text-[#f64949fe]"
                        } text-xs pt-1 py-2 `}
                      >
                        {chat?.status == "sent" || chat?.status == "read"
                          ? handleTime(chat?.timestamp)
                          : "Sensitive"}
                      </div> */}
                      {chat?.timestamp && (
                        <div className="absolute top-0 w-fit whitespace-nowrap right-full  h-fit mt-2 hidden group-hover:flex bg-white text-[#000000] items-center justify-center text-sm rounded shadow-lg py-1 px-2">
                          {handleTime(chat?.timestamp)}
                        </div>
                      )}
                    </div>
                    {chat?.file_url && (
                      <img
                        src={chat?.file_url}
                        alt=""
                        className="w-96 p-2 ml-2 rounded-3xl object-cover"
                      />
                    )}
                    {checkurl(chat?.text) && (
                      <div className="max-w-xs rounded-xl overflow-hidden">
                        <LinkPr text={chat?.text} />
                      </div>
                    )}
                  </div>

                  {chat?.checked && type != "group" && (
                    <div className="flex text-ascent-2 text-xs font-normal items-center justify-end gap-2">
                      <CiCircleCheck />
                      Seen
                    </div>
                  )}
                  {/* {chat?.checked && <div className="bg-blue">Seen </div>} */}
                </div>
              ) : (
                <div
                  className="w-full itemchat "
                  ref={(el) => chatRefs.current.push(el)}
                  key={chat?._id}
                  data-id={chat._id}
                  data-senderid={chat.senderId}
                >
                  <div>
                    {index < listchat.length &&
                      listchat[index]?.senderId !=
                        listchat[index + 1]?.senderId && (
                        // <div className="flex items-center justify-center w-fit gap-2 mb-2">
                        //   <img
                        //     src={userinfo?.profileUrl || NoProfile}
                        //     className="w-7 h-7 object-cover rounded-lg"
                        //     alt=""
                        //   />
                        //   <span className="text-ascent-2">
                        //     {userinfo?.firstName}
                        //   </span>
                        // </div>
                        <ChatUser id={listchat[index].senderId} />
                      )}
                  </div>
                  <div className="bg-[#66666645] relative p-2 rounded-xl group ml-2 max-w-2xl w-fit">
                    <p className="text-justify text-ascent-1 px-2 py-1 break-words">
                      {chat?.text}
                    </p>
                    {/* <div className="flex justify-end w-full text-ascent-2 text-xs pt-1 py-2">
                      {handleTime(chat?.timestamp)}
                    </div> */}
                    {chat?.timestamp && (
                      <div className="absolute top-0 w-fit whitespace-nowrap left-full  h-fit mt-2 hidden group-hover:flex bg-white text-[#000000] items-center justify-center text-sm rounded shadow-lg py-1 px-2">
                        {handleTime(chat?.timestamp)}
                      </div>
                    )}
                  </div>
                  {chat?.file_url && (
                    <img
                      src={chat?.file_url}
                      alt="chat?.file_url"
                      className="w-96 p-2 ml-2 rounded-3xl object-cover"
                    />
                  )}
                  {checkurl(chat?.text) && (
                    <div className="max-w-xs overflow-hidden rounded-xl">
                      <LinkPr text={chat?.text} />
                    </div>
                  )}
                </div>
              );
            })}

          <div className="w-full flex justify-center"></div>

          {/* <div className="w-full flex text-ascent-2 text-xs font-normal items-center justify-end gap-2">
            <CiCircleCheck />
            Seen
          </div> */}
        </div>
      ) : (
        <div className="text-ascent-2 text-xl w-full h-full flex justify-center items-start">
          New Conversation
        </div>
      )}
    </div>
  );
};

const Chat = () => {
  const { user, edit } = useSelector((state) => state.user);
  const { id } = useParams();
  console.log(id);

  const [showPicker, setShowPicker] = useState(false);
  const [review, setReview] = useState();
  const [reviewcheck, setReviewcheck] = useState(false);
  const myDivRef = useRef(null);
  const [page, setPage] = useState(1);
  const [createg, setCreatg] = useState(false);
  const [manageru, setManageru] = useState(false);
  const [block, setBlock] = useState(false);

  const [listsuggest, setListsuggest] = useState();

  const [listchat, setListchat] = useState([]);
  const [listgroup, setListgroup] = useState([]);
  const [addu, setAddu] = useState(false);
  const [roleo, setRoleo] = useState(false);
  const [userinfo, setUserinfo] = useState();
  const navigate = useNavigate();
  const [fetchchats, setFetchchats] = useState();
  const [search, setSearch] = useState("");
  const [newChat, setNewChat] = useState(false);
  const [idroom, setIdroom] = useState();
  const childRef = useRef();
  const [member, setMember] = useState([]);
  const [listfriend, setListfriend] = useState(false);
  const [type, setType] = useState("inbox");
  const socket = useSocket();
  const userChat = (user) => {
    setUserinfo(user);
  };
  const id_1 = user?._id;

  console.log(user);

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
      if (res?.message == "Conversation not found") {
        setListchat([]);
      } else {
        const lists = [...res?.data];
        const listPersonal = [];
        const listGroup = [];
        listGroup.push(...lists.filter((list) => list?.type === "group"));
        listPersonal.push(...lists.filter((list) => list?.type === "personal"));
        setListchat(listPersonal);
        setListgroup(listGroup);
      }

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
  const handlemember = (members) => {
    setMember([...members]);
    console.log(members);
  };
  const hanldeUserchat = async (user) => {
    // if (childRef.current) {
    //   console.log(childRef.current);
    //   childRef.current.handleloading();
    //   console.log("11");
    // }

    console.log(user);
    userChat(user);

    // console.log(id_1);

    const id_2 = user?._id;
    try {
      const res = await createConversations(user?.token, id_1, id_2);
      console.log(res);
      setIdroom(res);
    } catch (error) {
      console.log(error);
    }
  };

  const hanldeGroupchat = async (itemchat) => {
    console.log(itemchat);
    userChat(itemchat);

    try {
      // const res = await createConversations(user?.token, id_1, id_2);

      console.log(123);
      setIdroom(itemchat?._id);
    } catch (error) {
      console.log(error);
    }
  };
  const getAvatar = async () => {
    try {
      const res = await usergetUserpInfo(user?.token, id);
      console.log(res);
      hanldeUserchat(res);
    } catch (error) {
      console.log(error);
    }
  };
  const fetchchatforchild = async (idroom) => {
    await childRef.current.fetchchat(idroom);
    console.log(idroom);
    childRef.current.position();
  };

  useEffect(() => {
    let userId = id_1;
    fetchList();
    fetchSuggestFriends();

    return () => {};
  }, []);
  // useEffect(() => {
  //   console.log(idroom);

  // }, [idroom]);
  useEffect(() => {
    id && getAvatar();
  }, []);
  return (
    <div className="flex">
      <div
        className="flex flex-col home w-full px-0 lg:px-10  2xl-40 bg-bgColor 
    lg:rounded-lg h-screen overflow-hidden"
      >
        <TopBar user={user} />
        <div className="w-full flex gap-2 lg:gap-4 pt-5 pb-32 h-full shrink-0">
          {/* {LEFT} */}
          <div className="h-full w-[4%] rounded-xl bg-primary overflow-hidden flex flex-col justify-between">
            <div className="w-full  gap-7 flex flex-col items-center content-end justify-start py-5 ">
              <div
                className="hover:bg-ascent-3/30 py-1 px-1 rounded-xl"
                onClick={() => {
                  setListfriend(false);
                }}
              >
                <IoIosChatbubbles className="text-ascent-1 " size={30} />
              </div>
              <div
                className="hover:bg-ascent-3/30 py-1 px-1 rounded-xl"
                onClick={() => {
                  setListfriend(true);
                }}
              >
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
          {!listfriend && (
            <div
              className="w-1/5  h-full bg-primary md:flex flex-col gap-1
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
        outline-none text-sm  py-2 placeholder:text-ascent-2"
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
                {type == "inbox" &&
                  listchat &&
                  listchat.length > 0 &&
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
                        type={type}
                        // event={() => {
                        //   onchangepage(user?.page);
                        // }}
                        hanldeUserchat={hanldeUserchat}
                        // onUser={() => {
                        //   hanldeUserchat(user);
                        // }}
                      />
                    );
                  })}

                {type == "group" &&
                  listgroup &&
                  listgroup.length > 0 &&
                  listgroup.map((itemchat) => {
                    return (
                      <UserCard
                        key={itemchat?._id}
                        user={user}
                        socket={socket}
                        itemchat={itemchat}
                        conversationId={itemchat?._id}
                        fetchList={fetchList}
                        ref={childRef}
                        handlemember={() => {
                          handlemember(itemchat.members);
                        }}
                        // event={() => {
                        //   onchangepage(user?.page);
                        // }}
                        hanldeGroupchat={() => {
                          hanldeGroupchat(itemchat);
                        }}
                        // onUser={() => {
                        //   hanldeUserchat(user);
                        // }}
                      />
                    );
                  })}
                {/* <div className="w-full text-ascent-1 flex justify-center items-start text-xl flex-col">
                <div className="w-full px-5 text-xl">Suggest</div>
                {listsuggest &&
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
                  })}
              </div> */}
              </div>
              {/* <FriendsCard friends={user?.friends} /> */}
            </div>
          )}
          {listfriend && (
            <div
              className="w-1/5  h-full bg-primary md:flex flex-col gap-1
        overflow-y-auto overflow-x-hidden rounded-xl grow-0"
            >
              <div>
                <div className="w-full font-bold text-ascent-1 text-3xl px-5 py-5">
                  Friends
                </div>
              </div>

              <div className="w-full h-2/3 gap-3 flex flex-col pt-2">
                {/* {type == "inbox" &&
                  listchat &&
                  listchat.length > 0 &&
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
                        type={type}

                        hanldeUserchat={hanldeUserchat}

                      />
                    );
                  })} */}

                {user?.friends &&
                  user.friends.map((friend) => {
                    console.log(friend);
                    return (
                      <div
                        className="w-full px-4"
                        onClick={() => {
                          setType("inbox");
                        }}
                      >
                        <FriendCardfChat
                          friend={friend}
                          hanldeUserchat={hanldeUserchat}
                        />
                      </div>
                    );
                  })}
                {/* <FriendsCard friend={user.friends} /> */}
              </div>
            </div>
          )}
          {idroom ? (
            <div className="w-3/4" key={idroom}>
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
                setRoleo={setRoleo}
                setAddu={setAddu}
                ref={childRef}
                fetchchatforchild={fetchchatforchild}
                type={type}
              />
            </div>
          ) : (
            <div className="flex-1 h-full bg-primary px-4 flex flex-col gap-6 overflow-hidden rounded-lg justify-center items-center text-ascent-2 text-xl">
              Choose Conversation
            </div>
          )}
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
      {createg && <CreateGroup fetchList={fetchList} setCreatg={setCreatg} />}
      {/* ADD member */}
      {
        addu && <AddNewMember idroom={idroom} setAddu={setAddu} />
        // <div className="absolute w-full h-full bg-secondary/30 z-50 ">
        //   <div className="w-full h-full flex justify-center items-center">
        //     <div className="bg-primary px-3 py-3 flex flex-col gap-4 w-1/6 h-[40%] rounded-2xl">
        //       <div className="w-full flex px-3 pb-3 border-b border-[#66666645]">
        //         <span className="text-ascent-1 w-full flex items-center justify-between text-xl font-medium ">
        //           Add member
        //           <div
        //             className="text-ascent-1 h-full flex items-center cursor-pointer"
        //             onClick={() => {
        //               setAddu(!addu);
        //             }}
        //           >
        //             <MdClose size={25} />
        //           </div>
        //         </span>
        //       </div>

        //       <input
        //         type="text"
        //         className="bg-secondary px-4 py-2 rounded-2xl outline-none text-ascent-1"
        //         placeholder="Search"
        //       />
        //       <div className="content-start border-b border-[#66666645] pb-2 h-1/4 bg-primary gap-2 overflow-y-auto flex flex-wrap ">
        //         <div className="w-fit h-fit bg-secondary px-2 py-1 text-ascent-1 flex gap-2 justify-center items-center rounded-3xl">
        //           <img
        //             src={user?.profileUrl}
        //             alt=""
        //             className="h-5 w-5 rounded-full object-cover"
        //           />
        //           {user?.firstName}
        //           <IoIosAddCircle />
        //         </div>
        //         <div className="w-fit h-fit bg-secondary px-2 py-1 text-ascent-1 flex gap-2 justify-center items-center rounded-3xl">
        //           <img
        //             src={user?.profileUrl}
        //             alt=""
        //             className="h-5 w-5 rounded-full object-cover"
        //           />
        //           {user?.firstName}
        //           <IoIosAddCircle />
        //         </div>
        //         <div className="w-fit h-fit bg-secondary px-2 py-1 text-ascent-1 flex gap-2 justify-center items-center rounded-3xl">
        //           <img
        //             src={user?.profileUrl}
        //             alt=""
        //             className="h-5 w-5 rounded-full object-cover"
        //           />
        //           {user?.firstName}
        //           <IoIosAddCircle />
        //         </div>
        //         <div className="w-fit h-fit bg-secondary px-2 py-1 text-ascent-1 flex gap-2 justify-center items-center rounded-3xl">
        //           <img
        //             src={user?.profileUrl}
        //             alt=""
        //             className="h-5 w-5 rounded-full object-cover"
        //           />
        //           {user?.firstName}
        //           <IoIosAddCircle />
        //         </div>
        //         <div className="w-fit h-fit bg-secondary px-2 py-1 text-ascent-1 flex gap-2 justify-center items-center rounded-3xl">
        //           <img
        //             src={user?.profileUrl}
        //             alt=""
        //             className="h-5 w-5 rounded-full object-cover"
        //           />
        //           {user?.firstName}
        //           <IoIosAddCircle />
        //         </div>
        //         <div className="w-fit h-fit bg-secondary px-2 py-1 text-ascent-1 flex gap-2 justify-center items-center rounded-3xl">
        //           <img
        //             src={user?.profileUrl}
        //             alt=""
        //             className="h-5 w-5 rounded-full object-cover"
        //           />
        //           {user?.firstName}
        //           <IoIosAddCircle />
        //         </div>
        //         <div className="w-fit h-fit bg-secondary px-2 py-1 text-ascent-1 flex gap-2 justify-center items-center rounded-3xl">
        //           <img
        //             src={user?.profileUrl}
        //             alt=""
        //             className="h-5 w-5 rounded-full object-cover"
        //           />
        //           {user?.firstName}
        //           <IoIosAddCircle />
        //         </div>
        //         <div className="w-fit h-fit bg-secondary px-2 py-1 text-ascent-1 flex gap-2 justify-center items-center rounded-3xl">
        //           <img
        //             src={user?.profileUrl}
        //             alt=""
        //             className="h-5 w-5 rounded-full object-cover"
        //           />
        //           {user?.firstName}
        //           <IoIosAddCircle />
        //         </div>
        //         <div className="w-fit h-fit bg-secondary px-2 py-1 text-ascent-1 flex gap-2 justify-center items-center rounded-3xl">
        //           <img
        //             src={user?.profileUrl}
        //             alt=""
        //             className="h-5 w-5 rounded-full object-cover"
        //           />
        //           {user?.firstName}
        //           <IoIosAddCircle />
        //         </div>
        //         <div className="w-fit h-fit bg-secondary px-2 py-1 text-ascent-1 flex gap-2 justify-center items-center rounded-3xl">
        //           <img
        //             src={user?.profileUrl}
        //             alt=""
        //             className="h-5 w-5 rounded-full object-cover"
        //           />
        //           {user?.firstName}
        //           <IoIosAddCircle />
        //         </div>
        //         <div className="w-fit h-fit bg-secondary px-2 py-1 text-ascent-1 flex gap-2 justify-center items-center rounded-3xl">
        //           <img
        //             src={user?.profileUrl}
        //             alt=""
        //             className="h-5 w-5 rounded-full object-cover"
        //           />
        //           {user?.firstName}
        //           <IoIosAddCircle />
        //         </div>
        //         <div className="w-fit h-fit bg-secondary px-2 py-1 text-ascent-1 flex gap-2 justify-center items-center rounded-3xl">
        //           <img
        //             src={user?.profileUrl}
        //             alt=""
        //             className="h-5 w-5 rounded-full object-cover"
        //           />
        //           {user?.firstName}
        //           <IoIosAddCircle />
        //         </div>
        //         <div className="w-fit h-fit bg-secondary px-2 py-1 text-ascent-1 flex gap-2 justify-center items-center rounded-3xl">
        //           <img
        //             src={user?.profileUrl}
        //             alt=""
        //             className="h-5 w-5 rounded-full object-cover"
        //           />
        //           {user?.firstName}
        //           <IoIosAddCircle />
        //         </div>
        //         <div className="w-fit h-fit bg-secondary px-2 py-1 text-ascent-1 flex gap-2 justify-center items-center rounded-3xl">
        //           <img
        //             src={user?.profileUrl}
        //             alt=""
        //             className="h-5 w-5 rounded-full object-cover"
        //           />
        //           {user?.firstName}
        //           <IoIosAddCircle />
        //         </div>
        //         <div className="w-fit h-fit bg-secondary px-2 py-1 text-ascent-1 flex gap-2 justify-center items-center rounded-3xl">
        //           <img
        //             src={user?.profileUrl}
        //             alt=""
        //             className="h-5 w-5 rounded-full object-cover"
        //           />
        //           {user?.firstName}
        //           <IoIosAddCircle />
        //         </div>
        //         <div className="w-fit h-fit bg-secondary px-2 py-1 text-ascent-1 flex gap-2 justify-center items-center rounded-3xl">
        //           <img
        //             src={user?.profileUrl}
        //             alt=""
        //             className="h-5 w-5 rounded-full object-cover"
        //           />
        //           {user?.firstName}
        //           <IoIosAddCircle />
        //         </div>
        //       </div>
        //       <div className="h-1/4 flex flex-wrap items-start gap-2 overflow-y-auto content-start">
        //         <UserTiitle />
        //         <UserTiitle />
        //         <UserTiitle />
        //         <UserTiitle />
        //         <UserTiitle />
        //       </div>

        //       <div className="w-full flex justify-end items-end">
        //         <CustomButton
        //           tittle="Submit"
        //           containerStyles="bg-blue w-fit px-2 py-2 rounded-xl text-white"
        //         />
        //       </div>
        //     </div>
        //   </div>
        // </div>
      }
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
          <Managergroup setRoleo={setRoleo} member={member} idroom={idroom} />
        </div>
      )}
      {edit && <EditFix />}
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
