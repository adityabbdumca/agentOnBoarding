import {
  Activity,
  AlertTriangleIcon,
  CircleCheckBig,
  CircleX,
  FileText,
  Home,
  Settings,
  Shield,
  User,
  UserCheck,
} from "lucide-react";
const BASE_TABS = [
  {
    name: "Endorsement",
    icon: Home,
    path: "endorsement",
  },
  {
    name: "Register Request",
    path: "register-request",
    icon: Activity,
    disabled: true,
  },
  {
    name: "Status Tracking",
    path: "status-tracking",
    icon: Activity,
  },
];
const iconMap = {
  "PAN Number Update": FileText,
  "Mobile Number Update": Shield,
  "Email Id Update": User,
  "Change in Communication address": Settings,
  "Change in Permanent address": Settings,
  "Update/Change in Name": User,
  "Change in License details": FileText,
  "Change in Bank Details": Settings,
  "Change in Nominee Details": UserCheck,
  "Change in Gender": User,
  "Change in Date of Birth": User,
};
const registerFields = {
  "PAN Number Update": "PAN Number",
  "Mobile Number Update": "Mobile Number",
  "Email Id Update": "Email",
  "Change in Communication address": "Communication Address",
  "Change in Permanent address": "Permanent Address",
  "Update/Change in Name": "Name",
  "Change in License details": "License Details",
  "Change in Bank Details": "Bank Details",
  "Change in Nominee Details": "Nominee Details",
  "Change in Gender": "Gender",
  "Change in Date of Birth": "DOB",
};
const endorsementData = [
  {
    id: 1,
    name: "PAN Number Update",
    service_type: "Auto",
    validation_type: "NSDL Validated",
    description: "Update PAN number with automatic NSDL validation",
    created_at: "2025-07-25T06:50:29.000000Z",
    updated_at: "2025-07-25T06:50:29.000000Z",
  },
  {
    id: 2,
    name: "Mobile Number Update",
    service_type: "Auto",
    validation_type: "System Validated",
    description: "Update mobile number with automatic validation",
    created_at: "2025-07-25T06:50:29.000000Z",
    updated_at: "2025-07-25T06:50:29.000000Z",
  },
  {
    id: 3,
    name: "Email Id Update",
    service_type: "Auto",
    validation_type: "System Validated",
    description: "Update email address with automatic validation",
    created_at: "2025-07-25T06:50:29.000000Z",
    updated_at: "2025-07-25T06:50:29.000000Z",
  },
  {
    id: 4,
    name: "Change in Communication address",
    service_type: "Manual",
    validation_type: null,
    icon: User,
    description: "Manual update of communication address",
    created_at: "2025-07-25T06:50:29.000000Z",
    updated_at: "2025-07-25T06:50:29.000000Z",
  },
  {
    id: 5,
    name: "Change in Permanent address",
    service_type: "Auto",
    validation_type: "UIDAI Validated",
    description: "Update permanent address with UIDAI validation",
    created_at: "2025-07-25T06:50:29.000000Z",
    updated_at: "2025-07-25T06:50:29.000000Z",
  },
  {
    id: 6,
    name: "Update/Change in Name",
    service_type: "Auto",
    validation_type: "NSDL/UIDAI Validated",
    icon: User,
    description: "Update name with NSDL/UIDAI validation",
    created_at: "2025-07-25T06:50:29.000000Z",
    updated_at: "2025-07-25T06:50:29.000000Z",
  },
  {
    id: 7,
    name: "Change in License details",
    service_type: "Manual",
    validation_type: null,
    description: "Manual update of license details",
    created_at: "2025-07-25T06:50:29.000000Z",
    updated_at: "2025-07-25T06:50:29.000000Z",
  },
  {
    id: 8,
    name: "Change in Bank Details",
    service_type: "Auto",
    validation_type: "Penny Drop Validated",
    description: "Update bank details with penny drop validation",
    created_at: "2025-07-25T06:50:29.000000Z",
    updated_at: "2025-07-25T06:50:29.000000Z",
  },
  {
    id: 9,
    name: "Change in Date of Birth",
    service_type: "Auto",
    validation_type: "NSDL/UIDAI Validated",
    description: "Update date of birth with NSDL/UIDAI validation",
    created_at: "2025-07-25T06:50:29.000000Z",
    updated_at: "2025-07-25T06:50:29.000000Z",
  },
  {
    id: 10,
    name: "Change in Gender",
    service_type: "Auto",
    validation_type: "UIDAI Validated",
    description: "Update gender with UIDAI validation",
    created_at: "2025-07-25T06:50:29.000000Z",
    updated_at: "2025-07-25T06:50:29.000000Z",
  },
  {
    id: 11,
    name: "Change in Nominee Details",
    service_type: "Manual",
    validation_type: null,
    description: "Manual update of nominee details",
    created_at: "2025-07-25T06:50:29.000000Z",
    updated_at: "2025-07-25T06:50:29.000000Z",
  },
];

const userOptions = [
  { id: 1, name: "Agent", value: "Agent", Icon: User },
  {
    id: 2,
    name: "Register Request",
    value: "Register Request",
    Icon: UserCheck,
  },
  { id: 3, name: "Status Tracking", value: "Status Tracking", Icon: Shield },
];
const textColorClasses = {
  Discrepancy: "text-orange-600",
  Reject: "text-red-500",
  Approve: "text-green-500",
};
const ACTION_BUTTONS = [
  {
    label: "Approve",
    value: "Approve",
    icon: CircleCheckBig,
    button_id: 2,
    color: "text-green-500",
    isLoading: false,
  },

  {
    label: "Reject",
    value: "Reject",
    icon: CircleX,
    button_id: 5,
    color: "text-red-500",
    isLoading: false,
  },
  {
    label: "Discrepancy",
    value: "Discrepancy",
    icon: AlertTriangleIcon,
    button_id: 3,
    color: "text-orange-500",
    isLoading: false,
  },
];
const ENDORSEMENT_TYPE_MESSAGE = {
  "PAN Number Update":
    "Details from uploaded Pan card and Updated details are mismatched. Please provide valid proof of Pan change",
  "Mobile Number Update":
    "Provide supporting documents to verify your new mobile number.",
  "Email Id Update":
    "Provide supporting documents to verify your new email id.",
  "Change in Communication address":
    "Details from uploaded address proof and communication address are mismatched. Please provide valid proof of address change",
  "Change in Permanent address":
    "Details from uploaded address proof and permanent address are mismatched. Please provide valid proof of address change",
  "Update/Change in Name":
    "Details from uploaded Id proof and updated name are mismatched. Please provide valid proof of name change",
  "Change in License Details":
    "Please provide updated license documents reflecting the changes.",
  "Change in Bank Details":
    "Bank account verification failed. Please provide latest bank statement and cancelled cheque.",
  "Change in Date of Birth":
    "Details from the uploaded ID proof and updated date of birth are mismatched. Please provide valid proof of date of birth.",
  "Change in Gender":
    "Details from the uploaded ID proof and updated gender are mismatched. Please provide valid proof of gender.",
  "Change in Nominee Details":
    "Details from the uploaded ID proof and updated nominee details are mismatched. Please provide valid proof of nominee change.",
};
export {
  endorsementData,
  iconMap,
  userOptions,
  registerFields,
  textColorClasses,
  ACTION_BUTTONS,
  BASE_TABS,
  ENDORSEMENT_TYPE_MESSAGE
};
