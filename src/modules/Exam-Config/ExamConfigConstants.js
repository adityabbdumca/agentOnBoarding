import * as yup from "yup";

export const AGENT_TYPE_OPTIONS = [
  {
    label: "New Agent",
    value: 1,
    tooltip:
      "A new applicant with no prior insurance agency code. \nMust complete CKYC, payment, 25 hrs training, and exam. Eligible only after passing IRDAI exam.",
  },
  {
    label: "Composite",
    value: 3,
    tooltip:
      "An existing Life or General Insurance agent wanting to also sell Health Insurance. \nRequires CKYC, payment, and training. Already licensed in one domain (Life/General).",
  },
  {
    label: "Transfer",
    value: 4,
    tooltip:
      "An agent shifting from another Health Insurance company to PHI. \nNeeds NOC from previous insurer. CKYC and document validation required.",
  },
  {
    label: "POSP",
    value: 5,
    tooltip:
      "Authorized to sell specific, pre-approved simple insurance products. \nRequires CKYC, payment, and 15 hrs mandatory training. Exam taken here itself.",
  },
];
export const examConfigSchema = yup.object().shape({
  type: yup.mixed().required("User Type is required"),
  number_of_questions: yup
    .number()
    .min(10, "Minimum 10 questions")
    .typeError("Only numeric values are allowed")
    .max(200, "Maximum 200 questions")
    .required("Number of Questions is required"),
  passing_percentage: yup
    .number()
    .min(35, "Minimum passing percentage is 35%")
    .typeError("Only numeric values are allowed")
    .max(100, "Maximum passing percentage is 100%")
    .required("Passing Percentage is required"),
  exam_time: yup
    .number()
    .min(1, "Minimum exam time is 1 minute")
    .typeError("Only numeric values are allowed")
    .required("Exam Time is required"),
  exam_type: yup.mixed().required("Exam Type is required"),
});
