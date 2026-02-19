import Calendar from "@/Components/DateRangePicker/Calendar";
import MasterTable from "@/Components/MasterTable";
import useGlobalDebounceHandler from "@/hooks/useGlobalDebounce";
import { Button, GlobalModal } from "@/UI-Components";
import UiButton from "@/UI-Components/Buttons/UiButton";
import UiCapsule from "@/UI-Components/Capsules/UiCapsule";
import { ActionContainer } from "@/UI-Components/GlobalStyles";
import Input from "@/UI-Components/Input";
import ActionConfirmationModal from "@/UI-Components/Modals/ActionConfirmModal";
import { Copy, Eye, History } from "lucide-react";
import { DateTime } from "luxon";
import moment from "moment";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { PiMicrosoftExcelLogoFill } from "react-icons/pi";
import { toast } from "react-toastify";
import HistoryModal from "../../component/HistoryModal";
import RespondModal from "../../component/RespondModal";
import ViewServicingModal from "../../component/ViewServicingModal/ViewServicingModal";
import useStatusTracking from "../../hooks/useStatusTracking";
import { textColorClasses } from "../../servicingModule.constant";

const StatusTrackingPage = () => {
  const {
    states: {
      respondModalOpen,
      setIsRespondModalOpen,
      historyModalOpen,
      setIsHistoryModalOpen,
      confirmModal,
      setConfirmModal,
      viewModal,
      setViewModal,
    },
    functions: { handleActionSubmit, handleRespondSubmit },
    service: {
      historyEndorsementMutation,
      updateEndorsementStatusMutation,
      exportMutation,
    },
  } = useStatusTracking();
  const { setValue, watch } = useForm({
    defaultValues: {
      date_range: [moment().startOf("month"), moment().endOf("month")],
    },
  });
  const startDate = watch("date_range")?.[0];
  const endDate = watch("date_range")?.[1];
  const historyData = historyEndorsementMutation?.data?.data ?? [];
  const verticalId = +localStorage?.getItem("vertical_id");
  const [searchData, setSearchData] = useState({
    start_date: moment(startDate).format("YYYY-MM-DD") || "",
    end_date: moment(endDate).format("YYYY-MM-DD") || "",
    search_value: "",
  });
  const { debouncedQuery } = useGlobalDebounceHandler(searchData);
  // Debounced search

  useEffect(() => {
    if (endDate) {
      setSearchData((prev) => ({
        ...prev,
        start_date: moment(startDate).format("YYYY-MM-DD"),
        end_date: moment(endDate).format("YYYY-MM-DD"),
      }));
    }
  }, [endDate]);
  const StatusTrackingCustomCells = {
    endorsement_status_name: ({ row }) => {
      const color = row.original.endorsement_status_colour;
      return (
        <UiCapsule
          text={row.getValue("endorsement_status_name")}
          color={color}
          className=""
        />
      );
    },
    agent_application_no: ({ row }) => {
      if (!row.getValue("agent_application_no")) return <span>N/A</span>;
      const handleCopy = () => {
        navigator.clipboard.writeText(row.getValue("agent_application_no"));
        toast.info("Application number copied to clipboard");
      };
      return (
        <UiButton
          text={row.getValue("agent_application_no")}
          buttonType="tertiary"
          icon={<Copy className="size-4" />}
          className=" flex-row-reverse border bg-blue-50 text-blue-600 text-xs  p-1 mr-2 border-none"
          onClick={() => handleCopy()}
        />
      );
    },
    last_updated: ({ row }) => {
      const date = row?.original?.last_updated;
      const formattedDate = DateTime.fromSQL(date).toFormat(
        "dd-MM-yyyy, HH:mm:ss"
      );

      return <span>{formattedDate}</span>;
    },
  };

  return (
    <div>
      <div className="mb-8 flex flex-col gap-1">
        <h2 className="text-lg font-semibold text-gray-900">
          Request Status Tracking
        </h2>
        <p className="text-gray-600 text-sm">
          Track and manage profile update requests with complete discrepancy
          workflow
        </p>
      </div>
      <MasterTable
        api={"get-endorsement-data"}
        method="POST"
        payload={debouncedQuery}
        customCellRenderers={StatusTrackingCustomCells}
        columnSizes={{ request_id: 800 }}
        renderTopToolbarCustomActions={() => {
          return (
            <div className="flex items-center justify-between w-full">
              {[2, 3].includes(verticalId) && (
                <div className="m-3">
                  <Button
                    variant="outlined"
                    width={"auto"}
                    startIcon={<PiMicrosoftExcelLogoFill />}
                    onClick={() => {
                      exportMutation.mutate({
                        startDate: moment(startDate).format("YYYY-MM-DD"),
                        endDate: moment(endDate).format("YYYY-MM-DD"),
                      });
                    }}
                    className="px-4 flex flex-row-reverse"
                    disabled={exportMutation.isPending}
                    isLoading={exportMutation.isPending}>
                    {verticalId === 3 ? "Export" : "Download"}
                  </Button>
                </div>
              )}

              <span className="flex w-full gap-3 items-center text-xs font-medium bg-slate-50 p-2 rounded-lg">
                Filter Date Range:
                <Calendar
                  name="date_range"
                  watch={watch}
                  setValue={setValue}
                  isMaxDate={false}
                />
              </span>
              <Input
                name="search_value"
                placeholder={"Search Table"}
                onChange={(e) =>
                  setSearchData((prev) => ({
                    ...prev,
                    search_value: e.target.value,
                  }))
                }
              />
            </div>
          );
        }}
        customActions={(props) => {
          const row = props.row;
          const actions = row.original.actions || [];
          const actionConfig = {
            View: {
              icon: <Eye className="size-4 text-gray-950" />,
              onClick: () => {
                setViewModal({
                  open: true,
                  data: row.original,
                  endorsement_id: row?.original?.id,
                });
              },
            },
            History: {
              icon: <History className="size-4 text-black" />,
              onClick: (row) => {
                setIsHistoryModalOpen({
                  open: true,
                  action: "History",
                  endorsement_id: row?.original?.id,
                });
              },
            },
          };

          return (
            <ActionContainer>
              {actions.map((action) => {
                const config = actionConfig[action.label];
                const label = action.label?.trim();

                if (!config) return null;

                return (
                  <UiButton
                    key={action?.label}
                    icon={config.icon}
                    data-action-label={
                      action?.label?.trim() == "Resubmit Discrepancy"
                    }
                    className={`flex-row-reverse p-2 text-sm data-[action-label=true]:text-blue-500 data-[action-label=true]:w-52 data-[action-label=History]:text-black ${
                      textColorClasses[label] || "text-gray-950"
                    }`}
                    buttonType="secondary"
                    text={action.label}
                    onClick={(e) => {
                      e.stopPropagation();
                      config.onClick(row, {
                        buttonId: action?.id,
                      });
                    }}
                  />
                );
              })}
            </ActionContainer>
          );
        }}
      />
      <GlobalModal
        open={respondModalOpen.open}
        onClose={() =>
          setIsRespondModalOpen({ open: false, row: null, action: null })
        }
        title="Respond Status"
        description="Provide the requested information or documents."
        width={500}>
        <RespondModal
          endorsement_id={respondModalOpen.endorsement_id}
          endorsement_status_id={respondModalOpen.endorsement_status_id}
          endorsement_type_name={respondModalOpen.endorsement_type_name}
          handleViewModalClose={() => {
            setViewModal({ open: false, data: null });
          }}
          onSubmit={handleRespondSubmit}
          isLoading={updateEndorsementStatusMutation?.isPending}
        />
      </GlobalModal>

      <GlobalModal
        open={historyModalOpen.open}
        onClose={() =>
          setIsHistoryModalOpen({ open: false, row: null, action: null })
        }
        title="Request History - REQ003"
        description="Complete communication history for this request."
        width={600}>
        <HistoryModal
          historyData={historyData}
          isLoading={historyEndorsementMutation?.isPending}
        />
      </GlobalModal>

      {confirmModal?.open && (
        <ActionConfirmationModal
          open={confirmModal.open}
          onClose={() =>
            setConfirmModal({ open: false, action: null, row: null })
          }
          onConfirm={() =>
            handleActionSubmit({
              button_id: confirmModal?.button_id,
              endorsement_id: confirmModal?.row?.original?.id,
            })
          }
          actionType={confirmModal.action}
          title={confirmModal.title}
          message={confirmModal.message}
          isLoading={updateEndorsementStatusMutation?.isPending}
        />
      )}
      {viewModal?.open && (
        <ViewServicingModal
          isOpen={viewModal?.open}
          handleClose={() => {
            setViewModal({ open: false, data: null });
          }}
          endorsementId={viewModal?.endorsement_id}
          data={viewModal?.data}
          setIsRespondModalOpen={setIsRespondModalOpen}
        />
      )}
    </div>
  );
};

export default StatusTrackingPage;
