import styled from "styled-components";

function InlineLoader({ styles }) {
  return (
    <LoaderDiv styles={styles}>
      <div>
        <div className="bounce1"></div>
        <div className="bounce2"></div>
        <div className="bounce3"></div>
      </div>
    </LoaderDiv>
  );
}

export default InlineLoader;

const LoaderDiv = styled.div`
  cursor: text;
  -webkit-transition: all 0.15s linear;
  transition: all 0.15s linear;
  border-radius: 15px;
  color: #000000;
  font-size: ${({ theme: { fontSize } }) =>
    fontSize ? `calc(18px + ${fontSize - 92}%)` : "18px"};
  border: none;
  // box-shadow: 1px 5px 14px 0px rgb(0 0 0 / 10%);
  margin: 0 6px;
  text-align: left;
  display: flex;
  align-items: center;
  justify-content: space-around;
  & > div > div {
    width: 10px;
    height: 10px;
    background-color: ${({ theme: { primaryColor } }) => primaryColor};
    border-radius: 100%;
    display: inline-block;
    -webkit-animation: sk-bouncedelay 1.4s infinite ease-in-out both;
    animation: sk-bouncedelay 1.4s infinite ease-in-out both;
  }
  & > div .bounce1 {
    -webkit-animation-delay: -0.32s;
    animation-delay: -0.32s;
  }
  & > div .bounce2 {
    -webkit-animation-delay: -0.16s;
    animation-delay: -0.16s;
  }
  @-webkit-keyframes sk-bouncedelay {
    0%,
    80%,
    100% {
      -webkit-transform: scale(0);
    }
    40% {
      -webkit-transform: scale(1);
    }
  }
  @keyframes sk-bouncedelay {
    0%,
    80%,
    100% {
      -webkit-transform: scale(0);
      transform: scale(0);
    }
    40% {
      -webkit-transform: scale(1);
      transform: scale(1);
    }
  }
`;
