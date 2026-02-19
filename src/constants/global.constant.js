const genderOptions = [
  { label: "Male", value: "Male" },
  { label: "Female", value: "Female" },
  { value: "Third Gender", label: "Third Gender" },
];
 const nomineeRelations = {
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

  const LANGUAGE_OPTIONS = [
  { label: "English", value: "English" },
  { label: "Hindi", value: "Hindi" },
  { label: "Marathi", value: "Marathi" },
  { label: "Gujarati", value: "Gujarati" },
  { label: "Tamil", value: "Tamil" },
  { label: "Bengali", value: "Bengali" },
  { label: "Kannada", value: "Kannada" },
  { label: "Malayalam", value: "Malayalam" },
  { label: "Telugu", value: "Telugu" },
  { label: "Punjabi", value: "Punjabi" },
  { label: "Assamese", value: "Assamese" },
  { label: "Oriya", value: "Oriya" },   // Odia
  { label: "Urdu", value: "Urdu" },
];
  
   const STATES_OPTIONS = [
    { value: "Andaman and Nicobar Island", label: "Andaman and Nicobar Island" },
    { value: "Andhra Pradesh", label: "Andhra Pradesh" },
    { value: "Arunachal Pradesh", label: "Arunachal Pradesh" },
    { value: "Assam", label: "Assam" },
    { value: "Bihar", label: "Bihar" },
    { value: "Chandigarh", label: "Chandigarh" },
    { value: "Chhattisgarh", label: "Chhattisgarh" },
    { value: "Delhi (NCT)", label: "Delhi (NCT)" },
    { value: "Goa", label: "Goa" },
    { value: "Gujarat", label: "Gujarat" },
    { value: "Haryana", label: "Haryana" },
    { value: "Himachal Pradesh", label: "Himachal Pradesh" },
    { value: "Jammu and Kashmir", label: "Jammu and Kashmir" },
    { value: "Jharkhand", label: "Jharkhand" },
    { value: "Karnataka", label: "Karnataka" },
    { value: "Kerala", label: "Kerala" },
    { value: "Madhya Pradesh", label: "Madhya Pradesh" },
    { value: "Maharashtra", label: "Maharashtra" },
    { value: "Manipur", label: "Manipur" },
    { value: "Meghalaya", label: "Meghalaya" },
    { value: "Mizoram", label: "Mizoram" },
    { value: "Nagaland", label: "Nagaland" },
    { value: "Odisha", label: "Odisha" },
    { value: "Puducherry", label: "Puducherry" },
    { value: "Punjab", label: "Punjab" },
    { value: "Rajasthan", label: "Rajasthan" },
    { value: "Sikkim", label: "Sikkim" },
    { value: "Tamil Nadu", label: "Tamil Nadu" },
    { value: "Telangana", label: "Telangana" },
    { value: "Tripura", label: "Tripura" },
    { value: "Uttar Pradesh", label: "Uttar Pradesh" },
    { value: "Uttarakhand", label: "Uttarakhand" },
    { value: "West Bengal", label: "West Bengal" },
  ];

export { genderOptions, nomineeRelations, LANGUAGE_OPTIONS, STATES_OPTIONS };
