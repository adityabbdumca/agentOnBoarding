import { useState } from "react";
import { DownloadIcon, FileUpIcon, HardDriveUpload } from "lucide-react";
import UiButton from "../Buttons/UiButton";
import UiModalContainer from "../Modals/UiModal";

function UiUploadModal({
  isOpen,
  handleClose,
  handleUpload,
  handleDownload,
  maxSize,
  title,
  supportFormat,
}) {
  const [file, setFile] = (useState < File) | (undefined > undefined);
  return (
    <UiModalContainer
      headSection={
        <div className="flex items-start gap-4  ">
          <section className="w-8 h-8 p-1 bg-primary/90 text-white flex  items-center justify-center rounded-full shadow-md">
            <HardDriveUpload className="size-4" />
          </section>

          <section className="leading-5">
            <h2 className="text-md font-semibold text-heading">{title}</h2>
            <p className="text-sm font-normal text-darkGray">
              Upload a file by dragging and dropping it here or clicking to
            </p>
          </section>
        </div>
      }
      isOpen={isOpen}
      handleCloseModal={handleClose}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleUpload?.(file);
        }}
        className="w-[500px] flex flex-col gap-4">
        <section className="w-full flex flex-col gap-1">
          <label
            htmlFor="upload_file"
            className="w-full h-40 border-dotted border-2 border-extraLightGray bg-offWhite/50 rounded
          flex flex-col items-center justify-center gap-4">
            <FileUpIcon className="stroke-1 size-10 text-darkGray" />
            {file ? (
              <p className="text-primary text-sm font-semibold">{file?.name}</p>
            ) : (
              <p className="text-sm font-medium text-gray">
                Drag and drop your file here or click to upload
              </p>
            )}
          </label>
          <input
            onChange={(e) => {
              setFile(e?.target?.files?.[0]);
            }}
            multiple={false}
            id="upload_file"
            name="upload_file"
            accept={supportFormat?.join(",")}
            type="file"
            className="hidden"
          />
          <section className="text-xs text-darkGray font-medium flex items-center justify-between">
            <p>Support format {supportFormat?.join(", ")}</p>
            <p>Max size: {maxSize}</p>
          </section>
        </section>
        <button
          type="button"
          onClick={handleDownload}
          className="bg-secondary/20 rounded px-4 py-2 flex items-center justify-between gap-2">
          <p className="text-sm font-semibold text-body">
            Download Sample File.
          </p>
          <DownloadIcon className="size-4" />
        </button>
        <section className="flex items-center justify-end gap-2 ">
          <UiButton buttonType="secondary" text="Cancel" className="w-32 h-8" />
          <UiButton text="Upload" type="submit" className="w-40 h-8" />
        </section>
      </form>
    </UiModalContainer>
  );
}

export default UiUploadModal;
