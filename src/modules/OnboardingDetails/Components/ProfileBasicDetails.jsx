import { genderOptions } from "@/constants/global.constant";
import {
  allowOnlyLastName,
  allowOnlyName,
  allowOnlyNameWithDot,
  allowOnlyNumbers,
  formatAadhaarInput,
  validateContactNumber,
  verifyValidEmail,
  verifyValidPincode,
} from "@/HelperFunctions/helperFunctions";
import UiCheckbox from "@/UI-Components/Checkbox/UiCheckBox";
import Dropdown from "@/UI-Components/Dropdown";
import Input from "@/UI-Components/Input";
import RadioButton from "@/UI-Components/RadioButton";
import UiDateInput from "@/UI-Components/UiDateInput";
import { DateTime } from "luxon";
import { Controller } from "react-hook-form";
import { HiOutlineSwitchHorizontal } from "react-icons/hi";
import { AGENT_TYPE_STYLES } from "../../Agent-Master/AgentMasterCustomCells";
import {
  // useGetCategoriesList,
  useGetReportingUserList,
} from "../../Create-User/service";
import { useOccupationList } from "../service";
import { useEffect, useState } from "react";
import { useCategoriesServices } from "@/services/hooks/categories/useCategoriesService";
const ProfileBasicDetails = ({
  register,
  errors,
  setValue,
  id,
  control,
  watch,
  setOpen,
  userData,
}) => {
  const {
    services: { getAllCategoriesServices },
  } = useCategoriesServices({});
  const vertical_id = +localStorage.getItem("vertical_id");
  const localAgentTypeStr = localStorage.getItem("agentType");
  const localAgentType = localAgentTypeStr
    ? JSON.parse(localAgentTypeStr)
    : null;

  const isShowAgentModalButton = [2, 3, 4].includes(vertical_id);
  const agentType =
    watch("user_type")?.toLowerCase() == "fresh"
      ? "New Agent"
      : watch("user_type")?.toLowerCase() || "";
  const agentTypeStyles =
    AGENT_TYPE_STYLES[agentType] || "bg-gray-100 text-gray-700";
  const isCommunicationAddressSame = watch(
    "profile.is_communication_address_same"
  );

  const paymentStatus = watch("payment_status");

  const mobileNumber = watch("profile.mobile");

  const handleAdressChange = () => {
    setValue("profile.communicational_address", "");
    setValue("profile.communication_street", "");
    setValue("profile.communication_town", "");
    setValue("profile.communication_district", "");
    setValue("profile.communication_pincode", "");
    setValue("profile.communication_city", "");
    setValue("profile.communication_state", "");
  };
  const [flsId, setFlsId] = useState("");
  const isSelectedFlsName = watch("profile.rm_mapping")?.value;
  const isSelectedFlsCode = watch("profile.fls_code")?.value;

  const { data: reportingUserData } = useGetReportingUserList(id);
  // const { data: categoriesData } = useGetCategoriesList(id);
  const reportingFlsNameMap =
    reportingUserData?.data?.data?.map((item) => ({
      label: item.name,
      value: item.id,
    })) || [];
  const reportingFlsCodeMap =
    reportingUserData?.data?.data
      ?.filter((item) => item?.fls_code != null && item?.id != null)
      .map((item) => ({
        label: item.fls_code,
        value: item.id,
      })) || [];

  // This for Prefill After Selecting FlsName/FlsCode
  useEffect(() => {
    if (![1, 2].includes(vertical_id)) return;
    if (!reportingUserData?.data?.data) return;

    if (!flsId) return;

    const flsData = reportingUserData?.data?.data?.find(
      (item) => item?.id == flsId
    );

    if (!flsData) return;
    setValue("profile.branch_name", flsData?.branch_name || "");
    setValue("profile.branch_code", flsData?.branch_code || "");
    setValue("profile.master_channel_code", flsData?.master_channel_code || "");
    setValue("profile.master_name", flsData?.master_name || "");
    if (isSelectedFlsName && flsData?.fls_code) {
      setValue("profile.fls_code", {
        label: flsData?.fls_code,
        value: flsData?.id,
      });
    }

    if (isSelectedFlsCode && flsData?.name) {
      setValue("profile.rm_mapping", {
        label: flsData?.name,
        value: flsData?.id,
      });
    }
  }, [reportingUserData?.data?.data, flsId]);
  // This for first Render of Prefill Fls
  useEffect(() => {
    if (
      reportingUserData?.data?.data &&
      watch("profile.rm_mapping") &&
      [1, 2].includes(vertical_id)
    ) {
      const flsData = reportingUserData?.data?.data?.find(
        (item) => item?.id == watch("profile.rm_mapping").value
      );
      if (!flsData) return;
      setValue("profile.branch_name", flsData?.branch_name || "");
      setValue("profile.branch_code", flsData?.branch_code || "");
      setValue(
        "profile.master_channel_code",
        flsData?.master_channel_code || ""
      );
      setValue("profile.master_name", flsData?.master_name || "");
      setValue("profile.fls_code", {
        label: flsData?.fls_code,
        value: flsData?.id,
      });
      setValue("profile.rm_mapping", {
        label: flsData?.name,
        value: flsData?.id,
      });
    }
  }, [reportingUserData?.data?.data]);
  const { data: occupationData } = useOccupationList();
  const occupationList =
    occupationData?.data?.data?.map((item) => {
      return {
        label: item?.label,
        value: item?.id,
      };
    }) || [];

  const handleSalutationOnChange = (e) => {
    switch (e?.value || "") {
      case "Mr.":
        setValue(`profile.gender`, { label: "Male", value: "Male" });
        return e.value || "";
      case "Mrs.":
        setValue(`profile.gender`, {
          label: "Female",
          value: "Female",
        });
        return e.value || "";
      case "Miss":
        setValue(`profile.gender`, {
          label: "Female",
          value: "Female",
        });
        return e.value || "";
    }
    return e?.value || "";
  };

  const isWhatsAppSameAsMobile = watch("profile.is_whatsapp_same_as_mobile");


  return (
    <>
      <div
        data-id={!!id}
        className="group  ring ring-gray-200 p-4 rounded-lg shadow-md"
      >
        <div className="flex items-center justify-between  border-b border-lightGray pb-2">
          <h2 className="col-span-4 text-lg font-semibold text-gray-600  ">
            Basic Details
          </h2>
          {(isShowAgentModalButton ||
            ["Fresh", "Composite", "Transfer", "posp"].includes(
              localAgentType?.label
            )) && (
            <button
              disabled={paymentStatus}
              type="button"
              onClick={() => setOpen(true)}
              className={`flex items-center gap-2 px-3 py-2 rounded-full text-xs font-semibold capitalize cursor-pointer ${agentTypeStyles}`}
            >
              {agentType}
              <HiOutlineSwitchHorizontal className="size-4" />
            </button>
          )}
        </div>

        <div
          data-id={!!id}
          className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 data-[id=true]:grid-cols-2 mt-4"
        >
          <div>
            <Dropdown
              control={control}
              name={`profile.salutation`}
              label="Salutation"
              placeholder="Select Salutation"
              errors={errors}
              isRequired
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
              onChange={handleSalutationOnChange}
            />
          </div>
          <div>
            <Input
              label="First Name"
              inputRef={register("profile.first_name")}
              placeholder="Enter First Name"
              isRequired
              errors={errors}
              onChange={(e) => (e.target.value = allowOnlyName(e))}
              name="profile.first_name"
              maxLength={100}
            />
          </div>
          <div>
            <Input
              label="Middle Name"
              inputRef={register("profile.middle_name")}
              placeholder="Enter Middle Name"
              onChange={(e) => (e.target.value = allowOnlyNameWithDot(e))}
              name="profile.middle_name"
              // errors={errors}
              maxLength={100}
            />
          </div>
          <div>
            <Input
              label="Last Name"
              inputRef={register("profile.last_name")}
              placeholder="Enter Last Name"
              isRequired
              errors={errors}
              onChange={(e) => (e.target.value = allowOnlyLastName(e))}
              name="profile.last_name"
              maxLength={100}
            />
          </div>
          <div>
            <Input
              label="Father Name"
              inputRef={register("profile.father_name")}
              placeholder="Enter Father Name"
              isRequired
              errors={errors}
              onChange={(e) => (e.target.value = allowOnlyNameWithDot(e))}
              name="profile.father_name"
              maxLength={100}
            />
          </div>
          <div>
            <Dropdown
              control={control}
              options={genderOptions}
              name={"profile.gender"}
              label={"Gender"}
              placeholder="Select gender"
              isRequired
              errors={errors}
            />
          </div>
          <div>
            <Controller
              control={control}
              name="profile.dob"
              defaultValue=""
              rules={{ required: "Date of birth is required" }}
              render={({ field, fieldState }) => (
                <UiDateInput
                  label="Date of Birth"
                  value={field.value}
                  onChange={field.onChange}
                  isRequired={true}
                  minAllowedDate={DateTime.now().minus({ years: 80 })}
                  maxAllowedDate={DateTime.now().minus({ years: 18 })}
                  errors={fieldState?.error?.message}
                />
              )}
            />
          </div>
          <div>
            <Dropdown
              control={control}
              options={[
                { value: "Single", label: "Single" },
                { label: "Married", value: "Married" },
              ]}
              name={"profile.marital_status"}
              label={"Marital Status"}
              placeholder="Select marital status"
              isRequired
              errors={errors}
            />
          </div>

          <div className="flex flex-col">
            <Input
              label="Mobile No."
              inputRef={register("profile.mobile")}
              placeholder="Enter Mobile No"
              isRequired
              errors={errors}
              readOnly
              name="profile.mobile"
              type="tel"
            />

            <Controller
              name="profile.is_whatsapp_same_as_mobile"
              control={control}
              render={({ field }) => (
                <UiCheckbox
                  id="same-as-mobile"
                  enabled={field.value}
                  setEnabled={(e) => {
                    const checked = e.target.checked;
                    field.onChange(checked);
                    setValue(
                      "profile.alternate_no",
                      checked ? mobileNumber : ""
                    );
                  }}
                  label="Mobile number is same as WhatsApp number"
                  containerClass="items-center ml-2 mt-2"
                  className="w-3 h-3 text-xs"
                  labelClassName="text-gray-600"
                />
              )}
            />
          </div>

          <div>
            <Input
              label="Alternative No /WhatsApp No"
              inputRef={register("profile.alternate_no")}
              placeholder="Enter Alternative No /WhatsApp No"
              errors={errors}
              name="profile.alternate_no"
              maxLength={10}
              disabled={isWhatsAppSameAsMobile}
              onChange={(e) => validateContactNumber(e)}
              type="tel"
            />
          </div>
          <div>
            <Input
              label="E-Mail Id"
              inputRef={register("profile.email")}
              placeholder="Enter E-Mail Id"
              isRequired
              errors={errors}
              name="profile.email"
              maxLength={100}
              onChange={(e) => verifyValidEmail(e)}
            />
          </div>
          <div>
            <Input
              inputRef={register("profile.nationality")}
              name={"profile.nationality"}
              label={"Nationality"}
              readOnly
              errors={errors}
              onChange={(e) => (e.target.value = e.target.value.toUpperCase())}
            />
          </div>
          <div>
            <Input
              name={"profile.aadhar_no"}
              inputRef={register("profile.aadhar_no")}
              type={"tel"}
              placeholder={"1234 5678 9012"}
              label={"Aadhaar No."}
              isRequired
              maxLength={14}
              onChange={(e) => {
                formatAadhaarInput(e);
              }}
              errors={errors}
            />
          </div>
          <div>
            <Input
              inputRef={register("profile.pan_no")}
              name={"profile.pan_no"}
              placeholder={"Eg. ABCPE1234F"}
              label={"PAN No."}
              maxLength={10}
              isRequired
              errors={errors}
              onChange={(e) => {
                e.target.value = e.target.value.toUpperCase();
                e.target.value = e.target.value.replace(/[^a-zA-Z0-9]/g, "");
                //   SetBlackListSearchQuery(e.target.value.toUpperCase());
              }}
            />
          </div>

          <div>
            <Dropdown
              control={control}
              defaultValue={{ label: "General", value: "General" }}
              options={[
                { label: "General", value: "General" },
                { label: "OBC", value: "OBC" },
                { label: "SC", value: "SC" },
                { label: "ST", value: "ST" },
                { label: "NT", value: "NT" },
                { label: "Other", value: "Other" },
              ]}
              name={"profile.category"}
              isRequired
              label={"Caste Category"}
              //  errors={errors}
            />
          </div>
          {watch("profile.category")?.value === "Other" && (
            <div>
              <Input
                inputRef={register("profile.other_caste")}
                name={"profile.other_caste"}
                isRequired
                label={"Enter Other Caste (Specify)"}
                placeholder="Enter Other Caste"
                errors={errors}
                maxLength={100}
                onChange={(e) => (e.target.value = allowOnlyName(e))}
              />
            </div>
          )}
          <div>
            <Dropdown
              control={control}
              options={occupationList}
              name={"profile.occupation"}
              isRequired
              label={"Occupation"}
              errors={errors}
            />
          </div>
          {[1, 2].includes(vertical_id) && (
            <div>
              <Dropdown
                control={control}
                options={getAllCategoriesServices?.data?.data?.data || []}
                name={"profile.agent_category_id"}
                labelKey="name"
                valueKey="id"
                label={"Agent Category"}
                errors={errors}
              />
            </div>
          )}
          {watch("profile.occupation")?.label === "Others" && (
            <div>
              <Input
                inputRef={register("profile.other_occupation")}
                name={"profile.other_occupation"}
                isRequired
                label={"Enter Other Occupation (Specify)"}
                placeholder="Enter Other Occupation"
                errors={errors}
                maxLength={100}
                onChange={(e) => (e.target.value = allowOnlyName(e))}
              />
            </div>
          )}
        </div>
      </div>
      {/* FLS Mapping */}
      {id && [1, 2].includes(vertical_id) && (
        <div
          data-id={!!id}
          className="group ring ring-gray-200 p-4 rounded-lg shadow-md"
        >
          <div className="flex items-center justify-between  border-b border-lightGray pb-2">
            <h2 className="col-span-4 text-lg font-semibold text-gray-600  ">
              Monitoring Manager
            </h2>
          </div>

          <div
            data-id={!!id}
            className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 data-[id=true]:grid-cols-2 mt-4"
          >
            <Dropdown
              label="FLS Code"
              className="notranslate"
              control={control}
              options={reportingFlsCodeMap || []}
              inputRef={register("profile.fls_code")}
              placeholder="Select fls code"
              // isRequiredan
              errors={errors}
              name="profile.fls_code"
              onChange={(val) => {
                setFlsId(val?.value);
                setValue("profile.rm_mapping", null);
              }}
              isDisabled={![1, 2].includes(vertical_id)}
            />
            <Dropdown
              label="FLS Name"
              className="notranslate"
              control={control}
              options={reportingFlsNameMap || []}
              inputRef={register("profile.rm_mapping")}
              placeholder="Select Relation Manager"
              isRequired
              errors={errors}
              name="profile.rm_mapping"
              onChange={(val) => {
                setFlsId(val?.value);
                setValue("profile.fls_code", null);
              }}
              isDisabled={![1, 2].includes(vertical_id)}
            />
            <Input
              label="Master Channel Code"
              inputRef={register("profile.master_channel_code")}
              placeholder="master channel"
              isRequired
              errors={errors}
              maxLength={100}
              name="profile.master_channel_code"
              disabled={true}
            />
            {/* New field */}
            <Input
              label="Master Channel Name"
              inputRef={register("profile.master_name")}
              placeholder="master channel name"
              isRequired
              errors={errors}
              maxLength={100}
              name="profile.master_name"
              disabled={true}
            />
            {/* New field */}
            <Input
              label="Branch Code"
              inputRef={register("profile.branch_code")}
              placeholder="branch code"
              isRequired
              errors={errors}
              maxLength={100}
              name="profile.branch_code"
              disabled={true}
              onChange={(e) =>
                (e.target.value = e.target.value.replace(
                  /[^A-Za-z0-9\s,.-/]|(\s{2,})/g,
                  ""
                ))
              }
            />
            <Input
              label="Branch Name"
              inputRef={register("profile.branch_name")}
              placeholder="branch name"
              isRequired
              errors={errors}
              maxLength={100}
              name="profile.branch_name"
              disabled={true}
              onChange={(e) =>
                (e.target.value = e.target.value.replace(
                  /[^A-Za-z0-9\s,.-/]|(\s{2,})/g,
                  ""
                ))
              }
            />
          </div>
        </div>
      )}

      <div
        data-id={!!id}
        className="group ring ring-gray-200 p-4 rounded-lg shadow-md"
      >
        <div className="flex items-center justify-between  border-b border-lightGray pb-2">
          <h2 className="col-span-4 text-lg font-semibold text-gray-600  ">
            Permanent Address Details
          </h2>
        </div>

        <div
          data-id={!!id}
          className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 data-[id=true]:grid-cols-2 mt-4"
        >
          <div className="col-span-2">
            <Input
              label="Address Line 1"
              inputRef={register("profile.address")}
              placeholder="House No, Building Name"
              isRequired
              errors={errors}
              name="profile.address"
              maxLength={100}
              onChange={(e) =>
                (e.target.value = e.target.value.replace(
                  /[^A-Za-z0-9\s,.-/]|(\s{2,})/g,
                  ""
                ))
              }
            />
          </div>

          <div className="col-span-2">
            <Input
              label="Address Line 2"
              inputRef={register("profile.street")}
              placeholder="Street, Landmark, Area"
              isRequired
              errors={errors}
              maxLength={100}
              name="profile.street"
              onChange={(e) =>
                (e.target.value = e.target.value.replace(
                  /[^A-Za-z0-9\s,.-/]|(\s{2,})/g,
                  ""
                ))
              }
            />
          </div>
          <div>
            <Input
              label="Pincode"
              inputRef={register("profile.pincode")}
              placeholder="Enter Pincode"
              isRequired
              errors={errors}
              name="profile.pincode"
              type="tel"
              maxLength={6}
              onChange={(e) => {
                allowOnlyNumbers(e);
                const value = e.target.value;
                if (!value || value.length < 6) {
                  setValue("profile.city", "");
                  setValue("profile.state", "");
                }
              }}
            />
          </div>
          <div>
            <Input
              label="City"
              inputRef={register("profile.city")}
              placeholder="Enter City"
              isRequired
              errors={errors}
              readOnly
              name="profile.city"
            />
          </div>

          <div>
            <Input
              label="State"
              inputRef={register("profile.state")}
              placeholder="Enter State"
              isRequired
              errors={errors}
              readOnly
              name="profile.state"
            />
          </div>

          <div>
            <RadioButton
              name="profile.is_communication_address_same"
              label="Is Communication Address Same?"
              options={[
                { label: "Yes", value: "Y" },
                { label: "No", value: "N" },
              ]}
              control={control}
              onChange={handleAdressChange}
            />
          </div>
        </div>
      </div>
      {isCommunicationAddressSame === "N" ? (
        <div
          data-id={!!id}
          className={`group  ring  p-4 rounded-lg shadow-md ${
            errors.profile?.root?.type === "communication-address-validation"
              ? "ring-error"
              : "ring-gray-200"
          }`}
        >
          <div className="flex items-center justify-between  border-b border-lightGray pb-2">
            <h2 className="col-span-4 text-lg font-semibold text-gray-600  ">
              Communication Address Details
            </h2>
          </div>

          <div
            data-id={!!id}
            className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 data-[id=true]:grid-cols-2 mt-4"
          >
            <>
              <div className="col-span-2 ">
                <Input
                  label="Address Line 1"
                  inputRef={register("profile.communicational_address")}
                  placeholder="House No, Building Name"
                  isRequired
                  errors={errors}
                  maxLength={100}
                  name="profile.communicational_address"
                  onChange={(e) =>
                    (e.target.value = e.target.value.replace(
                      /[^A-Za-z0-9\s,.-/]|(\s{2,})/g,
                      ""
                    ))
                  }
                />
              </div>
              <div className="col-span-2">
                <Input
                  label="Address Line 2"
                  inputRef={register("profile.communication_street")}
                  placeholder="Street, Landmark, Area"
                  isRequired
                  errors={errors}
                  maxLength={100}
                  name="profile.communication_street"
                  onChange={(e) =>
                    (e.target.value = e.target.value.replace(
                      /[^A-Za-z0-9\s,.-/]|(\s{2,})/g,
                      ""
                    ))
                  }
                />
              </div>
              <div>
                <Input
                  label="Pincode"
                  inputRef={register("profile.communication_pincode")}
                  placeholder="Enter Pincode"
                  isRequired
                  errors={errors}
                  name="profile.communication_pincode"
                  type="tel"
                  maxLength={6}
                  onChange={(e) => {
                    const value = e.target.value;
                    verifyValidPincode(e);

                    if (!value || value.length < 6) {
                      setValue("profile.communication_city", "");
                      setValue("profile.communication_state", "");
                    }
                  }}
                />
              </div>
              <div>
                <Input
                  label="City"
                  inputRef={register("profile.communication_city")}
                  placeholder="Enter City"
                  isRequired
                  errors={errors}
                  readOnly
                  name="profile.communication_city"
                />
              </div>
              <div>
                <Input
                  label="State"
                  inputRef={register("profile.communication_state")}
                  placeholder="Enter State"
                  isRequired
                  errors={errors}
                  readOnly
                  name="profile.communication_state"
                />
              </div>
            </>
          </div>
          {errors.profile?.root?.type ===
            "communication-address-validation" && (
            <div className="text-error text-xs mt-2">
              {errors.profile.root.message}
            </div>
          )}
        </div>
      ) : null}
    </>
  );
};
export default ProfileBasicDetails;
