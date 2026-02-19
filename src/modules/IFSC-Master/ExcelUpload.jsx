import { FilePicker } from "@/UI-Components";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useDownloadSampleIfscExcel, useIfscUploadExcel } from "./service";
import UiButton from "@/UI-Components/Buttons/UiButton";
import excel from "@/assets/images/excel.svg";

const excelSchema = yup.object().shape({
  excel: yup
    .mixed()
    .required("Please upload an Excel file")
    .test("fileType", "Only Excel files are allowed", (value) => {
      if (!value || value.length === 0) return false;
      const file = value[0];
      return (
        file.type ===
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" || // .xlsx
        file.type === "application/vnd.ms-excel" // .xls
      );
    })
    .test("fileSize", "File size must be less than 5 MB", (value) => {
      if (!value || value.length === 0) return false;
      return value[0].size <= 5 * 1024 * 1024;
    }),
});

function ExcelUpload({ setOpenExcelModal }) {
  const {
    handleSubmit,
    clearErrors,
    watch,
    control,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(excelSchema),
  });

  const { mutate: UploadExcel } = useIfscUploadExcel(setOpenExcelModal);
  const { mutate: downloadSample } = useDownloadSampleIfscExcel();
  const onSubmit = (data) => {
    const payload = {
      file: Array.isArray(data.excel) ? data.excel[0] : data.excel,
    };
    UploadExcel(payload);
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="p-3">
          <FilePicker
            isTransparent={true}
            isExcel={true}
            clearErrors={clearErrors}
            name={"excel"}
            label={`Upload Excel`}
            control={control}
            watch={watch}
            setValue={setValue}
            errors={errors}
            isMulti={false}
            acceptedFiles={{
              "application/vnd.ms-excel": [".xls", ".xlsx"],
            }}
          />
          <div className="w-full h-[50px] mt-3  bg-green-100 rounded-lg flex justify-between items-center px-3 py-1 text-sm font-semibold text-green-600">
            <span className="flex items-center gap-2">
              <img src={excel} alt="Excel icon" className="w-5 h-5" />
              Download Excel Format
            </span>

            <UiButton
              text="Download"
              buttonType="text-green-700"
              onClick={() => downloadSample()}
              className="rounded-lg bg-green-50 px-3 py-1 text-green-600 font-semibold hover:bg-green-600 hover:text-white transition-all duration-200"
            />
          </div>
          <UiButton
            text="Submit"
            type="submit"
            buttonType="primary"
            className="px-6 my-5  p-3  float-end"
          />
        </div>
      </form>
    </div>
  );
}

export default ExcelUpload;
