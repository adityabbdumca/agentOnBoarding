import moment from "moment";
import { allowOnlyName } from "@/HelperFunctions/helperFunctions";

export const spBulkUploadColumns = (RmData) => [
  {
    label: "First Name",
    name: "first_name",
    type: "input",
    isRequired: true,
    onChange: (e) => (e.target.value = allowOnlyName(e)),
  },
  {
    label: "Middle Name",
    name: "middle_name",
    type: "input",
    isRequired: true,
  },
  {
    label: "Last Name",
    name: "last_name",
    type: "input",
    isRequired: true,
    onChange: (e) => (e.target.value = allowOnlyName(e)),
  },
  {
    label: "DOB",
    name: "dob",
    type: "date",

    maxDate: moment().subtract(18, "years").format("YYYY-MM-DD"),
  },
  {
    label: "Mobile No",
    name: "mobile_no",
    type: "input",
    isRequired: true,
    maxLength: 10,
    onChange: (e) => (e.target.value = e.target.value.replace(/[^0-9]/g, "")),
  },

  {
    label: "E-Mail Id",
    name: "email_id",
    type: "input",
    isRequired: true,
  },

  {
    label: "Address",
    name: "address",
    type: "input",
  },
  {
    label: "Pincode",
    name: "pincode",
    type: "input",
  },
  {
    label: "City",
    name: "city",
    type: "input",
  },
  {
    label: "State",
    name: "state",
    type: "input",
  },
  {
    label: "Name As In Bank Account",
    name: "name_as_in_bank_account",
    type: "input",
  },
  {
    label: "Account Number",
    name: "account_number",
    type: "input",
  },
  {
    label: "IFSC Code",
    name: "ifsc_code",
    type: "input",

    onChange: (e) => (e.target.value = e.target.value.toUpperCase()),
    maxLength: 11,
  },
  {
    label: "PAN Card",
    name: "pan_card",
    type: "input",
    isRequired: true,
  },
  {
    label: "Aadhaar Card",
    name: "aadhaar_card",
    type: "input",
    isRequired: true,
  },
  {
    label: "SP Code",
    name: "sp_code",
    type: "input",
    isRequired: true,
  },
  {
    label: "Mapped RM",
    name: "mapped_rm",
    type: "dropdown",
    isRequired: true,
    options: RmData,
  },
];
