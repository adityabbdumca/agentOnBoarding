import React from "react";
import MainContainer from "../OnboardingDetails/Components/MainContainer";
import { ICONS } from "@/constants/ICONS";
import Button from "@/UI-Components/Button";
import MasterTable from "@/Components/MasterTable";
import GlobalModal from "@/UI-Components/Modals/GlobalModal";
import UploadExcel from "../Payment-Bulk-Upload/UploadExcel";
import { useExamExcel, useExamExcelDownload } from "./service";

const ExamResultBulkIndex = () => {
  const [openModal, setOpenModal] = React.useState(false);

  const { mutate } = useExamExcel(setOpenModal);

  const { data, mutate: ExcelMutate } = useExamExcelDownload();

  const onSubmit = (data) => {
    const payload = { exam_result_excel: data?.excel[0] };
    mutate(payload);
  };

  return (
    <MainContainer
      Icon={ICONS["Exam Details"]}
      title="Exam Result Bulk Upload"
      heading={"Exam Result Bulk Upload"}
      subHeading={
        "Upload the results for your Insurance Agent qualification exam"
      }
      pageActions={
        <>
          {" "}
          <Button
            width={"auto"}
            variant={"outlined"}
            startIcon={ICONS["Exam Details"]}
            onClick={() => [setOpenModal(true), ExcelMutate()]}
          >
            Upload Excel
          </Button>
        </>
      }
    >
      <MasterTable api={"listExamDateExcel"} />

      <GlobalModal
        open={openModal}
        setOpen={setOpenModal}
        onClose={() => setOpenModal(false)}
        title={"Bulk Upload"}
        width={500}
      >
        <UploadExcel data={data} mutate={ExcelMutate} onSubmit={onSubmit} />
      </GlobalModal>
    </MainContainer>
  );
};

export default ExamResultBulkIndex;
