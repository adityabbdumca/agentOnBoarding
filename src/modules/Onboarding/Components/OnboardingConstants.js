import * as Yup from "yup";
import { fileValidation } from "../../OnboardingDetails/Schema";
import { allowOnlyName } from "@/HelperFunctions/helperFunctions";
import { EXCEL_URL } from "@/config/env";

const onBoardType = new URLSearchParams(window.location.search).get("type");

export const constantsBroker = (types, BankDocument) => [
  {
    title: `${onBoardType || ""} Details`,
    dependsOn: "type",
    default: true,
    dependsOnValue: ["Broker", "Bank"],
    children: [
      {
        name: "type",
        label: "Type",
        placeholder: "Type",
        type: "dropdown",
        isRequired: true,
        options: [
          { label: "Broker", value: "Broker" },
          { label: "IMF", value: "IMF" },
          { label: "Corporate Agent", value: "Corporate Agent" },
          { label: "Bank", value: "Bank" },
          { label: "Web Aggregators", value: "Web Aggregators" },
        ],
        disabled: !!onBoardType,
      },
      {
        name: "name",
        label: `${onBoardType || types || ""} Name`,
        placeholder: `${onBoardType || types || ""} Name`,
        type: "input",
        onChange: allowOnlyName,
        isRequired: true,
      },
      {
        name: "license_start_date",
        label: "License Start Date",
        placeholder: "License Start Date",
        type: "date",
        isRequired: true,
        format: "DD/MM/YYYY",
      },
      {
        name: "license_end_date",
        label: "License End Date",
        placeholder: "License End Date",
        type: "date",
        readOnly: true,
        isRequired: true,
        format: "DD/MM/YYYY",
      },
      {
        name: "code",
        label: `${onBoardType || types || ""} Code`,
        placeholder: `${onBoardType || types || ""} Code`,
        dependsOn: "type",
        dependsOnValue: ["Broker", "Bank"],
        type: "input",
        isRequired: true,
      },
      {
        name: "telemarketing_check",
        label: "Have a Telemarketing License?",
        placeholder: " ",
        type: "dropdown",
        options: [
          { label: "Yes", value: "Yes" },
          { label: "No", value: "No" },
        ],
        isRequired: true,
      },
    ],
  },
  {
    title: "Telemarketing Details",
    dependsOn: "telemarketing_check",
    dependsOnValue: ["Yes"],
    children: [
      {
        name: "telemarketing_code",
        label: "Telemarketing Code",
        placeholder: "Telemarketing Code",
        type: "input",
        isRequired: true,
      },
      {
        name: "telemarketing_document",
        label: "Telemarketing Document",
        placeholder: "Telemarketing Document",
        type: "file",
        acceptedFiles: {
          "application/pdf": [".pdf"],
        },
        description: "Supported formats: PDF",
        isRequired: true,
      },
      {
        name: "list_of_av",
        label: "List of AV",
        acceptedFiles: {
          "application/vnd.ms-excel": [".xls", ".xlsx"],
        },
        description: "Supported formats: XLS, XLSX",
        type: "file",
        demoExcel: `${
          EXCEL_URL
        }storage/sample_excels/AV_on_Broker_Onboarding.xlsx`,
        isRequired: true,
      },
      {
        name: "license_copy_of_av",
        label: "License Copy of AV in zip",
        placeholder: "License Copy of AV in zip",
        acceptedFiles: {
          "application/zip": [".zip"],
        },
        type: "file",
        isRequired: true,
      },
    ],
  },

  {
    title: "Bank Details",
    children: [
      {
        name: "account_number",
        label: "Bank Account Number",
        placeholder: "Bank Account Number",
        type: "input",
        isRequired: true,
      },
      {
        name: "ifsc_code",
        label: "Bank IFSC Code",
        onChange: (e) => (e.target.value = e.target.value.toUpperCase()),
        placeholder: "Bank IFSC Code",
        type: "input",
        isRequired: true,
      },
      {
        name: "bank_name",
        label: "Bank Name",
        onChange: (e) => (e.target.value = e.target.value.toUpperCase()),
        disabled: true,
        placeholder: "Bank Name",
        type: "input",
        isRequired: true,
      },
      {
        name: "branch_name",
        disabled: true,
        label: "Bank Branch Name",
        placeholder: "Bank Branch Name",
        type: "input",
        isRequired: true,
      },
      {
        name: "bank_city",
        label: "Bank City",
        disabled: true,
        placeholder: "Bank City",
        type: "input",
        isRequired: true,
      },
      {
        name: "bank_document",
        label: "Bank Document",
        // dependsOn: "type",
        // dependsOnValue: ["Bank"],
        placeholder: "Bank Document",
        type: "dropdown",
        options: [
          { label: "NEFT Mandate", value: "NEFT Mandate" },
          { label: "Cancelled Cheque", value: "Cancelled Cheque" },
        ],
        isRequired: true,
      },
      {
        name: "bank_document_file",
        label: `Upload ${BankDocument} `,
        description: "Supported formats: PDF",
        acceptedFiles: {
          "application/pdf": [".pdf"],
        },
        dependsOn: "bank_document",
        dependsOnValue: ["NEFT Mandate", "Cancelled Cheque"],
        placeholder: "Bank document File",
        type: "file",
        isRequired: true,
      },
    ],
  },
  {
    title: "Designated Officer Details",
    children: [
      {
        name: "designated_officer_name",
        label: "Designated / Principal Officer Name",
        placeholder: " Name",
        type: "input",
        onChange: allowOnlyName,
        isRequired: true,
        description: "Designated / Principal Officer Name",
      },
      {
        name: "email",
        label: "Email ID",
        placeholder: "Email ID",
        type: "input",
        isRequired: true,
      },
      {
        name: "mobile_number",
        label: "Mobile Number",
        maxLength: 10,
        placeholder: "Mobile Number",
        type: "input",
        isRequired: true,
      },
      {
        name: "designation",
        label: "Designation",
        placeholder: "Designation",
        type: "input",
        isRequired: true,
      },
      {
        name: "employee_code",
        label: "Employee Code",
        placeholder: "Employee Code",
        type: "input",
        isRequired: true,
      },
    ],
  },
  {
    title: "Required Documents",
    children: [
      {
        name: "license_no",
        label: "License No.",
        placeholder: "License No.",
        type: "input",
        isRequired: true,
      },
      {
        name: "pan_card_no",
        onChange: (e) => (e.target.value = e.target.value.toUpperCase()),
        label: "PAN Card No.",
        placeholder: "PAN Card No.",
        type: "input",
        isRequired: true,
        helperText: "Eg: AAAAA0000A",
      },
      {
        name: "gst_number",
        label: "GST Number",
        placeholder: "GST Number",
        type: "input",
        isRequired: true,
      },
      {
        name: "agreement_copy_check",
        label: "Have a Online Website License?",
        placeholder: "",
        dependsOn: "type",
        dependsOnValue: ["Broker"],
        options: [
          { label: "Yes", value: "Yes" },
          { label: "No", value: "No" },
        ],
        type: "dropdown",
        isRequired: false,
      },
      {
        name: "website_code",
        label: "Website Code",
        placeholder: "Website Code",
        type: "input",
        dependsOn: "agreement_copy_check",
        dependsOnValue: ["Yes"],
        isRequired: true,
      },
      {
        name: "website_url",
        label: "Website URL",
        placeholder: "Website URL",
        type: "input",
        dependsOn: "agreement_copy_check",
        dependsOnValue: ["Yes"],
        isRequired: false,
      },
      {
        name: "agreement_copy",
        label: "Agreement Copy",
        description: "Supported formats: PDF",
        placeholder: "Agreement Copy",
        type: "file",
        acceptedFiles: {
          "application/pdf": [".pdf"],
        },
        dependsOn: "agreement_copy_check",
        dependsOnValue: ["Yes"],
        isRequired: true,
      },
      {
        name: "digital_bank",
        label: "Have a Digital License",
        dependsOn: "type",
        dependsOnValue: ["Bank"],
        options: [
          { label: "Yes", value: "Yes" },
          { label: "No", value: "No" },
        ],
        type: "dropdown",
        isRequired: true,
        placeholder: "",
      },
      {
        name: "digital_code",
        label: "Digital Code",
        placeholder: "Digital Code",
        type: "input",
        dependsOn: "digital_bank",
        dependsOnValue: ["Yes"],
        isRequired: true,
      },
      {
        name: "digital_url",
        label: "URL",
        placeholder: "URL",
        type: "input",
        dependsOn: "digital_bank",
        dependsOnValue: ["Yes"],
        isRequired: false,
      },
      {
        name: "license_copy",
        acceptedFiles: {
          "application/pdf": [".pdf"],
        },
        helperText: "Supported formats: PDF",
        label: "License Copy Document",
        placeholder: "License Copy Document",
        type: "file",
        isRequired: true,
      },
      {
        name: "pan_card_document",
        label: "PAN Card Document",
        acceptedFiles: {
          "application/pdf": [".pdf"],
          "image/png": [".png"],
          "image/jpg": [".jpg"],
          "image/jpeg": [".jpeg"],
        },
        placeholder: "PAN Card Document",
        helperText: "Supported formats: PDF, PNG, JPG, JPEG",
        type: "file",
        isRequired: true,
      },
      {
        name: "gst_document",
        helperText: "Supported formats: PDF",
        label: "GST Document",
        placeholder: "GST Document",
        acceptedFiles: {
          "application/pdf": [".pdf"],
        },
        type: "file",
        isRequired: true,
      },

      {
        name: "agreement_copy_bank",
        label: "Agreement Copy",
        helperText: "Supported formats: PDF",
        acceptedFiles: {
          "application/pdf": [".pdf"],
        },
        placeholder: "Agreement Copy",
        type: "file",
        dependsOn: "type",
        dependsOnValue: ["Bank"],
        isRequired: true,
      },
      {
        name: "irdai_screenshot",
        label: "IRDAI Screenshot",
        helperText: "Supported formats: PNG, JPG, JPEG, PDF",
        placeholder: "IRDAI Screenshot",
        dependsOn: "type",
        acceptedFiles: {
          "image/png": [".png"],
          "image/jpg": [".jpg"],
          "image/jpeg": [".jpeg"],
          "application/pdf": [".pdf"],
        },
        dependsOnValue: ["Bank"],
        type: "file",
        isRequired: true,
      },
      {
        name: "sp_data",
        label: "SP Data",
        helperText: "Supported formats: .xls, .xlsx",
        acceptedFiles: {
          "application/vnd.ms-excel": [".xls", ".xlsx"],
        },
        demoExcel: `${
          EXCEL_URL
        }storage/sample_excels/SP_on_Bank_Onboarding.xlsx`,
        placeholder: "SP Data",
        dependsOn: "type",
        dependsOnValue: ["Bank"],
        type: "file",
        isRequired: true,
      },
      {
        name: "license_copy_sp",
        label: "License Copy of SP in zip format",
        placeholder: "Upload License Copy of SP ",
        acceptedFiles: {
          "application/zip": [".zip"],
        },

        type: "file",
        isRequired: true,
        dependsOn: "type",
        dependsOnValue: ["Bank"],
      },

      {
        name: "broker_branch_list",
        label: "Broker Branch List (with total employees)",
        placeholder: "Select Broker Branch List ",
        type: "file",
        dependsOn: "type",
        acceptedFiles: {
          "application/vnd.ms-excel": [".xls", ".xlsx"],
        },
        demoExcel: `${
          EXCEL_URL
        }storage/sample_excels/Branch_on_broker_onboarding.xlsx`,
        description: "Broker Branch List (with total employees)",
        helperText: "Supported formats: XLS, XLSX",
        dependsOnValue: ["Broker"],
        isRequired: true,
      },

      {
        name: "pos_data",
        label: "POS Data",
        placeholder: "POS Data",
        type: "file",
        helperText: "Supported formats: XLS, XLSX",
        demoExcel: `${EXCEL_URL}storage/sample_excels/POS_Sample_Excel.xlsx`,
        dependsOn: "type",
        dependsOnValue: ["Broker"],
        acceptedFiles: {
          "application/vnd.ms-excel": [".xls", ".xlsx"],
        },
        isRequired: false,
      },
      {
        name: "bqp_data",
        label: "Lead Generator Data ",
        placeholder: "",
        helperText: "Supported formats: XLS, XLSX",
        acceptedFiles: {
          "application/vnd.ms-excel": [".xls", ".xlsx"],
        },
        type: "file",
        demoExcel: `${EXCEL_URL}storage/sample_excels/BQP_Sample_Excel.xlsx`,
        isRequired: true,
      },
      {
        name: "nda",
        label: "Upload NDA",
        placeholder: "NDA",
        helperText: "Supported formats: PDF",
        acceptedFiles: {
          "application/pdf": [".pdf"],
        },
        type: "file",
        dependsOn: "type",
        dependsOnValue: ["Broker", "Bank"],
        isRequired: false,
      },
    ],
  },
];

export const brokerValidationSchema = () => {
  return Yup.object().shape({
    type: Yup.mixed().required("Type is required"),
    name: Yup.string().required("Broker Name is required"),
    license_start_date: Yup.date().required("License Start Date is required"),
    license_end_date: Yup.date().required("License End Date is required"),
    code: Yup.string().required("Code is required"),
    telemarketing_check: Yup.mixed().test(
      "telemarketing_check",
      "Telemarketing Check is required",
      function (value) {
        return this.parent.type?.value === "Bank" ? !!value : true;
      }
    ),
    telemarketing_code: Yup.string().test(
      "telemarketing_code",
      "Telemarketing Code is required",
      function (value) {
        return this.parent.telemarketing_check?.value === "Yes"
          ? !!value
          : true;
      }
    ),
    telemarketing_document: Yup.mixed().test(
      "telemarketing_document",
      "Telemarketing Document is required",
      function (value) {
        return this.parent.telemarketing_check?.value === "Yes"
          ? fileValidation.isValidSync(value)
          : true;
      }
    ),
    license_copy_of_av: Yup.mixed().test(
      "license_copy_of_av",
      "License Copy of AV is required",
      function (value) {
        return this.parent.telemarketing_check?.value === "Yes"
          ? fileValidation.isValidSync(value)
          : true;
      }
    ),
    account_number: Yup.string().test(
      "account_number",
      "Account Number is required",
      function (value) {
        return this.parent.type?.value === "Bank" ||
          this.parent.type?.value === "Broker"
          ? !!value
          : true;
      }
    ),
    ifsc_code: Yup.string().test(
      "ifsc_code",
      "IFSC Code is required",
      function (value) {
        return this.parent.type?.value === "Bank" ||
          this.parent.type?.value === "Broker"
          ? !!value
          : true;
      }
    ),
    bank_document: Yup.mixed().test(
      "bank_document",
      "Bank Document is required",
      function (value) {
        return this.parent.type?.value === "Bank" ||
          this.parent.type?.value === "Broker"
          ? !!value
          : true;
      }
    ),
    bank_document_file: Yup.mixed().test(
      "bank_document_file",
      "Bank Document File is required",
      function (value) {
        return this.parent.bank_document?.value === "NEFT Mandate" ||
          this.parent.bank_document?.value === "Cancelled Cheque"
          ? fileValidation.isValidSync(value)
          : true;
      }
    ),
    designated_officer_name: Yup.string().required(
      "Designated Officer Name is required"
    ),
    email: Yup.string()
      .email("Invalid email format")
      .required("Email ID is required"),
    mobile_number: Yup.string()
      .matches(/^\d{10}$/, "Mobile Number must be 10 digits")
      .required("Mobile Number is required"),
    designation: Yup.string().required("Designation is required"),
    employee_code: Yup.string().required("Employee Code is required"),
    license_no: Yup.string().required("License No. is required"),
    pan_card_no: Yup.string()
      .required("PAN Card number is required")
      .test("pan-card", "Invalid PAN Card number", (value) => {
        return /^[A-Za-z]{5}\d{4}[A-Za-z]{1}$/.test(value);
      }),
    gst_number: Yup.string()
      .matches(
        /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[A-Z0-9]{3}$/,
        "Invalid GST Number format"
      )
      .required("GST Number is required"),

    agreement_copy_check: Yup.mixed().test(
      "agreement_copy_check",
      "Agreement Copy is required",
      function (value) {
        return this.parent.type?.value === "Broker" ? !!value : true;
      }
    ),
    website_code: Yup.string().test(
      "website_code",
      "Website Code is required",
      function (value) {
        return this.parent.agreement_copy_check?.value === "Yes"
          ? !!value
          : true;
      }
    ),
    agreement_copy: Yup.mixed().test(
      "agreement_copy",
      "Agreement Copy is required",
      function (value) {
        return this.parent.agreement_copy_check?.value === "Yes"
          ? fileValidation.isValidSync(value)
          : true;
      }
    ),
    digital_bank: Yup.mixed().test(
      "digital_bank",
      "This field is required",
      function (value) {
        return this.parent.type?.value === "Bank" ? !!value : true;
      }
    ),
    digital_code: Yup.string().test(
      "digital_code",
      "Digital Code is required",
      function (value) {
        return this.parent.digital_bank?.value === "Yes" ? !!value : true;
      }
    ),
    digital_url: Yup.string().test(
      "digital_url",
      "URL is required",
      function (value) {
        return this.parent.digital_bank?.value === "Yes" ? !!value : true;
      }
    ),
    bqp_data: Yup.mixed().test(
      "bqp_data",
      "BQP / Employees Data is required",
      function (value) {
        return this.parent.type?.value === "Broker"
          ? fileValidation.isValidSync(value)
          : true;
      }
    ),
    agreement_copy_bank: Yup.mixed().test(
      "agreement_copy_bank",
      "Agreement Copy is required",
      function (value) {
        return this.parent.type?.value === "Bank"
          ? fileValidation.isValidSync(value)
          : true;
      }
    ),
    irdai_screenshot: Yup.mixed().test(
      "irdai_screenshot",
      "IRDAI Screenshot is required",
      function (value) {
        return this.parent.type?.value === "Bank"
          ? fileValidation.isValidSync(value)
          : true;
      }
    ),

    sp_data: Yup.mixed().test(
      "sp_data",
      "SP Data is required",
      function (value) {
        return this.parent.type?.value === "Bank"
          ? fileValidation.isValidSync(value)
          : true;
      }
    ),
    license_copy_sp: Yup.mixed().test(
      "license_copy_sp",
      "License Copy is required",
      function (value) {
        return this.parent.type?.value === "Bank"
          ? fileValidation.isValidSync(value)
          : true;
      }
    ),
    broker_branch_list: Yup.mixed().test(
      "broker_branch_list",
      "Broker Branch List is required",
      function (value) {
        return this.parent.type?.value === "Broker"
          ? fileValidation.isValidSync(value)
          : true;
      }
    ),
    license_copy: fileValidation,
    pan_card_document: fileValidation,
    gst_document: fileValidation,
  });
};
