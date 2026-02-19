import {
  allowOnlyNumbers,
  formatAadhaarInput,
} from "@/HelperFunctions/helperFunctions";
import useCheckBlacklistAgent from "@/hooks/useCheckBlacklistAgent";
import { Button, FilePicker, Input, RadioButton } from "@/UI-Components";
import ButtonWrapper from "@/UI-Components/ButtonWrapper";
import UiDrawerWrapper from "@/UI-Components/Drawer/UiDrawer";
import { yupResolver } from "@hookform/resolvers/yup";
import { Verified } from "lucide-react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router";
import { useCkycData } from "../../service";
import { ckycValidationSchema } from "./ckyc.schema";

const CkycDrawer = ({
  isDrawerOpen,
  toggleIsDrawerOpen,
  setIsPanConfirmationModal,
}) => {
  const {
    control,
    watch,
    register,
    handleSubmit,
    formState,
    clearErrors,
    setValue,
  } = useForm({
    resolver: yupResolver(ckycValidationSchema),
    reValidateMode: "onChange",
  });

  const { mutate: ckycMutate, isPending: ckycMutationPending } =
    useCkycData(toggleIsDrawerOpen);
  const id = useParams().id;
  const panNumber = watch("no_ckyc_pan_number") ?? watch("pan_number");
  const {
    service: { getCheckBlackListAgentServices },
    states: { SetBlackListSearchQuery },
  } = useCheckBlacklistAgent({panNumber:panNumber});

  const ckyc = watch("ckyc");

  const onSubmit = (data) => {
    const panNumberValue =
      data.ckyc === "Y" ? data?.pan_number : data?.no_ckyc_pan_number;

    const isBlackListAgent =
      getCheckBlackListAgentServices?.data?.data?.is_blacklisted;

    if (isBlackListAgent && panNumberValue) {
      setIsPanConfirmationModal(true);
      toggleIsDrawerOpen(false);
      return;
    }
    const payload = {
      id,
      ckyc: data.ckyc,
      ...(data.ckyc === "Y" && {
        ...(data.ckyc_number && { ckyc_number: data.ckyc_number }),
        ...(data.aadhar_number && {
          aadhar_number: data.aadhar_number?.replace(/-/g, ""),
        }),
        ...(data.pan_number && { pan_number: data.pan_number }),
      }),
      ...(data.ckyc === "N" && {
        aadhar_number: data.no_ckyc_aadhar_number.replace(/-/g, ""),
        aadhar_card_front: Array.isArray(data.aadhar_card_front)
          ? data.aadhar_card_front[0]
          : data.aadhar_card_front,
        aadhar_card_back: Array.isArray(data.aadhar_card_back)
          ? data.aadhar_card_back[0]
          : data.aadhar_card_back,
        pan_number: data.no_ckyc_pan_number,
        pan_card_photo: Array.isArray(data.pan_card_photo)
          ? data.pan_card_photo[0]
          : data.pan_card_photo,
      }),
    };

    ckycMutate(payload);
  };

  return (
    <UiDrawerWrapper
      HeadSection={
        <section className="flex items-center gap-3 text-sm bg-extraLightGray p-4 rounded-t-xl">
          <div className="flex items-center gap-2">
            <Verified className="size-5 text-blue-600" />
            <p className="text-lg font-semibold text-gray-800">
              CKYC Verification
            </p>
          </div>
        </section>
      }
      isOpen={isDrawerOpen}
      containerClass="w-[50%]"
      onClose={() => {}}>
      <div className="flex w-full gap-1 h-full overflow-y-auto">
        <div className="w-full flex flex-col p-4 gap-4">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4">
            <RadioButton
              name="ckyc"
              label="Do you have CKYC?"
              options={[
                { label: "Yes", value: "Y" },
                { label: "No", value: "N" },
              ]}
              control={control}
              error={formState.errors?.ckyc?.message}
              onChange={(option) => {
                if (option.value === "Y") {
                  clearErrors([
                    "no_ckyc_aadhar_number",
                    "no_ckyc_pan_number",
                    "pan_card_photo",
                    "aadhar_card_front",
                    "aadhar_card_back",
                  ]);
                } else if (option.value === "N") {
                  clearErrors(["ckyc_number", "aadhar_number", "pan_number"]);
                }
              }}
            />

            {ckyc === "Y" && (
              <>
                <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded">
                  Please provide at least one of the following:
                </div>

                <Input
                  name="ckyc_number"
                  inputRef={register("ckyc_number")}
                  control={control}
                  label={"CKYC Number (Optional)"}
                  placeholder={`Enter CKYC Number`}
                  maxLength={14}
                  onChange={(e) => {
                    allowOnlyNumbers(e);
                  }}
                  errors={formState.errors}
                />

                <div className="text-center text-gray-500 text-sm">OR</div>

                <Input
                  name="aadhar_number"
                  inputRef={register("aadhar_number")}
                  control={control}
                  label={"Aadhaar Number (Optional)"}
                  placeholder={`Enter Aadhaar number`}
                  maxLength={14}
                  onChange={(e) => {
                    formatAadhaarInput(e);
                  }}
                  errors={formState.errors}
                />

                <div className="text-center text-gray-500 text-sm">OR</div>

                <Input
                  name="pan_number"
                  inputRef={register("pan_number")}
                  control={control}
                  label={"PAN Number (Optional)"}
                  placeholder={`Enter PAN number`}
                  maxLength={10}
                  onChange={(e) => {
                    
                    e.target.value = e.target.value.toUpperCase();
                    e.target.value = e.target.value.replace(
                      /[^a-zA-Z0-9]/g,
                      ""
                    );
                    SetBlackListSearchQuery(e.target.value.toUpperCase());
                  }}
                  errors={formState.errors}
                />
              </>
            )}

            {ckyc === "N" && (
              <>
                <Input
                  name="no_ckyc_aadhar_number"
                  inputRef={register("no_ckyc_aadhar_number")}
                  control={control}
                  label={"Aadhaar Number"}
                  isRequired={true}
                  placeholder={`Enter Aadhaar number`}
                  maxLength={14}
                  onChange={(e) => {
                    formatAadhaarInput(e);
                  }}
                  errors={formState.errors}
                />

                <FilePicker
                  isTransparent={true}
                  clearErrors={clearErrors}
                  name={"aadhar_card_front"}
                  label={"Aadhaar Card Front"}
                  control={control}
                  watch={watch}
                  setValue={setValue}
                  isRequired={true}
                  isMulti={false}
                  helperText={
                    "Please upload required documents (Maximum 10 MB) Accepted formats: .png, .jpg, .jpeg, .pdf"
                  }
                  acceptedFiles={{
                    "image/png": [".png"],
                    "image/jpg": [".jpg"],
                    "image/jpeg": [".jpeg"],
                    "application/pdf": [".pdf"],
                  }}
                  errors={formState.errors}
                />

                <FilePicker
                  isTransparent={true}
                  clearErrors={clearErrors}
                  name={"aadhar_card_back"}
                  label={"Aadhaar Card Back"}
                  control={control}
                  watch={watch}
                  isRequired={true}
                  setValue={setValue}
                  isMulti={false}
                  helperText={
                    "Please upload required documents (Maximum 10 MB) Accepted formats: .png, .jpg, .jpeg, .pdf"
                  }
                  acceptedFiles={{
                    "image/png": [".png"],
                    "image/jpg": [".jpg"],
                    "image/jpeg": [".jpeg"],
                    "application/pdf": [".pdf"],
                  }}
                  errors={formState.errors}
                />

                <Input
                  name="no_ckyc_pan_number"
                  inputRef={register("no_ckyc_pan_number")}
                  control={control}
                  label={"PAN Number"}
                  isRequired={true}
                  placeholder={`Enter PAN number`}
                  maxLength={10}
                  onChange={(e) => {
                    e.target.value = e.target.value.toUpperCase();
                    e.target.value = e.target.value.replace(
                      /[^a-zA-Z0-9]/g,
                      ""
                    );
                  }}
                  errors={formState.errors}
                />

                <FilePicker
                  isTransparent={true}
                  clearErrors={clearErrors}
                  name={"pan_card_photo"}
                  label={"PAN Card Photo"}
                  control={control}
                  watch={watch}
                  isRequired={true}
                  setValue={setValue}
                  isMulti={false}
                  helperText={
                    "Please upload required documents (Maximum 10 MB) Accepted formats: .png, .jpg, .jpeg, .pdf"
                  }
                  acceptedFiles={{
                    "image/png": [".png"],
                    "image/jpg": [".jpg"],
                    "image/jpeg": [".jpeg"],
                    "application/pdf": [".pdf"],
                  }}
                  errors={formState.errors}
                />
              </>
            )}

            <ButtonWrapper style={{ marginTop: "20px" }}>
              <Button
                width={"auto"}
                type={"submit"}
                variant={"contained"}
                isLoading={ckycMutationPending}>
                Submit
              </Button>
            </ButtonWrapper>
          </form>
        </div>
      </div>
    </UiDrawerWrapper>
  );
};

export default CkycDrawer;
