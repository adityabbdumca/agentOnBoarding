import { formatFileSize } from "@/utlities/file.utility";
import { FileUpIcon } from "lucide-react";
import { toast } from "react-toastify";

const UiFileInput = ({
  supportFormat,
  maxSize,
  name,
  error,
  handleChange,
  value,
  className,
}) => {
  const isValidExtension = (file) => {
    const lowerName = file.name.toLowerCase();
    return supportFormat?.some((ext) => lowerName.endsWith(ext));
  };

  const processFile = (file) => {
    if (!isValidExtension(file)) {
      toast.error(`Invalid file type. Allowed: ${supportFormat.join(", ")}`);
      return;
    }
    handleChange(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const selectedFile = e.dataTransfer.files?.[0];
    if (selectedFile) {
      processFile(selectedFile);
    }
  };

  return (
    <section className={`w-full flex flex-col gap-1 ${className}`}>
      {error && (
        <p className="text-xs text-error/90 font-medium pl-1 ">
          {error}
        </p>
      )}
      <label
        htmlFor="upload_file"
        className={`w-full h-40 cursor-pointer border-dotted border-2  bg-lightGray/40 rounded flex flex-col items-center justify-center gap-4 ${error ? "border-error/50" : "border-extraLightGray"}`}
        onDragOver={(e) => e.preventDefault()}
        onDragEnter={(e) => e.preventDefault()}
        onDrop={handleDrop}>
        <FileUpIcon className="stroke-1 size-10 text-darkGray" />
        {value ? (
          <div className="flex flex-col items-center">
            <p className="text-primary text-sm font-semibold">{value.name}</p>
            <span className="text-primary text-xs font-semibold">
              Size: {formatFileSize(value?.size)}
            </span>
          </div>
        ) : (
          <p className="text-sm font-medium text-gray">
            Drag and drop your file here or click to upload
          </p>
        )}
      </label>
      <input
        name={name}
        onChange={(e) => {
          const selectedFile = e.target.files?.[0];
          if (selectedFile) {
            processFile(selectedFile);
          }
        }}
        multiple={false}
        id="upload_file"
        accept={supportFormat?.join(",")}
        type="file"
        className="hidden"
      />
      <section className="text-xs text-gray-900 font-medium flex items-center justify-between">
        <p>Support format {supportFormat?.join(", ")}</p>
        <p>Max size: {maxSize}</p>
      </section>
    </section>
  );
};

export default UiFileInput;
