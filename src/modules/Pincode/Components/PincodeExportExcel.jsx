import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import {
  useDownloadSamplePincodeExcel,
  usePinCodeUploadExcel,
} from "../service";
import { FilePicker } from "@/UI-Components";
import UiButton from "@/UI-Components/Buttons/UiButton";
import excel from "@/assets/images/excel.svg";

const schema = Yup.object().shape({
  excel: Yup.mixed()
    .required("Excel file is required")
    .test("fileType", "Only .xls or .xlsx files are allowed", (value) => {
      if (!value || (Array.isArray(value) && value.length === 0)) return false;
      const file = Array.isArray(value) ? value[0] : value;
      return (
        file &&
        [
          "application/vnd.ms-excel",
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        ].includes(file.type)
      );
    }),
});

const PincodeExportExcel = ({ setOpenPincodeExcel }) => {
  const {
    handleSubmit,
    clearErrors,
    watch,
    control,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const { mutate: uploadExcel } = usePinCodeUploadExcel(setOpenPincodeExcel);
  const { mutate: downloadSample } = useDownloadSamplePincodeExcel();

  const onSubmit = (data) => {
    const payload = {
      file: Array.isArray(data.excel) ? data.excel[0] : data.excel,
    };
    uploadExcel(payload);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="p-3 space-y-4 mx-3">
        <FilePicker
          isTransparent
          isExcel
          clearErrors={clearErrors}
          name="excel"
          label="Upload Excel"
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

        <div className="flex justify-end">
          <UiButton
            text="Submit"
            type="submit"
            buttonType="primary"
            className="px-6 py-3"
          />
        </div>
      </div>
    </form>
  );
  
};

export default PincodeExportExcel;
