import { yupResolver } from "@hookform/resolvers/yup";
import { useMediaQuery } from "@mui/material";
import { DateTime } from "luxon";
import { lazy, Suspense, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import * as Yup from "yup";

import { genderOptions } from "@/constants/global.constant";
import { formatAadhaarOnPrefill } from "@/HelperFunctions/helperFunctions";
import useGlobalRoutesHandler from "@/hooks/useGlobalHandleRouter";
import { ModuleDescription } from "../../Components/MasterTable/constants";
import {
  setAgent,
  setAgentName,
  setApproved,
  setCompletedName,
  setDiscrepancy,
} from "./agent.slice";
import {
  bankSchema,
  ckycSchema,
  declarationSchema,
  documentsSchema,
  examSchema,
  NOCSchema,
  nomineeSchema,
  profileSchema,
} from "./Schema";
import { useGetData } from "./service";
import PrudentialLoader from "@/Components/Loader/PrudentialLoader";
import BlackListConfirmationAgentModal from "@/Components/BlackListConfirmationAgentModal/BlackListConfirmationAgentModal";

const AgentMainSideBar = lazy(
  () => import("@/Components/SideBar/AgentMainSideBar")
);
// const OCRForm = lazy(() => import("./Components/OCRForm"));
const AgentTypeModal = lazy(() => import("./Components/AgentTypeModal"));
const CkycDrawer = lazy(() => import("./Components/Ckyc/CkycDrawer"));
const BankDetails = lazy(() => import("./Components/BankDetails"));
const Certificate = lazy(() => import("./Components/Certificate"));
const Ckyc = lazy(() => import("./Components/Ckyc/Ckyc"));
const ConsentForm = lazy(() => import("./Components/Consent/ConsentForm"));
const Discrepancy = lazy(() => import("./Components/Discrepancy/Discrepancy"));
const Documents = lazy(() => import("./Components/Documents"));
const ExamDetails = lazy(() => import("./Components/ExamDetails/ExamDetails"));
const MainContainer = lazy(() => import("./Components/MainContainer"));
const NOCForm = lazy(() => import("./Components/NOCForm"));
const NomineeDetails = lazy(
  () => import("./Components/NomineeDetails/NomineeDetails")
);
const Payment = lazy(() => import("./Components/Payment"));
const ProfileDetails = lazy(() => import("./Components/ProfileDetails"));
const POSExam = lazy(() => import("./Components/POSExam"));
const ServicingModule = lazy(
  () => import("../Servicing-Module/ServicingModule")
);
const TrainingPageIndex = lazy(
  () => import("../Training-Page/TrainingPageIndex")
);

const Utilityindex = () => {
  const { location, subRoute } = useGlobalRoutesHandler();
  const { agentName, menus } = useSelector((state) => state.agent);

  const id = useParams().id;
  // +new URLSearchParams(window.location.search).get("id") || undefined;
  const { data: userData, isPending } = useGetData(+id);
  const [isAgentTypeModalOpen, setIsAgentTypeModalOpen] = useState(false);
  const [isPanConfirmationModal, setIsPanConfirmationModal] = useState(false);
  const [isOCRDrawerOpen, toggleIsOCRDrawerOpen] = useState(false);
  const dispatch = useDispatch();

  const agentType = userData?.data?.user_type;
  const isAgentTypeComposite = agentType === "composite";

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    register,
    resetField,
    formState: { errors },
    setError,
    clearErrors,
    reset,
    setFocus,
    getValues,
    trigger,
  } = useForm({
    defaultValues: {
      profile: {
        gender: "Male",
        is_communication_address_same: "Y",
        insurers: [],
      },
      ckyc: {
        ckyc: "Y",
      },
    },
    resolver: yupResolver(
      (() => {
        switch (agentName) {
          case "Profile Details":
            return profileSchema(agentType, id);
          case "Bank Details":
            return bankSchema;
          case "CKYC Verification":
            return ckycSchema;
          case "Nominee Details":
            return nomineeSchema;
          case "Documents":
            return documentsSchema(agentType);
          // case "Consent":
          //   return declarationSchema;
          case "Exam Details":
            return examSchema(id);
          case "NOC":
            return NOCSchema;
          default:
            return Yup.object({});
        }
      })()
    ),
    context: userData?.data,
    mode: "onChange",
    reValidateMode: "onChange",
  });
  useEffect(() => {
    if (userData?.data) {
      const {
        profile,
        bank,
        ckyc,
        nominee,
        documents,
        declaration,
        exam,
        posexam,
        application_number,
      } = userData.data;

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
          ...profile,
          // aadhar_no:
          //   profile?.aadhar_no && formatAadhaarOnPrefill(profile?.aadhar_no),
          salutation: profile?.salutation && {
            label: profile?.salutation,
            value: profile?.salutation,
          },
          gender: genderOptions?.find(
            (gender) => gender?.value === userData?.data?.profile?.gender
          ),
          dob: userData?.data?.profile?.dob
            ? DateTime.fromISO(userData?.data?.profile?.dob).toFormat(
                "dd-MM-yyyy"
              )
            : "",
          aadhar_no: profile?.aadhar_no
            ? formatAadhaarOnPrefill(profile.aadhar_no)
            : "",
          is_communication_address_same: profile?.is_communication_address_same
            ? "Y"
            : "N",
          nationality: "Indian",
          occupation: profile?.occupation?.id && {
            ...profile?.occupation,
            value: profile?.occupation?.id,
          },
          marital_status: profile?.marital_status && {
            label: profile.marital_status,
            value: profile.marital_status,
          },
          board_name: profile?.board_name && {
            label: profile.board_name,
            value: profile.board_name,
          },
          category: profile?.category && {
            label: profile.category,
            value: profile.category,
          },
          year_of_passing: profile?.year_of_passing && {
            label: profile.year_of_passing,
            value: profile.year_of_passing,
          },
          highest_qualification: profile?.highest_qualification
            ? {
                label: profile.highest_qualification,
                value: profile.highest_qualification,
              }
            : {
                label: "10th",
                value: "10th",
              },
          existing_health_insurance_name:
            profile?.existing_health_insurance_name && {
              label: profile.existing_health_insurance_name,
              value: profile.existing_health_insurance_id,
            },
          existing_health_insurance_noc_date: userData?.data?.profile
            ?.existing_health_insurance_noc_date
            ? DateTime.fromISO(
                userData?.data?.profile?.existing_health_insurance_noc_date
              ).toFormat("dd-MM-yyyy")
            : "",
          name_of_issurer: profile?.name_of_issurer && {
            label: profile.name_of_issurer,
            value: profile.name_of_issurer,
          },
          insurers,
        },
        bank: {
          ...bank,
          account_type: bank?.account_type
            ? {
                label: bank.account_type,
                value: bank.account_type,
              }
            : {
                label: "Savings",
                value: "Savings",
              },
        },
        ckyc: {
          ...ckyc,
          ckyc: ckyc?.type ? (ckyc?.type === "CKYC" ? "Y" : "N") : "Y",
          ckyc_type: ckyc?.type && {
            label: ckyc.type,
            value: ckyc.type,
          },
          ckyc_number:
            ckyc?.type === "Aadhar"
              ? formatAadhaarOnPrefill(ckyc?.ckyc_number)
              : ckyc?.ckyc_number,
        },
        nominee:
          nominee?.length > 0
            ? nominee.map((item) => ({
                ...item,
                nominee_check: item?.nominee_check === 1 ? true : false,
                relation_with_applicant: item?.relation_with_applicant && {
                  label: item.relation_with_applicant,
                  value: item.relation_with_applicant,
                },
                salutation: item?.salutation && {
                  label: item.salutation,
                  value: item.salutation,
                },
                gender: item?.gender && {
                  label: item.gender,
                  value: item.gender,
                },
                account_type: item?.account_type && {
                  label: item.account_type,
                  value: item.account_type,
                },
                relation_with_nominee: item?.relation_with_nominee && {
                  label: item.relation_with_nominee,
                  value: item.relation_with_nominee,
                },
                is_communication_address_same:
                  item?.is_communication_address_same ? "Y" : "N",
              }))
            : [{}],
        nominee_check: nominee?.[0]?.nominee_check === 1,
        documents: {
          ...documents,
          aadhar_card_no: formatAadhaarOnPrefill(documents?.aadhar_card_no),
          highest_education_qualification:
            documents?.highest_education_qualification && {
              label: documents.highest_education_qualification,
              value: documents.highest_education_qualification,
            },
          bank_account: documents?.bank_account && {
            label: documents.bank_account,
            value: documents.bank_account,
          },
          address_proof: documents?.address_proof && {
            label: documents.address_proof,
            value: documents.address_proof,
          },
          other_document: documents?.other_document,
          license_status:
            documents?.license_status === 1
              ? { label: "Yes", value: 1 }
              : documents?.license_status === 0
                ? { label: "No", value: 0 }
                : { label: "Yes", value: 1 },

          noc_date: userData?.data?.profile?.existing_health_insurance_noc_date
            ? DateTime.fromISO(
                userData?.data?.profile?.existing_health_insurance_noc_date
              ).toFormat("dd-MM-yyyy")
            : "",
        },
        declaration,
        posexam,
        exam:
          exam?.prefillData?.length > 0
            ? exam?.prefillData.map((item) => ({
                ...item,

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
                preferred_exam_date: item?.preferred_exam_date
                  ? DateTime.fromISO(item?.preferred_exam_date).toFormat(
                      "dd-MM-yyyy"
                    )
                  : "",
              }))
            : [{}],
        application_number,
        selected_date: exam?.selected_date,
        roll_no: exam?.roll_no,
        hall_ticket_path: exam?.hall_ticket_path,
        user_type: userData?.data?.user_type,
        user_stage: userData?.data?.user_stage,
        payment_status: userData?.data?.payment_status,
        user_approval_status: userData?.data?.user_approval_status,
      });

      documents?.Discrepancy?.forEach((item) =>
        dispatch(setDiscrepancy(+item))
      );
      documents?.Approval?.forEach((item) => dispatch(setApproved(+item)));

      if (userData?.data?.user_stage_id > -1) {
        menus?.map((item, i) => {
          if (item.label === userData?.data?.user_stage_label) {
            dispatch(setAgent(i));
          }
        });
      }

      if (userData?.data?.user_stage_label) {
        dispatch(setAgentName(userData?.data?.user_stage_label));
        dispatch(setCompletedName(userData?.data?.user_stage_label));
      }
    }
  }, [JSON.stringify(userData?.data)]);

  const lessthan576 = useMediaQuery("(max-width: 576px)");

  const showSubmitButton =
    !watch("payment_status") && !watch("user_approval_status");

  const ComponentProps = {
    control,
    handleSubmit,
    watch,
    getValues,
    setValue,
    register,
    resetField,
    errors,
    id,
    clearErrors,
    lessthan576,
    userData: userData?.data,
    reset,
    showSubmitButton,
    setError,
    trigger,
    setAgentName: (name) => dispatch(setAgentName(name)),
    setIsAgentTypeModalOpen,
  };

  useEffect(() => {
    if (
      userData?.data?.user_stage === "Lead" &&
      userData?.data?.has_license === 1
    ) {
      toggleIsOCRDrawerOpen(true);
    }
  }, [userData?.data?.user_stage, userData?.data?.has_license]);

  return (
    <>
      <MainContainer
        setOpenOCRModal={isOCRDrawerOpen}
        userData={userData?.data}
        heading={agentName || "Profile"}
        subHeading={ModuleDescription[agentName || "Profile Details"]}>
        <div className="block md:hidden">
          <AgentMainSideBar />
        </div>
        <CkycDrawer
          isDrawerOpen={isOCRDrawerOpen}
          toggleIsDrawerOpen={toggleIsOCRDrawerOpen}
          setIsPanConfirmationModal={setIsPanConfirmationModal}
        />
        <Suspense fallback={<PrudentialLoader />}>
          {(() => {
            switch (agentName) {
              case "Profile Details":
                return (
                  <div className="overflow-y-scroll h-[70vh] p-2 hide-scroll rounded-lg  ">
                    <AgentTypeModal
                      userData={userData?.data}
                      isPending={isPending}
                      open={isAgentTypeModalOpen}
                      setOpen={setIsAgentTypeModalOpen}
                      setValue={setValue}
                    />
                    <ProfileDetails
                      {...ComponentProps}
                      setOpen={setIsAgentTypeModalOpen}
                      setIsPanConfirmationModal={setIsPanConfirmationModal}
                    />
                  </div>
                );
              case "Bank Details":
                return <BankDetails {...ComponentProps} />;
              case "Nominee Details":
                return <NomineeDetails {...ComponentProps} />;
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
                return <TrainingPageIndex {...ComponentProps} />;
              case "Discrepancy":
                return <Discrepancy {...ComponentProps} />;
              case "Certified":
                return <Certificate {...ComponentProps} />;
              case "Servicing Module":
                return <ServicingModule isHeader={false} />;
              case "NOC":
                return <NOCForm {...ComponentProps} />;
              case "POSP Exam":
                return <POSExam {...ComponentProps} />;
              default:
                return null;
            }
          })()}
        </Suspense>
        {isPanConfirmationModal && (
          <BlackListConfirmationAgentModal
            open={isPanConfirmationModal}
            onClose={() => setIsPanConfirmationModal(false)}
            isLogOutAction={true}
          />
        )}
      </MainContainer>
    </>
  );
};

export default Utilityindex;
