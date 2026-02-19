import {
  allowOnlyName,
  allowOnlyNumbers,
  handleIFSCInput,
  verifyValidNumbers,
  verifyValidPincode,
} from "@/HelperFunctions/helperFunctions";
import Button from "@/UI-Components/Button";
import UiButton from "@/UI-Components/Buttons/UiButton";
import Dropdown from "@/UI-Components/Dropdown";
import Input from "@/UI-Components/Input";
import RadioButton from "@/UI-Components/RadioButton";
import { Checkbox } from "@mui/material";
import { Check, MessageCircle, XCircle } from "lucide-react";
import moment from "moment";
import { useEffect, useState } from "react";
import { Controller, useFieldArray, useWatch } from "react-hook-form";
import {
  HiArrowNarrowLeft,
  HiArrowNarrowRight,
  HiOutlinePlus,
  HiOutlineRefresh,
  HiOutlineX,
  HiUser,
} from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";
import { decrementAgent } from "../../agent.slice";
import {
  useDocumentFinalApproval,
  useGetIFSCCode,
  useGetStateCity,
  useNomineeDetails,
} from "../../service";
import { GlobalModal } from "@/UI-Components";
import NomineeCommentModal from "./NomineeCommentModal";
import { nomineeRelations } from "@/constants/global.constant";

const NomineeDetails = ({
  register,
  watch,
  getValues,
  handleSubmit,
  setValue,
  control,
  errors,
  id,
  clearErrors,
  showSubmitButton,
}) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "nominee",
    keyName: "key",
  });
  const nomineeValues = useWatch({
    control,
    name: "nominee",
  });
  const totalShare = Array.isArray(nomineeValues)
    ? nomineeValues.reduce((sum, item) => {
        const share = parseFloat(item?.nominee_share) || 0;
        return sum + share;
      }, 0)
    : 0;
  //STATE's
  const [stage, setStage] = useState(0);

  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  //Variable's

  const canAddNominee = totalShare < 100 && fields.length < 10;
  const userType = getValues("user_type");
  const { nominee } = getValues();
  const pincode = nominee?.[stage]?.pincode;
  const dob = getValues("profile.dob");
  const { agent } = useSelector((state) => state.agent);
  const martialStatus = watch("profile.marital_status");
  const dispatch = useDispatch();
  const { mutate, isPending } = useNomineeDetails();
  const {
    mutate: documentFinalApproval,
    isPending: documentApprovalMutationIsPending,
  } = useDocumentFinalApproval(userType);
  const { data: stateCity, mutate: getStateCity } = useGetStateCity();
  const { data: ifscCode, mutate: getIFSCCode } = useGetIFSCCode();
  const verticalId = Number(localStorage.getItem("vertical_id"));
  const isSameAddress = nominee?.[stage]?.is_communication_address_same;
  const applicantPincode = getValues("profile.pincode");
  const applicantAddress = getValues("profile.address");

  useEffect(() => {
    if (pincode && String(pincode).length === 6) {
      getStateCity({ pincode });
    }
  }, [pincode]);

  useEffect(() => {
    if (stateCity?.data?.status === 200) {
      setValue(`nominee[${stage}].city`, stateCity?.data?.city_name);
      setValue(`nominee[${stage}].state`, stateCity?.data?.state_name);
    }
  }, [stateCity?.data]);

  useEffect(() => {
    if (ifscCode?.data?.status === 200) {
      setValue(
        `nominee[${stage}].bank_name`,
        ifscCode?.data?.bankDetails?.bank_name
      );
      setValue(
        `nominee[${stage}].bank_city`,
        ifscCode?.data?.bankDetails?.bank_city
      );
      setValue(
        `nominee[${stage}].branch_name`,
        ifscCode?.data?.bankDetails?.bank_branch
      );
      clearErrors(`nominee[${stage}].bank_name`);
      clearErrors(`nominee[${stage}].bank_city`);
      clearErrors(`nominee[${stage}].branch_name`);
    }
  }, [ifscCode?.data]);

  useEffect(() => {
    if (dob)
      setValue(
        `nominee[${stage}].dob_age`,
        moment().diff(moment(dob, "YYYY-MM-DD"), "years")
      );
  }, [dob, stage]);

  const handleSalutationOnChange = (e) => {
    switch (e?.value || "") {
      case "Mr.":
        setValue(`nominee[${stage}].gender`, { label: "Male", value: "Male" });
        return e.value || "";
      case "Mrs.":
        setValue(`nominee[${stage}].gender`, {
          label: "Female",
          value: "Female",
        });
        return e.value || "";
      case "Miss":
        setValue(`nominee[${stage}].gender`, {
          label: "Female",
          value: "Female",
        });
        return e.value || "";
    }
    return e?.value || "";
  };

  const getSelectedRelations = (currentIndex) => {
    const allNominees = getValues("nominee") || [];
    const selectedRelations = [];
    allNominees.forEach((nominee, index) => {
      if (index !== currentIndex && nominee?.relation_with_applicant?.value) {
        selectedRelations.push(nominee.relation_with_applicant.value);
      }
    });
    return selectedRelations;
  };
  // Function to get available relation options for current nominee
  const getAvailableRelationOptions = (currentIndex) => {
    const genderValue = watch(`nominee[${currentIndex}].gender`)?.value;
    let baseOptions = nomineeRelations[genderValue] || [];
    if (martialStatus?.value === "Single") {
      baseOptions = baseOptions.filter((opt) => opt.value !== "Spouse");
    }
    const selectedRelations = getSelectedRelations(currentIndex);
    return baseOptions.filter((option) => {
      const isRestrictedRelation = ["Father"].includes(option.value);
      return !(
        isRestrictedRelation && selectedRelations.includes(option.value)
      );
    });
  };
  const relationOptions = getAvailableRelationOptions(stage);

  const handleUpdate = () => {
    if (getValues("approval_access")) return documentFinalApproval({ id });
  };

  const onSubmit = (data) => {
    const payload = data.nominee.map((nominee) => ({
      ...nominee,
      id,
      relation_with_applicant: nominee?.relation_with_applicant?.value,
      is_communication_address_same: nominee?.is_communication_address_same,
      salutation: nominee?.salutation?.value,
      gender: nominee?.gender?.value,
      account_type: nominee?.account_type?.value ?? "Savings",
      relation_with_nominee: nominee?.relation_with_nominee?.value,
      nominee_check: getValues("nominee_check"),
    }));
    mutate(payload);
  };

  return (
    <div>
      <div className="py-4.5">
        <div className="grid grid-cols-4  sm:grid-cols-10 gap-3 md:gap-4">
          {fields.map((_nominee, index) => (
            <div key={_nominee.key} className="relative ">
              <Button
                width={"100%"}
                variant={stage === index ? "contained" : "outlined"}
                onClick={() => setStage(index)}
                classNameProps="group">
                <HiUser /> {index + 1}
                {index > 0 && (
                  <HiOutlineX
                    size={20}
                    onClick={(event) => {
                      setStage(fields.length - 2);
                      remove(index);
                      event.stopPropagation();
                    }}
                    className="opacity-100 md:opacity-0 md:group-hover:opacity-100 text-primary  cursor-pointer absolute -top-2 -right-2 bg-white rounded-full border border-gray-300 p-1"
                  />
                )}
              </Button>
            </div>
          ))}
          {fields.length < 10 && (
            <div className="relative">
              <Button
                variant={"outlined"}
                disabled={
                  !canAddNominee || !watch(`nominee[${stage}].nominee_share`)
                }
                onClick={() => {
                  append({
                    account_type: { label: "Savings", value: "Savings" },
                  });
                  setStage((prev) => prev + 1);
                }}>
                <HiOutlinePlus />
              </Button>
            </div>
          )}
        </div>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        {fields.map((_nominee, index) => {
          return (
            stage === index && (
              <div
                key={_nominee.key}
                data-id={!!id}
                className="grid gap-4 grid-cols-1  md:grid-cols-2 lg:grid-cols-4 data-[id=true]:grid-cols-2">
                <input
                  name={`nominee[${stage}].dob_age`}
                  type="hidden"
                  value={getValues("profile.dob")}
                  {...register(`nominee[${stage}].dob_age`)}
                />

                <div>
                  <Dropdown
                    control={control}
                    name={`nominee[${stage}].salutation`}
                    label="Salutation"
                    placeholder="Select Salutation"
                    errors={errors}
                    isRequired={true}
                    options={[
                      {
                        label: "Mr.",
                        value: "Mr.",
                      },
                      {
                        label: "Mrs.",
                        value: "Mrs.",
                      },
                      {
                        label: "Miss",
                        value: "Miss",
                      },
                    ]}
                    onChange={(e) => {
                      setValue(
                        `nominee[${stage}].relation_with_applicant`,
                        null
                      );
                      handleSalutationOnChange(e);
                    }}
                  />
                </div>
                <div>
                  <Dropdown
                    control={control}
                    name={`nominee[${stage}].gender`}
                    label="Gender"
                    placeholder="Select Gender"
                    errors={errors}
                    isRequired={true}
                    options={[
                      {
                        label: "Male",
                        value: "Male",
                      },
                      {
                        label: "Female",
                        value: "Female",
                      },
                      {
                        label: "Other",
                        value: "Other",
                      },
                    ]}
                    isDisabled={true}
                  />
                </div>
                <div>
                  <Dropdown
                    control={control}
                    name={`nominee[${stage}].relation_with_applicant`}
                    label="Relation with Applicant"
                    placeholder="Select Relation"
                    errors={errors}
                    isRequired={true}
                    options={relationOptions}
                  />
                </div>
                <div>
                  <Input
                    label="Nominee Name"
                    inputRef={register(`nominee[${stage}].nominee_name`)}
                    placeholder="Enter Nominee Name"
                    errors={errors}
                    isRequired={true}
                    name={`nominee[${stage}].nominee_name`}
                    onChange={(e) => allowOnlyName(e)}
                  />
                </div>
                <div>
                  <Input
                    label="Contact Number"
                    inputRef={register(`nominee[${stage}].contact_number`)}
                    placeholder="Enter Contact Number"
                    errors={errors}
                    isRequired={true}
                    name={`nominee[${stage}].contact_number`}
                    maxLength={10}
                    onChange={(e) => (e.target.value = verifyValidNumbers(e))}
                    type="tel"
                  />
                </div>
                <div>
                  <Input
                    label="Age"
                    inputRef={register(`nominee[${stage}].age`)}
                    placeholder="Enter Age"
                    errors={errors}
                    isRequired={true}
                    name={`nominee[${stage}].age`}
                    maxLength={3}
                    onChange={(e) => (e.target.value = allowOnlyNumbers(e))}
                    type="tel"
                  />
                </div>
                <div>
                  <Input
                    label="Nominee Share %"
                    inputRef={register(`nominee[${stage}].nominee_share`)}
                    placeholder="Enter Nominee Share %"
                    errors={errors}
                    isRequired={true}
                    name={`nominee[${stage}].nominee_share`}
                    maxLength={3}
                    onChange={(e) => (e.target.value = allowOnlyNumbers(e))}
                    type="tel"
                  />
                </div>
                <div>
                  <RadioButton
                    control={control}
                    name={`nominee[${stage}].is_communication_address_same`}
                    label="Address Same Applicant"
                    options={[
                      { label: "Yes", value: "Y" },
                      { label: "No", value: "N" },
                    ]}
                    onChange={(opt) => {
                      if (opt?.value === "Y") {
                        setValue(
                          `nominee[${stage}].pincode`,
                          applicantPincode || ""
                        );
                        setValue(
                          `nominee[${stage}].house_number`,
                          applicantAddress || ""
                        );
                      } else {
                        setValue(`nominee[${stage}].pincode`, "");
                        setValue(`nominee[${stage}].city`, "");
                        setValue(`nominee[${stage}].state`, "");
                        setValue(`nominee[${stage}].house_number`, "");
                      }
                    }}
                  />
                </div>
                <div>
                  <Input
                    label="Pin Code"
                    inputRef={register(`nominee[${stage}].pincode`)}
                    placeholder="Enter Pin Code"
                    errors={errors}
                    isRequired={true}
                    name={`nominee[${stage}].pincode`}
                    maxLength={6}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (!value) {
                        setValue("profile.communicational_address", "");
                        setValue("profile.communication_street", "");
                      }
                      e.target.value = verifyValidPincode(e);
                    }}
                    type="tel"
                  />
                </div>
                <div>
                  <Input
                    label="City"
                    inputRef={register(`nominee[${stage}].city`)}
                    placeholder="Enter City"
                    errors={errors}
                    isRequired={true}
                    readOnly={true}
                    name={`nominee[${stage}].city`}
                  />
                </div>
                <div>
                  <Input
                    label="State"
                    inputRef={register(`nominee[${stage}].state`)}
                    placeholder="Enter State"
                    errors={errors}
                    isRequired={true}
                    readOnly={true}
                    name={`nominee[${stage}].state`}
                  />
                </div>
                <div>
                  <Input
                    label="Address Line 1"
                    inputRef={register(`nominee[${stage}].house_number`)}
                    placeholder="Enter Address Line 1"
                    errors={errors}
                    isRequired={true}
                    maxLength={100}
                    name={`nominee[${stage}].house_number`}
                  />
                </div>
                <div>
                  <Dropdown
                    name={`nominee[${stage}].account_type`}
                    control={control}
                    label="Account Type"
                    defaultValue={{ label: "Savings", value: "Savings" }}
                    placeholder="Select Account Type"
                    options={[
                      { label: "Savings", value: "Savings" },
                      { label: "Current", value: "Current" },
                    ]}
                  />
                </div>
                <div>
                  <Input
                    label="Nominee Account Number"
                    name={`nominee[${stage}].bank_account_number`}
                    inputRef={register(`nominee[${stage}].bank_account_number`)}
                    placeholder="Enter Nominee Account Number"
                    maxLength={20}
                    // isRequired={true}
                    errors={errors}
                    type="tel"
                    onChange={(e) => (e.target.value = allowOnlyNumbers(e))}
                  />
                </div>
                <div>
                  <Input
                    label="Re-Enter Nominee Account Number"
                    inputRef={register(
                      `nominee[${stage}].re_enter_bank_account_number`
                    )}
                    placeholder="Re-Enter Nominee Account Number"
                    // isRequired={true}
                    maxLength={20}
                    errors={errors}
                    onPaste={(e) => e.preventDefault()}
                    name={`nominee[${stage}].re_enter_bank_account_number`}
                    type="tel"
                    onChange={(e) => (e.target.value = allowOnlyNumbers(e))}
                  />
                </div>
                <div>
                  <Input
                    name={`nominee[${stage}].ifsc_code`}
                    inputRef={register(`nominee[${stage}].ifsc_code`)}
                    label="IFSC Code"
                    placeholder="Enter IFSC Code"
                    maxLength={11}
                    errors={errors}
                    onChange={(e) => {
                      const value = e.target.value;

                      handleIFSCInput(e);
                      if (String(e.target.value).length === 11) {
                        getIFSCCode({ ifscCode: e.target.value });
                      }
                      if (!value || value.length < 11) {
                        setValue(`nominee[${stage}].bank_name`, "");
                        setValue(`nominee[${stage}].bank_city`, "");
                        setValue(`nominee[${stage}].branch_name`, "");
                      }
                    }}
                  />
                </div>
                <div>
                  <Input
                    label="Bank Name"
                    inputRef={register(`nominee[${stage}].bank_name`)}
                    placeholder={"Enter Bank Name"}
                    readOnly
                    name={`nominee[${stage}].bank_name`}
                  />
                </div>
                <div>
                  <Input
                    label="Bank City"
                    inputRef={register(`nominee[${stage}].bank_city`)}
                    readOnly
                    placeholder={"Enter Bank City"}
                    name={`nominee[${stage}].bank_city`}
                  />
                </div>
                <div>
                  <Input
                    label="Branch Name"
                    inputRef={register(`nominee[${stage}].branch_name`)}
                    readOnly
                    placeholder={"Enter Branch Name"}
                    name={`nominee[${stage}].branch_name`}
                  />
                </div>
                {watch(`nominee[${stage}].age`) < 18 &&
                  watch(`nominee[${stage}].age`) && (
                    <>
                      <div>
                        <Input
                          label="Guardian Name"
                          inputRef={register(`nominee[${stage}].guardian_name`)}
                          placeholder="Enter Guardian Name"
                          errors={errors}
                          isRequired={true}
                          name={`nominee[${stage}].guardian_name`}
                        />
                      </div>
                      <div>
                        <Input
                          label="Guardian Contact Number"
                          inputRef={register(
                            `nominee[${stage}].guardian_contact_number`
                          )}
                          type="tel"
                          maxLength={10}
                          placeholder="Enter Guardian Contact Number"
                          errors={errors}
                          isRequired={true}
                          name={`nominee[${stage}].guardian_contact_number`}
                          onChange={(e) =>
                            (e.target.value = verifyValidNumbers(e))
                          }
                        />
                      </div>
                      {/* <div>
                        <Input
                          label="Relation with Nominee"
                          inputRef={register(
                            `nominee[${stage}].relation_with_nominee`
                          )}
                          placeholder="Enter Relation with Nominee"
                          errors={errors}
                          isRequired={true}
                          name={`nominee[${stage}].relation_with_nominee`}
                        />
                      </div> */}
                      <div>
                        <Dropdown
                          name={`nominee[${stage}].relation_with_nominee`}
                          control={control}
                          label="Guardian Relation with Nominee"
                          placeholder="Select"
                          errors={errors}
                          isRequired={true}
                          options={[
                            { label: "Father", value: "Father" },
                            { label: "Mother", value: "Mother" },
                            { label: "Brother", value: "Brother" },
                            { label: "Sister", value: "Sister" },
                            { label: "GrandFather", value: "GrandFather" },
                            { label: "GrandMother", value: "GrandMother" },
                            { label: "Uncle", value: "Uncle" },
                            { label: "Other", value: "Other" },
                          ]}
                        />
                      </div>
                    </>
                  )}
              </div>
            )
          );
        })}
        {![1, 2].includes(verticalId) && (
          <>
            {" "}
            <ul className="mt-5 text-xs font-semibold text-gray-500 italic">
              <li>
                Nomination by the Individual Agent should be restricted to his
                spouse, children, and parents as legal heirs.
              </li>
              <li>
                The payment of hereditary commission is subject to compliance
                with the applicable Law and IRDAI Regulations, and with any such
                changes in future, the scheme shall stand withdrawn/modified, as
                the case may be, without any notice to the Agent and/or Nominee.
              </li>
              <li>
                Relationship Document proof accepted: Any government-approved
                document containing the relationship of the beneficiary.
              </li>
              <li>
                The Individual Agent can cancel the nomination during his
                lifetime by submitting a fresh benefit form/withdrawing the
                nomination.
              </li>
            </ul>
            <div className="flex items-center">
              <Controller
                name="nominee_check"
                control={control}
                defaultValue={false}
                rules={{ required: "Please accept the terms & conditions" }}
                render={({ field, fieldState: { error } }) => (
                  <>
                    <Checkbox
                      size="small"
                      {...field}
                      checked={field.value || false}
                      onChange={(e) => field.onChange(e.target.checked)}
                    />
                    <span style={{ fontSize: "12px" }}>
                      I have read & understood the terms & conditions.
                    </span>
                    {error && (
                      <p className="text-red-500 text-xs mt-1 ml-2">
                        {error.message}
                      </p>
                    )}
                  </>
                )}
              />
            </div>
          </>
        )}

        <div className="mt-4 flex justify-between items-center gap-2">
          {agent > 0 ? (
            <Button
              startIcon={<HiArrowNarrowLeft size={15} />}
              variant={"outlined"}
              onClick={() => dispatch(decrementAgent())}>
              Back
            </Button>
          ) : (
            <div />
          )}
          <div className="flex gap-2 ">
            {showSubmitButton && [3, 4].includes(verticalId) && (
              <Button
                endIcon={
                  isPending ? (
                    <HiOutlineRefresh className="animate-spin" size={15} />
                  ) : (
                    <HiArrowNarrowRight size={15} />
                  )
                }
                disabled={isPending}
                type="submit"
                // onClick={handleSubmit(onSubmit)}
              >
                Submit
              </Button>
            )}

            {getValues("approval_access") && showSubmitButton && (
              <UiButton
                buttonType="tertiary"
                text="Approve"
                className="w-24 p-2 bg-gradient-to-r from-green-500 to-green-600 rounded-lg text-white flex-row-reverse  transform transition-transform duration-200 
             hover:scale-110"
                icon={<Check className="size-4" />}
                onClick={() => {
                  documentFinalApproval({ id: id, status: "Approve" });
                }}
                //isLoading={documentApprovalMutationIsPending}
                isLoading={
                  documentApprovalMutationIsPending?.variables?.status ==
                  "Approve"
                    ? documentApprovalMutationIsPending?.isPending
                    : false
                }
              />
            )}
            {getValues("approval_access") && showSubmitButton && (
              <UiButton
                buttonType="tertiary"
                text="Reject"
                className="w-24 p-2 bg-red-600 text-white flex-row-reverse rounded-lg  transform transition-transform duration-200 
                            hover:scale-110"
                icon={<XCircle className="size-4" />}
                onClick={() => {
                  documentFinalApproval({ id: id, status: "Reject" });
                }}
                isLoading={
                  documentApprovalMutationIsPending?.variables?.status ==
                  "Reject"
                    ? documentApprovalMutationIsPending?.isPending
                    : false
                }
              />
            )}
            {getValues("approval_access") && showSubmitButton && (
              <UiButton
                buttonType="tertiary"
                text="Comment"
                className="w-24 p-2 border rounded-lg border-lightGray text-blue-500 flex-row-reverse  transform transition-transform duration-200 
                            hover:scale-110"
                icon={<MessageCircle className="size-4" />}
                isLoading={false}
                onClick={() => {
                  setIsCommentModalOpen(true);
                }}
              />
            )}
          </div>
        </div>
      </form>
      <GlobalModal
        open={isCommentModalOpen}
        onClose={() => {
          setIsCommentModalOpen(false);
        }}
        title="Comment Status"
        description="Provide the requested information or documents."
        width={500}>
        <NomineeCommentModal
          handleModalClose={() => {
            setIsCommentModalOpen(false);
          }}
          agentId={id}
          isApprovalAccess={getValues("approval_access")}
        />
      </GlobalModal>
    </div>
  );
};

export default NomineeDetails;
