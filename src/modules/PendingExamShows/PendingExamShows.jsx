import { useState, useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import moment from "moment/moment";
import MasterTable from "@/Components/MasterTable";
import MainContainer from "../OnboardingDetails/Components/MainContainer";
import { URLs } from "@/lib/ApiService/constants/URLS";
import Calendar from "@/Components/DateRangePicker/Calendar";
import Input from "@/UI-Components/Input";
import { useExamExportExcel } from "./Service";
import { PiMicrosoftExcelLogoFill } from "react-icons/pi";
import { Button } from "@/UI-Components";
import { debounce } from "lodash";

const PendingExamShows = () => {
  const { setValue, watch } = useForm({
    defaultValues: {
      date_range: [moment().startOf("month"), moment().endOf("month")],
    },
  });

  const startDate = watch("date_range")?.[0];
  const endDate = watch("date_range")?.[1];

  const [searchData, setSearchData] = useState({
    start_date: moment(startDate).format("YYYY-MM-DD") || "",
    end_date: moment(endDate).format("YYYY-MM-DD") || "",
    search_value: "",
    search_type: "",
  });
  const { mutate: exportExcel } = useExamExportExcel();

  const onClickHandleExport = () => {
    exportExcel({
      startDate: `${moment(startDate).format("YYYY-MM-DD")}`,
      endDate: `${moment(endDate).format("YYYY-MM-DD")}`,
    });
  };
  useEffect(() => {
    if (endDate) {
      setSearchData((prev) => ({
        ...prev,
        start_date: moment(startDate).format("YYYY-MM-DD"),
        end_date: moment(endDate).format("YYYY-MM-DD"),
      }));
    }
  }, [endDate, startDate]);

  const debouncedSearch = useCallback(
    debounce((value) => {
      setSearchData((prev) => ({
        ...prev,
        search_value: value,
      }));
    }, 300),
    []
  );

  return (
    <MainContainer
      title="Exam Pending List"
      heading={"Exam Pending List"}
      subHeading={"Displays pending exams for New agents"}
    >
      <MasterTable
        api={URLs.EXPORT_EXAM_PENDINGEXAM_LIST}
        method={"POST"}
        payload={searchData}
        renderTopToolbarCustomActions={() => {
          return (
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-3">
                <Button
                  variant="outlined"
                  width={"auto"}
                  startIcon={<PiMicrosoftExcelLogoFill />}
                  onClick={() => onClickHandleExport()}
                >
                  Export
                </Button>

                <span className="flex w-full gap-3 items-center text-xs font-medium bg-slate-50 p-2 rounded-lg">
                  Filter Date Range:
                  <Calendar
                    name="date_range"
                    watch={watch}
                    setValue={setValue}
                    isMaxDate={false}
                  />
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Input
                  name="search_value"
                  placeholder="Search by Name, Mobile or Exam ID"
                  onChange={(e) => {
                    debouncedSearch(e.target.value);
                  }}
                />
              </div>
            </div>
          );
        }}
      />
    </MainContainer>
  );
};

export default PendingExamShows;
