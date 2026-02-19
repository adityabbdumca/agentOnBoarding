import {
  HiExternalLink,
  HiOutlineDocumentText,
  HiOutlineInformationCircle,
} from "react-icons/hi";
import { useGetUserDocuments } from "../OnboardingDetails/service";

import { useState } from "react";
import { AlertCircle } from "lucide-react";
const DocumentVerification = ({ setOpenModal, id, userData }) => {
  const [file, setFile] = useState(null);
  const [pdfLoading, setPdfLoading] = useState(false);
 
  const { data: documents } = useGetUserDocuments(+id);
  const handleRaiseDiscrepancy = (key, name, e) => {
    e.stopPropagation();
    setOpenModal({
      open: true,
      key: key,
      text: name,
    });
  };

  const getDocumentIcon = (fileName) => {
    if (fileName.includes(".pdf")) return "pdf";
    if (
      fileName.includes(".jpg") ||
      fileName.includes(".png") ||
      fileName.includes(".jpeg")
    )
      return "image";
    return "document";
  };

  return (
    <div>
      <div className="sticky top-0 bg-white border-b border-slate-200 p-4 shadow-sm">
        <h2 className="text-lg font-medium text-slate-800 flex items-center">
          <HiOutlineDocumentText className="mr-2 text-slate-600" />
          Document Verification
          <span className="ml-auto text-xs font-normal bg-slate-100 text-slate-600 px-2 py-1 rounded-full">
            {documents?.length} Documents
          </span>
        </h2>
      </div>

      {documents?.length > 0 ? (
        <div className="p-4 space-y-4">
          {documents.map((item) => {
            const isActive = file === item?.link;
            const formattedKey = item?.name?.replace(/_/g, " ");
            const docType = getDocumentIcon(item?.link);

            return (
              <div
                key={item?.id}
                className="bg-white rounded-lg border border-slate-200 overflow-hidden transition-all duration-200 hover:shadow-md">
                <div
                  className={`flex items-center gap-3 p-4 cursor-pointer transition-colors ${
                    isActive ? "bg-slate-50" : "hover:bg-slate-50"
                  }`}
                  onClick={() => {
                    if (file === item?.link) {
                      setFile(null);
                      setPdfLoading(false);
                    } else {
                      setPdfLoading(true);
                      setFile(item?.link);
                    }
                  }}>
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-full ${
                      docType === "pdf"
                        ? "bg-red-100 text-red-600"
                        : docType === "image"
                          ? "bg-blue-100 text-blue-600"
                          : "bg-green-100 text-green-600"
                    }`}>
                    <HiOutlineDocumentText className="text-xl" />
                  </div>

                  <div className="flex-1">
                    <div className="flex flex-col items-start">
                      <p className="text-sm font-medium text-slate-800 capitalize">
                        {formattedKey}
                      </p>
                      <span className="text-xs text-slate-500">
                        {docType === "pdf"
                          ? "PDF Document"
                          : docType === "image"
                            ? "Image File"
                            : "Document"}
                      </span>
                    </div>
                    <div className="flex gap-2 mt-2">
                      {[
                        "Aadhaar Card",
                        "Pan Card",
                        "Education Qualification",
                        "Bank Details (Cancelled Cheque)",
                      ].includes(item?.name) && (
                        <span className="inline-flex items-center text-xs text-red-600 font-medium bg-red-50 px-2 py-1 rounded-md">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          Not Verified
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      data-id={+item?.discrepancy_status}
                      disabled={!!userData?.user_approval_status}
                      className={`flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-purple-50 text-purple-600 data-[id=1]:bg-red-50 data-[id=1]:text-red-600 hover:bg-red-100 data-[id=2]:bg-green-50 data-[id=2]:text-green-600 data-[id=4]:bg-red-50 data-[id=4]:text-red-600 transition-colors disabled:cursor-not-allowed`}
                      onClick={(e) =>
                        +item?.discrepancy_status === 0 &&
                        handleRaiseDiscrepancy(item?.id, item?.name, e)
                      }>
                      <HiOutlineInformationCircle className="mr-1.5" />
                      {+item?.discrepancy_status === 0
                        ? "Raise Discrepancy"
                        : +item?.discrepancy_status === 1
                          ? "Raised"
                          : +item?.discrepancy_status === 2
                            ? "Approved"
                            : +item?.discrepancy_status === 3
                              ? "Re-Submitted"
                              : +item?.discrepancy_status === 4
                                ? "Re-Open"
                                : "Raise Discrepancy"}
                    </button>

                    <a
                      href={item?.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors">
                      <HiExternalLink className="mr-1.5" />
                      Open
                    </a>
                  </div>
                </div>

                <div
                  className={`transition-all duration-500 ease-in-out overflow-hidden ${
                    isActive ? "max-h-[650px] opacity-100" : "max-h-0 opacity-0"
                  }`}>
                  {isActive && (
                    <div className="border-t border-slate-200">
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => setFile(null)}
                          className="absolute top-3 right-3 z-10 px-2 py-1 cursor-pointer rounded-full text-xs font-bold bg-red-50 text-red-600 hover:bg-red-100 shadow">
                          ✕ Close
                        </button>
                        {file.includes(".pdf") ? (
                          <div className="bg-slate-800 p-4 rounded-b-lg relative">
                            {pdfLoading && (
                              <div className="flex flex-col items-center justify-center">
                                <div className="animate-spin h-20 w-20 border-4 border-blue-400 border-t-transparent rounded-full"></div>
                                <p className="text-xs text-white mt-2">
                                  Loading {docType}...
                                </p>
                              </div>
                            )}

                            <iframe
                              src={file + "#toolbar=0"}
                              width="100%"
                              height="550"
                              className={`rounded-lg w-full border border-slate-700 shadow-lg transition-opacity duration-300 ${
                                pdfLoading ? "opacity-0" : "opacity-100"
                              }`}
                              title={`pdf-${item?.id}`}
                              onLoad={() =>
                                // use Time out due to take gap between loader vanish and show pdf
                                setTimeout(() => {
                                  setPdfLoading(false);
                                }, 300)
                              }
                            />
                          </div>
                        ) : (
                          <div className="bg-slate-800 p-4 rounded-b-lg">
                            <div className="flex items-center justify-center bg-slate-900 rounded-lg border border-slate-700 shadow-lg overflow-hidden">
                              <img
                                src={file || "/placeholder.svg"}
                                alt={`document-${item?.id}`}
                                className="object-contain max-h-[550px] max-w-full"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-[calc(100%-70px)] text-slate-500">
          <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
            <HiOutlineDocumentText className="text-4xl text-slate-400" />
          </div>
          <p className="text-lg font-medium mb-1">No Documents Available</p>
          <p className="text-sm text-slate-400">
            Upload documents for verification
          </p>
        </div>
      )}
    </div>
  );
};
export default DocumentVerification;
