import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { CustomButton, Loading, TextInput } from "../components";
import { apiRequest } from "../until";
import { useTranslation } from "react-i18next";
import { userResetRequest } from "../until/user";

const ResetPassword = () => {
  const [errMsg, seterrMsg] = useState("");
  const [isSubmitting, setisSubmitting] = useState(false);
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onChange",
  });

  const handleresetSubmit = async (data) => {
    setisSubmitting(true);
    try {
      const res = await userResetRequest(data);
      console.log(res);

      if (res?.message === "Password reset have send email  successful") {
        seterrMsg(res);
        setTimeout(() => {
          window.location.replace("/login");
        }, 5000);
      } else {
        seterrMsg(res);
      }
      setisSubmitting(false);
    } catch (error) {
      console.log(error);
      setisSubmitting(false);
    }
  };
  return (
    <div
      className="w-full h-[100vh] bg-bgColor flex items-center itemscenter 
    justify-center p-6"
    >
      <div className="bg-primary w-ful md:w-1/3 2xl:w-1/4 px-6 py-8 shadow-md rounded-lg">
        <p className="text-ascent-1 text-lg font-semibold">
          {t("Email Address")}
        </p>

        <span className="text-sm text-ascent-2">
          {t("Enter email address used during registration")}
        </span>

        <form
          onSubmit={handleSubmit(handleresetSubmit)}
          className="py-4 flex flex-col gap-5"
        >
          <TextInput
            name="email"
            placeholder="email@example.com"
            type="email"
            register={register("email", {
              required: t("Email Address is required!"),
            })}
            styles="w-full rounded-lg"
            labelStyles="ml-2"
            error={errors.email ? errors.email.message : ""}
          />
          {errMsg?.message && (
            <span
              role="alert"
              className={`text-sm ${
                errMsg?.message === "Password reset have send email  successful"
                  ? "text-[#2ba150fe]"
                  : "text-[#f64949fe] "
              } mt-0.5`}
            >
              {errMsg?.message}
            </span>
          )}

          {isSubmitting ? (
            <Loading />
          ) : (
            <CustomButton
              type="submit"
              containerStyles={`inline-flex justify-center
               rounded-md bg-blue px-8 py-3 text-sm font-medium 
               text-white outline-non`}
              tittle={t("Submit")}
            />
          )}
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
