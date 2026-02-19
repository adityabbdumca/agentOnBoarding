import ErrorBoundary from "@/hoc/ErrorBoundary";
import { Navigate, Outlet } from "react-router-dom";

const PrivateRouteWrapper = () => {
  const isAuthenticated = localStorage.getItem("token");

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <ErrorBoundary>
      <Outlet />

      <df-messenger
        location="asia-south1"
        project-id="pruinhlth-nprd-dev-sm7hgn-5119"
        agent-id="a9302f46-d9bb-480e-a980-7d48e949c0bd"
        language-code="en"
        max-query-length="-1">
        <df-messenger-chat-bubble
          chat-title="Samvaad"
          chat-title-icon="https://storage.cloud.google.com/pruinhlth-nprd-dev-sm7hgn-asia-south1-conversational-agent/logo.PNG"
        />
      </df-messenger>
    </ErrorBoundary>
  );
};

export default PrivateRouteWrapper;
