import * as yup from "yup";
export const ckycValidationSchema = yup
  .object()
  .shape({
    ckyc: yup
      .string()
      .oneOf(["Y", "N"], "Please select Yes or No")
      .required("Please select Yes or No"),

    ckyc_number: yup.string().when("ckyc", {
      is: "Y",
      then: (schema) =>
        schema
          .nullable()
          .test("ckyc-length", "Ckyc Number must be 14 digits", (value) => {
            if (!value) return true;
            const digits = value.replace(/-/g, "");
            return digits.length === 14;
          })
          .test(
            "not-sequential",
            "CKYC Number cannot be sequential numbers",
            (value) => {
              if (!value) return true;
              const digits = value.replace(/\D/g, "");
              const isSequential =
                /^(0123456789|1234567890|9876543210|0987654321)/.test(digits) ||
                /^(\d)\1+$/.test(digits);
              return !isSequential;
            }
          ),
      otherwise: (schema) => schema.strip(),
    }),

    aadhar_number: yup.string().when("ckyc", {
      is: "Y",
      then: (schema) =>
        schema
          .nullable()
          .test(
            "aadhaar-length",
            "Aadhaar Number must be 12 digits",
            (value) => {
              if (!value) return true;
              const digits = value.replace(/-/g, "");
              return digits.length === 12;
            }
          )
          .test(
            "not-all-zeros",
            "Aadhaar Number cannot be all zeros",
            (value) => {
              if (!value) return true;
              const digits = value.replace(/-/g, "");
              return digits !== "000000000000";
            }
          ),
      otherwise: (schema) => schema.strip(),
    }),

    pan_number: yup.string().when("ckyc", {
      is: "Y",
      then: (schema) =>
        schema
          .nullable()
          .test(
            "pan-format",
            "PAN Number must be in format ABCPU1234F",
            (value) => {
              if (!value) return true;
              return /^[A-Z]{3}P[A-Z][0-9]{4}[A-Z]{1}$/i.test(value);
            }
          )
          .test(
            "not-invalid-pan",
            "Please enter a valid PAN Number",
            (value) => {
              if (!value) return true;
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
      otherwise: (schema) => schema.strip(),
    }),

    no_ckyc_aadhar_number: yup.string().when(["ckyc"], {
      is: (ckyc) => ckyc === "N",
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
      otherwise: (schema) => schema.strip(),
    }),

    no_ckyc_pan_number: yup.string().when(["ckyc"], {
      is: (ckyc) => ckyc === "N",
      then: (schema) =>
        schema
          .required("PAN Number is required")
          .matches(/^[A-Z]{3}P[A-Z][0-9]{4}[A-Z]{1}$/i, "Invalid PAN format.")
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
      otherwise: (schema) => schema.strip(),
    }),

    pan_card_photo: yup.mixed().when(["ckyc"], {
      is: (ckyc) => ckyc === "N",
      then: (schema) =>
        schema
          .required("PAN Card photo is required")
          .test("file", "PAN Card photo is required", (value) => {
            return (Array.isArray(value) && value.length > 0) || !!value;
          }),
      otherwise: (schema) => schema.strip(),
    }),

    aadhar_card_front: yup.mixed().when(["ckyc"], {
      is: (ckyc) => ckyc === "N",
      then: (schema) =>
        schema
          .required("Aadhaar Card front is required")
          .test("file", "Aadhaar Card front is required", (value) => {
            return (Array.isArray(value) && value.length > 0) || !!value;
          }),
      otherwise: (schema) => schema.strip(),
    }),

    aadhar_card_back: yup.mixed().when(["ckyc"], {
      is: (ckyc) => ckyc === "N",
      then: (schema) =>
        schema
          .required("Aadhaar Card back is required")
          .test("file", "Aadhaar Card back is required", (value) => {
            return (Array.isArray(value) && value.length > 0) || !!value;
          }),
      otherwise: (schema) => schema.strip(),
    }),
  })
  .test(
    "at-least-one-id",
    "Either CKYC Number, Aadhaar Number, or PAN Number is required",
    function (values) {
      if (values.ckyc === "Y") {
        if (values.ckyc_number || values.aadhar_number || values.pan_number) {
          return true;
        }

        return this.createError({
          path: "ckyc_number",
          message:
            "Either CKYC Number, Aadhaar Number, or PAN Number is required",
        });
      }
      return true;
    }
  );
