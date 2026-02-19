import styled, { keyframes } from "styled-components";

const bounceIn = keyframes`
  0% {
    transform: translateY(-500px);
    opacity: 0;
  }
  60% {
    transform: translateY(25px);
    opacity: 0.8;
  }
  85% {
    transform: translateY(-10px);
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
`;
const bounceIn1 = keyframes`
  0% {
    transform: translateX(-500px);
    opacity: 0;
  }
  60% {
    transform: translateX(25px);
    opacity: 0.8;
  }
  85% {
    transform: translateX(-10px);
  }
  100% {
    transform: translateX(0);
    opacity: 1;
  }
`;
export const FormSection = styled.div`
  animation: ${bounceIn} 1s ease forwards;
  display: flex;
  max-width: 400px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  // border: 1px solid #9a9393;
  // border-radius: 10px;
  border-radius: 50px;
  background: #e3f1ff;
  box-shadow: 6px 6px 12px #bebebe, -6px -6px 12px #ffffff;
  padding: 2rem;
`;

export const Form = styled.form`
  height: 300px;
  width: 300px;
`;
export const Logo = styled.img`
  animation: ${bounceIn1} 1s ease forwards;
  width: 70%;
  height: 70%;
`;

export const MainContainer = styled.div`
  width: 50%;
  display: flex;
  justify-content: center;
  background-color: #e3f1ff;
  position: relative;
`;

export const BrokerLogo = styled.img`
  width: 35%;
  // height: 15%;
  mix-blend-mode: darken;
  position: absolute;
  left: 23%;
  top: 6%;
`;

export const BgRectangle = styled.div`
  width: 50%;
  height: -webkit-fill-available;
  top: 20%;
  background-color: #c3e2ff;
  border-radius: 394px 394px 0px 0px;
  position: absolute;
  box-shadow: 20px 20px 60px #bebebe, -20px -20px 60px #ffffff;
`;

export const FormDiv = styled.div`
  width: 50%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #e3f1ff;
`;
