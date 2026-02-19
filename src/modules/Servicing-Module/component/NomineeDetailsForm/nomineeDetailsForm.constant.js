const genderNomineeRelations = {
  Male: [
    { label: "Father", value: "Father" },
    { label: "Brother", value: "Brother" },
    { label: "Son", value: "Son" },
    { label: "Spouse", value: "Spouse" },
  ],
  Female: [
    { label: "Mother", value: "Mother" },
    { label: "Sister", value: "Sister" },
    { label: "Daughter", value: "Daughter" },
    { label: "Spouse", value: "Spouse" },
  ],
  Other: [
    { label: "Father", value: "Father" },
    { label: "Mother", value: "Mother" },
    { label: "Brother", value: "Brother" },
    { label: "Sister", value: "Sister" },
    { label: "Spouse", value: "Spouse" },
    { label: "Son", value: "Son" },
    { label: "Daughter", value: "Daughter" },
    { label: "Spouse", value: "Spouse" },
  ],
};
const nomineeRelationOptions = [
  { label: "Father", value: "Father" },
  { label: "Mother", value: "Mother" },
  { label: "Brother", value: "Brother" },
  { label: "Sister", value: "Sister" },
  {
    label: "GrandFather",
    value: "GrandFather",
  },
  {
    label: "GrandMother",
    value: "GrandMother",
  },
  { label: "Uncle", value: "Uncle" },
  { label: "Other", value: "Other" },
];
const salutation = [
  {
    label: "Mr.",
    value: "Mr.",
  },
  {
    label: "Mrs.",
    value: "Mrs.",
  },
  {
    label: "Miss",
    value: "Miss",
  },
];
const genderOptions = [
  { label: "Male", value: "Male" },
  { label: "Female", value: "Female" },
  { label: "Other", value: "Other" },
];
const empty_nominee = {
  salutation: null,
  gender: null,
  relation_with_applicant: null,
  nominee_name: "",
  contact_number: "",
  age: "",
  nominee_share: "",
  pincode: "",
  city: "",
  state: "",
  house_number: "",
  street: "",
  land_mark: "",
  district: "",
  account_type: null,
  bank_account_number: "",
  re_enter_bank_account_number: "",
  ifsc_code: "",
  bank_name: "",
  bank_city: "",
  branch_name: "",
  guardian_name: "",
  guardian_contact_number: "",
  relation_with_nominee: "",
};
export {
  genderNomineeRelations,
  salutation,
  empty_nominee,
  genderOptions,
  nomineeRelationOptions,
};
