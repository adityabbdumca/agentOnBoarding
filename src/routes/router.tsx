import PrivateRouteWrapper from "@/Components/Wrappers/PrivateRouteWrapper";
import { APP_BASE_PATH } from "@/config/env";
import { lazy } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
const ExamListingPage = lazy(
  () => import("@/modules/ExamListing/ExamListingPage")
);
const ExamQuestionPage = lazy(
  () => import("@/modules/ExamQuestions/ExamQuestionPage")
);
const ErrorBoundary = lazy(() => import("../hoc/ErrorBoundary"));
const BaseComponent = lazy(
  () => import("../modules/BaseComponent/BaseComponent")
);
const EndorsementPage = lazy(
  () => import("../modules/Servicing-Module/Pages/Endorsement/EndorsementPage")
);
const StatusTrackingPage = lazy(
  () =>
    import(
      "../modules/Servicing-Module/Pages/StatusTracking/StatusTrackingPage"
    )
);
const RegisterRequestPage = lazy(
  () =>
    import(
      "../modules/Servicing-Module/Pages/RegisterRequest/RegisterRequestPage"
    )
);
const Login = lazy(() => import("../modules/Login/Login"));
const OnboardingDetails = lazy(
  () => import("../modules/OnboardingDetails/index")
);
const RoleMasterIndex = lazy(
  () => import("../modules/RoleMaster/RoleMasterIndex")
);
const AccessControlIndex = lazy(
  () => import("../modules/Access-Control/AccessControlIndex")
);
const AgentMasterIndex = lazy(
  () => import("../modules/Agent-Master/AgentMasterIndex")
);
const CreateUserIndex = lazy(
  () => import("../modules/Create-User/CreateUserIndex")
);
const TransactionMasterIndex = lazy(
  () => import("../modules/Transaction-Master/TransactionMasterIndex")
);
const TrainingMasterIndex = lazy(
  () => import("../modules/Training-Master/TrainingMasterIndex")
);
const DiscrepancyListingIndex = lazy(
  () => import("../modules/Discrepancy-Listing/DiscrepancyListingIndex")
);
// const OnboardingIndex = lazy(() => import("../modules/Onboarding/index"));
const PincodeIndex = lazy(() => import("../modules/Pincode/PincodeIndex"));

const SideBar = lazy(() => import("../Components/SideBar/SideBar"));

const AgentSideBar = lazy(() => import("../Components/SideBar/AgentSideBar"));

const ThemeIndex = lazy(() => import("../modules/Theme/ThemeIndex"));
const ReportIndex = lazy(() => import("../modules/IRDAI-Report/ReportIndex"));

const IFSCMasterIndex = lazy(
  () => import("../modules/IFSC-Master/IFSCMasterIndex")
);
const BulkUploadIndex = lazy(
  () => import("../modules/Payment-Bulk-Upload/BulkUploadIndex")
);
const MenuMasterIndex = lazy(
  () => import("../modules/Menu-Master/MenuMasterIndex")
);

const AgentBulkUpload = lazy(() => import("../modules/AgentBulkUpload/index"));
const LeadUploadIndex = lazy(
  () => import("../modules/Lead-Bulk-Upload/LeadUploadIndex")
);
const UpdateComponent = lazy(
  () => import("../modules/Admin-Approval/UpdateComponent")
);

const EventIndex = lazy(() => import("../modules/Event-Master/EventIndex"));
const RoleBasedCharges = lazy(
  () => import("../modules/Role-BasedCharges/RoleBasedCharges")
);

const NOCIndex = lazy(() => import("../modules/NOC/index"));

const NotFound = lazy(() => import("../Components/NotFound/NotFound"));

const ExamDateBulkIndex = lazy(
  () => import("../modules/ExamBulkUpload/ExamBulkIndex")
);

const ExamResultBulkIndex = lazy(
  () => import("../modules/ExamResultBulkUpload/ExamResultBulkIndex")
);

const ExamQuestionsIndex = lazy(
  () => import("../modules/Exam-Questions-Upload/ExamQuestionsIndex")
);

const ExamConfigListing = lazy(
  () => import("../modules/Exam-Config/Components/ExamConfigListing")
);

const AgentMenuMasterIndex = lazy(
  () => import("../modules/AgentMenuMaster/AgentMenuMasterIndex")
);

const ServerDown = lazy(
  () => import("../Components/MaintainancePage/ServerDown")
);

const UrlConfigIndex = lazy(
  () => import("../modules/UrlConfig/UrlConfigIndex")
);

const UtilityMasterIndex = lazy(
  () => import("../modules/UtilityMaster/UtilityMasterIndex")
);
const PendingExamShows = lazy(
  () => import("../modules/PendingExamShows/PendingExamShows")
);
const PaymentWayOfLazyPage = lazy(
  () => import("../modules/PaymentWayOf/PaymentWayOfPage")
);
const ServicingLazyComponent = lazy(
  () => import("../modules/Servicing-Module/ServicingModule")
);
const BlackListingAgentPage = lazy(
  () => import("@/modules/BlackListingAgents/BlackListingAgentPage")
);

const PaymentReceiptPage = lazy(
  () => import("@/modules/PaymentReciept/PaymentRecieptPage")
);
const RescheduleRaisePage = lazy(
  () => import("@/modules/RescheduleRaise/RescheduleRaisePage")
);
const RescheduleApproveListingPage = lazy(
  () => import("@/modules/RescheduleApproveModule/RescheduleApproveListingPage")
);
const RescheduleExamPage = lazy(
  () => import("@/modules/RescheduleExam/RescheduleExamPage")
);
const RescheduleExamListingPage = lazy(
  () => import("@/modules/RescheduleExamListing/RescheduleExamListingPage")
);
const EditRescheduleExamDetails = lazy(
  () => import("@/modules/RescheduleExam/component/EditRescheduleExamDetails")
);
const ApproveRescheduleExamDetails = lazy(
  () =>
    import("@/modules/RescheduleRaise/component/ApproveRescheduleExamDetails")
);

const AgingDiscrepancyPage = lazy(
  () => import("@/modules/AgingDiscrepancy/AgingDiscrepancyPage")
);

const OperationServicingModulePage = lazy(
  () =>
    import("../modules/OperationServicingModule/OperationServicingModulePage")
);

const router = createBrowserRouter(
  [
    {
      path: "/login",
      element: <Login />,
      errorElement: <ErrorBoundary />,
    },
    {
      element: <PrivateRouteWrapper />,
      children: [
        {
          path: "/",
          element: <SideBar />,
          children: [
            {
              path: "/",
              element: <BaseComponent />,
            },
            {
              path: "/role-master",
              element: <RoleMasterIndex />,
            },
            {
              path: "/servicing-module",
              element: <ServicingLazyComponent />,
              children: [
                {
                  index: true,
                  element: <Navigate to="endorsement" replace />,
                },
                {
                  path: "endorsement",
                  element: <EndorsementPage />,
                },
                {
                  path: "status-tracking",
                  element: <StatusTrackingPage />,
                },

                {
                  path: "register-request/:id",
                  element: <RegisterRequestPage />,
                },
              ],
            },
            {
              path: "status-tracking-actionable",
              element: <OperationServicingModulePage />,
            },
            {
              path: "status-tracking-non-actionable",
              element: <OperationServicingModulePage />,
            },
            {
              path: "/access-control",
              element: <AccessControlIndex />,
            },
            {
              path: "/agent-master",
              element: <AgentMasterIndex />,
            },
            {
              path: "/agent-master/:id",
              element: <UpdateComponent />,
            },
            {
              path: "/create-user",
              element: <CreateUserIndex />,
            },
            {
              path: "/transaction-master",
              element: <TransactionMasterIndex />,
            },
            {
              path: "/training-master",
              element: <TrainingMasterIndex />,
            },
            {
              path: "/discrepancy-listing",
              element: <DiscrepancyListingIndex />,
            },
            {
              path: "/pincode-master",
              element: <PincodeIndex />,
            },
            {
              path: "/reschedule-raise",
              element: <RescheduleRaisePage />,
            },
            {
              path: "/reschedule-approve",
              element: <RescheduleApproveListingPage />,
            },
            {
              path: "/reschedule-exam",
              element: <RescheduleExamPage />,
            },
            {
              path: "/reschedule-listing",
              element: <RescheduleExamListingPage />,
            },
            {
              path: "/reschedule-exam/:id",
              element: <EditRescheduleExamDetails />,
            },
            {
              path: "/reschedule-raise/:id",
              element: <ApproveRescheduleExamDetails />,
            },
            {
              path: "/theme",
              element: <ThemeIndex />,
            },
            {
              path: "/irdai-report",
              element: <ReportIndex />,
            },
            {
              path: "/ifsc-master",
              element: <IFSCMasterIndex />,
            },
            {
              path: "/bulk-upload",
              element: <BulkUploadIndex />,
            },
            {
              path: "/menu-master",
              element: <MenuMasterIndex />,
            },
            {
              path: "/role-based-charges",
              element: <RoleBasedCharges />,
            },
            {
              path: "/payment-waiver",
              element: <PaymentWayOfLazyPage />,
            },
            {
              path: "/agent-bulk-upload",
              element: <AgentBulkUpload />,
            },

            // {
            //   path: "/document-upload",
            //   element: <DocumentUploadIndex />,
            // },
            // {
            //   path: "/branch-onboarding",
            //   element: <BranchIndex />,
            // },
            {
              path: "/lead-upload",
              element: <LeadUploadIndex />,
            },
            {
              path: "/event-master",
              element: <EventIndex />,
            },
            // {
            //   path: "/pos-bulk-upload",
            //   element: <POSIndex />,
            // },
            // {
            //   path: "/sp-bulk-upload",
            //   element: <SPIndex />,
            // },
            // {
            //   path: "/av-bulk-upload",
            //   element: <AVIndex />,
            // },
            {
              path: "/noc",
              element: <NOCIndex />,
            },
            {
              path: "/exam-date-bulk-upload",
              element: <ExamDateBulkIndex />,
            },
            {
              path: "/exam-result-bulk-upload",
              element: <ExamResultBulkIndex />,
            },
            // {
            //   path: "/exam-config",
            //   element: <ExamConfigIndex />,
            // },
            {
              path: "/exam-config-listing",
              element: <ExamListingPage />,
            },
            {
              path: "/exam-questions",
              // element: <ExamQuestionsIndex />,
              element: <ExamQuestionPage />,
            },
            {
              path: "/agent-menu-master",
              element: <AgentMenuMasterIndex />,
            },
            {
              path: "/url-config",
              element: <UrlConfigIndex />,
            },
            {
              path: "/utility-master",
              element: <UtilityMasterIndex />,
            },
            {
              path: "/exam-pending",
              element: <PendingExamShows />,
            },
            {
              path: "/blacklisted-agents",
              element: <BlackListingAgentPage />,
            },
            {
              path: "/payment-receipt-master",
              element: <PaymentReceiptPage />,
            },
            {
              path: "/aging-descrepancy",
              element: <AgingDiscrepancyPage />,
            },
          ],
        },
        {
          path: "/agent",
          element: <AgentSideBar />,
          children: [
            {
              index: true,
              element: <OnboardingDetails />,
            },
            {
              path: "servicing-module",
              element: <ServicingLazyComponent />,
              children: [
                {
                  index: true,
                  element: <Navigate to="endorsement" replace />,
                },
                {
                  path: "endorsement",
                  element: <EndorsementPage />,
                },

                {
                  path: "status-tracking",
                  element: <StatusTrackingPage />,
                },
                {
                  path: "register-request/:id",
                  element: <RegisterRequestPage />,
                },
              ],
            },
          ],
        },
      ],
    },
    {
      path: "*",
      element: <NotFound />,
    },
    {
      path: "/500",
      element: <ServerDown />,
    },
  ],
  { basename: "/onboarding" }
);

export default router;
