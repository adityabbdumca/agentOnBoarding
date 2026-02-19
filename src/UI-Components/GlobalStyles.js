import styled from "styled-components";

export const StyledBg = styled.div`
  background: ${(props) => (props.isLogin ? "#E3F1FF" : "")};
  height: 100vh;
  width: -webkit-fill-available;
  // overflow-y: ${(props) => (props.isLogin ? "" : "hidden")};
  overflow-x: hidden;
  background-color: white;
  border-radius: 20px 0 0 20px;
`;

export const StyledContainer = styled.div`
  &::-webkit-scrollbar {
    display: none;
  }
  display: flex;
  flex-direction: column;
  gap: 4rem;
  width: calc(100% - 10px);
  // height: calc(100% - 108px);
  overflow-y: scroll;
  padding: 30px 28px;
  margin: 2px;
  gap: 32px;
  // border-radius: 10px;
  // background: #ffffff;
  // box-shadow: 0px 0px 4px 0px #00000040;
  opacity: 1;
  overflow-y: auto;
  position: relative;
  top: 3.5rem;
  font-family: ${({ theme }) => theme.fontFamily};
`;

export const StyledModal = styled.div`
  background: #fff;
  padding: 20px;
  border-radius: 10px;
`;

export const ActionContainer = styled.div`
  display: flex;
  gap: 10px;
  div {
    border-radius: 10px;
    border: 1px solid #dee2e6;
    padding: 10px;
    background: #f5f5f5;
    cursor: pointer;
    color: #495057;
    svg {
      font-size: 0.9rem;
    }
    &:hover {
      color: ${({ theme }) => theme?.primaryColor + "!important"};
    }
  }
`;

export const Error = styled.p`
  margin-bottom: 0;
  margin-top: ${({ top }) => top || "0px"};
  margin-left: ${({ left }) => left || "5px !important"};
  font-size: ${({ theme: { fontSize } }) =>
    fontSize ? `calc(13px + ${fontSize - 92}%)` : "10px"};
  text-align: left;
  color: ${({ color }) => color || "red"};
  font-family: ${({ theme }) => theme?.fontFamily || "sans-serif"};
  font-weight: 500;
  bottom: ${({ bottom }) => bottom || "0px"};
  margin: 0;
`;
export const BackButton = styled.button`
  all: unset;
  font-size: 0.75rem; /* text-sm */
  color: #000000;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem; /* gap-2 */
  background-color: #e7e7e7;
  padding: 0.5rem; /* px-2 */
  border-radius: 0.5rem; /* rounded-lg */
  cursor: pointer;
  width: fit-content;
`;
