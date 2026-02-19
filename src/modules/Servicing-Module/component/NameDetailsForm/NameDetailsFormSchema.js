import { fileValidation } from "@/modules/OnboardingDetails/Schema";
import * as Yup from "yup";

export const nameDetailsSchema = () => {
  return Yup.object({
    agent_name: Yup.string().required("Agent Name is required"),
    agent_id: Yup.mixed().required("Agent ID is required"),
    // 🔹 current_ fields
    // current_salutation: Yup.string().required("Salutation is required"),

    current_first_name: Yup.string()
      .required("First Name is required")
      .min(2, "First Name must be at least 2 characters")
      .max(100, "First Name must be less than 100 characters"),
    // current_middle_name: Yup.string()
    //   .min(2, "Middle Name must be at least 2 characters")
    //   .max(100, "Middle Name must be less than 100 characters"),
    current_last_name: Yup.string()
      .required("Last Name is required")
      .min(1, "Last Name must be at least 2 characters")
      .max(100, "Last Name must be less than 100 characters"),

    // 🔹 new_ fields

    // new_salutation: Yup.mixed().required("Salutation is required"),
    new_first_name: Yup.string()
      .required("First Name is required")
      .min(2, "First Name must be at least 2 characters")
      .max(100, "First Name must be less than 100 characters"),
    // new_middle_name: Yup.string()
    //   .min(2, "Middle Name must be at least 2 characters")
    //   .max(100, "Middle Name must be less than 100 characters"),
    new_last_name: Yup.string()
      .required("Last Name is required")
      .min(1, "Last Name must be at least 2 characters")
      .max(100, "Last Name must be less than 100 characters"),
    new_document_type: Yup.mixed().required("Document Type is required"),
    supporting_documents: fileValidation,
  });
};
