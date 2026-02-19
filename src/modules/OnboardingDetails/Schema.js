/* eslint-disable max-lines */

import { blockedDomains } from "@/constants/blockDomain";
import { DateTime } from "luxon";
import * as Yup from "yup";

// export const fileValidation = (fieldLabel) =>
//   Yup.mixed()
//     .nullable()
//     .test("file", `${fieldLabel} is required`, (value) => {
//       console.log(value, "value")
//       if (!value) return false;
//       if (Array.isArray(value)) return value.length > 0;
//       return value instanceof File;
//     });

export const fileValidation = Yup.mixed()
  .nullable()
  .test("file", "Supporting document is required", (value) => {
    return (Array.isArray(value) || value) && value.length > 0;
  });

export const fileValidationWithLabel = (fieldLabel = "Supporting document") =>
  Yup.mixed()
    .nullable()
    .test("file", `${fieldLabel} is required`, (value) => {
      // if (Array.isArray(value)) return value.length > 0;
      // return value instanceof File;
      return (Array.isArray(value) || value) && value.length > 0;
    });

export const fileValidation2 = Yup.mixed().test(
  "file",
  "This field is required",
  (value, parent) => {
    return (
      parent.parent?.license_status?.value === 0 &&
      (Array.isArray(value) || value) &&
      value.length > 0
    );
  }
);

export const declarationSchema = Yup.object({
  declaration: Yup.object({
    check: Yup.string().test("is-true", "Declaration is required", (value) => {
      return value === "true";
    }),
  }),
});

export const ckycSchema = Yup.object({
  ckyc: Yup.object({
    ckyc: Yup.string().required("Please select if you have CKYC"),

    ckyc_type: Yup.mixed()
      .nullable()
      .when("ckyc", {
        is: "N",
        then: (schema) => schema.required("CKYC Type is required"),
        otherwise: (schema) => schema.nullable(),
      }),

    ckyc_number: Yup.string().when(["ckyc", "ckyc_type"], {
      is: (ckyc, ckyc_type) => ckyc === "Y",
      then: (schema) =>
        schema
          .required("CKYC Number is required")
          .min(14, "CKYC Number must be 14 digits")
          .test("not-all-zeros", "CKYC Number cannot be all zeros", (value) => {
            if (!value) return false;
            const digits = value.replace(/\D/g, "");
            return digits !== "0".repeat(digits.length);
          })
          .test(
            "not-sequential",
            "CKYC Number cannot be sequential numbers",
            (value) => {
              if (!value) return false;
              const digits = value.replace(/\D/g, "");
              // Check for sequential patterns like 123456789012, 111111111111, etc.
              const isSequential =
                /^(0123456789|1234567890|9876543210|0987654321)/.test(digits) ||
                /^(\d)\1+$/.test(digits); // All same digits
              return !isSequential;
            }
          ),
      otherwise: (schema) =>
        schema.when("ckyc_type", {
          is: (ckyc_type) => ckyc_type?.value === "Aadhar",
          then: (schema) =>
            schema
              .required("Aadhaar Number is required")
              .test(
                "aadhaar-length",
                "Aadhaar Number must be 12 digits",
                (value) => {
                  if (!value) return false;
                  const digits = value.replace(/-/g, "");
                  return digits.length === 12;
                }
              )
              .test(
                "not-all-zeros",
                "Aadhaar Number cannot be all zeros",
                (value) => {
                  if (!value) return false;
                  const digits = value.replace(/-/g, "");
                  return digits !== "000000000000";
                }
              ),
          otherwise: (schema) =>
            schema.when("ckyc_type", {
              is: (ckyc_type) => ckyc_type?.value === "PAN",
              then: (schema) =>
                schema
                  .required("PAN Number is required")
                  .matches(
                    /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
                    "PAN Number must be in format ABCDE1234F"
                  )
                  .length(10, "PAN Number must be exactly 10 characters")
                  .test(
                    "not-invalid-pan",
                    "Please enter a valid PAN Number",
                    (value) => {
                      if (!value) return false;

                      const invalidPatterns = [
                        "AAAAA0000A",
                        "BBBBB0000B",
                        "CCCCC0000C",
                        "ABCDE0000F",
                        "ABCDE1234A",
                        "AAAAA1111A",
                      ];
                      return !invalidPatterns.includes(value.toUpperCase());
                    }
                  ),
              otherwise: (schema) => schema.nullable(),
            }),
        }),
    }),
  }),
});

const vertical_id = Number(localStorage.getItem("vertical_id"));

export const nomineeSchema = Yup.object({
  nominee: Yup.array()
    .of(
      Yup.object({
        relation_with_applicant: Yup.mixed().required(
          "Relation with Applicant is required"
        ),
        salutation: Yup.mixed().required("Salutation is required"),
        nominee_name: Yup.string()
          .required("Nominee Name is required")
          .min(3, "Nominee Name must be at least 3 characters")
          .max(100, "Nominee Name must be less than 100 characters"),

        contact_number: Yup.string()
          .required("Contact Number is required")
          .matches(/^\d{10}$/, "Contact Number must be a 10-digit number")
          .test(
            "contact_number",
            "Contact Number Should be Unique",
            function (value) {
              if (!value) return true;
              const nominees = this.from?.[1]?.value?.nominee || [];
              const currentIndex = this.path.match(/\[(\d+)\]/)?.[1];
              const duplicateCount = nominees.filter((nominee, index) => {
                return (
                  nominee?.contact_number &&
                  nominee.contact_number.trim().toLowerCase() ===
                    value.trim().toLowerCase() &&
                  index != currentIndex
                );
              }).length;
              return duplicateCount === 0;
            }
          ),
        ifsc_code: Yup.string()
          .nullable()
          .notRequired()
          .test(
            "ifsc-validation",
            "Please enter a valid 11-character IFSC code (e.g., HDFC0001234)",
            function (value) {
              if (!value) return true;
              return /^[A-Za-z]{4}0[A-Z0-9a-z]{6}$/.test(value);
            }
          ),
        bank_account_number: Yup.string()
          .nullable()
          .notRequired()
          .test(
            "bank_account_number",
            "Bank Account Number must be between 9 and 20 digits",
            function (value) {
              if (!value) return true;
              return /^\d{9,20}$/.test(value);
            }
          ),
        re_enter_bank_account_number: Yup.string()
          .nullable()
          .oneOf(
            [Yup.ref("bank_account_number"), null],
            "Entered account numbers do not match. Please re-enter."
          ),

        nominee_share: Yup.number()
          .required("Nominee Share % is required")
          .min(0, "Nominee Share % cannot be less than 0")
          .max(100, "Nominee Share % cannot be greater than 100")
          .typeError("Nominee Share % must be a number")
          .test("not-exceed-total", function (value) {
            if (value === undefined) return true;
            const { path } = this;
            const nominees = this.from?.[1]?.value?.nominee || [];

            const index = parseInt(path.match(/\[(\d+)\]/)?.[1] ?? "-1", 10);

            let sumBefore = 0;
            nominees.forEach((n, i) => {
              if (i !== index && n?.nominee_share) {
                sumBefore += Number(n.nominee_share) || 0;
              }
            });

            const totalWithCurrent = sumBefore + (Number(value) || 0);

            if (totalWithCurrent > 100) {
              const remain = 100 - sumBefore;
              return this.createError({
                path,
                message: `Nominee Share exceeded. Only ${remain}% remaining.`,
              });
            }

            return true;
          }),

        gender: Yup.mixed().required("Gender is required"),
        age: Yup.number()
          .required("Age is required")
          .min(1, "Age must be at least 1")
          .max(100, "Age must be less than or equal to 100")
          .typeError("Age must be a valid number")
          .test(
            "age",
            "Nominee age must be at least 18 years greater than applicant's age for Father and Mother",
            function (value) {
              const relation = this.parent?.relation_with_applicant?.value;
              const applicantAge = Math.floor(
                DateTime.now().diff(
                  DateTime.fromISO(this.options?.context?.profile?.dob), //Value comes from context in useForm
                  "years"
                ).years
              );

              if (!value) return true;
              const isFatherMother = ["Father", "Mother"].includes(relation);

              if (isFatherMother && value < applicantAge + 18) {
                return false;
              }
              return true;
            }
          )
          .test(
            "father-son-gap",
            "Son's or Daughter age must be at least 18 years less than Father or Mother age",
            function (value) {
              const relation = this.parent?.relation_with_applicant?.value;
              const applicantDOB = this.options.context?.profile?.dob; // Value comes from context in useForm
              if (
                (relation !== "Son" && relation !== "Daughter") ||
                !applicantDOB ||
                !value
              )
                return true;

              const applicantAge = Math.floor(
                DateTime.now().diff(DateTime.fromISO(applicantDOB), "years")
                  .years
              );

              return value <= applicantAge - 18;
            }
          )
          .test(
            "spouse",
            "Spouse age must be greater or equal to 18",
            function (value) {
              const relation = this.parent?.relation_with_applicant?.value;

              if (relation !== "Spouse" || value === null) return true;

              return value >= 18;
            }
          ),

        pincode: Yup.string()
          .required("Pin Code is required")
          .matches(/^\d{6}$/, "Pin Code must be a 6-digit number"),
        city: Yup.string().required("City is required"),
        state: Yup.string().required("State is required"),
        house_number: Yup.string()
          .required("Address is required")
          .min(2, "Address must be at least 2 characters")
          .max(100, "Address must be less than 100 characters"),

        guardian_name: Yup.string()
          .nullable()
          .test("guardian_name", "Guardian Name is required", function (value) {
            return (
              this.parent.age >= 18 ||
              (this.parent.age < 18 && value && value.trim() !== "")
            );
          }),
        relation_with_nominee: Yup.mixed()
          .nullable()
          .test(
            "relation_with_nominee",
            "Guardian Relation is required",
            function (value) {
              return (
                this.parent.age >= 18 ||
                (this.parent.age < 18 &&
                  value !== undefined &&
                  value !== null &&
                  value !== "")
              );
            }
          ),
        guardian_contact_number: Yup.string()
          .nullable()
          .test(
            "guardian_contact_number",
            "Guardian Contact Number is required",
            function (value) {
              return (
                this.parent.age >= 18 ||
                (this.parent.age < 18 && value && value.trim() !== "")
              );
            }
          ),
      })
    )
    // ✅ Array-level validation for total = 100
    .test(
      "total-share-100",
      "Total Nominee Share should be 100%",
      function (nominees) {
        if (!Array.isArray(nominees)) return true;
        const sum = nominees.reduce(
          (acc, nominee) =>
            acc + (isNaN(nominee.nominee_share) ? 0 : +nominee.nominee_share),
          0
        );

        if (sum !== 100) {
          return this.createError({
            path: `nominee[0].nominee_share`,
            message: `Total Nominee Share should be 100%. Remaining ${
              100 - sum
            }% must be allocated.`,
          });
        }
        return true;
      }
    )
    // ✅ Prevent duplicate nominee with same name, age, relation
    .test(
      "name-age-relation-unique",
      "If Nominee Name is same, Age & Relation must not both be same",
      function (nominees) {
        if (!Array.isArray(nominees)) return true;

        for (let i = 0; i < nominees.length; i++) {
          for (let j = i + 1; j < nominees.length; j++) {
            const ni = nominees[i];
            const nj = nominees[j];

            if (
              ni?.nominee_name?.trim().toLowerCase() ===
                nj?.nominee_name?.trim().toLowerCase() &&
              (ni?.age === nj?.age ||
                ni?.relation_with_applicant?.value ===
                  nj?.relation_with_applicant?.value)
            ) {
              return this.createError({
                path: `nominee[${j}].nominee_name`,
                message:
                  "Nominees with same name cannot have same age or relation with applicant",
              });
            }
          }
        }
        return true;
      }
    ),

  nominee_check: Yup.boolean().when([], {
    is: () => ![1, 2].includes(vertical_id),
    then: (schema) =>
      schema.oneOf([true], "You must accept the terms & conditions"),
    otherwise: (schema) => schema.notRequired().nullable(),
  }),
});

export const NOCSchema = Yup.object({
  noc: Yup.object({
    agent_name: Yup.string()
      .required("Agent Name is required")
      .min(2, "Agent Name must be at least 2 characters")
      .max(100, "Agent Name must be less than 100 characters"),
    gc_code: Yup.string()
      .required("GC Code is required")
      .matches(/^[A-Za-z0-9]{6}$/, "Invalid GC Code"),
    pan_no: Yup.string()
      .required("PAN No is required")
      .matches(/^[A-Za-z0-9]{10}$/, "Invalid PAN No"),
    agency_code: Yup.string()
      .required("Agency Code is required")
      .matches(/^[A-Za-z0-9]{6}$/, "Invalid Agency Code"),
    email: Yup.string()
      .required("Email is required")
      .email("Invalid Email address")
      .max(100, "Email must be less than 100 characters")
      .matches(
        /^[a-zA-Z0-9._-]+@[a-zA-Z.-]+\.(com|in|net)$/,
        "Invalid email format. Please check and try again."
      ),
    proposals_pending: Yup.number()
      .required("No of Proposal Pending for Submission is required")
      .min(0, "No of Proposal Pending for Submission cannot be less than 0")
      .typeError("No of Proposal Pending for Submission must be a number"),
    appointment_deposited: Yup.mixed().required(
      "Appointment Deposited is required"
    ),
    appointment_deposited_date: Yup.date()
      .required("Appointment Deposited Date is required")
      .transform((value, originalValue) => {
        if (!originalValue) return null;
        const date = new Date(originalValue);
        return isNaN(date) ? null : date;
      })
      .max(new Date(), "Appointment Deposited Date cannot be in the future"),
    appointment_remark: Yup.string().required("Appointment Remark is required"),
    id_card_deposited: Yup.mixed().required("ID Card Deposited is required"),
    id_card_deposited_date: Yup.date()
      .required("ID Card Deposited Date is required")
      .transform((value, originalValue) => {
        if (!originalValue) return null;
        const date = new Date(originalValue);
        return isNaN(date) ? null : date;
      })
      .max(new Date(), "ID Card Deposited Date cannot be in the future"),
    id_card_remark: Yup.string().required("ID Card Remark is required"),
    visiting_card_deposited: Yup.mixed().required(
      "Visiting Card Deposited is required"
    ),
    visiting_card_deposited_date: Yup.date()
      .required("Visiting Card Deposited Date is required")
      .transform((value, originalValue) => {
        if (!originalValue) return null;
        const date = new Date(originalValue);
        return isNaN(date) ? null : date;
      })
      .max(new Date(), "Visiting Card Deposited Date cannot be in the future"),
    visiting_card_remark: Yup.string().required(
      "Visiting Card Remark is required"
    ),
    resignation_reason: Yup.mixed().required("Resignation Reason is required"),
  }),
});
export const getInsurersSchema = (agentType) =>
  Yup.object().shape({
    insurers: Yup.array().of(
      Yup.object().shape({
        name_of_issuer: Yup.mixed()
          .nullable()
          .test(
            "name_of_issuer",
            "Name of Issuer is required",
            function (value) {
              if (agentType === "composite") {
                return !!value;
              }
              return true;
            }
          ),

        agency_code: Yup.string()
          .nullable()
          .test("agency_code", "Agency Code is required", function (value) {
            if (agentType === "composite") {
              return value && value.trim() !== "";
            }
            return true;
          })
          .min(5, "Agency Code must be at least 5 characters"),

        reason_of_cessation: Yup.string()
          .nullable()
          .test(
            "reason_of_cessation",
            "Reason of Cessation is required",
            function (value) {
              if (agentType === "composite") {
                return value && value.trim() !== "";
              }
              return true;
            }
          )
          .min(2, "Reason of Cessation must be at least 2 characters")
          .max(100, "Reason of Cessation must be less than 100 characters"),

        date_of_agent_appointment: Yup.string()
          .nullable()
          .test(
            "date_of_agent_appointment",
            "Appointment Date is required",
            function (value) {
              if (agentType === "composite") {
                return value && value.trim() !== "";
              }
              return true;
            }
          ),
      })
    ),
  });
export const profileSchema = (agentType = null, id = null) =>
  Yup.object({
    profile: Yup.object({
      ...(id && {
        rm_mapping: Yup.mixed().required("FLS Mapping is required"),
      }),
      salutation: Yup.mixed().required("Salutation is required"),
      gender: Yup.mixed().required("Gender is required"),
      first_name: Yup.string()
        .required("First Name is required")
        .min(2, "First Name must be at least 2 characters")
        .max(100, "First Name must be less than 100 characters"),
      // middle_name: Yup.string()
      //   // .required("Middle Name is required")
      //   .min(2, "Middle Name must be at least 2 characters")
      //   .max(100, "Middle Name must be less than 100 characters"),
      last_name: Yup.string()
        .required("Last Name is required")
        .min(1, "Last Name must be at least 2 characters")
        .max(100, "Last Name must be less than 100 characters"),
      father_name: Yup.string()
        .required("Father Name is required")
        .min(1, "Father Name must be at least 1 characters")
        .max(100, "Father Name must be less than 100 characters"),
      dob: Yup.string()
        .required("Date of birth is required")
        .test("valid-format", "Enter in dd-MM-yyyy format", (value) => {
          if (!value) return false;
          return DateTime.fromFormat(value, "dd-MM-yyyy").isValid;
        })
        .test("not-in-future", "DOB cannot be in the future", (value) => {
          if (!value) return false;
          const dob = DateTime.fromFormat(value, "dd-MM-yyyy");
          return dob <= DateTime.now();
        })
        .test("age", "Age must be at least 18", (value) => {
          if (!value) return false;
          const dob = DateTime.fromFormat(value, "dd-MM-yyyy");
          if (!dob.isValid) return false;

          const age = DateTime.now().diff(dob, "years").years;
          return age >= 18;
        }),
      marital_status: Yup.mixed().required("Marital Status is required"),
      // category: Yup.mixed().required("Category is required"),
      aadhar_no: Yup.string()
        .required("Aadhar No is required")
        .test("aadhar_no", "Aadhar No must be 12 digits", (value) => {
          if (!value) return true;
          const onlyDigits = value?.split("-")?.join("");
          return onlyDigits.length === 12;
        }),
      pan_no: Yup.string()
        .required("PAN No is required")
        .matches(
          /^[A-Z]{3}P[A-Z][0-9]{4}[A-Z]{1}$/i,
          "Invalid PAN format. Please enter a valid 10-character PAN."
        ),
      other_caste: Yup.string()
        .nullable()
        .test("other_caste", "Caste is required", function (value) {
          const caste = this.parent.category?.value;
          if (caste === "Other") {
            return value && value.trim() !== "";
          }
          return true;
        }),
      occupation: Yup.mixed().required("Occupation is required"),
      other_occupation: Yup.string()
        .nullable()
        .test("other_occupation", "Occupation is required", function (value) {
          const occupation = this.parent.occupation?.label;
          if (occupation === "Others") {
            return value && value.trim() !== "";
          }
          return true;
        }),
      mobile: Yup.string()
        .required("Mobile No is required")
        .matches(/^\d{10}$/, "Mobile No must be a 10-digit number"),
      alternate_no: Yup.string()
        .nullable()
        .test(
          "is-valid-alternate",
          "Alternate No must be a 10-digit number",
          (value) => {
            // allow empty / null value
            if (!value) return true;

            return /^\d{10}$/.test(value);
          }
        ),
      email: Yup.string()
        .required("E-Mail Id is required")
        .max(100, "E-Mail must be less than 100 characters")
        .matches(
          /^[a-zA-Z0-9._-]+@[a-zA-Z.-]+\.(com|in|net)$/,
          "Invalid email format. Please check and try again."
        )
        .test(
          "not-blocked-domain",
          "Emails from this domain are not allowed",
          (value) => {
            if (!value) return true;
            return !blockedDomains.some((domain) =>
              value.toLowerCase().endsWith("@" + domain)
            );
          }
        ),

      pincode: Yup.string()
        .required("Pincode is required")
        .matches(/^\d{6}$/, "Pincode must be a 6-digit number"),
      address: Yup.string()
        .required("Address is required")
        .min(10, "Address must be at least 10 characters"),
      city: Yup.string().required("City is required"),
      state: Yup.string().required("State is required"),
      street: Yup.string().required("Street is required"),
      board_name: Yup.mixed()
        .required("Board/University name is required")
        .test(
          "university name is required",
          "Board/University name is required",
          function (value) {
            const qualification = this.parent.highest_qualification?.value;
            if (!qualification) {
              return true;
            }
            return !!value;
          }
        ),
      roll_no: Yup.string().required("Roll No is required"),
      // .min(14, "URN No must be at least 14 characters"),
      year_of_passing: Yup.mixed().required("Year of Passing is required"),
      highest_qualification: Yup.mixed().required(
        "Highest Qualification is required"
      ),

      other_education: Yup.string()
        .nullable()
        .test(
          "other_education",
          "Other Education is required",
          function (value) {
            const highestQualification =
              this.parent.highest_qualification?.value;
            if (highestQualification === "Other") {
              return value && value.trim() !== ""; // Validate if highest qualification is "Other"
            }
            return true;
          }
        ),

      existing_health_insurance_name: Yup.mixed()
        .nullable()
        .test(
          "existing_health_insurance_name",
          "Field is required",
          function (value) {
            const isAgentTypeTransfer = agentType === "transfer";
            if (isAgentTypeTransfer) {
              return value && Object.keys(value).length > 0; // Validate if value is a non-empty object
            }
            return true;
          }
        ),
      existing_health_insurance_noc_date: Yup.string()
        .nullable()
        .test(
          "existing_health_insurance_noc_date",
          "Field is required",
          function (value) {
            const isAgentTypeTransfer = agentType === "transfer";
            if (isAgentTypeTransfer) {
              return value && value.trim() !== ""; // Validate if agent type is composite
            }
            return true;
          }
        )
        .test(
          "valid-format-if-present",
          "Enter in dd-MM-yyyy format",
          function (value) {
            if (!value) return true; // skip format check if empty
            return DateTime.fromFormat(value, "dd-MM-yyyy").isValid;
          }
        ),
      reason_for_transfer:
        agentType === "transfer"
          ? Yup.string()
              .required(" Reason for transfer is required")
              .min(3, "Reason for transfer must be at least 3 characters")
              .max(100, "Reason for transfer  must be less than 100 characters")
          : Yup.mixed().nullable(),

      communicational_address: Yup.string()
        .nullable()
        .test(
          "communicational_address",
          "Communicational Address is required",
          function (value) {
            const isCommunicationAddressSame =
              this.parent.is_communication_address_same;
            if (isCommunicationAddressSame === "Y") {
              return true; // Skip validation if address is same
            }
            return value && value.trim() !== ""; // Validate if address is not same
          }
        ),
      communication_street: Yup.string()
        .nullable()
        .test(
          "communication_street",
          "Communication Street is required",
          function (value) {
            const isCommunicationAddressSame =
              this.parent.is_communication_address_same;
            if (isCommunicationAddressSame === "Y") {
              return true; // Skip validation if address is same
            }
            return value && value.trim() !== ""; // Validate if street is not same
          }
        ),
      // communication_town: Yup.string()
      //   .nullable()
      //   .test(
      //     "communication_town",
      //     "Communication Town is required",
      //     function (value) {
      //       const isCommunicationAddressSame =
      //         this.parent.is_communication_address_same;
      //       if (isCommunicationAddressSame === "Y") {
      //         return true; // Skip validation if address is same
      //       }
      //       return value && value.trim() !== ""; // Validate if street is not same
      //     }
      //   ),
      // communication_district: Yup.string()
      //   .nullable()
      //   .test(
      //     "communication_district",
      //     "Communication District is required",
      //     function (value) {
      //       const isCommunicationAddressSame =
      //         this.parent.is_communication_address_same;
      //       if (isCommunicationAddressSame === "Y") {
      //         return true; // Skip validation if address is same
      //       }
      //       return value && value.trim() !== ""; // Validate if street is not same
      //     }
      //   ),
      communication_pincode: Yup.string()
        .nullable()
        .test(
          "communication_pincode",
          "Communication Pincode is required",
          function (value) {
            const isCommunicationAddressSame =
              this.parent.is_communication_address_same;
            if (isCommunicationAddressSame === "Y") {
              return true; // Skip validation if address is same
            }
            return value && value.trim() !== ""; // Validate if street is not same
          }
        ),
      communication_city: Yup.string()
        .nullable()
        .test(
          "communication_city",
          "Communication City is required",
          function (value) {
            const isCommunicationAddressSame =
              this.parent.is_communication_address_same;
            if (isCommunicationAddressSame === "Y") {
              return true; // Skip validation if address is same
            }
            return value && value.trim() !== ""; // Validate if street is not same
          }
        ),
      communication_state: Yup.string()
        .nullable()
        .test(
          "communication_state",
          "Communication State is required",
          function (value) {
            const isCommunicationAddressSame =
              this.parent.is_communication_address_same;
            if (isCommunicationAddressSame === "Y") {
              return true; // Skip validation if address is same
            }
            return value && value.trim() !== ""; // Validate if street is not same
          }
        ),
      insurers: Yup.array().of(
        Yup.object({
          insurer_type: Yup.mixed()
            .required("Insurer Type is required")
            .test("insurer_type", "insurer type is required", function (value) {
              if (agentType === "composite") {
                return !!value;
              }
              return true;
            }),
          name_of_issurer: Yup.mixed()
            .required("Name of insurer is required")
            .test(
              "name_of_issurer",
              "Name of Issuer is required",
              function (value) {
                if (agentType === "composite") {
                  return !!value;
                }
                return true;
              }
            ),
          agency_code: Yup.string()
            .required("Agency code is required")
            .test("agency_code", "Agency Code is required", function (value) {
              if (agentType === "composite") {
                return value && value.trim() !== "";
              }
              return true;
            })
            .min(5, "Agency Code must be at least 5 characters"),
          date_of_agent_appointment: Yup.string()
            .nullable()
            .test(
              "date_of_agent_appointment",
              "Appointment Date is required",
              function (value) {
                if (agentType === "composite") {
                  return value && value.trim() !== "";
                }
                return true;
              }
            )
            .test(
              "valid-format-if-present",
              "Enter in dd-MM-yyyy format",
              function (value) {
                if (!value) return true;
                return DateTime.fromFormat(value, "dd-MM-yyyy").isValid;
              }
            ),

          // date_of_agent_cessation: Yup.string()
          //   .nullable()
          //   .test(
          //     "date_of_agent_cessation",
          //     "Cessation Date is required",
          //     function (value) {
          //       if (agentType === "transfer") {
          //         return value && value.trim() !== "";
          //       }
          //       return true;
          //     }
          //   )
          //   .test(
          //     "valid-format-if-present",
          //     "Enter in dd-MM-yyyy format",
          //     function (value) {
          //       if (!value) return true;
          //       return DateTime.fromFormat(value, "dd-MM-yyyy").isValid;
          //     }
          //   ),

          // reason_of_cessation: Yup.string()
          //   .nullable()
          //   .test(
          //     "reason_of_cessation",
          //     "Reason of Cessation is required",
          //     function (value) {
          //       if (agentType === "transfer") {
          //         return value && value.trim() !== "";
          //       }
          //       return true;
          //     }
          //   )
          //   .min(2, "Reason of Cessation must be at least 2 characters")
          //   .max(100, "Reason of Cessation must be less than 100 characters"),
        })
      ),
    }).test(
      "communication-address-validation",
      "Communication address cannot be same as permanent address",
      (values) => {
        const { is_communication_address_same } = values;
        if (is_communication_address_same === "Y") return true;

        const pairs = [
          ["address", "communicational_address"],
          ["street", "communication_street"],
          ["city", "communication_city"],
          ["state", "communication_state"],
          ["pincode", "communication_pincode"],
        ];

        const allCommFilled = pairs.every(([_, commKey]) => {
          const val = values[commKey];
          return (
            val !== undefined && val !== null && val.toString().trim() !== ""
          );
        });
        if (!allCommFilled) {
          return true;
        }

        const differs = pairs.some(([permKey, commKey]) => {
          return (
            (values[permKey] || "").trim() !== (values[commKey] || "").trim()
          );
        });

        return differs;
      }
    ),
  });

export const bankSchema = Yup.object({
  bank: Yup.object({
    account_type: Yup.mixed().required("Account Type is required"),
    name_as_in_bank_acount: Yup.string()
      .required("Name as in Bank Account is required")
      .min(3, "Name as in Bank Account must be at least 3 characters")
      .max(100, "Name as in Bank Account must be less than 100 characters"),
    bank_account_number: Yup.string()
      .required("Bank Account Number is required")
      .min(9, "Bank Account Number must be at least 9 - 20 digits"),
    // nominee validation

    // .matches(
    //   /^\d{9,18}$/,
    //   "Bank Account Number must be between 9 and 18 digits"
    // ),
    re_enter_bank_account_number: Yup.string()
      .required("Re-Enter Bank Account Number is required")
      .test(
        "re-enter",
        "Entered account numbers do not match. Please re-enter.",
        function (value) {
          return value === this.parent.bank_account_number;
        }
      ),
    ifsc_code: Yup.string()
      .required("IFSC Code is required")
      .matches(
        /^[A-Za-z]{4}0[A-Z0-9a-z]{6}$/,
        "Please enter a valid 11-digit alphanumeric IFSC code."
      ),
    bank_name: Yup.string()
      .required("Bank Name is required")
      .min(3, "Bank Name must be at least 3 characters")
      .max(100, "Bank Name must be less than 100 characters"),
    bank_city: Yup.string().required("Bank City is required"),
    branch_name: Yup.string()
      .required("Branch Name is required")
      .min(3, "Branch Name must be at least 3 characters")
      .max(100, "Branch Name must be less than 100 characters"),
  }),
});

// role basedCharge  schema
export const roleBasedSchema = () =>
  Yup.object({
    user_type: Yup.object({
      label: Yup.string().required("Agent Type is required"),
      value: Yup.number().required("Agent Type is required"),
    }).required("Agent Type is required"),

    payment_amount: Yup.string().when("payment_status", {
      is: "1", // Only validate if Yes is selected
      then: (schema) => schema.required("Payment Amount is required"),
      otherwise: (schema) => schema.notRequired(),
    }),
  });

export const examSchema = (isAdmin) =>
  Yup.object({
    exam: Yup.array()
      .min(1, "At least one exam preference is required")
      .test("validate-exam-items", "Invalid exam data", function (examArray) {
        if (!examArray || examArray.length === 0) return true;

        const errors = [];

        examArray.forEach((item, index) => {
          const isFirstItem = index === 0;

          if (isFirstItem && !item.preferred_exam_date) {
            errors.push(
              this.createError({
                path: `exam[${index}].preferred_exam_date`,
                message: "Preferred Exam Date is required",
              })
            );
          } else if (
            item.preferred_exam_date &&
            typeof item.preferred_exam_date === "string"
          ) {
            const parsed = DateTime.fromFormat(
              item.preferred_exam_date,
              "dd-MM-yyyy"
            );
            if (!parsed.isValid) {
              errors.push(
                this.createError({
                  path: `exam[${index}].preferred_exam_date`,
                  message: "Invalid date format",
                })
              );
            }
          }

          // Validate preferred_language
          if (isFirstItem && !item.preferred_language) {
            errors.push(
              this.createError({
                path: `exam[${index}].preferred_language`,
                message: "Preferred Language is required",
              })
            );
          }

          // Validate state
          if (isFirstItem && !item.state) {
            errors.push(
              this.createError({
                path: `exam[${index}].state`,
                message: "State is required",
              })
            );
          }

          // Validate exam_center
          if (isFirstItem && !item.exam_center) {
            errors.push(
              this.createError({
                path: `exam[${index}].exam_center`,
                message: "Exam Center is required",
              })
            );
          }

          // Validate center_address
          if (isFirstItem && !item.center_address) {
            errors.push(
              this.createError({
                path: `exam[${index}].center_address`,
                message: "Center Address is required",
              })
            );
          } else if (item.center_address && item.center_address.length < 10) {
            errors.push(
              this.createError({
                path: `exam[${index}].center_address`,
                message: "Center Address must be at least 10 characters",
              })
            );
          }
        });

        if (errors.length > 0) {
          throw new Yup.ValidationError(errors);
        }

        return true;
      }),
    ...(isAdmin && {
      roll_no: Yup.string()
        .required("URN No is required")
        .min(6, "Roll No must be more than 5 characters")
        .test(
          "no-repeating-numbers",
          "URN No. cannot have all identical digits",
          (value) => {
            if (!value) return false;
            return !/^(\d)\1+$/.test(value);
          }
        ),
      selected_date: Yup.string().required("Selected Date is required"),
      // hall_ticket_path: fileValidation,
    }),
  });

export const documentsSchema = (type) =>
  Yup.object({
    documents: Yup.object({
      profile_photo: fileValidationWithLabel("Profile photo"),

      highest_education_qualification: Yup.mixed().required(
        "Highest Qualification is required"
      ),
      education_document: fileValidationWithLabel("Education document"),
      pan_card_photo: fileValidationWithLabel("Pan card"),
      aadhar_card_front: fileValidationWithLabel("Aadhar card front"),
      aadhar_card_back: fileValidationWithLabel("AAdhar card back"),
      bank_account: Yup.mixed().required("Bank Account is required"),
      cheque_copy: fileValidationWithLabel("Cheque"),
      license_status:
        type === "composite" || type === "transfer"
          ? Yup.mixed()
              .required("License Status is required")
              .test(
                "license_status",
                "License Status is required",
                function (value) {
                  const { type } = this.parent;
                  const isNewAgentType = type === "fresh" || type === "posp";
                  if (isNewAgentType) {
                    return true;
                  }
                  return !!value;
                }
              )
          : Yup.mixed().nullable(),
      select_docs:
        type === "composite"
          ? Yup.mixed().when("license_status", {
              is: (val) => val?.value === 0,
              then: (schema) => schema.required("This field is required"),
              otherwise: (schema) => schema.notRequired(),
            })
          : Yup.mixed().nullable(),
      commision_path:
        type === "composite"
          ? Yup.mixed().when("license_status", {
              is: (val) => val?.value === 0,
              then: (schema) => schema.required("This field is required"),
              otherwise: (schema) => schema.notRequired(),
            })
          : Yup.mixed().nullable(),
      license_path:
        type === "composite" || type === "transfer"
          ? Yup.mixed()
              .nullable()
              .test("file", "License is required", (value, context) => {
                const { license_status } = context.parent || {};
                const isNewAgentType = type === "fresh" || type === "posp";

                if (license_status?.value === 1 && !isNewAgentType) {
                  return (
                    (Array.isArray(value) && value.length > 0) ||
                    (value && value.length > 0)
                  );
                }
                return true;
              })
          : Yup.mixed().nullable(),

      noc_path:
        type === "transfer"
          ? fileValidationWithLabel("Noc")
          : Yup.mixed().nullable(),
      // doc1C: type === "transfer" ? fileValidation : Yup.mixed().nullable(),
      signature: fileValidationWithLabel("Signature"),

      noc_date:
        type === "transfer"
          ? Yup.string().required("NOC Date is required").nullable()
          : Yup.string().nullable(),
    }),
  });
