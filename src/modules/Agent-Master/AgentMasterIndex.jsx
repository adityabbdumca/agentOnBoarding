import { Tooltip } from "@mui/material";
import { debounce } from "lodash";
import moment from "moment/moment";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { FiUserCheck } from "react-icons/fi";
import { HiChevronLeft, HiOutlineShare, HiUserAdd } from "react-icons/hi";
import { HiOutlineEnvelope, HiOutlineEye } from "react-icons/hi2";
import { PiMicrosoftExcelLogoFill } from "react-icons/pi";
import { useNavigate, useSearchParams } from "react-router-dom";
import Calendar from "@/Components/DateRangePicker/Calendar";
import MasterTable from "@/Components/MasterTable";
import MainConatiner from "@/modules/OnboardingDetails/Components/MainContainer";
import Button from "@/UI-Components/Button";
import GlobalModal from "@/UI-Components/Modals/GlobalModal";
import { ActionContainer } from "@/UI-Components/GlobalStyles";
import Input from "@/UI-Components/Input";
import { AgentMasterCustomCells } from "./AgentMasterCustomCells";
import CreateLead from "./CreateLead";
import ExamPassForm from "./ExamPassForm";
import LogTable from "./LogTable";
import { useSHAREJOURNEY } from "./Service";
import {
  useApproveCertificate,
  useExportAgentMaster,
  useGetMasterCount,
} from "./Service";
import UiButton from "@/UI-Components/Buttons/UiButton";

const AgentMasterIndex = () => {
  const navigate = useNavigate();
  const [openLead, setOpenLead] = useState(false);
  const [openLogs, setOpenLogs] = useState(false);
  const [openTableModal, setOpenTableModal] = useState({
    open: false,
    data: null,
    result: null,
  });

  const { setValue, watch } = useForm({
    defaultValues: {
      date_range: [moment().startOf("month"), moment().endOf("month")],
    },
  });

  const defaultStart = moment().startOf("month").format("YYYY-MM-DD");
  const defaultEnd = moment().endOf("month").format("YYYY-MM-DD");

  const startDate = watch("date_range")?.[0];
  const endDate = watch("date_range")?.[1];

  const scrollRef = useRef(null);
  const [logId, setLogId] = useState(0);

  const [searchData, setSearchData] = useState({
    start_date: defaultStart,
    end_date: defaultEnd,
    search_value: "",
  });

  // Debounced search
  const debouncedSearch = useCallback(
    debounce((value) => {
      setSearchData((prev) => ({
        ...prev,
        search_value: value,
      }));
    }, 300),
    []
  );

  const { mutate: exportExcel } = useExportAgentMaster();
  const { mutate: approveCertificate } = useApproveCertificate();
  const {
    data: countData,
    isPending,
    refetch: refetchCount,
  } = useGetMasterCount(
    `${moment(startDate).format("YYYY-MM-DD")}`,
    endDate ? `${moment(endDate).format("YYYY-MM-DD")}` : null
  );

  const countArray = useMemo(
    () => (countData && Array.isArray(countData) ? countData : []),
    [countData]
  );

  useEffect(() => {
    if (countArray) {
      setSearchData((prev) => ({
        ...prev,
        stage_id: countArray[0]?.id,
      }));
    }
  }, [countArray]);

  const handleScrollLeft = useCallback(() => {
    scrollRef.current?.scrollTo({
      left: scrollRef.current.scrollLeft - 300,
      behavior: "smooth",
    });
  }, []);

  const handleScrollRight = useCallback(() => {
    scrollRef.current?.scrollTo({
      left: scrollRef.current.scrollLeft + 300,
      behavior: "smooth",
    });
  }, []);

  useEffect(() => {
    if (endDate) {
      setSearchData((prev) => ({
        ...prev,
        start_date: moment(startDate).format("YYYY-MM-DD"),
        end_date: moment(endDate).format("YYYY-MM-DD"),
      }));
      refetchCount();
    }
  }, [endDate]);

  const { mutate } = useSHAREJOURNEY();
  const shareJourney = (row) => {
    const payload = { id: row?.original?.id };
    mutate(payload);
  };

  return (
    <MainConatiner
      title="Agent Master"
      Icon={FiUserCheck}
      heading={"Agent Master"}
      subHeading={
        "Monitor onboarding progress, review agent details, and perform approvals, updates, or actions from the Agent Master dashboard."
      }
      pageActions={
        ![1, 2].includes(+JSON.parse(localStorage.getItem("vertical_id"))) && (
          <UiButton
            buttonType="tertiary"
            className="flex-row-reverse p-2 hover:bg-primary hover:text-white rounded-lg border border-primary outline-primary bg-white text-primary"
            type="button"
            icon={<HiUserAdd className="size-5" />}
            text={"Onboard Agent"}
            onClick={() => setOpenLead(true)}
          />
        )
      }
      isAdmin
    >
      {/* Stage Count Section */}
      <div className="flex gap-3 h-12 bg-white border-2 border-lightGray rounded-lg px-1 py-1  mt-3">
        <div
          className="w-full hide-scroll flex gap-2 overflow-x-scroll relative"
          ref={scrollRef}
        >
          {scrollRef.current?.scrollWidth > scrollRef.current?.clientWidth && (
            <button
              type="button"
              className={`rounded-full size-6 flex items-center justify-center bg-primary text-white cursor-pointer accent-amber-200 sticky top-1.5 left-1`}
            >
              <HiChevronLeft className="size-6 " onClick={handleScrollLeft} />
            </button>
          )}
          {countArray?.length > 0 ? (
            countArray?.map((item) => (
              <button
                data-selected={searchData.stage_id === item.id}
                type="button"
                className="border-0 rounded-lg px-2 py-3 flex gap-1 items-center justify-center  cursor-pointer data-[selected=true]:bg-primary/20 data-[selected=true]:text-white data-[selected=true]:font-semibold hover:bg-primary/10  hover:font-semibold  focus:outline-none transition-all ease-in-out duration-200"
                key={item?.id}
                onClick={() => {
                  setSearchData((prev) => ({
                    ...prev,
                    stage_id: item?.id,
                  }));
                }}
              >
                <span
                  data-selected={searchData.stage_id === item.id}
                  className="text-xs data-[selected=true]:text-primary font-semibold w-max truncate"
                >
                  {item?.stage}
                </span>
                <span className="text-xs bg-white text-primary p-1.5 rounded-full size-7 font-semibold">
                  {item?.count}
                </span>
              </button>
            ))
          ) : isPending ? (
            [...Array(15)].map((item) => {
              return (
                <div
                  key={item}
                  className="h-8 w-16 animate-pulse bg-slate-200 rounded-lg"
                />
              );
            })
          ) : (
            <p className="w-full font-semibold  text-xs text-gray-500 my-auto text-center">
              No Data Found
            </p>
          )}
          {scrollRef.current?.scrollWidth > scrollRef.current?.clientWidth && (
            <button
              type="button"
              className="rounded-full size-6 flex items-center justify-center bg-primary text-white cursor-pointer accent-amber-200 sticky top-1.5 right-1"
              onClick={handleScrollRight}
            >
              <HiChevronLeft className="size-6 rotate-180" />
            </button>
          )}
        </div>
      </div>

      <MasterTable
        api={"agentMasterList"}
        methods={"POST"}
        payload={searchData}
        setOpenTableModal={setOpenTableModal}
        mutateObj={[approveCertificate]}
        customCellRenderers={AgentMasterCustomCells}
        renderTopToolbarCustomActions={() => {
          return (
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-3">
                <UiButton
                  icon={<PiMicrosoftExcelLogoFill className="size-4.5 mr-1" />}
                  buttonType="tertiary"
                  className="flex-row-reverse p-2 hover:bg-primary hover:text-white rounded-lg border border-primary w-35 outline-primary bg-white text-primary"
                  text={"Export"}
                  onClick={() => {
                    const findStage = countArray?.find(
                      (item) => item.id == searchData?.stage_id
                    );

                    exportExcel({
                      defaultStart: `${moment(defaultStart).format("YYYY-MM-DD")}`,
                      defaultEnd: `${moment(defaultEnd).format("YYYY-MM-DD")}`,
                      stage: findStage?.stage,
                    });
                  }}
                />
                <span className="flex w-full gap-3 items-center text-xs font-medium bg-slate-50 p-2 rounded-lg">
                  Filter Date Range:
                  <Calendar
                    name="date_range"
                    watch={watch}
                    setValue={setValue}
                    isMaxDate={false}
                    // onDateChange={(start, end) => {
                    //   const formattedStart = moment(start).format("YYYY-MM-DD");
                    //   const formattedEnd = moment(end).format("YYYY-MM-DD");

                    //   // update searchData
                    //   console.log("1")
                    //   setSearchData((prev) => ({
                    //     ...prev,
                    //     start_date: formattedStart,
                    //     end_date: formattedEnd,
                    //   }));
                    //   console.log("2")
                    //   refetchCount();
                    // }}
                  />
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Input
                  name="search_value"
                  placeholder={"Search Table"}
                  onChange={(e) => debouncedSearch(e.target.value)}
                />
              </div>
            </div>
          );
        }}
        customActions={({ row }) => {
          return (
            <ActionContainer>
              <Tooltip title="Continue Journey" placement="top" arrow>
                <div
                  onClick={() => {
                    navigate(`/agent-master/${row?.original?.id}`);
                  }}
                >
                  <HiOutlineEye />
                </div>
              </Tooltip>
              <Tooltip title="Trigger Email Link" placement="top" arrow>
                <div
                  onClick={() => {
                    setLogId(row?.original?.id);
                    setOpenLogs(true);
                  }}
                  className="pointer-events-none opacity-50"
                >
                  <HiOutlineEnvelope />
                </div>
              </Tooltip>
              <Tooltip title="Share Journey" placement="top" arrow>
                <div
                  onClick={() => shareJourney(row)}
                  className="pointer-events-none opacity-50"
                >
                  <HiOutlineShare />
                </div>
              </Tooltip>
            </ActionContainer>
          );
        }}
      />

      {/* Modals */}

      <GlobalModal
        open={openLead}
        onClose={() => setOpenLead(false)}
        title={"Create an Agent"}
        width={500}
      >
        <CreateLead setOpenModal={setOpenLead} />
      </GlobalModal>
      <GlobalModal
        open={openTableModal.open}
        onClose={() =>
          setOpenTableModal({
            open: false,
            data: null,
            result: null,
          })
        }
        title={"Exam Result"}
        width={500}
      >
        <ExamPassForm
          setOpenTableModal={setOpenTableModal}
          rowData={openTableModal}
        />
      </GlobalModal>
      <GlobalModal
        open={openLogs}
        onClose={() => setOpenLogs(false)}
        title={"User Training Log"}
      >
        <LogTable logId={logId} />
      </GlobalModal>
    </MainConatiner>
  );
};

export default AgentMasterIndex;
