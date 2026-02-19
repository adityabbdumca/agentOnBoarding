const empty_license = {
  insurer_type: null,
  name_of_issurer: null,
  agency_code: "",
  date_of_agent_appointment: null,
  date_of_agent_cessation: null,
};
const INSURER_TYPE_OPTIONS = [
  { label: "General Insurance", value: "General" },
  { label: "Life Insurance", value: "Life" },
];

export { empty_license, INSURER_TYPE_OPTIONS };
