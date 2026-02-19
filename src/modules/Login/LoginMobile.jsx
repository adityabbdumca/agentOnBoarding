import styled from "styled-components";
import LoginIcon from "@/assets/images/LoginIcon.svg";
import Fyntune from "@/assets/images/Fyntune.svg";
import OTPImage from "@/assets/images/OTP.png";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Input from "@/UI-Components/Input";
import ButtonWrapper from "@/UI-Components/ButtonWrapper";
import Button from "@/UI-Components/Button";
import { Grid2 } from "@mui/material";
import { useLoginUser, useRegisterUser } from "./service";
import {
  allowOnlyName,
  verifyValidEmail,
} from "@/HelperFunctions/helperFunctions";

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(
    180deg,
    rgb(195 225 255) 0%,
    rgb(255, 255, 255) 100%
  );
  font-family: ${({ theme }) => theme.fontFamily};
`;

const Header = styled.div`
  background: #003366;
  padding: 1rem;
  color: white;
  height: 300px;
  position: relative;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-weight: 500;

  svg {
    width: 20px;
    height: 20px;
    fill: currentColor;
  }
`;

const HelloBubble = styled.div`
  background: #2563eb;
  color: white;
  padding: 4px 12px;
  border-radius: 16px;
  display: inline-block;
  margin-top: 2rem;
  font-size: 14px;
`;

const GetStarted = styled.h1`
  font-size: 24px;
  font-weight: 500;
  margin-top: 8px;
`;

const Illustration = styled.div`
  position: absolute;
  right: 1rem;
  bottom: 1rem;
  width: 200px;
  height: 200px;
  background-image: url(${LoginIcon});
  background-size: contain;
  background-repeat: no-repeat;
`;

const LoginCard = styled.div`
  background: white;
  border-radius: 16px 16px 0 0;
  padding: 1.5rem;
  margin-top: -2rem;
  position: relative;
  z-index: 1;
`;

const Title = styled.h2`
  color: #1a365d;
  font-size: 20px;
  font-weight: 500;
  margin-bottom: 1.5rem;
`;

const InputGroup = styled.div`
  margin-bottom: 1.5rem;
  position: relative;
`;

const Label = styled.div`
  color: #1a365d;
  font-size: 14px;
  margin-bottom: 4px;
`;

const CheckIcon = styled.div`
  position: absolute;
  right: 10px;
  bottom: 12px;
  color: #10b981;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 2rem;
`;

const CreateAccount = styled.div`
  text-align: center;
  margin-top: 1rem;
  font-size: 12px;

  span {
    color: #2563eb;
    text-decoration: none;
  }
`;

const OTPImageDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 11rem;
    height: 12rem;
    mix-blend-mode: multiply;
  }
`;

const OTPHeading = styled.p`
  margin: 10px 0;
  font-size: 24px;
  font-weight: 600;
  line-height: 32.68px;
  text-align: center;
  text-underline-position: from-font;
  text-decoration-skip-ink: none;
`;

const OTPSubHeading = styled.p`
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  line-height: 21.79px;
  text-align: center;
`;

export default function LoginScreen({
  loginMutate,
  registerMutate,
  loginData,
  registerData,
}) {
  const [isLogin, setIsLogin] = useState(true);

  const isOtp = loginData?.status === 200 || registerData?.status === 200;

  const schema = yup.object().shape({
    name: yup
      .string()
      .test("name", "Full Name is required", (value, parent) => {
        if (isLogin) {
          return true;
        }
        return !!value;
      }),
    mobile: yup
      .string()
      .required("Mobile number is required")
      .matches(
        /^(\+91[\-\s]?)?[0]?(91)?[789]\d{9}$/,
        "Mobile number is not valid"
      ),
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    watch,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data) => {
    if (isLogin) {
      if (isOtp) {
        +data.otp_code?.join("") > 0 &&
          loginMutate2({ ...data, otp_code: +data.otp_code?.join("") });
      } else {
        loginMutate(data);
      }
    } else {
      if (isOtp) {
        +data.otp_code?.join("") > 0 &&
          registerMutate2({ ...data, otp: +data.otp_code?.join("") });
      } else {
        registerMutate(data);
      }
    }
  };

  const { data: loginData2, mutate: loginMutate2 } = useLoginUser();

  const { data: registerData2, mutate: registerMutate2 } = useRegisterUser();

  useEffect(() => {
    isOtp && document.querySelectorAll("input")?.[0]?.focus();
  }, [isOtp]);

  //when otp field is filled it should autofocus to next field

  const handleKeyUp = (e, index) => {
    const inputFields = document.querySelectorAll("input");
    const currentInput = inputFields[index];
    const nextInput = inputFields[index + 1];
    const prevInput = inputFields[index - 1];
    if (
      e.key !== "Backspace" &&
      currentInput.value.length === currentInput.maxLength
    ) {
      nextInput?.focus();
    } else if (e.key === "Backspace" && currentInput.value.length === 0) {
      prevInput?.focus();
    }
  };

  return (
    <Container>
      {!isOtp ? (
        <>
          <Header>
            <Logo>
              <img src={Fyntune} alt="" />
            </Logo>
            <HelloBubble>{!isLogin ? "Hello" : "Welcome Back"}</HelloBubble>
            <GetStarted>Get Started</GetStarted>
            <Illustration />
          </Header>

          <LoginCard>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Title>{isLogin ? "Login" : "Sign Up"}</Title>
              {!isLogin && (
                <InputGroup>
                  <Input
                    label="Full Name"
                    inputRef={register("name")}
                    errors={errors}
                    name={"name"}
                    onChange={(e) => {
                      return (e.target.value = allowOnlyName(e));
                    }}
                  />
                  <CheckIcon>✓</CheckIcon>
                </InputGroup>
              )}
              <InputGroup>
                <Input
                  label="Mobile Number"
                  inputRef={register("mobile")}
                  errors={errors}
                  name={"mobile"}
                  maxLength={10}
                  type={"tel"}
                />
                <CheckIcon>✓</CheckIcon>
              </InputGroup>
              7
              {!isLogin && (
                <InputGroup>
                  <Input
                    label="Email"
                    inputRef={register("email")}
                    errors={errors}
                    name={"email"}
                    onChange={(e) => {
                      return (e.target.value = verifyValidEmail(e));
                    }}
                  />
                  <CheckIcon>✓</CheckIcon>
                </InputGroup>
              )}
              <ButtonWrapper>
                <Button type="submit">{isLogin ? "Login" : "Sign Up"}</Button>
              </ButtonWrapper>
              <CreateAccount>
                {!isLogin ? "Already" : "Don't"} have account?{" "}
                <span
                  onClick={() => {
                    setIsLogin(!isLogin);
                  }}
                >
                  {!isLogin ? "Login" : "Create Account"}
                </span>
              </CreateAccount>
            </form>
          </LoginCard>
        </>
      ) : (
        <>
          <div style={{ padding: "1rem" }}>
            <Logo>
              <img src={Fyntune} alt="" />
            </Logo>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              // gap: "1rem",
              height: "calc(90vh - 100px)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                // gap: "1rem",
                flexDirection: "column",
              }}
            >
              <form onSubmit={handleSubmit(onSubmit)}>
                <OTPImageDiv>
                  <img src={OTPImage} alt="" />
                </OTPImageDiv>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    // gap: "1rem",
                    flexDirection: "column",
                  }}
                >
                  <OTPHeading>OTP Verification</OTPHeading>
                  <OTPSubHeading>
                    Enter OTP Sent To {watch("mobile")}
                  </OTPSubHeading>
                  <Grid2
                    container
                    spacing={1}
                    columns={{ xs: 8, sm: 8, md: 8 }}
                    paddingX={2}
                    display={"flex"}
                    justifyContent={"center"}
                    alignItems={"center"}
                  >
                    {[...Array(6)].map((_, index) => (
                      <Grid2 key={index} size={{ xs: 1, sm: 1, md: 1 }}>
                        <Input
                          key={index}
                          inputRef={register(`otp_code[${index}]`)}
                          maxLength={1}
                          onKeyUp={(e) => handleKeyUp(e, index)}
                        />
                      </Grid2>
                    ))}
                  </Grid2>
                  <CreateAccount>
                    {"Didn't Get OTP?"}{" "}
                    <span
                      onClick={() => {
                        loginMutate2({
                          mobile: watch("mobile"),
                        });
                      }}
                    >
                      Resend OTP
                    </span>
                  </CreateAccount>
                  <ButtonWrapper
                    style={{ justifyContent: "center", marginTop: "1rem" }}
                  >
                    <Button type="submit" width={"auto"}>
                      Verify OTP
                    </Button>
                  </ButtonWrapper>
                </div>
              </form>
            </div>
          </div>
        </>
      )}
    </Container>
  );
}
