import { Tooltip } from "@mui/material";
import { useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { Controller } from "react-hook-form";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { MdOutlineFileDownload } from "react-icons/md";
import { VscEye } from "react-icons/vsc";
import styled from "styled-components";
import { useGetConditionalErrorMessage } from "../hooks/useGetConditionalErrorMessage";
import { InfoIcon, LoaderCircle } from "lucide-react";
const FilePicker = ({
  name,
  label,
  onChange,
  setValue,
  control,
  errors,
  title,
  tooltipText,
  watch,
  clearErrors,
  isRequired,
  helperText,
  demoExcel,
  setError,
  acceptedFiles = {
    "image/png": [".png"],
    "image/jpg": [".jpg"],
    "image/jpeg": [".jpeg"],
    "application/pdf": [".pdf"],
  },
  returnRawFile = false,
  disable = false, // new prop
  isLoading,
}) => {
  const { errorMessage } = useGetConditionalErrorMessage({ errors, id: name });

  const fileName = watch(name) || [];
  const { getRootProps, getInputProps } = useDropzone({
    accept: acceptedFiles,
    disabled: disable,
    onDrop: (acceptedFiles) => {
      if (disable) return;
      const invalidFiles = acceptedFiles.find((file) =>
        file.name.toLowerCase().endsWith(".jfif")
      );
      if (invalidFiles) {
        setError(name, { message: "This file type is not allowed" });
        setValue(name, []);
        return;
      }
      const filesToSet = returnRawFile
        ? acceptedFiles
        : acceptedFiles.map((file) => {
            const fileWithPreview = file;
            fileWithPreview.preview = URL.createObjectURL(file);
            return fileWithPreview;
          });

      setValue(name, filesToSet);
      onChange?.(filesToSet);
    },
    onDropRejected: (fileRejections) => {
      if (disable) return;
      fileRejections.forEach(({ errors }) => {
        errors.forEach((err) => {
          if (file.name.toLowerCase().endsWith(".jfif")) {
            setError?.(name, { message: "This file type is not allowed" });
          }
          if (err.code === "file-invalid-type") {
            setError(name, { message: "This file type is not allowed" });
          }
          if (err.code === "file-too-large") {
            setError(name, { message: "Maximum 5MB allowed" });
          }
        });
      });
    },
    maxSize: 10 * 1024 * 1024,
  });

  useEffect(() => {
    fileName.length > 0 && clearErrors(name);
  }, [fileName]);

  return (
    <>
      <Controller
        control={control}
        name={name}
        render={() => {
          return (
            <>
              <div className="flex flex-col  gap-2 relative">
                {label && (
                  <p className="text-xs font-semibold text-gray-700">
                    {label}{" "}
                    {isRequired && <span style={{ color: "red" }}>*</span>}
                  </p>
                )}
                {helperText && (
                  <div className="ml-1 mt-1 text-xs font-bold text-black">
                    {helperText}
                  </div>
                )}
                <div
                  data-error={!!errorMessage}
                  {...getRootProps({ className: "dropzone" })}
                  className={`border border-dashed  border-gray-300 rounded-md p-3 flex items-center justify-between w-full 
                ${fileName.length > 0 ? "bg-gray-50" : ""} 
                ${
                  disable
                    ? "cursor-not-allowed bg-gray-100 opacity-70"
                    : "cursor-pointer hover:bg-gray-50"
                }
                data-[error=true]:border-red-600 data-[error=true]:animate-shake`}
                >
                  <input {...getInputProps()} hidden disabled={disable} />
                  <div className="flex items-center gap-2 w-2/3">
                    {fileName.length > 0 ? (
                      <img
                        src={fileName[0].preview || fileName}
                        className="w-4 h-4 rounded-full object-cover"
                      />
                    ) : (
                      <AiOutlineCloudUpload />
                    )}
                    <span className="text-gray-600 font-semibold text-ellipsis flex overflow-hidden whitespace-nowrap text-xs w-full">
                      {fileName.length > 0
                        ? `${fileName[0]?.name || "File Uploaded Successfully"}${
                            fileName[0]?.size
                              ? ` (${(fileName[0].size / 1024).toFixed(2)} KB)`
                              : ""
                          }`
                        : disable
                          ? "File upload disabled"
                          : "Drag and drop files here, or click to select files"}
                    </span>
                  </div>
                  <div className="flex gap-4">
                    {!isLoading && fileName.length > 0 ? (
                      <div className="flex items-center gap-2">
                        <VscEye
                          size={15}
                          className="cursor-pointer text-blue-600"
                          onClick={() =>
                            fileName.includes("https")
                              ? window.open(fileName)
                              : window.open(fileName[0].preview)
                          }
                        />
                      </div>
                    ) : demoExcel && !disable ? (
                      <Tooltip
                        title="Download Demo Excel"
                        arrow
                        placement="top"
                        style={{ fontSize: "12px", zIndex: "9999" }}
                      >
                        <div>
                          <MdOutlineFileDownload
                            size={15}
                            onClick={() => window.open(demoExcel)}
                          />
                        </div>
                      </Tooltip>
                    ) : null}
                    {isLoading && (
                      <LoaderCircle className="size-5 text-darkGray animate-spin" />
                    )}
                    {tooltipText && (
                      <Tooltip title={tooltipText} arrow placement="top">
                        <InfoIcon size={15} />
                      </Tooltip>
                    )}
                  </div>
                </div>
                {errorMessage ? (
                  <div className="text-red-600 text-xs absolute -bottom-4 ml-1">
                    {errorMessage}
                  </div>
                ) : (
                  <></>
                )}
              </div>
            </>
          );
        }}
      />
    </>
  );
};

export default FilePicker;

export const Container = styled.div`
  height: 36px;
  padding: 12px 20px;
  gap: 7px;
  border-radius: 6px;
  opacity: 1;
  background: ${({ theme }) => theme.primaryColor};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;

  div {
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    gap: 10px;
  }

  span {
    font-size: 14px;
    font-weight: 500;
    color: #fff;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
`;
