import { Navigate } from "react-router";

const BaseComponent = () => {
  return <Navigate to="/agent-master" replace={true} />;
};

export default BaseComponent;
