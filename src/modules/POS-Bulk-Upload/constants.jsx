import moment from "moment";
import { allowOnlyName } from "@/HelperFunctions/helperFunctions";

export const commonFields = (
  type,
  RmData,
  watch,
  brokerOrBankList,
  branchList
) => [
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
    format: "DD/MM/YYYY",
    name: "dob",
    type: "date",
    // isRequired: true,
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
    label: `${type.toUpperCase()} Code`,
    name: `${type}_code`,
    type: "input",
    isRequired: true,
  },

  ...(location.pathname.includes("create-user")
    ? []
    : [
        {
          label: "Select Channel",
          name: "channel",
          type: "dropdown",
          placeholder: "",
          isRequired: true,
          options: [
            { value: 5, label: "Bank" },
            { value: 6, label: "Broker" },
          ],
        },
        {
          label: `${watch?.channel?.label} Name`,
          name: "list_name",
          placeholder: "",
          dependsOn: "channel",
          dependsOnValue: [5, 6],
          type: "dropdown",
          options: brokerOrBankList,
        },
      ]),
  {
    name: "branch_mapping",
    type: "dropdown",
    placeholder: "Mapping",
    label: `${
      watch.vertical?.value === 2
        ? "Hub"
        : watch.vertical?.value === 3
        ? "Unit"
        : watch.vertical?.label || ""
    } Mapping`,
    isRequired: true,
    options: branchList,
  },
];
