import { dynamicAlphaNumeric } from "@/HelperFunctions/helperFunctions";
import { addressProofOptions } from "@/modules/Servicing-Module/component/AddressDetailForm/utils";
import Button from "@/UI-Components/Button";
import Dropdown from "@/UI-Components/Dropdown";
import Input from "@/UI-Components/Input";
import GlobalModal from "@/UI-Components/Modals/GlobalModal";
import UiDateInput from "@/UI-Components/UiDateInput";
import { DateTime } from "luxon";
import { useEffect, useState } from "react";
import { Controller } from "react-hook-form";
import {
  HiArrowNarrowLeft,
  HiArrowNarrowRight,
  HiOutlineRefresh,
} from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";
import { decrementAgent } from "../agent.slice";
import { useDocuments, useFileUpload } from "../service";
import RaiseDiscrepancy from "./RaiseDiscrepancy";
import RenderDocument from "./RenderDocument";
import { toast } from "react-toastify";

const Documents = ({
  register,
  watch,
  handleSubmit,
  setValue,
  control,
  errors,
  id,
  clearErrors,
  setError,
  showSubmitButton,
}) => {
  const { mutate, isPending } = useDocuments();
  const { fileUploadMutations } = useFileUpload();
  const { agent } = useSelector((state) => state.agent);
  const dispatch = useDispatch();
  const [modalData, setModalData] = useState({
    key: "",
    open: false,
    text: "",
  });

  const isPaymentDone = watch("payment_status");

  const onSubmit = (data) => {
    mutate({
      ...data.documents,
      id,
      // aadhar_card_no: data.documents.aadhar_card_no?.split("-").join(""),
      profile_photo: Array.isArray(data.documents.profile_photo)
        ? data.documents.profile_photo[0]
        : data.documents.profile_photo,
      education_document: Array.isArray(data.documents.education_document)
        ? data.documents.education_document[0]
        : data.documents.education_document,
      pan_card_photo: Array.isArray(data.documents.pan_card_photo)
        ? data.documents.pan_card_photo[0]
        : data.documents.pan_card_photo,
      aadhar_card_front: Array.isArray(data.documents.aadhar_card_front)
        ? data.documents.aadhar_card_front[0]
        : data.documents.aadhar_card_front,
      aadhar_card_back: Array.isArray(data.documents.aadhar_card_back)
        ? data.documents.aadhar_card_back[0]
        : data.documents.aadhar_card_back,
      cheque_copy: Array.isArray(data.documents.cheque_copy)
        ? data.documents.cheque_copy[0]
        : data.documents.cheque_copy,
      license_path: Array.isArray(data.documents.license_path)
        ? data.documents.license_path[0]
        : data.documents.license_path,
      appointment_path: Array.isArray(data.documents.appointment_path)
        ? data.documents.appointment_path[0]
        : data.documents.appointment_path,
      commision_path: Array.isArray(data.documents.commision_path)
        ? data.documents.commision_path[0]
        : data.documents.commision_path,
      noc_path: Array.isArray(data.documents.noc_path)
        ? data.documents.noc_path[0]
        : data.documents.noc_path,
      herediatary_certificate: Array.isArray(
        data.documents.herediatary_certificate
      )
        ? data.documents.herediatary_certificate[0]
        : data.documents.herediatary_certificate,
      signature: Array.isArray(data.documents.signature)
        ? data.documents.signature[0]
        : data.documents.signature,
      doc1A: Array.isArray(data.documents.doc1A)
        ? data.documents.doc1A[0]
        : data.documents.doc1A,
      doc1B: Array.isArray(data.documents.doc1B)
        ? data.documents.doc1B[0]
        : data.documents.doc1B,
      doc1C: Array.isArray(data.documents.doc1C)
        ? data.documents.doc1C[0]
        : data.documents.doc1C,
      license_status: data.documents.license_status?.value,
      bank_account: data.documents.bank_account?.value,
      address_proof: data.documents.address_proof?.value,
      address_copy: Array.isArray(data.documents.address_copy)
        ? data.documents.address_copy[0]
        : data.documents.address_copy,
      highest_education_qualification:
        data.documents.highest_education_qualification?.value,
      other_document_path: Array.isArray(data.documents.other_document_path)
        ? data.documents.other_document_path[0]
        : data.documents.other_document_path,
      other_document: data?.documents?.other_document,
      ...(data.user_type === "transfer" &&
        data.documents.noc_date && {
          noc_date: DateTime.fromFormat(
            data.documents.noc_date,
            "dd-mm-yyyy"
          ).toFormat("yyyy-mm-dd"),
        }),
    });
  };

  const isAdmin = +localStorage.getItem("vertical_id");
  const licenseStatus =
    watch("documents.license_status")?.label === "Yes" ? true : false;
  const educationValue = watch("profile.highest_qualification");

  useEffect(() => {
    if (educationValue) {
      setValue("documents.highest_education_qualification", educationValue);
    }
  }, [educationValue, setValue]);

  const handleFileUpload = async (files, documentId) => {
    const file = Array.isArray(files) ? files[0] : files;
    if (!file) {
      toast.error("No file selected");
      return;
    }

    try {
      const payload = {
        id: id,
        document_id: documentId,
        file: file,
        upload_type: "journey",
      };
      await fileUploadMutations.mutateAsync(payload);
    } catch (err) {
      toast.error(err?.message || "Upload failed");
    }
  };

  return (
    <>
      {/* <OCRForm
        setValue={setValue}
        watch={watch}
        register={register}
        errors={errors}
        control={control}
        clearErrors={clearErrors}
        setError={setError}
      /> */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <span className="text-xs md:text-sm italic font-semibold">
          Note: Please upload all the required documents (Maximum 10 MB). File
          Format: (PDF, IMAGE)
          <span className="text-red-600">*</span>
        </span>

        {/* <div
          data-id={!!id}
          className="grid grid-cols-1 md:grid-cols-1 data-[id=true]:grid-cols-2 gap-4 mt-4"
        > */}
        <div
          data-id={[1, 2]?.includes(isAdmin)}
          className="grid grid-cols-1 md:grid-cols-2 data-[id=true]:grid-cols-1 gap-4 mt-4"
        >
          <RenderDocument
            docType={"documents.profile_photo"}
            title={"Profile Photo"}
            clearErrors={clearErrors}
            setError={setError}
            control={control}
            errors={errors}
            setValue={setValue}
            watch={watch}
            inputField={null}
            tooltip={
              "Recent passport-size photo (color, plain background).\nClear face visibility. \nFormat: JPG/PNG. Max size 10 MB."
            }
            helperText="Please upload required documents (Maximum 10 MB) Accepted formats: .jpg , .png, .jpeg"
            acceptedFiles={{
              "image/jpg": [".jpg"],
              "image/png": [".png"],
              "image/jpeg": [".jpeg"],
            }}
            onChange={(file) => {
              if (!isPaymentDone) handleFileUpload(file, 1);
            }}
            isLoading={
              fileUploadMutations.variables?.document_id === 1 &&
              fileUploadMutations?.isPending
            }
          />
          <RenderDocument
            docType={"documents.pan_card_photo"}
            title={"PAN Card"}
            clearErrors={clearErrors}
            setError={setError}
            control={control}
            errors={errors}
            setValue={setValue}
            watch={watch}
            tooltip={
              "Mandatory for all agent types.\n Name must match application details.\n Format: JPG/PDF. Max size 10 MB."
            }
            helperText="Please upload required documents (Maximum 10 MB) Accepted formats: .png, .jpg, .jpeg, .pdf"
            acceptedFiles={{
              "image/png": [".png"],
              "image/jpg": [".jpg"],
              "image/jpeg": [".jpeg"],
              "application/pdf": [".pdf"],
            }}
            onChange={(file) => {
              if (!isPaymentDone) handleFileUpload(file, 3);
            }}
            isLoading={
              fileUploadMutations.variables?.document_id === 3 &&
              fileUploadMutations?.isPending
            }
          />
          <RenderDocument
            docType={"documents.aadhar_card_front"}
            title={"Aadhar Card Front"}
            clearErrors={clearErrors}
            setError={setError}
            control={control}
            errors={errors}
            setValue={setValue}
            watch={watch}
            tooltip={
              "Must be clear and readable.\nFormat: JPG/PDF. Max size 10 MB."
            }
            helperText="Please upload required documents (Maximum 10 MB) Accepted formats: .png, .jpg, .jpeg, .pdf"
            acceptedFiles={{
              "image/png": [".png"],
              "image/jpg": [".jpg"],
              "image/jpeg": [".jpeg"],
              "application/pdf": [".pdf"],
            }}
            onChange={(file) => {
              if (!isPaymentDone) handleFileUpload(file, 4);
            }}
            isLoading={
              fileUploadMutations.variables?.document_id === 4 &&
              fileUploadMutations?.isPending
            }
          />
          <RenderDocument
            docType={"documents.aadhar_card_back"}
            title={"Aadhar Card Back"}
            tooltip={
              "Must be clear and readable.\nFormat: JPG/PDF. Max size 10 MB."
            }
            clearErrors={clearErrors}
            setError={setError}
            control={control}
            errors={errors}
            setValue={setValue}
            watch={watch}
            inputField={null}
            helperText="Please upload required documents (Maximum 10 MB) Accepted formats: .png, .jpg, .jpeg, .pdf"
            acceptedFiles={{
              "image/png": [".png"],
              "image/jpg": [".jpg"],
              "image/jpeg": [".jpeg"],
              "application/pdf": [".pdf"],
            }}
            onChange={(file) => {
              if (!isPaymentDone) handleFileUpload(file, 5);
            }}
            isLoading={
              fileUploadMutations.variables?.document_id === 5 &&
              fileUploadMutations?.isPending
            }
          />
          <RenderDocument
            docType={"documents.education_document"}
            title={"Education Document"}
            clearErrors={clearErrors}
            setError={setError}
            control={control}
            errors={errors}
            setValue={setValue}
            tooltip={
              "Minimum 10th pass for Fresh Agents.\n Clear scan showing board/university, year, and pass status.\nFormat: JPG/PDF. Max size 10 MB."
            }
            watch={watch}
            inputField={
              <Dropdown
                control={control}
                errors={errors}
                isDisabled={true}
                name={"documents.highest_education_qualification"}
                options={[
                  {
                    value: "10th",
                    label: "10th",
                  },
                  {
                    value: "12th",
                    label: "12th",
                  },
                  {
                    value: "Diploma",
                    label: "Diploma",
                  },
                  {
                    value: "Graduation",
                    label: "Graduation",
                  },
                  {
                    value: "Post Graduation",
                    label: "Post Graduation",
                  },
                  {
                    value: "Other",
                    label: "Other",
                  },
                ]}
                setValue={setValue}
                watch={watch}
                placeholder={"Select Highest Education Qualification"}
              />
            }
            helperText="Please upload required documents (Maximum 10 MB) Accepted formats: .png, .jpg, .jpeg, .pdf"
            acceptedFiles={{
              "image/png": [".png"],
              "image/jpg": [".jpg"],
              "image/jpeg": [".jpeg"],
              "application/pdf": [".pdf"],
            }}
            onChange={(file) => {
              if (!isPaymentDone) handleFileUpload(file, 2);
            }}
            isLoading={
              fileUploadMutations.variables?.document_id === 2 &&
              fileUploadMutations?.isPending
            }
          />
          <RenderDocument
            docType={"documents.signature"}
            title={"Signature"}
            clearErrors={clearErrors}
            setError={setError}
            control={control}
            errors={errors}
            setValue={setValue}
            watch={watch}
            inputField={null}
            tooltip={
              "Candidate’s own signature (black/blue ink on white paper).\nShould match signed forms and bank records. \nFormat: JPG/PNG. Max size 10 MB."
            }
            helperText="Please upload required documents (Maximum 10 MB) Accepted formats: .png, .jpg, .jpeg, .pdf"
            acceptedFiles={{
              "image/png": [".png"],
              "image/jpg": [".jpg"],
              "image/jpeg": [".jpeg"],
              "application/pdf": [".pdf"],
            }}
            onChange={(file) => {
              if (!isPaymentDone) handleFileUpload(file, 12);
            }}
            isLoading={
              fileUploadMutations.variables?.document_id === 12 &&
              fileUploadMutations?.isPending
            }
          />
          <RenderDocument
            docType={"documents.cheque_copy"}
            title={"Bank Account"}
            clearErrors={clearErrors}
            setError={setError}
            control={control}
            errors={errors}
            helperText={
              "Upload bank statement from the last 6 months or cancelled cheque"
            }
            setValue={setValue}
            watch={watch}
            tooltip={
              "Must show account holder’s name, account no., IFSC.\n Account name must match applicant’s name. \nFormat: JPG/PDF. Max size 10 MB."
            }
            inputField={
              <Dropdown
                control={control}
                // label={"Bank Account"}
                name={"documents.bank_account"}
                isRequired={true}
                errors={errors}
                options={[
                  {
                    label: "Cancelled Cheque",
                    value: "Cancelled Cheque",
                  },
                  {
                    label: "Account Statement",
                    value: "Account Statement",
                  },
                  {
                    label: "Bank PassBook",
                    value: "Bank PassBook",
                  },
                ]}
              />
            }
            acceptedFiles={{
              "image/png": [".png"],
              "image/jpg": [".jpg"],
              "image/jpeg": [".jpeg"],
              "application/pdf": [".pdf"],
            }}
            onChange={(file) => {
              if (!isPaymentDone) handleFileUpload(file, 6);
            }}
            isLoading={
              fileUploadMutations.variables?.document_id === 6 &&
              fileUploadMutations?.isPending
            }
          />
          {/* <RenderDocument
            docType={"documents.address_copy"}
            title={"Address Proof"}
            clearErrors={clearErrors}
            setError={setError}
            control={control}
            errors={errors}
            isRequired={false}
            helperText={
              "Please upload required documents (Maximum 10 MB) Accepted formats: .png, .jpg, .jpeg, .pdf"
            }
            setValue={setValue}
            watch={watch}
            tooltip={
              "Accepted documents: Aadhaar Card, Passport, Voter ID (EPIC Card). Upload file (Max 10 MB) in .jpg, .jpeg, .png, or .pdf format"
            }
            inputField={
              <Dropdown
                control={control}
                name={"documents.address_proof"}
                errors={errors}
                options={addressProofOptions}
              />
            }
            acceptedFiles={{
              "image/png": [".png"],
              "image/jpg": [".jpg"],
              "image/jpeg": [".jpeg"],
              "application/pdf": [".pdf"],
            }}
            onChange={(file) => {
              if (!isPaymentDone) handleFileUpload(file, 1);
            }}
            isLoading={
              fileUploadMutations.variables?.document_id === 1 &&
              fileUploadMutations?.isPending
            }
          /> */}
          {!["fresh", "posp"].includes(watch("user_type")) && (
            <>
              <RenderDocument
                docType={"documents.license_path"}
                title={"License"}
                clearErrors={clearErrors}
                setError={setError}
                control={control}
                errors={errors}
                setValue={setValue}
                watch={watch}
                helperText={"Attach IRDAI portal screenshot"}
                showFilePicker={licenseStatus}
                tooltip={
                  "Valid IRDAI license (Life / General).\n Must clearly show license number, validity, and authority.\n Format: PDF/JPG. Max size 10 MB."
                }
                inputField={
                  <Dropdown
                    control={control}
                    // label={"Licence Copy Available?"}
                    name={"documents.license_status"}
                    isRequired={true}
                    errors={errors}
                    options={[
                      {
                        label: "Yes",
                        value: 1,
                      },
                      {
                        label: "No",
                        value: 0,
                      },
                    ]}
                    style={{ width: "150px" }}
                  />
                }
                acceptedFiles={{
                  "image/png": [".png"],
                  "image/jpg": [".jpg"],
                  "image/jpeg": [".jpeg"],
                  "application/pdf": [".pdf"],
                }}
                onChange={(file) => {
                  if (!isPaymentDone) handleFileUpload(file, 10);
                }}
                isLoading={
                  fileUploadMutations.variables?.document_id === 10 &&
                  fileUploadMutations?.isPending
                }
              />

              {watch("documents.license_status")?.value === 0 && (
                <RenderDocument
                  docType={"documents.commision_path"}
                  title={"Select Commission/Appointment Letter"}
                  clearErrors={clearErrors}
                  setError={setError}
                  control={control}
                  errors={errors}
                  setValue={setValue}
                  watch={watch}
                  tooltip={
                    "Latest commission letter from insurer.\n Used to validate ongoing association.\n Format: PDF only. Max size 10 MB "
                  }
                  inputField={
                    <Dropdown
                      control={control}
                      name={"documents.select_docs"}
                      isRequired={true}
                      errors={errors}
                      options={[
                        {
                          label: "Commission Letter",
                          value: "Commission Letter",
                        },
                        {
                          label: "Appointment Letter",
                          value: "Appointment Letter",
                        },
                      ]}
                    />
                  }
                  helperText="Please upload required documents (Maximum 10 MB) Accepted formats: .png, .jpg, .jpeg, .pdf"
                  acceptedFiles={{
                    "image/png": [".png"],
                    "image/jpg": [".jpg"],
                    "image/jpeg": [".jpeg"],
                    "application/pdf": [".pdf"],
                  }}
                />
              )}
              {watch("user_type") === "transfer" && (
                <>
                  <RenderDocument
                    docType={"documents.noc_path"}
                    title={"NOC"}
                    clearErrors={clearErrors}
                    setError={setError}
                    control={control}
                    errors={errors}
                    setValue={setValue}
                    watch={watch}
                    tooltip={
                      "NOC issued by previous insurer within 90 days.\n Must clearly mention release of agent. \n Format: PDF only. Max size 10 MB."
                    }
                    inputField={
                      <Controller
                        control={control}
                        name={"documents.noc_date"}
                        defaultValue=""
                        render={({ field, fieldState }) => (
                          <UiDateInput
                            value={field.value}
                            onChange={field.onChange}
                            isRequired={true}
                            errors={fieldState?.error?.message}
                            disabled={true}
                          />
                        )}
                      />
                    }
                    helperText="Please upload required documents (Maximum 10 MB) Accepted formats: .png, .jpg, .jpeg, .pdf"
                    acceptedFiles={{
                      "image/png": [".png"],
                      "image/jpg": [".jpg"],
                      "image/jpeg": [".jpeg"],
                      "application/pdf": [".pdf"],
                    }}
                    onChange={(file) => {
                      if (!isPaymentDone) handleFileUpload(file, 11);
                    }}
                    isLoading={
                      fileUploadMutations.variables?.document_id === 11 &&
                      fileUploadMutations?.isPending
                    }
                  />
                  {/* <RenderDocument
                    docType={"documents.doc1C"}
                    title={"Address Proof"}
                    clearErrors={clearErrors}
                    setError={setError}
                    control={control}
                    errors={errors}
                    setValue={setValue}
                    watch={watch}
                    inputField={null}
                  /> */}
                </>
              )}
            </>
          )}
          <RenderDocument
            docType={"documents.other_document_path"}
            title={"Other Document"}
            clearErrors={clearErrors}
            setError={setError}
            control={control}
            errors={errors}
            isRequired={false}
            helperText={
              "Please upload required documents (Maximum 10 MB) Accepted formats: .png, .jpg, .jpeg, .pdf"
            }
            setValue={setValue}
            watch={watch}
            tooltip={
              "Accepted documents: Aadhaar Card, Passport, Voter ID (EPIC Card). Upload file (Max 10 MB) in .jpg, .jpeg, .png, or .pdf format"
            }
            inputField={
              <div className="w-52">
                <Input
                  name="documents.other_document"
                  inputRef={register("documents.other_document")}
                  placeholder="Enter document name"
                  onChange={(e) => {
                    dynamicAlphaNumeric(e, ["_", "-"], 50);
                  }}
                />
              </div>
            }
            acceptedFiles={{
              "image/png": [".png"],
              "image/jpg": [".jpg"],
              "image/jpeg": [".jpeg"],
              "application/pdf": [".pdf"],
            }}
            onChange={(file) => {
              if (!isPaymentDone) handleFileUpload(file, 20);
            }}
            isLoading={
              fileUploadMutations.variables?.document_id === 20 &&
              fileUploadMutations?.isPending
            }
          />
          {/* {watch("user_type") === "new" && (
            <RenderDocument
              docType={"documents.doc1A"}
              title={"Document 1A"}
              clearErrors={clearErrors}
              setError={setError}
              control={control}
              errors={errors}
              setValue={setValue}
              watch={watch}
              isMobile={true}
              inputField={
                <div className="flex items-center justify-end gap-2">
                  <button
                    type="button"
                    className="text-sm text-blue-500 border border-gray-400 rounded-md px-2 py-1 cursor-pointer"
                    onClick={(e) => {
                      e.preventDefault();
                      window.open(data, "_blank");
                    }}
                  >
                    <HiDownload />
                  </button>
                </div>
              }
            />
          )} */}
          {/* {watch("user_type") === "composite" && (
            <RenderDocument
              docType={"documents.doc1B"}
              title={"Document 1B"}
              clearErrors={clearErrors}
              setError={setError}
              control={control}
              errors={errors}
              setValue={setValue}
              watch={watch}
              inputField={
                <div className="flex items-center justify-end gap-2">
                  <button
                    type="button"
                    className="text-sm text-blue-500 border border-gray-400 rounded-md px-2 py-1 cursor-pointer"
                    onClick={(e) => {
                      e.preventDefault();
                      window.open(data, "_blank");
                    }}
                  >
                    <HiDownload />
                  </button>
                </div>
              }
            />
          )} */}
        </div>

        <div className="mt-4 flex justify-between gap-2">
          {agent > 0 ? (
            <Button
              startIcon={<HiArrowNarrowLeft size={15} />}
              variant={"outlined"}
              width={"auto"}
              onClick={() => dispatch(decrementAgent())}
            >
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
              }
            >
              {watch("approval_access") ? "Next" : "Submit"}
            </Button>
          )}
        </div>
      </form>
      <GlobalModal
        title={"Raise Discrepancy"}
        open={modalData.open}
        onClose={() => setModalData(false)}
        width={500}
      >
        <RaiseDiscrepancy
          modalData={modalData}
          setModalData={setModalData}
          id={id}
        />
      </GlobalModal>
    </>
  );
};

export default Documents;
