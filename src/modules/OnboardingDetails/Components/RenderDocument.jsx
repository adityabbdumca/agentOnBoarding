import FilePicker from "@/UI-Components/FilePicker";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { Tooltip } from "@mui/material";

const renderDocumentSection = ({
  docType,
  title,
  inputField,
  isMobile,
  showFilePicker,
  tooltip,
  isRequired = true,
  onChange,
  isLoading,
  ...props
}) => {
  //   const doc = documents[docType];
  return (
    <div className="border border-gray-200 rounded-md p-4 flex flex-col gap-4 ">
      <div className="flex justify-between">
        <div
          data-mobile={isMobile}
          className={
            "grid grid-cols-1 md:grid-cols-2 data-[mobile=true]:grid-cols-2  gap-4 "
          }
        >
          <div className="flex items-center gap-2">
            <span className="font-medium text-sm">{title} </span>
            {isRequired && <span style={{ color: "red" }}>*</span>}
          </div>
          {inputField}
        </div>
        {tooltip && (
          <Tooltip
            title={tooltip}
            arrow
            slotProps={{
              tooltip: {
                sx: {
                  whiteSpace: "pre-line",
                },
              },
            }}
          >
            <InfoOutlinedIcon
              fontSize="small"
              className="text-gray-500 cursor-pointer whitespace-pre-line"
            />
          </Tooltip>
        )}
      </div>

      {(showFilePicker || docType !== "documents.license_path") && (
        <FilePicker
          name={docType}
          title={title}
          onChange={onChange}
          isRequired
          clearErrors={props.clearErrors}
          control={props.control}
          errors={props.errors}
          setValue={props.setValue}
          watch={props.watch}
          helperText={props.helperText}
          acceptedFiles={props.acceptedFiles}
          setError={props.setError}
          isLoading={isLoading}
        />
      )}
    </div>
  );
};

export default renderDocumentSection;
