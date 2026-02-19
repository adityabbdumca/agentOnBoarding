import * as yup from "yup";
import {
  allowOnlyName,
  verifyValidEmail,
  verifyValidNumbers,
} from "@/HelperFunctions/helperFunctions";

export const genderOptions = [
  { label: "Male", value: "Male" },
  { label: "Female", value: "Female" },
  { label: "Other", value: "Other" },
];

export const qualificationOptions = [
  { label: "HSC", value: "HSC" },
  { label: "SSC", value: "SSC" },
  { label: "Diploma", value: "Diploma" },
  { label: "Graduation", value: "Graduation" },
  { label: "Post Graduation", value: "Post Graduation" },
];

export const userFields = (branchList, vertical) => [
  {
    name: "first_name",
    label: "First Name",
    type: "input",
    onChange: allowOnlyName,
    placeholder: "First Name",
    isRequired: true,
  },
  {
    name: "middle_name",
    label: "Middle Name",
    onChange: allowOnlyName,
    type: "input",
    isRequired: false,
    placeholder: "Middle Name",
  },
  {
    name: "last_name",
    label: "Last Name",
    onChange: allowOnlyName,
    type: "input",
    placeholder: "Last Name",
    isRequired: true,
  },
  {
    name: "email_id",
    label: "Email",
    onChange: (e) => {
      const sanitizedValue = verifyValidEmail(e);
      e.target.value = sanitizedValue;
    },
    type: "input",
    placeholder: "Email",
    isRequired: true,
  },
  {
    name: "mobile",
    label: "Mobile",
    type: "input",

    placeholder: "Mobile",
    onChange: (e) => {
      const sanitizedValue = verifyValidNumbers(e);
      e.target.value = sanitizedValue;
    },
    isRequired: true,
    maxlength: 10,
  },
  {
    name: "employee_code",
    label: "LG Code",
    type: "input",
    placeholder: "LG Code",
    isRequired: true,
    maxlength: 10,
  },
  {
    name: "branch_mapping",
    label: `${
      vertical?.value === 2
        ? "Hub"
        : vertical?.value === 3
        ? "Unit"
        : vertical?.label
    } Mapping`,
    type: "dropdown",
    isRequired: true,
    placeholder: "Mapping",
    options: branchList,
  },
];

export const userSchema = yup.object().shape({
  first_name: yup.string().required("First Name is required"),
  last_name: yup.string().required("Last Name is required"),
  employee_code: yup.string().required("Employee Code is required"),
  email_id: yup.string().required("Email is required"),
  mobile: yup.string().required("Mobile is required"),
  channel: yup.mixed().required("Channel is required"),
  list_name: yup.mixed().required("List Name is required"),
  role_id: yup.mixed().required("Role is required"),
  vertical: yup.mixed().required("Vertical is required"),
  branch_mapping: yup.mixed().required("Branch Mapping is required"),
});
