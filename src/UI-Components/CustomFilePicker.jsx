import React, { useEffect } from "react";
import { useDropzone } from "react-dropzone";
import styled from "styled-components";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { Controller } from "react-hook-form";
import { VscEye } from "react-icons/vsc";
import { MdOutlineCancel } from "react-icons/md";
import { useGetConditionalErrorMessage } from "../hooks/useGetConditionalErrorMessage";
import { Error } from "./GlobalStyles";
import { Container } from "./FilePicker";
import { FaFilePdf } from "react-icons/fa";

const CustomFilePicker = ({
  name,
  label,
  setValue,
  control,
  errors,
  watch,
  clearErrors,
  isRequired,
}) => {
  const fileName = watch(name) || [];
  const { errorMessage } = useGetConditionalErrorMessage({ errors, id: name });

  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/png": [".png"],
      "image/jpg": [".jpg"],
      "image/jpeg": [".jpeg"],
      "application/pdf": [".pdf"],
    },
    onDrop: (acceptedFiles) => {
      setValue(
        name,
        acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        )
      );
    },
    maxSize: 5 * 1024 * 1024,
  });
  useEffect(() => {
    if (fileName.length > 0) {
      clearErrors(name);
    }
  }, [fileName]);
  return (
    <div>
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, value } }) => {
          return (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "3px",
                // marginTop: "15px",
                // width: "150px"
              }}
            >
              {/* <p style={{ margin: "0", fontSize: "13px" }}>
                {label} {isRequired && <span style={{ color: "red" }}>*</span>}
              </p> */}
              <span
                style={{
                  fontSize: "12px",
                  fontStyle: "italic",
                  marginTop: "20px",
                }}
              >
                Note: Maximum File Size 5MB. File Format: (PDF, DOC, IMAGE)
              </span>
              <StyledDiv errors={errorMessage}>
                <UploadDiv {...getRootProps({ className: "dropzone" })}>
                  <input {...getInputProps()} hidden />
                  {fileName.length === 0 && <AiOutlineCloudUpload size={35} />}
                  <div>
                    {fileName.length > 0 && (
                      <div>
                        {fileName && fileName[0]?.name.includes("pdf") ? (
                          <div>
                            <FaFilePdf
                              color="red"
                              size={35}
                              onClick={() =>
                                window.open(fileName[0]?.preview, "_blank")
                              }
                            />
                          </div>
                        ) : (
                          fileName[0]?.preview && (
                            <div>
                              <img
                                src={fileName[0]?.preview}
                                height={200}
                                width={200}
                                onClick={() =>
                                  window.open(fileName[0]?.preview, "_blank")
                                }
                              />
                            </div>
                          )
                        )}
                      </div>
                      //   <VscEye
                      //     size={35}
                      //     onClick={() =>
                      //       window.open(fileName[0]?.preview, "_blank")
                      //     }
                      //   />
                    )}
                  </div>
                  <div
                    style={{
                      position: "relative",
                      marginTop: "10px",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "16px",
                        fontWeight: "500",
                        position: "relative",
                        ...(fileName?.length > 0 && {
                          border: "1px solid #000",
                          borderRadius: "10px",
                          padding: "2px 10px",
                        }),
                      }}
                    >
                      {fileName.length > 0 ? fileName[0]?.name : "Upload"}
                    </span>
                    {fileName.length > 0 && (
                      <MdOutlineCancel
                        onClick={() => setValue(name, [])}
                        style={{
                          position: "absolute",
                          top: "-8px",
                          right: "-6px",
                        }}
                      />
                    )}
                  </div>
                </UploadDiv>
              </StyledDiv>
              {errorMessage && (
                <Error style={{ color: "red" }}>{errorMessage}</Error>
              )}
            </div>
          );
        }}
      />
    </div>
  );
};

export default CustomFilePicker;
const StyledDiv = styled.div`
  border: ${({ errors }) => (errors ? "2px dotted red" : "2px dotted #000")};
  height: 250px;
  width: 100%;
  border-radius: 9px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const UploadDiv = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  justify-content: center;
  align-items: center;
`;
