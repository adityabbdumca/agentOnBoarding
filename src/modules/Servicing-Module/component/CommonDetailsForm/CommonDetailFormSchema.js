import { blockedDomains } from "@/constants/blockDomain";
import { DateTime } from "luxon";
import * as Yup from "yup";

const getBaseSchema = (isRequiredDocuments, isRequiredDocType, isGender) => ({
  agent_id: Yup.mixed().required("Agent is required"),
  agent_name: Yup.string().required("Agent Name is required"),
  current_value: Yup.string().required("Current Value is required"),
  ...(isGender && {
    current_salutation: Yup.string().required("current salutation is required"),
  }),
  comments: Yup.string().max(500, "Comments cannot exceed 500 characters"),
  supporting_documents: isRequiredDocuments
    ? Yup.mixed()
        .nullable()
        .test("file", "Supporting Documents is required", (value) => {
          return (Array.isArray(value) || value) && value.length > 0;
        })
    : Yup.mixed().notRequired(),
  document_type: isRequiredDocType
    ? Yup.mixed().required("Document Type is required")
    : Yup.mixed().notRequired(),
});

const panValidator = () => ({
  new_pan_number: Yup.string()
    .required("PAN No is required")
    .matches(
      /^[A-Z]{3}P[A-Z][0-9]{4}[A-Z]{1}$/i,
      "Invalid PAN format. Please enter a valid 10-character PAN."
    )
    .test(
      "not-same-as-current",
      "New PAN cannot be same as current PAN",
      function (value) {
        const { current_value } = this.parent;
        return !value || !current_value || value !== current_value;
      }
    ),
});

const mobileValidator = () => ({
  new_mobile_number: Yup.string()
    .required("New Mobile Number is required")
    .matches(/^[6-9]\d{9}$/, "Mobile must be 10 digits and start with 6-9")
    .test(
      "not-same-as-current",
      "New Mobile cannot be same as current Mobile",
      function (value) {
        const { current_value } = this.parent;
        return !value || !current_value || value !== current_value;
      }
    ),
});

const emailValidator = () => ({
  new_email: Yup.string()
    .required("New Email is required")
    .email("Must be a valid email")
    .test(
      "not-blocked-domain",
      "Emails from this domain are not allowed",
      (value) => {
        if (!value) return true;
        return !blockedDomains.some((domain) =>
          value.toLowerCase().endsWith("@" + domain)
        );
      }
    )
    .test(
      "not-same-as-current",
      "New Email cannot be same as current Email",
      function (value) {
        const { current_value } = this.parent;
        return (
          !value ||
          !current_value ||
          value.toLowerCase() !== current_value.toLowerCase()
        );
      }
    ),
});

const bankValidator = () => ({
  new_bank_account_number: Yup.string()
    .required("New Bank Account Number is required")
    .matches(/^\d+$/, "Only numbers allowed")
    .min(8, "Must be at least 8 digits")
    .max(20, "Cannot exceed 20 digits")
    .test(
      "not-same-as-current",
      "New Bank Account cannot be same as current Account",
      function (value) {
        const { current_value } = this.parent;
        return !value || !current_value || value !== current_value;
      }
    ),
});

const genderValidator = () => ({
  new_gender: Yup.object({
    label: Yup.string().required("Gender is required"),
    value: Yup.string().required("Gender is required"),
  })
    .nullable()
    .test("has-value", "Gender is required", (v) => !!(v && v.value))
    .test(
      "not-same-as-current",
      "New Gender cannot be same as current Gender",
      function (value) {
        const { current_value } = this.parent;
        return !value?.value || !current_value || value.value !== current_value;
      }
    ),

  new_salutation: Yup.object({
    label: Yup.string(),
    value: Yup.string(),
  })
    .nullable()
    .test("has-value", "Salutation is required", (v) => !!(v && v.value)),
});

const dobValidator = () => ({
  new_dob: Yup.string()
    .required("New Date of Birth is required")
    .test(
      "not-same-as-current",
      "New DOB cannot be same as current DOB",
      function (value) {
        const { current_value } = this.parent;
        if (!value || !current_value) return true;

        const newDate = DateTime.fromFormat(value, "dd-MM-yyyy");
        const currentDate = DateTime.fromFormat(current_value, "dd-MM-yyyy");

        if (!newDate.isValid || !currentDate.isValid) return true;

        return newDate.toISODate() !== currentDate.toISODate();
      }
    ),
});

export const commonDetailsFormSchema = (validationType, fieldName) => {
  const isRequiredDocuments = ["pan", "gender", "dob"].includes(validationType);
  const isRequiredDocType = ["gender", "dob"].includes(validationType);
  const isGender = validationType === "gender";
  const baseSchema = getBaseSchema(
    isRequiredDocuments,
    isRequiredDocType,
    isGender
  );

  let specificValidator = {};

  switch (validationType) {
    case "pan":
      specificValidator = panValidator();
      break;
    case "mobile":
      specificValidator = mobileValidator();
      break;
    case "email":
      specificValidator = emailValidator();
      break;
    case "bank":
      specificValidator = bankValidator();
      break;
    case "gender":
      specificValidator = genderValidator();
      break;
    case "dob":
      specificValidator = dobValidator();
      break;
    default:
      specificValidator = {
        new_value: Yup.string()
          .required(`New ${fieldName} is required`)
          .min(1, `${fieldName} cannot be empty`)
          .test(
            "not-same-as-current",
            `New ${fieldName} cannot be same as current ${fieldName}`,
            function (value) {
              const { current_value } = this.parent;
              return !value || !current_value || value !== current_value;
            }
          ),
      };
      break;
  }

  return Yup.object({
    ...baseSchema,
    ...specificValidator,
  });
};
