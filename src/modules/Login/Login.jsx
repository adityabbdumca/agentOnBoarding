import Fyntune from "@/assets/images/Prud_Logo.png";
import {
  allowOnlyNumbers,
  handleKeyUp,
} from "@/HelperFunctions/helperFunctions";
// import useCaptchaHook from "@/hooks/useCaptchaHook";
// import CaptchTest from "@/UI-Components/CaptchaTest";
import Input from "@/UI-Components/Input";
import { yupResolver } from "@hookform/resolvers/yup";
import { lazy, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  HiEyeOff,
  HiOfficeBuilding,
  HiShieldCheck,
  HiTrendingUp,
  HiUsers,
} from "react-icons/hi";
import { HiArrowLeftCircle, HiEye } from "react-icons/hi2";
//import { toast } from "react-toastify";
import * as yup from "yup";
import CreateAccount from "./CreateAccount";
const GlobalModal = lazy(() => import("@/UI-Components/Modals/GlobalModal"));
const OTPModal = lazy(() => import("./OTPModal"));
import { useForgotPassword, useLoginUser, useRegisterUser } from "./service";
import { blockedDomains } from "@/constants/blockDomain";

const schema = (renderLoginField) =>
  yup.object().shape({
    mobile: yup
      .string()
      .min(10, "Mobile number must be 10 digits")
      .max(10, "Mobile number must be 10 digits")
      .matches(
        /^(\+91[\-\s]?)?[0]?(91)?[6789]\d{9}$/,
        "Mobile number is not valid"
      )
      .required("Mobile number is required"),
    ...(renderLoginField === "otp" && {
      otp: yup.string().test("otp", "OTP is required", (_, parent) => {
        return parent.parent?.otp_code?.join("") > 0;
      }),
    }),
    ...(renderLoginField === "password" && {
      password: yup.string().required(),
    }),
    // captcha_code: yup.string().required("Captcha is required"),
  });
const signupSchema = (isTrue) =>
  yup.object().shape({
    name: yup.string().test("name", "Full Name is required", (value) => {
      return !isTrue ? value?.length > 0 : true;
    }),
    email: yup
      .string()
      .required("E-Mail Id is required")
      .max(100, "E-Mail must be less than 100 characters")
      .matches(
        /^[a-zA-Z0-9._-]+@[a-zA-Z.-]+\.(com|in|net)$/,
        "Invalid email format. Please check and try again."
      )
      .test(
        "not-blocked-domain",
        "Emails from this domain are not allowed",
        (value) => {
          if (!value) return true;

          return !blockedDomains.some((domain) =>
            value.toLowerCase().endsWith("@" + domain)
          );
        }
      ),
    mobile: yup
      .string()
      .required("Mobile number is required")
      .min(10, "Mobile number must be 10 digits")
      .max(10, "Mobile number must be 10 digits")
      .matches(/^[6-9]\d{9}$/, "Mobile number is not valid")
      .test(
        "not-all-same",
        "Mobile number cannot have all digits the same",
        (value) => {
          if (!value) return true; // Required check is already handled
          return !/^(\d)\1{9}$/.test(value); // Rejects 0000000000, 1111111111, etc.
        }
      ),
    // password: yup
    //   .string()
    //   .required("Password is required")
    //   .min(8, "Password must be at least 8 characters")
    //   .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    //   .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    //   .matches(/\d/, "Password must contain at least one number")
    //   .matches(
    //     /[@$!%*?&#]/,
    //     "Password must contain at least one special character"
    //   ),
    // re_enter_password: yup
    //   .string()
    //   .oneOf([yup.ref("password"), null], "Passwords must match"),
  });

const Login = () => {
  // const {
  //   actions: { generateCaptchaText, drawCaptcha, setGeneratedCaptcha },
  //   refs: { canvasRef },
  //   states: { captchaText, generatedCaptcha },
  // } = useCaptchaHook(5);
  const [type, setType] = useState("login");
  const [showLoginOption, setShowLoginOption] = useState(false);
  const [renderLoginField, setRenderLoginField] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showReEnterPassword, setShowReEnterPassword] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const {
    handleSubmit,
    control,
    register,
    watch,
    reset,
    setValue,
    setFocus,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(
      type === "login"
        ? schema(renderLoginField)
        : signupSchema(type === "forgot")
    ),
    mode: "onChange",
  });
  const { mutate: registerMutate, isPending } = useRegisterUser(setOpenModal);
  const { mutate: forgotPasswordMutate } = useForgotPassword();
  const { mutateAsync: loginMutate } = useLoginUser();
  useEffect(() => {
    if (!watch("mobile")) {
      setValue("otp", "");
    }
  }, [watch("mobile")]);

  const onSubmit = (data) => {
    if (type === "login") {
      // if (data.captcha_code === generatedCaptcha) {
      if (!showLoginOption) {
        // toast.success("Captcha is valid");
        // setShowLoginOption(true);

        loginMutate({
          mobile: watch("mobile"),
          loginOption: "otp_code",
        }).then((res) => {
          if (res?.data?.status !== 500) {
            setShowLoginOption(true);
            setRenderLoginField("otp");
            setTimer(true);
          }
        });
        return;
      }
      if (watch("otp_code")?.join("") > 0) {
        loginMutate({
          ...data,
          loginOption: "otp_code",
          otp_code: +data.otp_code?.join(""),
        });
      } else {
        loginMutate({
          ...data,
          loginOption: "password",
          password: data.password,
        });
      }
      // } else {
      //   setValue("captcha_code", "");
      //   setShowLoginOption(false);
      //   toast.error("Captcha is invalid");
      //   generateCaptchaText();
      // }
    }
    if (type === "register") {
      const { otp, ...payload } = data;
      setValue("otp_code", []);
      registerMutate(payload);
    }
    if (type === "forgot") {
      const { otp, ...payload } = data;
      setValue("otp_code", []);
      forgotPasswordMutate(payload);
    }
  };

  useEffect(() => {
    if (renderLoginField) {
      setFocus("otp_code[0]");
    }
  }, [renderLoginField]);

  const [timer, setTimer] = useState(false);
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    let timerOTP;
    let countdownInterval;

    if (timer) {
      setCountdown(10); // Reset countdown to 10

      // Create countdown interval
      countdownInterval = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);

      // Create timer to enable resend
      timerOTP = setTimeout(() => {
        setTimer(false);
      }, 10000);
    }

    return () => {
      clearTimeout(timerOTP);
      clearInterval(countdownInterval);
    };
  }, [timer]);

  const handleDisabled = () => {
    if (renderLoginField && showLoginOption) {
      return false;
    }
    if (!renderLoginField && !showLoginOption) {
      return false;
    }
    return true;
  };

  return (
    <>
      <div className="flex h-screen">
        {/* Left side - Login Form */}
        <div className="w-full lg:w-1/2 flex flex-col p-4  justify-center">
          <div className="lg:flex items-center justify-center h-full">
            <div className="lg:min-w-md">
              <div className="flex items-center justify-start w-full mb-4">
                <img src={Fyntune} alt="Logo" className="h-12" />
              </div>
              <h1 className="text-3xl font-bold mb-2">
                {type === "login" ? "Welcome Back" : "Create Account"}
              </h1>
              <p className="text-gray-500 mb-4">Please enter your details</p>
              {showLoginOption && (
                <div className="flex items-center justify-between mb-4">
                  <button
                    type="button"
                    className="max-sm:hidden flex items-center gap-2 text-xs text-slate-800  rounded-lg p-2 font-semibold cursor-pointer "
                    onClick={() => {
                      setShowLoginOption(false);
                      setRenderLoginField(false);
                      setValue("captcha_code", "");
                      reset({
                        otp_code: [],
                      });
                      setTimer(false);
                      setCountdown(10);
                    }}
                  >
                    <HiArrowLeftCircle size={20} />
                    Go Back
                  </button>
                </div>
              )}
              <form className="space-y-4 " onSubmit={handleSubmit(onSubmit)}>
                <div className="space-y-2">
                  <Input
                    inputRef={register("mobile")}
                    name={"mobile"}
                    label={"Mobile Number"}
                    isRequired
                    // errors={errors}
                    showErrorMessage={errors?.mobile?.message}
                    control={control}
                    readOnly={showLoginOption}
                    onPaste={(e) => {
                      e.preventDefault();
                      return false;
                    }}
                    type={"tel"}
                    placeholder={"Enter your mobile number"}
                    maxLength={10}
                    onChange={(e) => {
                      allowOnlyNumbers(e);
                    }}
                  />
                </div>
                {type === "login" ? (
                  <>
                    {/* {!showLoginOption && (
                      <>
                        <CaptchTest
                          setGeneratedCaptcha={setGeneratedCaptcha}
                          canvasRef={canvasRef}
                          captchaText={captchaText}
                          generateCaptchaText={generateCaptchaText}
                          drawCaptcha={drawCaptcha}
                        />
                        <div className="space-y-2">
                          <Input
                            inputRef={register("captcha_code")}
                            name={"captcha_code"}
                            label={"Captcha Code"}
                            isRequired
                            errors={errors}
                            maxLength={5}
                            control={control}
                            onPaste={(e) => {
                              e.preventDefault();
                              return false;
                            }}
                            placeholder={"Enter Captcha Code"}
                          />
                        </div>
                      </>
                    )} */}
                    {showLoginOption && (
                      <section>
                        <div className="flex justify-end -mt-2">
                          {/* <div className="flex w-24 flex-col items-center mb-2">
                            <button
                              className="h-10 flex items-center text-body justify-center gap-1 text-sm font-semibold border border-slate-300 cursor-pointer w-10 rounded-lg bg-white outline-gray transition-all disabled:brightness-90  disabled:cursor-not-allowed disabled:ring-0 hover:brightness-90 active:ring-1 active:ring-extraLightGray/50 "
                              type="button"
                              onClick={() => setRenderLoginField("password")}
                            >
                              <HiLockClosed
                                size={18}
                                className="text-slate-700"
                              />
                            </button>
                            <p className="text-xs font-semibold text-slate-600">
                              Password
                            </p>
                          </div> */}
                          <div className="flex ">
                            <button
                              type="button"
                              disabled={timer}
                              className="text-xs text-primary hover:text-primary/90 cursor-pointer disabled:text-gray-400 disabled:cursor-not-allowed"
                              onClick={() => {
                                setTimer(true);
                                for (let i = 0; i < 6; i++) {
                                  setValue(`otp_code.${i}`, "");
                                }

                                loginMutate({
                                  mobile: watch("mobile"),
                                  loginOption: "otp_code",
                                });
                              }}
                            >
                              {!timer
                                ? "Resend OTP"
                                : `Resend in ${countdown}s`}
                            </button>
                          </div>
                        </div>
                      </section>
                    )}
                    {renderLoginField === "password" && (
                      <div className="space-y-2">
                        <Input
                          inputRef={register("password")}
                          type={showPassword ? "text" : "password"}
                          name={"password"}
                          label={"Password"}
                          isRequired
                          errors={errors}
                          control={control}
                          placeholder={"Enter your password"}
                          endIcon={
                            showPassword ? (
                              <HiEye
                                size={20}
                                className="text-slate-600 cursor-pointer"
                                onClick={() => setShowPassword(!showPassword)}
                              />
                            ) : (
                              <HiEyeOff
                                size={20}
                                className="text-slate-600 cursor-pointer"
                                onClick={() => setShowPassword(!showPassword)}
                              />
                            )
                          }
                        />
                      </div>
                    )}
                    {renderLoginField === "otp" && (
                      <div className="space-y-1">
                        <div id="otp" className="flex gap-4 justify-center">
                          {[...Array(6)].map((_, index) => (
                            <Input
                              key={index}
                              Width={"40"}
                              inputRef={register(`otp_code[${index}]`)}
                              name={"otp"}
                              control={control}
                              type={"password"}
                              maxLength={1}
                              onChange={(e) => {
                                allowOnlyNumbers(e);
                              }}
                              className="text-center"
                              onKeyUp={(e) => handleKeyUp(e, index)}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                ) : type === "register" ? (
                  <CreateAccount
                    register={register}
                    errors={errors}
                    control={control}
                  />
                ) : (
                  <>
                    <div className="space-y-2">
                      <Input
                        inputRef={register("password")}
                        type={showPassword ? "text" : "password"}
                        name={"password"}
                        label={"Password"}
                        isRequired
                        errors={errors}
                        control={control}
                        placeholder={"Enter your password"}
                        endIcon={
                          showPassword ? (
                            <HiEye
                              size={20}
                              className="text-slate-600 cursor-pointer"
                              onClick={() => setShowPassword(!showPassword)}
                            />
                          ) : (
                            <HiEyeOff
                              size={20}
                              className="text-slate-600 cursor-pointer"
                              onClick={() => setShowPassword(!showPassword)}
                            />
                          )
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Input
                        inputRef={register("re_enter_password")}
                        type={showReEnterPassword ? "text" : "password"}
                        name={"re_enter_password"}
                        label={"Re-enter Password"}
                        isRequired
                        errors={errors}
                        control={control}
                        placeholder={"Re-enter your password"}
                        endIcon={
                          showReEnterPassword ? (
                            <HiEye
                              size={20}
                              className="text-slate-600 cursor-pointer"
                              onClick={() =>
                                setShowReEnterPassword(!showReEnterPassword)
                              }
                            />
                          ) : (
                            <HiEyeOff
                              size={20}
                              className="text-slate-600 cursor-pointer"
                              onClick={() =>
                                setShowReEnterPassword(!showReEnterPassword)
                              }
                            />
                          )
                        }
                      />
                    </div>
                  </>
                )}
                {/* {type === "login" && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center" />
                    <button
                      type="button"
                      className="text-xs text-primary hover:text-primary/90 cursor-pointer"
                      onClick={() => {
                        setType("forgot");
                      }}
                    >
                      Forgot password
                    </button>
                  </div>
                )} */}
                <button
                  type="submit"
                  className=" w-full py-2 px-4 bg-primary hover:bg-primary/90 text-white font-medium rounded-md cursor-pointer active:scale-95 active:shadow-md transition-all disabled:brightness-90 disabled:cursor-not-allowed disabled:ring-0 hover:brightness-90 active:ring-1 active:ring-extraLightGray/50"
                  disabled={handleDisabled()}
                >
                  {type === "login" ? "Sign in" : "Sign up"}{" "}
                </button>
              </form>
              <p className="mt-8 text-center text-sm text-gray-500">
                {type === "login"
                  ? "Don't have an account? "
                  : "Already have an account? "}
                <button
                  type="button"
                  className="text-primary hover:text-primary/90 cursor-pointer"
                  onClick={() => {
                    setType(type === "login" ? "register" : "login");
                    reset({ mobile: "", name: "", email: "" });
                    setShowLoginOption(false);
                    setRenderLoginField(false);
                  }}
                >
                  {type === "login" ? "Sign Up" : "Sign in"}
                </button>
              </p>
            </div>
          </div>
        </div>

        <div className="max-md:hidden h-full w-1/2 bg-gradient-to-br from-primary to-secondary flex items-center justify-center p-8 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute bg-white/30 top-10 left-10 w-32 h-32 border border-white/20 rounded-full" />
            <div className="absolute bg-white/30 top-32 right-20 w-24 h-24 border border-white/20 rounded-full" />
            <div className="absolute bg-white/30 bottom-20 left-20 w-40 h-40 border border-white/20 rounded-full" />
            <div className="absolute bg-white/30 bottom-32 right-10 w-28 h-28 border border-white/20 rounded-full" />
          </div>

          {/* Main Content */}
          <div className="relative z-10 text-center text-white space-y-8 max-w-md">
            {/* Hero Icon */}
            <div className="mx-auto w-24 h-24 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
              <HiOfficeBuilding className="w-12 h-12 text-white" />
            </div>

            {/* Main Message */}
            <div className="space-y-3">
              <h2 className="text-2xl font-bold">Welcome to Prudential</h2>
              <p className="text-white/90 text-xl font-semibold  leading-relaxed">
                Agent Onboarding
              </p>
              {/* <p className="text-white/90 text-sm leading-relaxed">
                Join thousands of successful agents building secure futures for
                families worldwide
              </p> */}
            </div>

            {/* Key Features */}
            <div className="space-4 flex items-center gap-8">
              <div className=" space-x-3 text-center flex items-center flex-col gap-2">
                <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <HiShieldCheck className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="font-medium text-sm">Trusted Platform</div>
                  <div className="text-white/70 text-xs">
                    Secure and reliable
                  </div>
                </div>
              </div>

              <div className=" space-x-3 text-center flex items-center flex-col gap-2">
                <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <HiTrendingUp className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="font-medium text-sm">Career Growth</div>
                  <div className="text-white/70 text-xs">
                    Unlimited potential
                  </div>
                </div>
              </div>

              <div className=" space-x-3 text-center flex items-center flex-col gap-2">
                <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <HiUsers className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="font-medium text-sm">Expert Support</div>
                  <div className="text-white/70 text-xs">24/7 assistance</div>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 pt-6 border-t border-white/20">
              <div className="text-center">
                <div className="text-xl font-bold">50K+</div>
                <div className="text-xs text-white/70">Active Agents</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold">177+</div>
                <div className="text-xs text-white/70">Years Strong</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <GlobalModal
        open={openModal}
        title={"Enter OTP"}
        onClose={() => setOpenModal(false)}
        width={"400"}
      >
        <OTPModal
          register={register}
          watch={watch}
          registerMutate={registerMutate}
          setFocus={setFocus}
          setValue={setValue}
          isLoading={isPending}
        />
      </GlobalModal>
    </>
  );
};

export default Login;
