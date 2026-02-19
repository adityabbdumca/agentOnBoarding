import { removeCharAddSpace } from "@/HelperFunctions/helperFunctions";
import { GlobalModal } from "@/UI-Components";
import UiButton from "@/UI-Components/Buttons/UiButton";
import UiCapsule from "@/UI-Components/Capsules/UiCapsule";
import UiDrawerWrapper from "@/UI-Components/Drawer/UiDrawer";
import UiTextArea from "@/UI-Components/Input/UiTextArea";
import { CACHE_KEYS } from "@/lib/ApiService/constants/CACHE_KEYS";
import { useQueryClient } from "@tanstack/react-query";
import {
  CheckCircle,
  ChevronLeft,
  Clock,
  GripHorizontal,
  MessageSquare,
  NotebookPen,
  NotepadText,
  RefreshCcw,
  RefreshCcwDot,
  TrendingUp,
  User,
} from "lucide-react";
import { DateTime } from "luxon";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { FaRegFileImage } from "react-icons/fa";
import { HiExternalLink } from "react-icons/hi";
import { toast } from "react-toastify";
import useStatusTracking from "../../hooks/useStatusTracking";
import {
  ACTION_BUTTONS,
  textColorClasses,
} from "../../servicingModule.constant";
import BeforeAfterSectionCard from "./Components/BeforeAfterSectionCard";
import RaiseDiscrepancyModal from "./Components/RaiseDescrepancyModal";
import { queryClientGlobal } from "@/lib/tanstack-query/query.config";

const ViewServicingModal = ({
  handleClose,
  setIsRespondModalOpen,
  isOpen,
  endorsementId,
}) => {
  const queryClient = useQueryClient();
  const formMethods = useForm({
    defaultValues: { respond: "" },
  });
  const {
    service: { viewEndorsementMutation, updateEndorsementStatusMutation },
  } = useStatusTracking();
  const [openRaiseDiscrepancyModal, setOpenRaiseDiscrepancyModal] = useState({
    open: false,
    key: null,
    text: null,
  });

  const [clickedAction, setClickedAction] = useState(null);
  const viewEndorseData = viewEndorsementMutation?.data?.data?.data;
  const verticalId = +localStorage.getItem("vertical_id");
  const isEndorsementStatus = viewEndorseData?.endorsement_status;

  const isDiscrepancyStatus =
    viewEndorseData?.endorsement_status === "Discrepancy Raised";
  const renderValue = (val) => {
    if (val == null || val === "") return "--";
    if (typeof val === "object") {
      return (
        <ul className="list-disc list-inside text-sm text-gray-700">
          {Object.entries(val).map(([k, v]) => (
            <li key={k}>
              <strong>{removeCharAddSpace(k, "_")}:</strong> {String(v) || "--"}
            </li>
          ))}
        </ul>
      );
    }
    return <span className="text-sm font-medium text-gray-800">{val}</span>;
  };

  const getIcon = (field) => {
    switch (field.toLowerCase()) {
      case "request_id":
        return <GripHorizontal className="size-4 text-blue-600" />;
      case "agent_name":
        return <User className="size-4 text-purple-600" />;
      case "agent_application_no":
        return <NotepadText className="size-4 text-indigo-600" />;
      case "endorsement_type_name":
      case "endorsement_type":
        return <NotebookPen className="size-4 text-orange-600" />;
      case "change_from":
        return <RefreshCcw className="size-4 text-amber-600" />;
      case "change_to":
        return <RefreshCcwDot className="size-4 text-green-600" />;
      case "endorsement_status_name":
      case "endorsement_status":
        return <TrendingUp className="size-4 text-emerald-600" />;
      case "last_updated":
      case "updated_at":
        return <Clock className="size-4 text-gray-600" />;
      default:
        return <CheckCircle className="size-4 text-gray-500" />;
    }
  };

  const shouldShowAsCapsule = (key) =>
    key.toLowerCase().includes("status") ||
    key.toLowerCase().includes("type") ||
    key.toLowerCase().includes("endorsement_type_name") ||
    key.toLowerCase().includes("endorsement_type");

  const getFieldBackground = (key) => {
    switch (key.toLowerCase()) {
      case "request_id":
        return "bg-blue-50 border-blue-200";
      case "agent_name":
        return "bg-purple-50 border-purple-200";
      case "agent_application_no":
        return "bg-indigo-50 border-indigo-200";
      case "endorsement_type_name":
      case "endorsement_type":
        return "bg-orange-50 border-orange-200";
      case "change_from":
        return "bg-amber-50 border-amber-200";
      case "change_to":
        return "bg-green-50 border-green-200";
      case "endorsement_status_name":
      case "endorsement_status":
        return "bg-emerald-50 border-emerald-200";
      case "last_updated":
      case "updated_at":
        return "bg-gray-50 border-gray-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  const isImage = /\.(jpe?g|png|gif|jfif)$/i.test(
    viewEndorseData?.document_path ?? ""
  );
  const onSubmit = (data) => {
    updateEndorsementStatusMutation
      .mutateAsync({
        endorsement_status_id: clickedAction,
        endorsement_id: endorsementId,
        respond: data?.respond,
      })
      .then((res) => {
        if (res?.status === 200) {
          toast.success(res?.data?.message);
          setOpenRaiseDiscrepancyModal({ open: false, text: null, key: null });
          handleClose();

          queryClientGlobal.invalidateQueries([CACHE_KEYS.ENDORSEMENT_UPDATE]);
        }
      });
  };
  useEffect(() => {
    if (endorsementId) {
      formMethods.reset({ respond: "" });
      viewEndorsementMutation.mutate({ endorsement_id: endorsementId });
    }
  }, [endorsementId]);

  return (
    <UiDrawerWrapper
      HeadSection={
        <section className="flex items-center gap-3 text-sm bg-gradient-to-r  from-blue-50 to-indigo-50 p-4 rounded-t-xl">
          <UiButton
            className="h-9 w-9 bg-white shadow-sm hover:shadow-md transition-shadow !p-2"
            icon={<ChevronLeft className="size-4 text-gray-600" />}
            buttonType="tertiary"
            onClick={handleClose}
          />
          <div className="flex items-center gap-2">
            <TrendingUp className="size-5 text-blue-600" />
            <p className="text-lg font-semibold text-gray-800">
              Single Status Tracking Details
            </p>
          </div>
        </section>
      }
      isOpen={isOpen}
      containerClass="w-[50%]"
      onClose={handleClose}
    >
      <div className="flex flex-col h-[calc(100vh-105px)] relative">
        <section className="flex-1 overflow-y-auto p-2">
          <div className="grid grid-cols-2 gap-4 mt-2">
            {Object.entries(viewEndorseData ?? {})
              .filter(
                ([key]) =>
                  ![
                    "actions",
                    "endorsement_status_colour",
                    "id",
                    "comment",
                    "document_path",
                    "before_changes",
                    "after_changes",
                  ].includes(key)
              )
              .map(([key, value]) => {
                const title = removeCharAddSpace(key, "_");
                const showAsCapsule = shouldShowAsCapsule(key);
                const statusKey =
                  key === "endorsement_status_name" ||
                  key === "endorsement_status";
                const lastUpdated =
                  key === "last_updated" ||
                  key === "updated_at" ||
                  key === "created_at";

                return (
                  <div
                    key={key}
                    className={`flex gap-3 ${getFieldBackground(
                      key
                    )} rounded-xl p-4 hover:shadow-sm transition-all duration-200 border`}
                  >
                    <div className="flex-shrink-0 mt-0.5">{getIcon(key)}</div>
                    <section className="flex flex-col gap-2 min-w-0 flex-1">
                      <h1 className="text-sm text-gray-500 capitalize font-medium">
                        {title}
                      </h1>

                      {showAsCapsule ? (
                        <UiCapsule
                          text={
                            typeof value === "object"
                              ? (value?.label ?? JSON.stringify(value))
                              : value
                          }
                          color={
                            statusKey
                              ? viewEndorseData?.endorsement_status_colour ||
                                "#FF894F"
                              : "#FF894F"
                          }
                        />
                      ) : (
                        <div className="text-sm font-semibold text-gray-800 break-words">
                          {lastUpdated
                            ? DateTime.fromISO(value).toFormat(
                                "dd/LL/yyyy HH:mm:ss"
                              )
                            : renderValue(value)}
                        </div>
                      )}
                    </section>
                  </div>
                );
              })}
          </div>

          {
            <BeforeAfterSectionCard
              viewEndorseData={viewEndorseData}
              renderValue={renderValue}
            />
          }
          <div className="flex flex-col gap-4 p-4 mt-1 text-sm text-gray bg-purple-50 border border-purple-200 rounded-xl  w-full">
            <h6 className="text-sm text-gray-700 font-medium">Comment</h6>
            <div className=" font-medium">
              {viewEndorseData?.comment ?? "---"}
            </div>
          </div>
          {/* Uploaded Document */}
          <div className="flex flex-col items-start mx-auto p-4 m-4 bg-purple-50 border border-purple-200 rounded-xl gap-3 w-full">
            <div className="flex items-center gap-2">
              <FaRegFileImage className="text-purple-600" />
              <h6 className="text-sm text-gray-700 font-medium">
                Uploaded Document
              </h6>
              <a
                href={viewEndorseData?.document_path}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
              >
                <HiExternalLink className="mr-1.5" />
                Open
              </a>
            </div>
            <div className="mx-auto  w-full  rounded-md overflow-hidden">
              {isImage ? (
                <img
                  src={viewEndorseData?.document_path ?? "/placeholder.svg"}
                  alt="Document Preview"
                  className="w-full h-48 object-contain rounded-md"
                />
              ) : (
                <iframe
                  src={viewEndorseData?.document_path}
                  title="Document Preview"
                  className="w-full h-48 border-0 cursor-pointer"
                />
              )}
            </div>
          </div>
        </section>

        {/* Fixed Action Buttons */}
        {
          ["Under Review", "Discrepancy Response"].includes(
            isEndorsementStatus
          ) &&
          [1, 2].includes(verticalId) && (
            <section className="sticky bottom-0 left-0 w-full bg-white border-t-lightGray flex gap-4 p-4">
              <FormProvider {...formMethods}>
                <form
                  onSubmit={formMethods?.handleSubmit(onSubmit)}
                  className="w-full flex flex-col gap-2 p-2">
                  <div className="space-y-2 mb-2">
                    <UiTextArea
                      name="respond"
                      placeholder="Provide your response or additional information..."
                      label="Respond"
                      registerOptions={{
                        onChange: (e) => {
                          dynamicAlphaNumeric(e, ["-", "_"], 100);
                        },
                        maxLength: {
                          value: 100,
                          message: "Respond must not exceed 100 characters",
                        },
                      }}
                    />
                  </div>
                  <div className="flex gap-4 ml-auto">
                    {ACTION_BUTTONS?.map((action) => {
                      const Icon = action.icon;
                      const isDiscrepancy = action?.label === "Discrepancy";
                      return (
                        <UiButton
                          key={action?.label}
                        
                          type={
                            action.label === "Discrepancy" ? "button" : "submit"
                          }
                          icon={<Icon className={`size-4 ${action?.color}`} />}
                          className={`flex-row-reverse p-2 text-sm w-24 data-[action-label=true]:text-blue-500 data-[action-label=true]:w-52 data-[action-label=History]:text-black ${
                            textColorClasses[action?.label] || "text-gray-950"
                          }`}
                          buttonType="secondary"
                          text={action.label}
                          onClick={() => {
                            setClickedAction(action?.button_id);
                            if (isDiscrepancy &&  !openRaiseDiscrepancyModal?.open)
                              setOpenRaiseDiscrepancyModal({
                                open: true,
                                text: viewEndorseData?.endorsement_type,
                                key: viewEndorseData?.request_id,
                              });
                          }}
                          isLoading={
                            updateEndorsementStatusMutation?.variables
                              ?.endorsement_status_id === action?.button_id
                              ? updateEndorsementStatusMutation?.isPending
                              : false
                          }
                        />
                      );
                    })}
                  </div>
                </form>
              </FormProvider>
            </section>
          )
        }
        {isDiscrepancyStatus && [3, 4].includes(verticalId) && (
          <section className="sticky bottom-0 left-0 w-full bg-white border-t-lightGray flex gap-4 p-4">
            <div className="flex ml-auto gap-4">
              <UiButton
                icon={<MessageSquare className="size-4 text-blue-500" />}
                className={`flex-row-reverse p-2 text-sm w-52 data-[action-label=History]:text-black text-blue-500
                    `}
                buttonType="secondary"
                text={"Resubmit Discrepancy"}
                onClick={() => {
                  setIsRespondModalOpen({
                    open: true,
                    endorsement_id: endorsementId,
                    endorsement_status_id: 4,
                    endorsement_type_name: viewEndorseData?.endorsement_type,
                  });
                }}
              />
            </div>
          </section>
        )}
      </div>
      <GlobalModal
        open={openRaiseDiscrepancyModal.open}
        onClose={() =>
          setOpenRaiseDiscrepancyModal({ open: false, text: null, key: null })
        }
        width={"450"}
        title={`Raise Endorsement Discrepancy`}
      >
        <RaiseDiscrepancyModal
          modalData={openRaiseDiscrepancyModal}
          closeDiscrepancyModal={() =>
            setOpenRaiseDiscrepancyModal({ open: false, text: null, key: null })
          }
          closeDrawer={handleClose}
          updateEndorsementStatusMutation={updateEndorsementStatusMutation}
          buttonId={clickedAction}
          endorsementId={endorsementId}
        />
      </GlobalModal>
    </UiDrawerWrapper>
  );
};

export default ViewServicingModal;
