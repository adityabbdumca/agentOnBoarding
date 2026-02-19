import { fileValidation } from "@/modules/OnboardingDetails/Schema";
import * as Yup from "yup";

export const bankServiceSchema = () => {
  return Yup.object({
    // --- Common ---
    agent_name: Yup.string().required("Agent Name is required"),
    agent_id: Yup.mixed().required("Agent ID is required"),

    // --- Current Bank Details ---
    current_account_type: Yup.string().required("Account Type is required"),
    current_name_as_in_bank_acount: Yup.string()
      .required("Name as in Bank Account is required")
      .min(3, "Name as in Bank Account must be at least 3 characters")
      .max(100, "Name as in Bank Account must be less than 100 characters"),
    current_bank_account_number: Yup.string()
      .required("Bank Account Number is required")
      .min(9, "Bank Account Number must be at least 9 - 20 digits"),
    current_re_enter_bank_account_number: Yup.string()
      .required("Re-Enter Bank Account Number is required")
      .test(
        "re-enter",
        "Entered account numbers do not match. Please re-enter.",
        function (value) {
          return value === this.parent.current_bank_account_number;
        }
      ),
    current_ifsc_code: Yup.string()
      .required("IFSC Code is required")
      .matches(
        /^[A-Za-z]{4}0[A-Z0-9a-z]{6}$/,
        "Please enter a valid 11-digit alphanumeric IFSC code."
      ),
    current_bank_name: Yup.string()
      .required("Bank Name is required")
      .min(3, "Bank Name must be at least 3 characters")
      .max(100, "Bank Name must be less than 100 characters"),
    current_bank_city: Yup.string().required("Bank City is required"),
    current_branch_name: Yup.string()
      .required("Branch Name is required")
      .min(3, "Branch Name must be at least 3 characters")
      .max(100, "Branch Name must be less than 100 characters"),
    // current_document_type: Yup.mixed().required("Document Type is required"),
    // current_address_proof: fileValidation,

    // --- New Bank Details ---

    new_account_type: Yup.mixed().required("Account Type is required"),
    new_name_as_in_bank_acount: Yup.string()
      .required("Name as in Bank Account is required")
      .min(3, "Name as in Bank Account must be at least 3 characters")
      .max(100, "Name as in Bank Account must be less than 100 characters"),
    new_bank_account_number: Yup.string()
      .required("Bank Account Number is required")
      .min(9, "Bank Account Number must be at least 9 - 20 digits"),
    new_re_enter_bank_account_number: Yup.string()
      .required("Re-Enter Bank Account Number is required")
      .test(
        "re-enter",
        "Entered account numbers do not match. Please re-enter.",
        function (value) {
          return value === this.parent.new_bank_account_number;
        }
      ),
    new_ifsc_code: Yup.string()
      .required("IFSC Code is required")
      .matches(
        /^[A-Za-z]{4}0[A-Z0-9a-z]{6}$/,
        "Please enter a valid 11-digit alphanumeric IFSC code."
      ),
    new_bank_name: Yup.string()
      .required("Bank Name is required")
      .min(3, "Bank Name must be at least 3 characters")
      .max(100, "Bank Name must be less than 100 characters"),
    new_bank_city: Yup.string().required("Bank City is required"),
    new_branch_name: Yup.string()
      .required("Branch Name is required")
      .min(3, "Branch Name must be at least 3 characters")
      .max(100, "Branch Name must be less than 100 characters"),
    new_document_type: Yup.mixed().required("Document Type is required"),
    supporting_documents: fileValidation,
  });
};
