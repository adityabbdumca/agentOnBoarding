import * as Yup from "yup";
import { DateTime } from "luxon";
// Common file validation
const fileValidation = Yup.mixed()
  .required("Supporting document is required")
  .test("fileSize", "File size is too large (max 10 MB)", (files) => {
    if (!files) return false;
    return files?.[0]?.size <= 5 * 1024 * 1024;
  })
  .test("fileType", "Only JPG, PNG, or PDF files are allowed", (files) => {
    if (!files) return false;
    const allowed = ["image/png", "image/jpeg", "application/pdf"];
    return allowed.includes(files?.[0]?.type);
  });

const dropdownRequired = (message) =>
  Yup.mixed()
    .nullable()
    .required(message)
    .test("dropdown-val", message, (val) => {
      if (!val) return false;
      if (typeof val.value === "string") {
        return val.value.trim().length > 0;
      }
      return !!val.value;
    });

export const endorsementLicenseSchema = Yup.object({
  agent_name: Yup.string().required("Agent Name is required"),
  agent_id: Yup.mixed().required("Agent ID is required"),

  license: Yup.array()
    .of(
      Yup.object({
        insurer_type: dropdownRequired("Insurer Type is required"),
        name_of_issurer: dropdownRequired("Name of insurer is required"),

        agency_code: Yup.string()
          .required("Agency code is required")
          .min(5, "Agency Code must be at least 5 characters"),

        date_of_agent_appointment: Yup.string().required(
          "License Start Date is required"
        ),
      })
    )
    .min(1, "At least one license entry is required"),
});
