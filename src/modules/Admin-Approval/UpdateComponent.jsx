import BlackListConfirmationAgentModal from "@/Components/BlackListConfirmationAgentModal/BlackListConfirmationAgentModal";
import { useGetAgentMenu } from "@/Components/SideBar/Service";
import { formatAadhaarOnPrefill } from "@/HelperFunctions/helperFunctions";
import UiCapsule from "@/UI-Components/Capsules/UiCapsule";
import { genderOptions } from "@/constants/global.constant";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMediaQuery } from "@mui/material";
import { DateTime } from "luxon";
import { lazy, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import * as Yup from "yup";
import ConsentForm from "../OnboardingDetails/Components/Consent/ConsentForm";
import {
  bankSchema,
  ckycSchema,
  documentsSchema,
  examSchema,
  nomineeSchema,
  profileSchema,
} from "../OnboardingDetails/Schema";
import {
  setAgent,
  setAgentName,
  setApprovedArray,
  setCompletedName,
  setDiscrepancyArray,
  setMenus,
} from "../OnboardingDetails/agent.slice";
import { useGetData } from "../OnboardingDetails/service";

// ✅ Lazy-loaded components
const GlobalModal = lazy(() => import("@/UI-Components/Modals/GlobalModal"));
const AgentTypeModal = lazy(
  () => import("../OnboardingDetails/Components/AgentTypeModal")
);
const AgentWatermark = lazy(
  () => import("../OnboardingDetails/Components/AgentWatermark")
);
const AgentRejectWatermark = lazy(
  () => import("../OnboardingDetails/Components/AgentRejectWaterMark")
);
const BankDetails = lazy(
  () => import("../OnboardingDetails/Components/BankDetails")
);
const Certificate = lazy(
  () => import("../OnboardingDetails/Components/Certificate")
);
const Ckyc = lazy(() => import("../OnboardingDetails/Components/Ckyc/Ckyc"));
// const ConsentForm = lazy(
//   () => import("../OnboardingDetails/Components/ConsentForm")
// );

const Discrepancy = lazy(
  () => import("../OnboardingDetails/Components/Discrepancy/Discrepancy")
);
const Documents = lazy(
  () => import("../OnboardingDetails/Components/Documents")
);
const ExamDetails = lazy(
  () => import("../OnboardingDetails/Components/ExamDetails/ExamDetails")
);
const MainContainer = lazy(
  () => import("../OnboardingDetails/Components/MainContainer")
);
const NOCForm = lazy(() => import("../OnboardingDetails/Components/NOCForm"));
const NomineeDetails = lazy(
  () => import("../OnboardingDetails/Components/NomineeDetails/NomineeDetails")
);
const Payment = lazy(() => import("../OnboardingDetails/Components/Payment"));
const ProfileDetails = lazy(
  () => import("../OnboardingDetails/Components/ProfileDetails")
);
const RaiseDiscrepancy = lazy(
  () => import("../OnboardingDetails/Components/RaiseDiscrepancy")
);
const TrainingPageIndex = lazy(
  () => import("../Training-Page/TrainingPageIndex")
);

const AdminStepper = lazy(() => import("./AdminStepper"));
const CkycDrawer = lazy(
  () => import("../OnboardingDetails/Components/Ckyc/CkycDrawer")
);
const DocumentVerification = lazy(() => import("./DocumentVerification"));
const POSExam = lazy(() => import("../OnboardingDetails/Components/POSExam"));
// const OCRForm = lazy(() => import("../OnboardingDetails/Components/OCRForm"));
// const Button = lazy(() => import("@/UI-Components"));
const UpdateComponent = () => {
  const { agentName, menus } = useSelector((state) => state.agent);
  const [open, setOpen] = useState(false);
  const [isPanConfirmationModal, setIsPanConfirmationModal] = useState(false);

  const [openModal, setOpenModal] = useState({ open: false, data: "" });
  const [isOCRDrawerOpen, toggleIsOCRDrawerOpen] = useState(false);
  const verticalId = +localStorage.getItem("vertical_id");
  const id = +useParams().id;
  const { data: userData, isPending, isFetching, refetch } = useGetData(+id);
  const lessthan576 = useMediaQuery("(max-width:576px)");
  const agentType = userData?.data?.user_type;

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    register,
    formState: { errors },
    clearErrors,
    reset,
    resetField,
    setError,
    getValues,
    setFocus,
  } = useForm({
    defaultValues: {
      profile: {
        insurers: [],
        category: { label: "General", value: "General" },
      },
      ckyc: {
        ckyc: "Y",
      },
      nominee: [{ account_type: { label: "Savings", value: "Savings" } }],
      document: {
        license_status: {
          label: "Yes",
          value: 1,
        },
      },
    },
    resolver: yupResolver(
      {
        "Profile Details": profileSchema(agentType, id),
        "Bank Details": bankSchema,
        "Nominee Details": nomineeSchema,
        Documents: documentsSchema(agentType),
        "Exam Details": examSchema(userData?.data?.approval_access),
        "CKYC Verification": ckycSchema,
        // 4: ckycSchema,
        // 5: declarationSchema,
      }[agentName] || Yup.object({})
    ),
    context: userData?.data,
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const dispatch = useDispatch();
  const { data } = useGetAgentMenu(id);
  const steps = data?.data?.menu || [];

  useEffect(() => {
    if (steps.length > 0) {
      dispatch(setMenus(steps));
    }
  }, [steps]);

  useEffect(() => {
    if (!userData?.data) return;

    const currentValues = getValues();
    const newProfileFirstName = userData?.data?.profile?.first_name;

    const isSameData =
      verticalId === 2 &&
      currentValues?.profile?.first_name === newProfileFirstName &&
      currentValues?.user_approval_status ===
        userData?.data?.user_approval_status;

    if (isSameData) return;

    const insurersFromApi = userData?.data?.profile?.insurers || [];

    const insurers =
      insurersFromApi.length > 0
        ? insurersFromApi.map((each) => ({
            ...each,
            date_of_agent_appointment: each?.date_of_agent_appointment || "",
            date_of_agent_cessation: each?.date_of_agent_cessation || "",
          }))
        : userData?.data?.user_type?.toLowerCase() === "composite"
          ? [
              {
                insurer_type: "",
                name_of_issurer: "",
                agency_code: "",
                date_of_agent_appointment: "",
                date_of_agent_cessation: "",
                reason_of_cessation: "",
              },
            ]
          : [];

    reset({
      profile: {
        ...userData?.data?.profile,
        salutation: userData?.data?.profile?.salutation && {
          label: userData?.data?.profile?.salutation,
          value: userData?.data?.profile?.salutation,
        },
        aadhar_no: userData?.data?.profile?.aadhar_no
          ? formatAadhaarOnPrefill(userData?.data?.profile?.aadhar_no)
          : "",
        gender: genderOptions?.find(
          (gender) => gender?.value === userData?.data?.profile?.gender
        ),
        dob: userData?.data?.profile?.dob
          ? DateTime.fromISO(userData?.data?.profile?.dob).toFormat(
              "dd-MM-yyyy"
            )
          : "",
        // aadhar_no:
        //   userData?.data?.profile?.aadhar_no &&
        //   formatAadhaarOnPrefill(userData?.data?.profile?.aadhar_no),
        is_communication_address_same: userData?.data?.profile
          ?.is_communication_address_same
          ? "Y"
          : "N",
        nationality: "Indian",
        marital_status: userData?.data?.profile?.marital_status && {
          label: userData?.data?.profile?.marital_status,
          value: userData?.data?.profile?.marital_status,
        },
        occupation: userData?.data?.profile?.occupation?.id && {
          ...userData?.data?.profile?.occupation,
          value: userData?.data?.profile?.occupation?.id,
        },
        category: userData?.data?.profile?.category
          ? {
              label: userData?.data?.profile.category,
              value: userData?.data?.profile.category,
            }
          : { label: "General", value: "General" },
        board_name: userData?.data?.profile?.board_name && {
          label: userData?.data?.profile.board_name,
          value: userData?.data?.profile.board_name,
        },
        year_of_passing: userData?.data?.profile?.year_of_passing && {
          label: userData?.data?.profile.year_of_passing,
          value: userData?.data?.profile.year_of_passing,
        },
        name_of_issurer: userData?.data?.profile?.name_of_issurer && {
          label: userData?.data?.profile.name_of_issurer,
          value: userData?.data?.profile.name_of_issurer,
        },
        highest_qualification: userData?.data?.profile?.highest_qualification
          ? {
              label: userData?.data?.profile.highest_qualification,
              value: userData?.data?.profile.highest_qualification,
            }
          : {
              label: "10th",
              value: "10th",
            },
        existing_health_insurance_name: userData?.data?.profile
          ?.existing_health_insurance_name && {
          label: userData?.data?.profile.existing_health_insurance_name,
          value: userData?.data?.profile.existing_health_insurance_id,
        },
        rm_mapping: userData?.data?.profile?.reporting_user_id && {
          value: userData?.data?.profile?.reporting_user_id,
          label: userData?.data?.profile?.reporting_user_name,
        },
        existing_health_insurance_noc_date: userData?.data?.profile
          ?.existing_health_insurance_noc_date
          ? DateTime.fromISO(
              userData?.data?.profile?.existing_health_insurance_noc_date
            ).toFormat("dd-MM-yyyy")
          : "",
        insurers,
      },
      bank: {
        ...userData?.data?.bank,
        account_type: userData?.data?.bank?.account_type
          ? {
              label: userData?.data?.bank?.account_type,
              value: userData?.data?.bank?.account_type,
            }
          : {
              label: "Savings",
              value: "Savings",
            },
        name_as_in_bank_account: userData?.data?.bank?.name_as_in_bank_acount,
      },
      ckyc: {
        ...userData?.data?.ckyc,
        ckyc: userData?.data?.ckyc?.type
          ? userData?.data?.ckyc?.type === "CKYC"
            ? "Y"
            : "N"
          : "Y",
        ckyc_type: userData?.data?.ckyc?.type && {
          label: userData?.data?.ckyc?.type,
          value: userData?.data?.ckyc?.type,
        },
        ckyc_number:
          userData?.data?.ckyc?.type === "Aadhar"
            ? formatAadhaarOnPrefill(userData?.data?.ckyc?.ckyc_number)
            : userData?.data?.ckyc?.ckyc_number,
      },
      nominee:
        userData?.data?.nominee?.length > 0
          ? userData?.data?.nominee?.map((item) => {
              return {
                ...item,
                relation_with_applicant: item?.relation_with_applicant && {
                  label: item?.relation_with_applicant,
                  value: item?.relation_with_applicant,
                },
                salutation: item?.salutation && {
                  label: item?.salutation,
                  value: item?.salutation,
                },
                gender: item?.gender && {
                  label: item?.gender,
                  value: item?.gender,
                },
                account_type: item?.account_type && {
                  label: item?.account_type,
                  value: item?.account_type,
                },
                relation_with_nominee: item?.relation_with_nominee && {
                  label: item.relation_with_nominee,
                  value: item.relation_with_nominee,
                },
                is_communication_address_same:
                  item.is_communication_address_same ? "Y" : "N",
              };
            })
          : [{}],
      nominee_check: userData?.data?.nominee?.[0]?.nominee_check === 1,
      documents: {
        ...userData?.data?.documents,
        address_proof: userData?.data?.documents?.address_proof && {
          label: userData?.data?.documents?.address_proof,
          value: userData?.data?.documents?.address_proof,
        },
        address_copy:
          userData?.data?.documents?.address_copy &&
          userData?.data?.documents?.address_copy,
        other_document: userData?.data?.documents?.other_document,
        aadhar_card_no: formatAadhaarOnPrefill(
          userData?.data?.documents?.aadhar_card_no
        ),

        highest_education_qualification: userData?.data?.documents
          ?.highest_education_qualification && {
          label: userData?.data?.documents?.highest_education_qualification,
          value: userData?.data?.documents?.highest_education_qualification,
        },
        bank_account: userData?.data?.documents?.bank_account && {
          label: userData?.data?.documents?.bank_account,
          value: userData?.data?.documents?.bank_account,
        },
        license_status:
          userData?.data?.documents?.license_status === 1
            ? { label: "Yes", value: 1 }
            : userData?.data?.documents?.license_status === 0
              ? { label: "No", value: 0 }
              : { label: "Yes", value: 1 },
        noc_date: userData?.data?.profile?.existing_health_insurance_noc_date
          ? DateTime.fromISO(
              userData?.data?.profile?.existing_health_insurance_noc_date
            ).toFormat("dd-MM-yyyy")
          : "",
      },
      declaration: userData?.data?.declaration,
      exam:
        userData?.data?.exam?.prefillData?.length > 0
          ? userData?.data?.exam?.prefillData.map((item) => ({
              ...item,
              preferred_exam_date: item?.preferred_exam_date
                ? DateTime.fromISO(item?.preferred_exam_date).toFormat(
                    "dd-MM-yyyy"
                  )
                : "",
              state: item?.state && {
                value: item.state,
                label: item.state,
              },
              exam_center: item?.exam_center && {
                value: item.exam_center,
                label: item.exam_center,
                address: item.center_address,
              },
              preferred_language: item?.preferred_language && {
                value: item.preferred_language,
                label: item.preferred_language,
              },
            }))
          : [{}],
      // selected_date: userData?.data?.exam?.selected_date && {
      //   value: DateTime.fromISO(userData?.data?.exam.selected_date).toFormat(
      //     "dd-MM-yyyy HH:mm"
      //   ),

      //   label: userData?.data?.exam.selected_date,
      // },
      // selected_date: DateTime.fromISO(
      //   userData?.data?.exam?.selected_date
      // ).toFormat("dd-MM-yyyy HH:mm"),
      exam_status: userData?.data?.exam?.exam_result && {
        value: userData?.data?.exam?.exam_result,
        label: userData?.data?.exam?.exam_result,
      },
      exam_score: userData?.data?.exam?.score && userData?.data?.exam.score,
      application_number: userData?.data?.application_number,
      roll_no: userData?.data?.exam?.roll_no || "",
      hall_ticket_path: userData?.data?.exam?.hall_ticket_path,
      user_type: userData?.data?.user_type,
      user_stage: userData?.data?.user_stage,
      payment_status: userData?.data?.payment_status,
      user_approval_status: userData?.data?.user_approval_status,
      approval_access: userData?.data?.approval_access,
    });
    userData?.data?.documents?.Discrepancy &&
      dispatch(setDiscrepancyArray(userData?.data?.documents?.Discrepancy));
    userData?.data?.documents?.Approval &&
      dispatch(setApprovedArray(userData?.data?.documents?.Approval));
    if (userData?.data?.user_stage_id > -1) {
      menus?.map((item, i) => {
        if (item.label === userData?.data?.user_stage_label) {
          dispatch(setAgent(i));
        }
      });
    }
    userData?.data?.user_stage_label &&
      dispatch(setAgentName(userData?.data?.user_stage_label));
    userData?.data?.user_stage_label &&
      dispatch(setCompletedName(userData?.data?.user_stage_label));
  }, [JSON.stringify(userData?.data)]);

  const trainingStatus = userData?.training?.training_completed
    ? "Completed"
    : "Pending";
  const isPospAgentType = userData?.data?.user_type == "posp";
  const isAdminOperations = [1, 2].includes(verticalId);

  const showSubmitButton = isAdminOperations
    ? !watch("user_approval_status")
    : !watch("payment_status");

  const isVisible =
    isAdminOperations &&
    ["Profile Details", "Bank Details", "Nominee Details"].includes(agentName);

  const ComponentProps = {
    control,
    handleSubmit,
    watch,
    setValue,
    register,
    getValues,
    resetField,
    reset,
    errors,
    id,
    clearErrors,
    setError,
    lessthan576,
    showSubmitButton,
    userData: userData?.data,
    getUserDetailsRefetch: refetch,
  };

  useEffect(() => {
    if (
      userData?.data?.user_stage === "Lead" &&
      userData?.data?.has_license === 1 &&
      verticalId === 3
    ) {
      toggleIsOCRDrawerOpen(true);
    }
  }, [userData?.data?.user_stage, userData?.data?.has_license]);

  // if (isFetching) {
  //   return <PrudentialLoader />;
  // }

  return (
    <MainContainer
      setOpenOCRModal={toggleIsOCRDrawerOpen}
      heading={"Agent Journey Details"}
      subHeading={
        "This tab shows the complete journey of the agent from the time of registration to the time of approval. All the details provided by the agent are shown here."
      }
      // pageActions={
      //   <div className="flex items-center gap-2">
      //     {["Profile Details", "Bank Details", "Nominee Details"].includes(
      //       agentName
      //     ) &&
      //       !isAdminOperations && (
      //         <Button
      //           variant="outlined"
      //           endIcon={<HiOutlineUpload />}
      //           onClick={() => setOpenOCRModal(true)}
      //         >
      //           Smart Upload
      //         </Button>
      //       )}
      //   </div>
      // }
    >
      <CkycDrawer
        isDrawerOpen={isOCRDrawerOpen}
        toggleIsDrawerOpen={toggleIsOCRDrawerOpen}
        setIsPanConfirmationModal={setIsPanConfirmationModal}
      />

      {watch("user_approval_status") && isVisible ? (
        watch("user_stage") === "Rejected" ? (
          <AgentRejectWatermark />
        ) : (
          <AgentWatermark />
        )
      ) : null}

      <div style={{ height: "auto", padding: "7px 0" }}>
        <AdminStepper />
      </div>
      <div
        data-id={
          [1, 2]?.includes(verticalId) &&
          ["Profile Details", "Bank Details", "Nominee Details"]?.includes(
            agentName
          )
        }
        className="grid grid-cols-1 md:grid-cols-1 data-[id=true]:grid-cols-2 gap-4 mt-4">
        {(() => {
          switch (agentName) {
            case "Profile Details":
              return (
                <div className="overflow-y-scroll h-[70vh] p-2 hide-scroll rounded-lg  ">
                  <AgentTypeModal
                    userData={userData?.data}
                    isPending={isPending}
                    open={open}
                    setOpen={setOpen}
                    setValue={setValue}
                  />
                  <ProfileDetails
                    {...ComponentProps}
                    setOpen={setOpen}
                    setIsPanConfirmationModal={setIsPanConfirmationModal}
                  />
                </div>
              );
            case "Bank Details":
              return <BankDetails {...ComponentProps} />;
            case "Nominee Details":
              return (
                <div className="overflow-y-scroll h-[70vh] p-2 hide-scroll rounded-lg  ">
                  <NomineeDetails {...ComponentProps} />
                </div>
              );
            case "Documents":
              return <Documents {...ComponentProps} />;
            case "CKYC Verification":
              return <Ckyc {...ComponentProps} />;
            case "Consent":
              return <ConsentForm {...ComponentProps} setFocus={setFocus} />;
            case "Payment":
              return <Payment {...ComponentProps} />;
            case "Exam Details":
              return <ExamDetails {...ComponentProps} />;
            case "Training":
            case "Thank You":
              // return <POSExam {...ComponentProps} />;
              return <TrainingPageIndex {...ComponentProps} />;
            case "Discrepancy":
              return <Discrepancy {...ComponentProps} />;
            case "Certified":
              return <Certificate {...ComponentProps} />;
            case "NOC":
              return <NOCForm {...ComponentProps} />;
            case "POSP Exam":
              return <POSExam {...ComponentProps} />;
            default:
              return null;
          }
        })()}
        <section className="flex flex-col gap-4">
          {isPospAgentType && (
            <div className="ml-auto">
              <UiCapsule
                text={`Training Status:${trainingStatus}`}
                color="#08CB00"
              />
            </div>
          )}

          <div
            data-id={isVisible}
            className="bg-gradient-to-b from-slate-50 to-slate-100 rounded-lg h-[70vh] overflow-y-auto data-[id=false]:hidden shadow-md border border-slate-200">
            <DocumentVerification
              setOpenModal={setOpenModal}
              id={id}
              {...ComponentProps}
            />
          </div>
        </section>
      </div>
      <GlobalModal
        open={openModal.open}
        onClose={() => setOpenModal({ open: false, data: null })}
        width={lessthan576 ? "100%" : "500"}
        title={`Raise Discrepancy`}>
        <RaiseDiscrepancy
          modalData={openModal}
          setModalData={setOpenModal}
          id={id}
        />
      </GlobalModal>
      {isPanConfirmationModal && (
        <BlackListConfirmationAgentModal
          open={isPanConfirmationModal}
          onClose={() => setIsPanConfirmationModal(false)}
          isLogOutAction={true}
        />
      )}
    </MainContainer>
  );
};

export default UpdateComponent;
