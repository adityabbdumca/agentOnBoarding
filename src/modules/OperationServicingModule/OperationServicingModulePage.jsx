import AuthCard from "../Servicing-Module/component/AuthCard";
import OperationStatusTrackingPage from "./Components/OperationStatusTrackingPage";

const OperationServicingModulePage = ({ isHeader = true }) => {

  return (
    <div className="relative w-full h-screen overflow-x-hidden bg-white rounded-l-lg">
      {isHeader && (
        <>
          <div className="bg-white border-b border-gray-200">
            <div className="flex items-center justify-between px-6 py-2">
              <section className="flex flex-col items-start">
                <h1 className="text-xl font-semibold text-gray-900">
                    Servicing Module
                </h1>
                <p className="text-sm text-gray-600">
                  Agent Profile Management Portal
                </p>
              </section>
              <AuthCard />
            </div>
          </div>
        </>
      )}

      <div className="px-6 py-4 h-[calc(100vh-100px)] overflow-auto">
       <OperationStatusTrackingPage />
      </div>
    </div>
  );
};

export default OperationServicingModulePage;
