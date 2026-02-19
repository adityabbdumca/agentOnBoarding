import exam from "@/assets/images/exam.png";
import { HiOutlineDocumentText } from "react-icons/hi";
import { useGetUserCertificate } from "../service";
import useGlobalRoutesHandler from "@/hooks/useGlobalHandleRouter";

const Certificate = ({ userData, watch, id, setAgentName }) => {
  const { navigate } = useGlobalRoutesHandler();
  const userName = `${
    watch("profile.first_name") && watch("profile.first_name")
  } ${watch("profile.last_name") && watch("profile.last_name")}`;
  const { data } = useGetUserCertificate(id);
  const certificateUrl = data?.certificate_url;
  const vertical_id = localStorage.getItem("vertical_id");
  const isAgent = vertical_id === "4";
  return (
    <>
      {userData?.exam_result &&
      userData.exam_result.toLowerCase() === "pass" ? (
        <div className="max-w-4xl mx-auto ">
          {/* Certificate Card */}
          <div className="mb-8 overflow-hidden border-0 rounded-lg shadow-lg">
            <div className="bg-slate-800 text-white p-4 flex justify-between items-center">
              <div>
                <h2 className="text-lg font-semibold">Your Certificate</h2>
                <p className="text-slate-300 text-sm">
                  Ready for download and printing
                </p>
              </div>
              <div className="bg-green-500 px-4 py-1 text-xs rounded-xl font-bold hover:bg-green-600">
                Verified
              </div>
            </div>

            <div className="p-6 bg-white">
              <div className="border-2 border-slate-200 border-dashed p-2 mb-6 bg-slate-50 rounded-lg">
                <div className="text-center">
                  {/* <Award className="h-16 w-16 text-slate-700 mx-auto mb-4" /> */}
                  <h3 className="text-xl font-bold text-slate-800 mb-1">
                    Professional Certification
                  </h3>
                  <p className="text-slate-600 mb-4">{userName}</p>

                  <div className="flex justify-center space-x-8 text-sm text-slate-500 mb-6">
                    <div className="flex items-center">
                      {/* <Calendar className="h-4 w-4 mr-1" /> */}
                      <span>Issued:{userData?.certificate_approved_date}</span>
                    </div>
                    <div>
                      <span>
                        Application ID: {userData?.application_number}
                      </span>
                    </div>
                  </div>

                  <p className="italic text-slate-600 mb-4">
                    Has successfully completed all requirements and demonstrated
                    proficiency in all required areas.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => window.open(certificateUrl, "_blank")}
                className="w-full flex items-center justify-center p-3 text-white rounded-lg gap-2 bg-slate-800 cursor-pointer hover:bg-slate-900"
              >
                {/* <Download className="h-4 w-4" /> */}
                Download Certificate
              </button>
            </div>
          </div>

          {/* Additional Documents */}
          <h2 className="text-xl font-bold text-slate-800 mb-4">
            Additional Documents
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="overflow-hidden">
              <div className="p-6 flex items-start space-x-4">
                <div className="bg-blue-100 p-2 rounded-full">
                  <HiOutlineDocumentText className="size-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-slate-900 mb-1">
                    Insurance Kit
                  </h3>
                  <p className="text-sm text-slate-500 mb-4">
                    Important information about your certification and next
                    steps.
                  </p>
                  <button
                    type="button"
                    className="w-full text-sm flex items-center justify-center gap-2 ring-1 rounded-lg p-2 hover:bg-blue-50 cursor-pointer"
                  >
                    {/* <Download className="h-4 w-4" /> */}
                    Download
                  </button>
                </div>
              </div>
            </div>

            <div className="overflow-hidden">
              <div className="p-6 flex items-start space-x-4">
                <div className="bg-purple-100 p-2 rounded-full">
                  <HiOutlineDocumentText className="size-5 text-purple-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-slate-900 mb-1">Agreement</h3>
                  <p className="text-sm text-slate-500 mb-4">
                    Important information about your certification and next
                    steps.
                  </p>
                  <button
                    type="button"
                    className="w-full text-sm flex items-center justify-center gap-2 ring-1 rounded-lg p-2 hover:bg-blue-50 cursor-pointer"
                  >
                    Download
                  </button>
                </div>
              </div>
            </div>

            {isAgent && (
              <>
                <div className="overflow-hidden">
                  <div className="p-6 flex items-start space-x-4">
                    <div className="bg-purple-100 p-2 rounded-full">
                      <HiOutlineDocumentText className="size-5 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-slate-900 mb-1">
                        NOC Form
                      </h3>
                      <p className="text-sm text-slate-500 mb-4">
                        Please find the NOC form which is required to be signed
                        and uploaded in the system.
                      </p>
                      <button
                        type="button"
                        className="w-full text-sm flex items-center justify-center gap-2 ring-1 rounded-lg p-2 hover:bg-blue-50 cursor-pointer"
                        onClick={() => setAgentName("NOC")}
                      >
                        Apply NOC
                      </button>
                    </div>
                  </div>
                </div>
                <div className="overflow-hidden">
                  <div className="p-6 flex items-start space-x-4">
                    <div className="bg-purple-100 p-2 rounded-full">
                      <HiOutlineDocumentText className="size-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-slate-900 mb-1">
                        Servicing Module
                      </h3>
                      <p className="text-sm text-slate-500 mb-4">
                        Choose the type of profile update you want to request
                      </p>
                      <button
                        type="button"
                        className="w-full text-sm flex items-center justify-center gap-2 ring-1 rounded-lg p-2 hover:bg-blue-50 cursor-pointer"
                        onClick={() => navigate("/agent/servicing-module")}
                      >
                        Service
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <img src={exam} alt="" height={400} width={400} />
          {/* <h3 style={{ color: theme.primaryColor }}>
            Kindly wait as your Exam results will be declared soon
          </h3> */}
        </div>
      )}
    </>
  );
};

export default Certificate;

// const BackButton = styled.button`
//   border: 2px solid #e0e0e0;
//   border-radius: 20px;
//   width: max-content;
//   padding: 10px 20px;
//   background: ${({ theme }) => theme.primaryColor};
//   color: white;
//   cursor: pointer;
// `;
