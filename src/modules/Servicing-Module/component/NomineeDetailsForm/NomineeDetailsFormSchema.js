import { fileValidation } from "@/modules/OnboardingDetails/Schema";
import * as Yup from "yup";

export const endorsementNomineeSchema = Yup.object({
  agent_name: Yup.string().required("Agent Name is required"),
  agent_id: Yup.mixed().required("Agent ID is required"),
  document: fileValidation,
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
          .typeError("Nominee Share % must be a number"),
        gender: Yup.mixed().required("Gender is required"),
        age: Yup.number()
          .required("Age is required")
          .max(100, "Age must be less than or equal to 100")
          .typeError("Age must be a valid number")
          .test(
            "age",
            "Nominee age must be at least 18 years greater than applicant's age for Father and Mother",
            function (value) {
              const {context}=this.options
              const applicantAge = context?.reportee_agents?.[0]?.agent_age ?? 18;
              const relation = this.parent?.relation_with_applicant?.value;;
              if (!value || !applicantAge) return true;
              const isFatherMother = ["Father", "Mother"].includes(relation);
              if (isFatherMother && value < applicantAge + 18) {
                return false;
              }
              return true;
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
    .test(
      "total-share-100",
      "Total Nominee Share should be 100%",
      function (nominees) {
        if (!Array.isArray(nominees)) return true;
        const sum = nominees.reduce((acc, nominee) => {
          return (
            acc + (isNaN(nominee.nominee_share) ? 0 : +nominee.nominee_share)
          );
        }, 0);

        if (sum !== 100) {
          return this.createError({
            path: `nominee[0].nominee_share`,
            message: "Total Nominee Share should be 100%",
          });
        }

        return sum === 100;
      }
    )
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
              ni?.age === nj?.age &&
              ni?.relation_with_applicant?.value ===
                nj?.relation_with_applicant?.value
            ) {
              return this.createError({
                path: `nominee[${j}].nominee_name`,
                message:
                  "Nominees with same name cannot have same age & relation with applicant",
              });
            }
          }
        }
        return true;
      }
    ),
});
