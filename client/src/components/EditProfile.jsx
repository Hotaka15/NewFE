import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { MdClose } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import TextInput from "./TextInput";
import Loading from "./Loading";
import CustomButton from "./CustomButton";
import { UpdateProfile, UserLogin } from "../redux/userSlice";
import { apiRequest, handFileUpload } from "../until";
import { NoProfile } from "../assets";
import { userapiRequest } from "../until/user";
import { FaFileImage } from "react-icons/fa6";
const EditProfile = () => {
  const { user, edit } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [errMsg, seterrMsg] = useState("");
  const [isSubmitting, setisSubmitting] = useState(false);
  const [picture, setPicuter] = useState(null);
  const [preview, setPreview] = useState();
  const [file, setFile] = useState(null);
  const [editor, setEditor] = useState(1);
  const [review, setReview] = useState();
  const provinces = [
    "An Giang",
    "Bà Rịa - Vũng Tàu",
    "Bắc Giang",
    "Bắc Kạn",
    "Bạc Liêu",
    "Bắc Ninh",
    "Bến Tre",
    "Bình Định",
    "Bình Dương",
    "Bình Phước",
    "Bình Thuận",
    "Cà Mau",
    "Cần Thơ",
    "Cao Bằng",
    "Đà Nẵng",
    "Đắk Lắk",
    "Đắk Nông",
    "Điện Biên",
    "Đồng Nai",
    "Đồng Tháp",
    "Gia Lai",
    "Hà Giang",
    "Hà Nam",
    "Hà Nội",
    "Hà Tĩnh",
    "Hải Dương",
    "Hải Phòng",
    "Hậu Giang",
    "Hòa Bình",
    "Hưng Yên",
    "Khánh Hòa",
    "Kiên Giang",
    "Kon Tum",
    "Lai Châu",
    "Lâm Đồng",
    "Lạng Sơn",
    "Lào Cai",
    "Long An",
    "Nam Định",
    "Nghệ An",
    "Ninh Bình",
    "Ninh Thuận",
    "Phú Thọ",
    "Phú Yên",
    "Quảng Bình",
    "Quảng Nam",
    "Quảng Ngãi",
    "Quảng Ninh",
    "Quảng Trị",
    "Sóc Trăng",
    "Sơn La",
    "Tây Ninh",
    "Thái Bình",
    "Thái Nguyên",
    "Thanh Hóa",
    "Thừa Thiên Huế",
    "Tiền Giang",
    "TP. Hồ Chí Minh",
    "Trà Vinh",
    "Tuyên Quang",
    "Vĩnh Long",
    "Vĩnh Phúc",
    "Yên Bái",
  ];
  const hobbys = [
    "Chơi bóng bàn",
    "Chơi bóng đá",
    "Bơi lội",
    "Vẽ tranh màu nước",
    "Chụp ảnh phong cảnh",
    "Làm đồ handmade",
    "Viết lách hoặc làm thơ",
    "Chơi guitar",
    "Nấu ăn và tham gia chia sẻ công thức",
    "Thử các món ăn đường phố",
    "Làm bánh",
    "Đam mê cà phê và thử các quán mới",
    "Khám phá các món ăn truyền thống",
    "Học tiếng Anh và luyện nói",
    "Đọc sách và trao đổi sách hay",
    "Học lập trình",
    "Học nhạc lý hoặc chơi piano",
    "Học kỹ năng mềm",
  ];
  const [birthDate, setBirthDate] = useState(
    user && user?.birthDate.split("T")[0]
  );
  const [selecthobby, setSelecthobby] = useState([]);
  const handlebg = (e) => {
    // console.log(e.target.files[0]);
    setPicuter(e.target.files[0]);
    setFile(e.target.files[0]);
    const reader = new FileReader();
    reader.onload = () => {
      setReview(reader.result);
    };
    reader.readAsDataURL(e.target.files[0]);
    setPreview(true);
  };
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    defaultValues: { ...user, birthDate: user?.birthDate.split("T")[0] },
  });

  // const onSubmit = async (data) => {
  //   setisSubmitting(true);
  //   seterrMsg("");
  //   try {
  //     const uri = picture && (await handFileUpload(picture));
  //     const { firstName, lastName, location, profession } = data;

  //     const res = await userapiRequest({
  //       url: "",
  //       data: {
  //         firstName,
  //         lastName,
  //         location,
  //         profileUrl: uri ? uri : user?.profileUrl,
  //         profession,
  //       },
  //       method: "PUT",
  //       token: user?.token,
  //     });

  //     console.log(res);
  //     if (res?.status === "failed") {
  //       seterrMsg(res);
  //     } else {
  //       seterrMsg(res);

  //       // const newUser = { token: res?.token, ...res?.user };
  //       const newUser = { token: user?.token, ...res };

  //       dispatch(UserLogin(newUser));

  //       setTimeout(() => {
  //         dispatch(UpdateProfile(false));
  //       }, 3000);
  //     }
  //     setisSubmitting(false);
  //     window.location.reload();
  //   } catch (error) {
  //     // console.log(error);
  //     setisSubmitting(false);
  //   }
  // };
  const onSubmit = async (data) => {
    console.log(data);

    setisSubmitting(true);
    seterrMsg("");
    try {
      const uri = picture && (await handFileUpload(picture));
      const {
        firstName,
        lastName,
        profession,
        gender,
        birthDate,
        province,
        adress,
      } = data;

      const res = await userapiRequest({
        url: "",
        data: {
          firstName,
          lastName,
          province,
          profileUrl: uri ? uri : user?.profileUrl,
          profession,
          gender,
          adress,
          birthDate,
          hobby: selecthobby,
        },
        method: "PUT",
        token: user?.token,
      });

      console.log(res);
      if (res?.status === "failed") {
        seterrMsg(res);
      } else {
        seterrMsg(res);

        const newUser = { token: user?.token, ...res };

        dispatch(UserLogin(newUser));

        setTimeout(() => {
          dispatch(UpdateProfile(false));
        }, 3000);
      }
      setisSubmitting(false);

      // window.location.reload();
    } catch (error) {
      console.log(error);
      setisSubmitting(false);
    }
    // const { firstName, lastName, location, profession } = data;
    console.log("submits");

    console.log(data);
  };

  const handleClose = () => {
    dispatch(UpdateProfile(false));
  };

  const handlehobby = (value) => {
    console.log(selecthobby);

    // setSelecthobby((pre) => {
    //   if (pre.includes(value)) {
    //     if (pre.length < 5) {
    //       console.log(pre);

    //       console.log(pre.filter((hobby) => hobby != value));
    //     } else {
    //       console.log([...pre, value]);
    //     }
    //   }
    // });

    setSelecthobby((pre) => {
      if (pre.includes(value)) {
        return pre.filter((hobby) => hobby !== value);
      } else if (pre.length < 5) {
        return [...pre, value];
      }

      return pre;
    });
  };

  const handleSelect = (e) => {
    setPicuter(e.target.files[0]);
  };

  return (
    <div>
      <div className="fixed z-50 inset-0 overflow-y-auto">
        <div
          className="flex items-center justify-center min-h-screen pt-4
            px-4 pb-20 text-center sm:block sm:p-0"
        >
          <div className="fixed inset-0 transition-opacticy">
            <div className="absolute inset-0 bg-[#000] opacity-70"></div>
          </div>
          <span className="hidden sm:inline-block sm:align-middle sm:h-screen"></span>
          &#8203;
          <div
            className="inline-block align-bottom bg-primary rounded-lg
            text-left overflow-hidden shadow-xl transform transition-all
            sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-headline"
          >
            <div className="flex justify-between px-6 pt-5 pb-2">
              <label
                htmlFor="name"
                className="block font-medium text-xl text-ascent-1 text-left"
              >
                Edit Profile
              </label>

              <button className="text-ascent-1" onClick={handleClose}>
                <MdClose size={22} />
              </button>
            </div>
            <div className="flex text-ascent-1 px-5 w-full justify-around gap-2 my-2">
              <span
                className={` px-2 w-full text-center py-2 rounded-2xl hover:cursor-pointer  ${
                  editor == 1
                    ? "bg-blue text-white"
                    : "text-ascent-2 outline outline-1"
                }  `}
                onClick={() => setEditor(1)}
              >
                Profile
              </span>
              {/* <span
                className={` px-2 w-full text-center py-2 rounded-2xl hover:cursor-pointer  ${
                  editor == 2
                    ? "bg-blue text-ascent-1"
                    : "text-ascent-2 outline outline-1"
                }  `}
                onClick={() => setEditor(2)}
              >
                Social
              </span>
              <span
                className={` px-2 w-full text-center py-2 rounded-2xl hover:cursor-pointer   ${
                  editor == 3
                    ? "bg-blue text-ascent-1"
                    : "text-ascent-2 outline outline-1"
                }  `}
                onClick={() => setEditor(3)}
              >
                Expertise
              </span>
              <span
                className={` px-2 w-full text-center py-2 rounded-2xl hover:cursor-pointer  ${
                  editor == 4
                    ? "bg-blue text-ascent-1"
                    : "text-ascent-2 outline outline-1"
                }  `}
                onClick={() => setEditor(4)}
              >
                Experience
              </span> */}
              <span
                className={` px-2 w-full text-center py-2 rounded-2xl hover:cursor-pointer  ${
                  editor == 2
                    ? "bg-blue text-white"
                    : "text-ascent-2 outline outline-1"
                }  `}
                onClick={() => setEditor(2)}
              >
                Hobby
              </span>
            </div>
            {editor == 1 && (
              <form
                className="px-4 sm:px-6 flex flex-col gap-3 2xl:gap-6"
                onSubmit={handleSubmit(onSubmit)}
              >
                <div className="flex gap-4">
                  <TextInput
                    label="First Name"
                    placeholder="First Name"
                    type="text"
                    styles="w-full"
                    register={register("firstName", {
                      required: "First name is required",
                    })}
                    error={errors.firstName ? errors.firstName?.message : ""}
                  />
                  <TextInput
                    label="Last Name"
                    placeholder="Last Name"
                    type="text"
                    styles="w-full"
                    register={register("lastName", {
                      required: "Last name is required!",
                    })}
                    error={errors.lastName ? errors.lastName?.message : ""}
                  />
                </div>
                <div className="flex gap-4">
                  <div className="w-1/2">
                    <p className={`text-ascent-2 text-sm mb-2`}>Gender</p>
                    <select
                      {...register("gender")}
                      className="text-ascent-1 w-full bg-secondary rounded border border-[#66666690] px-4 py-3 outline-none"
                    >
                      <option selected value="male">
                        Male
                      </option>
                      <option value="female">Female</option>
                      <option value="other">Orther</option>
                    </select>
                  </div>
                  <div className="w-1/2">
                    <p className={`text-ascent-2 text-sm mb-2`}>Date</p>
                    <input
                      {...register("birthDate")}
                      type="date"
                      value={birthDate}
                      className="datepicker-input bg-secondary rounded border w-full border-[#66666690] text-ascent-1 px-4 py-3"
                      onChange={(e) => {
                        setBirthDate(e.target.value);
                      }}
                    />
                  </div>
                </div>
                <div className="flex gap-4 w-full items-center justify-center">
                  <div className="w-1/2 max-h-40 overflow-hidden">
                    <p className={`text-ascent-2 text-sm mb-2`}>Location</p>
                    <select
                      {...register("province")}
                      className="text-ascent-1 w-full outline-none bg-secondary rounded border border-[#66666690] px-4 py-3 "
                    >
                      {provinces.map((province, index) => (
                        <option key={index} value={province}>
                          {province}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="w-1/2">
                    <p className={`text-ascent-2 text-sm mb-2`}>Address</p>
                    <input
                      {...register("adress")}
                      type="text"
                      onChange={(e) => {}}
                      placeholder="Address"
                      className="datepicker-input bg-secondary rounded border w-full border-[#66666690] text-ascent-1 px-4 py-3"
                    />
                  </div>
                </div>
                <TextInput
                  label="profession"
                  placeholder="Profession"
                  type="text"
                  styles="w-full"
                  register={register("profession", {
                    required: "Profession is required!",
                  })}
                  error={errors.profession ? errors.profession?.message : ""}
                />

                {/* <TextInput
                label="Location"
                placeholder="Location"
                type="text"
                styles="w-full"
                register={register("location", {
                  required: "Location do no match",
                })}
                error={errors.location ? errors.location?.message : ""}
              /> */}

                <label className="w-full flex justify-center items-center">
                  <div className="cursor-pointer h-fit w-fit px-2 py-2 relative bg-secondary rounded-full">
                    <div className="absolute right-1 bottom-1 bg-primary px-1 py-1 rounded-full">
                      <FaFileImage />
                    </div>
                    {review ? (
                      <img
                        src={review}
                        className="object-cover rounded-full h-24 w-24"
                        alt=""
                      />
                    ) : (
                      <img
                        src={user?.profileUrl ?? NoProfile}
                        className="object-cover rounded-full h-24 w-24"
                        alt=""
                      />
                    )}
                  </div>

                  <input
                    type="file"
                    className="hidden w-full bg-secondary"
                    id="avatar"
                    onInput={(e) => {
                      e.target.value[0] && handlebg(e);
                    }}
                    accept=".jpg, .png, .jpeg"
                  />
                </label>

                {errMsg?.message && (
                  <span
                    role="alert"
                    className={`text-sm ${
                      errMsg?.status === "failed"
                        ? "text-[#f64949fe]"
                        : "text-[#2ba150fe]"
                    } mt-0.5`}
                  >
                    {errMsg?.message}
                  </span>
                )}

                <div className="py-5 sm:flex sm:flex-row-reverse border-t border-[#66666645]">
                  {isSubmitting ? (
                    <Loading />
                  ) : (
                    <CustomButton
                      type="submit"
                      containerStyles={`inline-flex justify-center rounded-md bg-blue px-8
                    py-3 text-sm font-medium text-white outline-none`}
                      tittle="Submit"
                    />
                  )}
                </div>
              </form>
            )}
            {editor == 2 && (
              <form
                className="px-4 sm:px-6 flex flex-col gap-3 2xl:gap-6"
                onSubmit={handleSubmit(onSubmit)}
              >
                {/* <span className=" text-ascent-2">Select Hobbys</span> */}
                <div className="w-full h-full flex flex-wrap items-center justify-center gap-2">
                  {hobbys.map((hobby, index) => (
                    <label
                      key={index}
                      htmlFor={index}
                      className={`rounded-full border ${
                        selecthobby.includes(hobby)
                          ? "border-blue"
                          : "border-[#66666690]"
                      } w-fit py-2 px-3`}
                    >
                      <input
                        className="hidden"
                        type="checkbox"
                        id={index}
                        value={hobby}
                        checked={selecthobby.includes(hobby)}
                        onChange={(e) => {
                          handlehobby(e.target.value);
                        }}
                      />
                      <label htmlFor={index}>{hobby}</label>
                    </label>
                  ))}
                </div>
                <div className="py-2 sm:flex sm:flex-row-reverse border-t border-[#66666645]">
                  {isSubmitting ? (
                    <Loading />
                  ) : (
                    <CustomButton
                      type="submit"
                      containerStyles={`inline-flex justify-center rounded-md bg-blue px-8
                    py-3 text-sm font-medium text-white outline-none`}
                      tittle="Submit"
                    />
                  )}
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
