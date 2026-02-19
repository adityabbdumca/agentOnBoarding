import {
  allowOnlyName,
  handleIndianPhoneInput,
  verifyValidEmail,
} from "@/HelperFunctions/helperFunctions";
import Button from "@/UI-Components/Button";
import { StyledModal } from "@/UI-Components/GlobalStyles";
import Input from "@/UI-Components/Input";
import GlobalModal from "@/UI-Components/Modals/GlobalModal";
import { blockedDomains } from "@/constants/blockDomain";
import { yupResolver } from "@hookform/resolvers/yup";
import { ExternalLinkIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import OTPModal from "../Login/OTPModal";
import { useRegisterUserLead } from "../Login/service";

const CreateLead = ({ setOpenModal }) => {
  const signupSchema = yup.object().shape({
    name: yup.string().required("Full name is required"),
    mobile: yup
      .string()
      .required("Mobile number is required")
      .matches(
        /^(\+91[\-\s]?)?[0]?(91)?[6789]\d{9}$/,
        "Mobile number is not valid"
      ),
    email: yup
      .string()
      .required("E-Mail Id is required")
      .max(100, "E-Mail must be less than 100 characters")
      .matches(
        /^[a-zA-Z0-9._-]+@[a-zA-Z.-]+\.(com|in|net)$/,
        "Invalid email format. Please check and try again."
      )
      .test(
        "not-blocked-domain",
        "Emails from this domain are not allowed",
        (value) => {
          if (!value) return true;
          return !blockedDomains.some((domain) =>
            value.toLowerCase().endsWith("@" + domain)
          );
        }
      ),
  });
  const [open, setOpen] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
    setFocus,
    setValue,
  } = useForm({
    mode: "onChange",
    reValidateMode: "onChange",
    resolver: yupResolver(signupSchema),
  });
  const { mutate: registerMutate, isPending } = useRegisterUserLead(
    setOpenModal,
    setOpen
  );

  const onSubmit = (data) => {
    registerMutate({
      name: data.name,
      mobile: data.mobile,
      email: data.email,
      password: data.password,
      re_enter_password: data.re_enter_password,
    });
  };

  return (
    <StyledModal>
      <form onSubmit={handleSubmit(onSubmit)} className=" space-y-4">
        <div className="space-y-2">
          <Input
            inputRef={register("name")}
            name={"name"}
            label={"Full Name"}
            isRequired
            errors={errors}
            maxLength={100}
            control={control}
            placeholder={"Enter your full name"}
            onChange={(e) => {
              allowOnlyName(e);
            }}
          />
        </div>
        <div className="space-y-2">
          <Input
            inputRef={register("mobile")}
            name={"mobile"}
            label={"Mobile Number"}
            isRequired
            errors={errors}
            control={control}
            type={"tel"}
            placeholder={"Enter your mobile number"}
            maxLength={10}
            onChange={(e) => {
              handleIndianPhoneInput(e);
            }}
          />
        </div>
        <div className="space-y-2">
          <Input
            inputRef={register("email")}
            name={"email"}
            label={"Email"}
            errors={errors}
            isRequired
            maxLength={100}
            control={control}
            placeholder={"Enter your email"}
            onChange={(e) => {
              verifyValidEmail(e);
            }}
          />
        </div>
        <div className="">
          <a
            href="https://agencyportal.irdai.gov.in:8080/PublicAccess/LookUpPAN.aspx"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-primary text-xs gap-1 font-semibold hover:underline hover:text-primary/80 transition-colors">
            
            PAN check for knowing association with any other insurer
            <ExternalLinkIcon size={14} />
          </a>
        </div>
        <div className="flex justify-end">
          <Button type="submit" width="auto" isLoading={isPending}>
            Submit
          </Button>
        </div>
      </form>
      <GlobalModal
        open={open}
        onClose={() => {
          setValue("otp_code", []);
          setOpen(false);
        }}
        title={"Verify OTP"}
        width={400}>
        <OTPModal
          register={register}
          watch={watch}
          registerMutate={registerMutate}
          setOpenModal={setOpenModal}
          setFocus={setFocus}
          isLoading={isPending}
        />
      </GlobalModal>
    </StyledModal>
  );
};

export default CreateLead;
