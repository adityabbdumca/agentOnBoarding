import React from "react";
import styled from "styled-components";

function ButtonWrapper({ children, style }) {
  return <Wrapper style={style}>{children}</Wrapper>;
}

export default ButtonWrapper;

const Wrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: auto;
`;
