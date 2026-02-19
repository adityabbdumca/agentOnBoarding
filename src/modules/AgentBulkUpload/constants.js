import * as Yup from "yup";
import { fileValidation } from "../OnboardingDetails/Schema";
import {
  allowOnlyName,
  allowOnlyNumbers,
  allowPanCard,
  alphanumeric,
  handleAddressChange,
  handleIFSCInput,
  handleIndianPhoneInput,
  verifyValidEmail,
  verifyValidNumbers,
} from "@/HelperFunctions/helperFunctions";
import moment from "moment";
export const constantsAgent = (reportingUserList) => [
  {
    name: "agent_type",
    placeholder: "Agent Type",
    type: "dropdown",
    options: [
      {
        label: "New Agent",
        value: 1,
      },
      {
        label: "Existing",
        value: 2,
      },
      {
        label: "Composite",
        value: 3,
      },
      {
        label: "Transfer",
        value: 4,
      },
    ],
    isRequired: true,
  },
  {
    name: "insurance_type",
    placeholder: "Insurance Type",
    type: "dropdown",
    options: [
      {
        label: "Health Insurance",
        value: 1,
      },
      {
        label: "General Insurance",
        value: 2,
      },
      {
        label: "Life Insurance",
        value: 3,
      },
    ],
    isRequired: true,
    dependsOn: [{ field: "agent_type", values: [2] }],
  },
  {
    name: "general_insurance",
    placeholder: "General Insurance Company Name",
    type: "input",
    isRequired: true,
    dependsOn: [{ field: "agent_type", values: [3] }],
  },
  {
    name: "life_insurance",
    placeholder: "Life Insurance Name",
    type: "input",
    isRequired: true,
    dependsOn: [{ field: "agent_type", values: [3] }],
  },
  {
    name: "health_insurance",
    placeholder: "Health Insurance Name",
    type: "input",
    isRequired: true,
    dependsOn: [{ field: "agent_type", values: [4] }],
  },
  {
    name: "noc_date",
    type: "date",
    placeholder: "NOC Date",
    isRequired: true,
    dependsOn: [{ field: "agent_type", values: [4] }],
  },
  {
    name: "first_name",
    placeholder: "First Name",
    maxLength: 100,
    type: "input",
    isRequired: true,
    onChange: (e) => (e.target.value = allowOnlyName(e)),
  },
  {
    name: "middle_name",
    placeholder: "Middle Name",
    maxLength: 100,
    type: "input",
    onChange: (e) => (e.target.value = allowOnlyName(e)),
    // isRequired: true,
  },
  {
    name: "last_name",
    placeholder: "Last Name",
    maxLength: 100,
    type: "input",
    isRequired: true,
    onChange: (e) => (e.target.value = allowOnlyName(e)),
  },
  {
    name: "email",
    placeholder: "Email",
    type: "input",
    isRequired: true,
    maxLength: 100,
    onChange: (e) => verifyValidEmail(e),
  },
  {
    name: "mobile",
    placeholder: "Mobile",
    type: "input",
    isRequired: true,
    maxLength: 10,
    onChange: (e) => (e.target.value = verifyValidNumbers(e)),
  },
  {
    name: "address",
    placeholder: "Address",
    type: "input",
    isRequired: true,
    maxLength: 100,
   onChange:(e)=>handleAddressChange(e)
  },
  {
    name: "dob",
    placeholder: "DOB",
    type: "date",
    isRequired: true,
    maxDate: moment().subtract(18, "years").format("YYYY-MM-DD"),
  },
  {
    name: "account_type",
    placeholder: "Account Type",
    type: "dropdown",
    options: [
      {
        label: "Savings",
        value: "Savings",
      },
      {
        label: "Current",
        value: "Current",
      },
    ],
    isRequired: true,
  },
  {
    name: "name_as_in_bank_account",
    placeholder: "Name As In Bank Account",
    type: "input",
    maxLength: 100,
    isRequired: true,
    onChange: (e) => allowOnlyName(e),
  },
  //   { "name": "bank_name", "placeholder": "Bank Name", "type": "input" },
  {
    name: "account_number",
    placeholder: "Account Number",
    type: "input",
    isRequired: true,
    onChange: (e) => allowOnlyNumbers(e),
    maxLength: 20,
  },
  {
    name: "ifsc_code",
    placeholder: "IFSC Code",
    type: "input",
    isRequired: true,
    onChange: (e) => handleIFSCInput(e),
    maxLength: 11,
  },
  {
    name: "relation_with_applicant",
    placeholder: "Relation With Applicant",
    type: "dropdown",
    options: [
      {
        label: "Spouse",
        value: "Spouse",
      },
      {
        label: "Father",
        value: "Father",
      },
      {
        label: "Mother",
        value: "Mother",
      },
      {
        label: "Brother",
        value: "Brother",
      },
      {
        label: "Sister",
        value: "Sister",
      },
      {
        label: "Son",
        value: "Son",
      },
      {
        label: "Daughter",
        value: "Daughter",
      },
    ],
    isRequired: true,
  },
  {
    name: "nominee_name",
    placeholder: "Nominee Name",
    onChange: (e) => (e.target.value = allowOnlyName(e)),
    type: "input",
    maxLength: 100,
    isRequired: true,
  },
  {
    name: "contact_number",
    placeholder: "Contact Number",
    type: "input",
    isRequired: true,
    onChange: (e) => {
      allowOnlyNumbers(e);
      handleIndianPhoneInput(e);
    },
    maxLength: 10,
  },
  {
    name: "nominee_share",
    placeholder: "Nominee Share",
    type: "input",
    isRequired: true,
    maxLength:3,
    onChange: (e) =>
      (e.target.value = e.target.value > 100 ? 100 : e.target.value),
  },
  {
    name: "nominee_age",
    placeholder: "Age",
    type: "input",
    maxLength:3,
    isRequired: true,
    onChange: (e) =>{
      (e.target.value = e.target.value > 100 ? 100 : e.target.value),
    allowOnlyNumbers(e)}
    
  },
  {
    name: "pincode",
    placeholder: "Pincode",
    type: "input",
    isRequired: true,
    maxLength: 6,
    onChange:(e)=> allowOnlyNumbers(e)
  },
  {
    name: "state",
    placeholder: "State",
    type: "input",
    readOnly: true,
    isRequired: true,
  },
  {
    name: "city",
    placeholder: "City",
    type: "input",
    readOnly: true,
    isRequired: true,
  },
  {
    name: "address_line1",
    placeholder: "Address Line 1",
    type: "input",
    isRequired: true,
     maxLength:100,
    onChange:(e)=>handleAddressChange(e)
    
  },
  {
    name: "address_line2",
    placeholder: "Address Line 2",
    type: "input",
     maxLength:100,
    onChange:(e)=>handleAddressChange(e)
  },
  {
    name: "address_line3",
    placeholder: "Address Line 3",
    type: "input",
    maxLength:100,
   onChange:(e)=>handleAddressChange(e)
  },
  {
    name: "highest_education_qualification",
    placeholder: "Highest Education Qualification",
    type: "input",
    isRequired: true,
    maxLength: 100,
    onChange: (e) => allowOnlyName(e),
  },
  {
    name: "pan_card_no",
    placeholder: "Pan Card No",
    type: "input",
    isRequired: true,
    onChange: (e) =>{ allowPanCard(e), alphanumeric(e)},
    maxLength: 10,
  },
  {
    name: "aadhar_card_no",
    placeholder: "Aadhar Card No",
    type: "input",
    isRequired: true,
    maxLength: 14,
    onChange: (e) => {
      const value = e.target.value.replace(/\D/g, "");
      let formattedValue = "";

      if (value.length <= 4) {
        formattedValue = value;
      } else if (value.length <= 8) {
        formattedValue = value.slice(0, 4) + "-" + value.slice(4);
      } else {
        formattedValue =
          value.slice(0, 4) +
          "-" +
          value.slice(4, 8) +
          "-" +
          value.slice(8, 12);
      }

      e.target.value = formattedValue;
    },
  },
  {
    name: "license_status",
    placeholder: "License Status",
    type: "dropdown",
    options: [
      {
        label: "Yes",
        value: "Yes",
      },
      {
        label: "No",
        value: "No",
      },
    ],
    dependsOn: [{ field: "agent_type", values: [2, 3, 4] }],
    isRequired: true,
  },
  {
    name: "ckyc_number",
    placeholder: "CKYC Number",
    type: "input",
    maxLength: 14,
    onChange:(e)=>allowOnlyNumbers(e),
    isRequired: true,
  },
  // {
  //   name: "exam_selected_date",
  //   placeholder: "Exam Selected Date",
  //   type: "date",
  //   isRequired: true,
  // },
  // {
  //   name: "exam_center_state",
  //   placeholder: "Exam Center State",
  //   type: "input",
  //   isRequired: true,
  // },
  // {
  //   name: "exam_center",
  //   placeholder: "Exam Center",
  //   type: "input",
  //   isRequired: true,
  // },
  // {
  //   name: "center_address",
  //   placeholder: "Center Address",
  //   type: "input",
  //   isRequired: true,
  // },
  {
    name: "profile_photo",
    type: "file",
    placeholder: "Profile Photo",
    isRequired: true,
  },
  {
    name: "aadhar_card",
    type: "file",
    placeholder: "Aadhar Card",
    isRequired: true,
  },
  {
    name: "pan_card",
    type: "file",
    placeholder: "PAN Card",
    isRequired: true,
  },
  {
    name: "education_document",
    type: "file",
    placeholder: "Education Document",
    isRequired: true,
  },
  {
    name: "license_copy",
    type: "file",
    placeholder: "License Copy",
    isRequired: true,
  },
  {
    name: "cancelled_cheque",
    type: "file",
    placeholder: "Cancelled Cheque / Bank Statement",
    isRequired: true,
  },
  {
    name: "commission_statement",
    type: "file",
    placeholder: "Commission Statement",
    isRequired: true,
    dependsOn: [
      { field: "agent_type", values: [] },
      { field: "license_status", values: ["Yes"] },
    ],
  },
  {
    name: "appointment_letter",
    type: "file",
    placeholder: "Appointment Letter",
    isRequired: true,
    dependsOn: [
      { field: "agent_type", values: [] },
      { field: "license_status", values: ["Yes"] },
    ],
  },
  {
    name: "noc_letter",
    type: "file",
    placeholder: "NOC Letter",
    isRequired: true,
    dependsOn: [{ field: "agent_type", values: [4] }],
  },
  {
    name: "fls_mapping",
    placeholder: "FLS Mapping",
    type: "dropdown",
    isRequired: true,
    options: reportingUserList,
  },
];

export const Schema = Yup.object().shape({
  agent_type: Yup.mixed().required("Agent Type is required"),
  general_insurance: Yup.string().test(
    "general_insurance",
    "General Insurance is required",
    (value, parent) => {
      if (parent.parent?.agent_type?.value === 3) {
        return value || parent.parent?.life_insurance;
      } else {
        return true;
      }
    }
  ),
  life_insurance: Yup.string().test(
    "life_insurance",
    "Life Insurance is required",
    (value, parent) => {
      if (parent.parent?.agent_type?.value === 3) {
        return parent.parent?.general_insurance || value;
      } else {
        return true;
      }
    }
  ),
  insurance_type: Yup.mixed().test(
    "agent_type",
    "Insurance Type is required",
    (value, parent) => {
      if (parent.parent?.agent_type?.value === 2) {
        return value;
      } else {
        return true;
      }
    }
  ),
  health_insurance: Yup.string().test(
    "health_insurance",
    "Health Insurance is required",
    (value, parent) => {
      if (parent.parent?.agent_type?.value === 4) {
        return value;
      } else {
        return true;
      }
    }
  ),
  noc_date: Yup.mixed().test(
    "noc_date",
    "NOC Date is required",
    (value, parent) => {
      if (parent.parent?.agent_type?.value === 4) {
        return value;
      } else {
        return true;
      }
    }
  ),
  first_name: Yup.string().required("First Name is required"),
  last_name: Yup.string().required("Last Name is required"),
  email: Yup.string().required("Email is required"),
  mobile: Yup.string().required("Mobile is required"),
  address: Yup.string().required("Address is required"),
  dob: Yup.date()
    .required("DOB is required")
    .transform((value, originalValue) => {
      if (!originalValue) return null;
      const date = new Date(originalValue);
      return isNaN(date) ? null : date;
    })
    .max(new Date(), "DOB cannot be in the future")
    .test("age", "Age must be at least 18", (value) => {
      if (!value) return false;
      const today = new Date();
      const age = today.getFullYear() - value.getFullYear();
      const m = today.getMonth() - value.getMonth();
      return age > 18 || (age === 18 && m >= 0);
    }),
  account_type: Yup.mixed().required("Account Type is required"),
  name_as_in_bank_account: Yup.string()
    .required("Name As In Bank Account is required")
    .min(3, "Name as in Bank Account must be at least 3 characters")
    .max(100, "Name as in Bank Account must be less than 100 characters"),
  // bank_name: Yup.string().required("Bank Name is required"),
  // branch_name: Yup.string().required("Branch Name is required"),
  ifsc_code: Yup.string().required("IFSC Code is required"),
  account_number: Yup.string().required("Account Number is required"),
  relation_with_applicant: Yup.mixed().required(
    "Relation With Applicant is required"
  ),
  nominee_name: Yup.string().required("Nominee Name is required"),
  contact_number: Yup.string()
    .required("Contact Number is required")
    .matches(/^\d{10}$/, "Contact Numrequber must be a 10-digit number"),
  nominee_share: Yup.number()
    .required("Nominee Share % is required")
    .min(0, "Nominee Share % cannot be less than 0")
    .max(100, "Nominee Share % cannot be greater than 100")
    .typeError("Nominee Share % must be a number"),
  nominee_age: Yup.number()
    .required("Age is required")
    .min(18, "Age must be at least 18")
    .max(100, "Age must be less than or equal to 100")
    .typeError("Age must be a valid number"),
  pincode: Yup.string()
    .required("Pin Code is required")
    .matches(/^\d{6}$/, "Pin Code must be a 6-digit number"),
  address_line1: Yup.string().required("Address Line 1 is required"),
  state: Yup.string().required("State is required"),
  city: Yup.string().required("City is required"),
  highest_education_qualification: Yup.string()
    .required("Highest Education Qualification is required")
    .matches(/^[a-zA-Z0-9 ]*$/, "Invalid input"),

  pan_card_no: Yup.string().required("Pan Card No is required"),
  aadhar_card_no: Yup.string()
    .matches(/^\d{4}-\d{4}-\d{4}$/, "Enter valid Aadhaar number")
    .required("Aadhar Card No is required"),
  license_status: Yup.mixed().test(
    "license_status",
    "License Status is required",
    function (value) {
      return this.parent.agent_type?.value !== 1
        ? fileValidation.isValidSync(value)
        : true;
    }
  ),
  ckyc_number: Yup.string()
    .required("CKYC Number is required")
    .matches(/^[a-zA-Z0-9 ]*$/, "Invalid input"),
  profile_photo: fileValidation,
  aadhar_card: fileValidation,
  pan_card: fileValidation,
  education_document: fileValidation,
  license_copy: fileValidation,
  cancelled_cheque: fileValidation,
  commission_statement: Yup.mixed().test(
    "commission_statement",
    "Commission Statement is required",
    function (value) {
      return this.parent.license_status?.value === "Yes"
        ? fileValidation.isValidSync(value)
        : true;
    }
  ),
  appointment_letter: Yup.mixed().test(
    "commission_statement",
    "Commission Statement is required",
    function (value) {
      return this.parent.license_status?.value === "Yes"
        ? fileValidation.isValidSync(value)
        : true;
    }
  ),
  noc_letter: Yup.mixed().test(
    "commission_statement",
    "Commission Statement is required",
    function (value) {
      return this.parent.agent_type?.value === 4
        ? fileValidation.isValidSync(value)
        : true;
    }
  ),
  fls_mapping: Yup.mixed().required("FLS Mapping is required"),
});
