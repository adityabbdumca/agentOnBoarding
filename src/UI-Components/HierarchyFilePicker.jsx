import { useRef, useState } from "react";
import styled from "styled-components";
import { useDropzone } from "react-dropzone";
import Button from "./Button";
import excel from "../assets/images/excel.svg";

const DropZone = styled.div`
  border: 2px dashed ${(props) => (props.isDragging ? "#2563eb" : "#e5e7eb")};
  margin: 24px;
  border-radius: 8px;
  padding: 40px 20px;
  text-align: center;
  background: ${(props) =>
    props.isDragging ? "rgba(37, 99, 235, 0.05)" : "#f9fafb"};
  transition: all 0.2s ease;
  cursor: ${(props) => (props.isUploading ? "default" : "pointer")};
  position: relative;
  min-height: 160px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;

  &:hover {
    border-color: ${(props) => (props.isUploading ? "#e5e7eb" : "#2563eb")};
    background: ${(props) =>
      props.isUploading ? "#f9fafb" : "rgba(37, 99, 235, 0.05)"};
  }
`;

const UploadIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-bottom: 8px;

  svg {
    width: 24px;
    height: 24px;
    color: #6b7280;
  }
`;

const ChooseFileButton = styled.button`
  color: #2563eb;
  font-weight: 500;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  font-size: inherit;

  &:hover {
    text-decoration: underline;
  }
`;

const ExampleSection = styled.div`
  margin: 0 24px 24px;
  padding: 12px 16px;
  background: #f9fafb;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const FileInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;

  .file-name {
    color: #111827;
    font-size: 14px;
    line-height: 1.5;
    font-weight: 500;
  }

  .file-size {
    color: #6b7280;
    font-size: 12px;
    line-height: 1.5;
  }
`;

const HierarchyFilePicker = ({ setValue, data }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [, setUploadProgress] = useState(0);
  const [fileName, setFileName] = useState("");
  const fileInputRef = useRef();

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "application/vnd.ms-excel": [".xlsx", ".xls"],
    },
    onDrop: (acceptedFiles) => {
      simulateUpload();
      setFileName(acceptedFiles[0].name);
      setValue(
        "excel",
        acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        )
      );
    },
    maxSize: 5 * 1024 * 1024,
  });

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragIn = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  };

  const handleDragOut = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files[0]);
    }
  };

  const handleFiles = (file) => {
    if (
      file.type === "application/vnd.ms-excel" ||
      file.type ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ) {
      if (file.size <= 25 * 1024 * 1024) {
        // setValue("excel", file.name);
        setFileName(file.name);
        simulateUpload();
      } else {
        alert("File size exceeds 25MB limit");
      }
    } else {
      alert("Please upload only Excel files (.xls, .xlsx)");
    }
  };

  const simulateUpload = () => {
    setIsUploading(true);
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 500);
  };

  return (
    <>
      <DropZone
        isDragging={isDragging}
        isUploading={isUploading}
        onDragEnter={handleDragIn}
        onDragLeave={handleDragOut}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => !isUploading && fileInputRef.current?.click()}
        {...getRootProps({ className: "dropzone" })}
      >
        <input {...getInputProps()} hidden />
        {!isUploading ? (
          <>
            <UploadIcon>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </UploadIcon>
            <div>
              Drag and Drop file here or{" "}
              <ChooseFileButton
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
              >
                Choose file
              </ChooseFileButton>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              hidden
              accept=".xls,.xlsx"
              onChange={(e) => {
                const files = e.target.files;
                if (files && files.length > 0) {
                  handleFiles(files[0]);
                }
              }}
            />
          </>
        ) : (
          <>
            <StyledDiv style={{ height: "50px", width: "auto" }}>
              <span
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <img src={excel} height={20} width={20} /> {fileName}
              </span>
            </StyledDiv>
          </>
        )}
      </DropZone>

      <div style={{ padding: "0 24px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            color: "#6b7280",
            fontSize: "14px",
          }}
        >
          <span>Supported formats: XLS, XLSX</span>
          <span>Maximum size: 25MB</span>
        </div>
      </div>

      {!isUploading && (
        <ExampleSection>
          <FileInfo>
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                x="4"
                y="2"
                width="16"
                height="20"
                rx="2"
                stroke="#6b7280"
                strokeWidth="2"
              />
              <path
                d="M8 7H16"
                stroke="#6b7280"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M8 12H16"
                stroke="#6b7280"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M8 17H12"
                stroke="#6b7280"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            <div>
              <div className="file-name">Table Example</div>
              <div className="file-size">
                You can download the attached example and use them as a starting
                point for your own file.
              </div>
            </div>
          </FileInfo>
          <Button
            width={"auto"}
            onClick={() => window.open(data?.data?.file_url || data)}
          >
            Download
          </Button>
        </ExampleSection>
      )}
    </>
  );
};

export default HierarchyFilePicker;

const StyledDiv = styled.div`
  width: 100%;
  height: 50px;
  background: #ddf1f1;
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px 10px;
  font-family: ${({ theme }) => theme.fontFamily};
  font-size: 14px;
  color: #2e7d32;
  font-weight: 600;
`;
