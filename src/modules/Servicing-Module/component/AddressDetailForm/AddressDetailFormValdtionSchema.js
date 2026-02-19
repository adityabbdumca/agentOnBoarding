import { fileValidation } from "@/modules/OnboardingDetails/Schema";
import * as Yup from "yup";

export const addressServiceSchema = (validationType) => {
  const isCommunication = validationType === "communication";

  const requiredString = (msg) => Yup.string().required(msg);

  const requiredPincode = (msg) =>
     Yup.string()
          .required(msg)
          .matches(/^\d{6}$/, "Pincode must be a 6-digit number");

  const requiredMixed = (msg) => Yup.mixed().required(msg);

  return Yup.object({
    agent_name: Yup.string().required("Agent Name is required"),
    agent_id: Yup.mixed().required("Agent ID is required"),

    // --- Current Address ---
    [`current_${validationType}_pincode`]: requiredPincode(
      "Pincode is required"
    ),
    [`current_${validationType}_address_line_1`]: Yup.string()
            .required("Address is required"),
           // .min(10, "Address must be at least 10 characters"),
    [`current_${validationType}_address_line_2`]:
      requiredString("Street is required"),
    [`current_${validationType}_city`]: requiredString("City is required"),
    [`current_${validationType}_state`]: requiredString("State is required"),

    // --- New Address ---
    [`new_${validationType}_pincode`]: requiredPincode("Pincode is required"),
    [`new_${validationType}_address_line_1`]: requiredString(
      "Address is required"
    ).min(10, "Address must be at least 10 characters"),
    [`new_${validationType}_address_line_2`]:
      requiredString("Street is required"),
    [`new_${validationType}_city`]: requiredString("City is required"),
    [`new_${validationType}_state`]: requiredString("State is required"),

    [`new_${validationType}_document_type`]: requiredMixed(
      "Document Type is required"
    ),

    supporting_documents: fileValidation,
    comments: Yup.string().nullable(),
  }).test("address-not-same", null, function (values) {
  if (!values || isCommunication) return true;

  const fields = ["pincode", "address_line_1", "address_line_2", "city", "state"];
  const allSame = fields.every(
    (f) =>
      values[`current_${validationType}_${f}`] ===
      values[`new_${validationType}_${f}`]
  );

  if (allSame) {
    return this.createError({
      path: "address_all_field", // attach error to a field
      message: "New address must not be exactly same as current address",
    });
  }

  return true;
})}
