import styled from "styled-components";
import NotFoundImage from "/NotFoundImage.svg";

const Container = styled.div`
  display: flex;
  font-family: ${({ theme }) => theme.fontFamily};
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #e6e6e9;
  padding: 20px;
`;

const Card = styled.div`
  font-family: ${({ theme }) => theme.fontFamily};
  height: 100vh;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  width: 100%;
  padding: 40px;
  position: relative;
`;

const Content = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  height: 100%;

  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
  }
`;

const IllustrationContainer = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const TextContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  @media (max-width: 768px) {
    align-items: center;
    margin-top: 40px;
  }
`;

const ErrorCode = styled.h1`
  font-size: 120px;
  font-weight: bold;
  color: ${({ theme }) => theme.primaryColor};
  margin: 0;
  line-height: 1;
`;

const ErrorTitle = styled.h2`
  font-size: 40px;
  font-weight: bold;
  color: ${({ theme }) => theme.primaryColor};
  margin: 0 0 20px 0;
`;

const ErrorMessage = styled.p`
  font-size: 16px;
  color: #a0aec0;
  margin: 0 0 30px 0;
  max-width: 400px;
  line-height: 1.5;
`;

const HomeButton = styled.a`
  display: inline-block;
  background-color: ${({ theme }) => theme.primaryColor};
  color: white;
  font-weight: bold;
  padding: 12px 30px;
  border-radius: 30px;
  text-decoration: none;
  text-transform: uppercase;
  font-size: 14px;
  transition: background-color 0.3s;

  &:hover {
    background-color: ${({ theme }) => theme.secondaryColor};
  }
`;

export default function NotFound() {
  return (
    <Card>
      <Content>
        <IllustrationContainer>
          <img
            src={NotFoundImage}
            alt="404 Illustration"
            style={{ maxWidth: "100%", height: "auto" }}
          />
        </IllustrationContainer>

        <TextContainer>
          <ErrorCode>404</ErrorCode>
          <ErrorTitle>Page Not Found</ErrorTitle>
          <ErrorMessage>
            We're sorry, the page you requested could not be found. Please go
            back to the homepage
          </ErrorMessage>
          <HomeButton href="/">GO HOME</HomeButton>
        </TextContainer>
      </Content>
    </Card>
  );
}
