import Button from "@/UI-Components/Button";
import { DateTime } from "luxon";
import { useEffect, useState } from "react";
import {
  HiArrowNarrowLeft,
  HiArrowNarrowRight,
  HiOutlineRefresh,
} from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";
import { decrementAgent } from "../agent.slice";
import { useGetStateCity, useProfileDetails } from "../service";
import ProfileBasicDetails from "./ProfileBasicDetails";
import ProfileEducationDetails from "./ProfileEducationDetails";
import ProfileInsurerDetails from "./ProfileInsurerDetails";
import { getYearOptionsFromDOB } from "@/HelperFunctions/helperFunctions";
import PinCodeConfirmModal from "./PinCodeConfirmModal";
import useGlobalRoutesHandler from "@/hooks/useGlobalHandleRouter";
import useCheckBlacklistAgent from "@/hooks/useCheckBlacklistAgent";

const ProfileDetails = ({
  control,
  handleSubmit,
  watch,
  setValue,
  register,
  errors,
  id,
  clearErrors,
  setOpen,
  showSubmitButton,
  getValues,
  userData,
  setIsPanConfirmationModal,
}) => {
  const [yearOfPassingOptions, setYearOfPassingOptions] = useState([]);

  const { mutate, isPending } = useProfileDetails();
  const panNumberValue=watch("profile.pan_no")
  const {
   service:{getCheckBlackListAgentServices},
   states:{SetBlackListSearchQuery}
  } = useCheckBlacklistAgent({panNumber:panNumberValue?.toUpperCase()});
  const { agent } = useSelector((state) => state.agent);
  const dispatch = useDispatch();
  const { subRoute } = useGlobalRoutesHandler();
  const agentType = watch("user_type") && watch("user_type").toLowerCase();
  const isAgentTypeFresh = agentType === "fresh";
  const isAgentTypePOS = agentType === "posp";
  const isAgentTypeComposite = agentType === "composite";
  const isAgentTypeTransfer = agentType === "transfer";
  const dob = watch("profile.dob");

  const [showTextPopup, setShowTextPopup] = useState(false);
  const onSubmit = (data) => {
    const panNumberValue=watch("profile.pan_no")
  
    const isBlackListAgent = getCheckBlackListAgentServices?.data?.data?.is_blacklisted;
    // Check BlackList Agent Condition on PAN-NUMBER
    if (isBlackListAgent) {
      setIsPanConfirmationModal(true);
      return;
    }

    const communicationalAddress = {
      communicational_address: data.profile?.communicational_address,
      communication_city: data.profile?.communication_city,
      communication_state: data.profile?.communication_state,
      communication_pincode: data.profile?.communication_pincode,
      communication_street: data.profile?.communication_street,
      // communication_town: data.profile?.communication_town,
      // communication_district: data.profile?.communication_district,
    };

    const { aadhar_no, ...rest } = data.profile;

    const aadhar_no_prefill = !["x", "X"]?.includes(aadhar_no?.[0])
      ? {
          aadhar_no: aadhar_no ? aadhar_no.split("-").join("") : null,
        }
      : null;
    const dob = DateTime.fromFormat(data.profile.dob, "dd-MM-yyyy").toFormat(
      "yyyy-MM-dd"
    );
    const noc_date = DateTime.fromFormat(
      data.profile.existing_health_insurance_noc_date || "",
      "dd-MM-yyyy"
    ).toFormat("yyyy-MM-dd");

    mutate({
      id,
      salutation: rest.salutation?.value,
      gender: rest.gender?.value,
      marital_status: rest.marital_status?.value,
      rm_mapping: rest.rm_mapping?.value,
     // categories: [rest?.category?.value],
      address: rest?.address,
      board_name: rest?.board_name?.value,
      city: rest?.city,
      state: rest?.state,
      alternate_no: rest?.alternate_no,
      email: rest?.email,
      first_name: rest?.first_name,
      middle_name: rest?.middle_name,
      last_name: rest?.last_name,
      father_name: rest?.father_name,
      mobile: rest?.mobile,
      nationality: rest?.nationality,
      pan_no: rest?.pan_no,
      pincode: rest?.pincode,
      roll_no: rest?.roll_no,
      street: rest?.street,
      dob: dob,
      is_whatsapp_same_as_mobile: rest?.is_whatsapp_same_as_mobile,
      occupation_id: rest.occupation.value,
      other_caste: rest.other_caste,
      other_occupation: rest.other_occupation,
      category: rest.category?.value ?? "General",
      ...(data?.profile?.agent_category_id?.id && { agent_category_id: data?.profile?.agent_category_id?.id }),
      is_communication_address_same:
        rest?.is_communication_address_same === "Y" ? true : false,
      ...(aadhar_no_prefill ? aadhar_no_prefill : null),
      ...communicationalAddress,
      year_of_passing: rest.year_of_passing?.value,
      highest_qualification: rest.highest_qualification?.value,
      other_education:
        rest.highest_qualification?.value === "Other"
          ? rest.other_education
          : null,
      insurers: rest.insurers?.map((insurer) => ({
        insurer_type: insurer.insurer_type,
        name_of_issurer: insurer.name_of_issurer,
        agency_code: insurer.agency_code,
        date_of_agent_appointment: insurer.date_of_agent_appointment,
        date_of_agent_cessation: insurer.date_of_agent_cessation,
        reason_of_cessation: insurer.reason_of_cessation,
      })),

      ...(isAgentTypeTransfer && {
        existing_health_insurance_id:
          rest.existing_health_insurance_name?.value,
        existing_health_insurance_name:
          rest.existing_health_insurance_name?.label,
        existing_health_insurance_noc_date: noc_date,
        reason_for_transfer: rest.reason_for_transfer,
      }),
    });
  };

  const { data: stateCity, mutate: getStateCity } = useGetStateCity();
  const {
    data: stateCityCommunicationData,
    mutate: getStateCityCommunication,
  } = useGetStateCity();
  useEffect(() => {
    if (dob) {
      const options = getYearOptionsFromDOB(dob);
      setYearOfPassingOptions(options);
    } else {
      setYearOfPassingOptions([]);
    }
  }, [dob]);
  useEffect(() => {
    if (String(watch("profile.pincode"))?.length === 6) {
      getStateCity({
        pincode: watch("profile.pincode"),
        ...(subRoute !== "agent" && { id: subRoute }),
      });
    }
  }, [watch("profile.pincode")?.length]);

  useEffect(() => {
    if (String(watch("profile.communication_pincode"))?.length === 6) {
      getStateCityCommunication({
        pincode: watch("profile.communication_pincode"),
        ...(subRoute !== "agent" && { id: subRoute }),
      });
    }
  }, [watch("profile.communication_pincode")?.length]);
  useEffect(() => {
    if (stateCity?.data?.status === 200) {
      setValue("profile.city", stateCity?.data?.city_name);
      setValue("profile.state", stateCity?.data?.state_name);
      clearErrors("profile.city");
      clearErrors("profile.state");
      if (stateCity?.data?.text_popup) {
        setShowTextPopup(true);
      }
    } else {
      setValue("profile.city", "");
      setValue("profile.state", "");
    }
  }, [stateCity?.data]);

  useEffect(() => {
    if (stateCityCommunicationData?.data?.status === 200) {
      setValue(
        "profile.communication_city",
        stateCityCommunicationData?.data?.city_name
      );
      setValue(
        "profile.communication_state",
        stateCityCommunicationData?.data?.state_name
      );
      clearErrors("profile.communication_city");
      clearErrors("profile.communication_state");
    } else {
      setValue("profile.communication_city", "");
      setValue("profile.communication_state", "");
    }
  }, [stateCityCommunicationData?.data]);

  const defaultProps = {
    control,
    register,
    errors,
    watch,
    setValue,
    id,
    getValues,
    userData,
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        autoComplete="off"
        className="space-y-4">
        <ProfileBasicDetails {...defaultProps} setOpen={setOpen} />

        <ProfileEducationDetails
          {...defaultProps}
          passingYearOption={yearOfPassingOptions}
        />

        {isAgentTypeComposite || isAgentTypeTransfer ? (
          <ProfileInsurerDetails
            {...defaultProps}
            isAgentTypeComposite={isAgentTypeComposite}
            isAgentTypeTransfer={isAgentTypeTransfer}
          />
        ) : null}

        <div className="mt-4 flex justify-between gap-2">
          {agent > 0 ? (
            <Button
              startIcon={<HiArrowNarrowLeft size={15} />}
              variant={"outlined"}
              width={"auto"}
              onClick={() => dispatch(decrementAgent())}>
              Back
            </Button>
          ) : (
            <div />
          )}
          {showSubmitButton && (
            <Button
              type="submit"
              width={"auto"}
              disabled={isPending}
              endIcon={
                isPending ? (
                  <HiOutlineRefresh className="animate-spin" size={15} />
                ) : (
                  <HiArrowNarrowRight size={15} />
                )
              }>
              {watch("approval_access") ? "Next" : "Submit"}
            </Button>
          )}
        </div>
      </form>
      <PinCodeConfirmModal
        open={showTextPopup}
        onClose={() => setShowTextPopup(false)}
      />
    </>
  );
};

export default ProfileDetails;
