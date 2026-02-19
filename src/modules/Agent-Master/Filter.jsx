


import styled from "styled-components";
import { IoCloseSharp } from "react-icons/io5";
// Styled components
const Wrapper = styled.div`
  position: fixed;
  right: 0;
  top: 0;
  z-index: 3;
  transform: translateX(${(props) => (props.isOpen ? "0" : "100%")});
  transition: all 0.9s ease-in-out;
`;

const Sidebar = styled.div`
  position: fixed;
  inset-y: 0;
  right: 18px;
  top: 20px;
  z-index: 3;
  width: 300px;
`;

const Card = styled.div`
  height: 100%;
  padding: 16px;
  background-color: white;
  box-shadow: -4px 0px 12px rgba(0, 0, 0, 0.1);
  border-radius: 20px;
  border: 2px solid #e0e0e0;
  transform: translateX(${(props) => (props.isOpen ? "0%" : "0")});
  transition: all 0.3s ease-in-out;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const Title = styled.h2`
  font-size: 18px;
  font-weight: 600;
`;

const CloseButton = styled.button`
  background: transparent;
  border: none;
  padding: 0;
  cursor: pointer;
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 12px;
  font-family: ${({ theme }) => theme.fontFamily};
  background-color: black;
  color: white;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  &:hover {
    background-color: rgba(0, 0, 0, 0.9);
  }
`;

const Filter = ({ openFilter, setOpenFilter, children }) => {
  return (
    <Wrapper isOpen={openFilter}>
      <Sidebar isOpen={openFilter}>
        <Card isOpen={openFilter}>
          <Header>
            <Title>Filter</Title>
            <CloseButton onClick={() => setOpenFilter(false)}>
              <IoCloseSharp size={24} />
            </CloseButton>
          </Header>
          {children}
        </Card>
      </Sidebar>
    </Wrapper>
  );
};

export default Filter;
