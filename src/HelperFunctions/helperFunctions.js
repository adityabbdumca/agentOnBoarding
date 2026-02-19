import { blockedDomains } from "@/constants/blockDomain";
import { DateTime } from "luxon";
export const verifyValidPincode = (e) => {
  const value = e.target.value;
  const sanitizedValue = value.replace(/^0+|[^0-9]/g, "");
  return sanitizedValue; // Return the sanitized value
};

export const handleAddressChange = (e) => {
  const sanitizedValue = e.target.value.replace(
    /[^A-Za-z0-9\s,.\-\/]|(\s{2,})/g,
    ""
  );
  return (e.target.value = sanitizedValue);
};
export const verifyValidNumbers = (e) => {
  const value = e.target.value;
  const sanitizedValue = value.replace(/^[0-5][0-9]*$|\D/g, "");
  return sanitizedValue;
};

const removeLastChar = (e, cursorPos) => {
  const value = e.target.value;
  e.target.value = value.slice(0, cursorPos - 1) + value.slice(cursorPos);
  e.target.setSelectionRange(cursorPos - 1, cursorPos - 1);
};

export const verifyValidEmail = (e) => {
  let value = e.target.value.toLowerCase();
  const cursorPos = e.target.selectionStart;

  const isValidChar = /^[a-z0-9@._-]*$/.test(value);
  const atCount = (value.match(/@/g) || []).length;
  const atIndex = value.indexOf("@");

  // Rule 1: Only a-z, 0-9, @, .
  if (!isValidChar) {
    removeLastChar(e, cursorPos);
    return e.target.value;
  }

  // Rule 2: Only one @ allowed
  if (atCount > 1) {
    removeLastChar(e, cursorPos);
    return e.target.value;
  }

  // Rule 3: No digits allowed after @
  if (atIndex !== -1 && cursorPos > atIndex) {
    const justTypedChar = value[cursorPos - 1];
    if (/\d/.test(justTypedChar)) {
      removeLastChar(e, cursorPos);
      return e.target.value;
    }
  }

  e.target.value = value;
  return value;
};

export function formatIndianPrice(price) {
  const number = +price;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(number);
}

export const allowOnlyNumbers = (e) => {
  const sanitizedValue = e.target.value.replace(/[^0-9]/g, ""); // Remove non-numeric characters
  e.target.value = sanitizedValue; // Update the input value

  return sanitizedValue;
};

export const allowOnlyName = (e) => {
  const value = e.target.value;
  const sanitizedValue = value.replace(/[^A-Za-z-\s]|(\s{2,})/g, "");
  const upperCaseValue = sanitizedValue.replace(/\b\w/g, (l) =>
    l.toUpperCase()
  );
  e.target.value = upperCaseValue;
  return upperCaseValue;
};
export const allowOnlyNameWithDot = (e) => {
  const value = e.target.value;
  const sanitizedValue = value.replace(/[^A-Za-z.\-\s]|(\s{2,})/g, "");
  const upperCaseValue = sanitizedValue.replace(/\b\w/g, (l) =>
    l.toUpperCase()
  );
  e.target.value = upperCaseValue;
  return upperCaseValue;
};
export const allowOnlyLastName = (e) => {
  const value = e.target.value;
  // Allow letters, spaces, hyphens, dots, and prevent multiple spaces
  const sanitizedValue = value.replace(/[^A-Za-z.\-\s]|(\s{2,})/g, "");
  const upperCaseValue = sanitizedValue.replace(/\b\w/g, (l) =>
    l.toUpperCase()
  );
  e.target.value = upperCaseValue;
  return upperCaseValue;
};

export const alphanumeric = (e, maxLength = 100) => {
  const value = e.target.value;
  let filteredValue = value.replace(/[^a-zA-Z0-9]/g, "");
  e.target.value = filteredValue;
  if (maxLength && filteredValue.length > maxLength) {
    filteredValue = filteredValue.slice(0, maxLength);
  }
  e.target.value = filteredValue;
};

export const alphanumericWithSpace = (e) => {
  const value = e.target.value;
  let filteredValue = value.replace(/[^a-zA-Z0-9 ]/g, "");
  filteredValue = filteredValue.replace(/\s+/g, " ");
  filteredValue = filteredValue.trimStart();
  e.target.value = filteredValue;
};
export const dynamicAlphaNumeric = (e, allowChar = [], maxLength = 100) => {
  const value = e.target.value;
  const allowedChars = allowChar
    .map((char) => char.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&"))
    .join("");
  const regex = new RegExp(`[^a-zA-Z0-9 ${allowedChars}]`, "g");
  let filteredValue = value.replace(regex, "");
  filteredValue = filteredValue.replace(/\s+/g, " ");
  filteredValue = filteredValue.trimStart();
  if (maxLength && filteredValue.length > maxLength) {
    filteredValue = filteredValue.slice(0, maxLength);
  }
  e.target.value = filteredValue;
};
export const allowPanCard = (e) => {
  const sanitizedValue = e.target.value.replace(/^[A-Z]{5}\d{4}[A-Z]{1}$/, "");

  return (e.target.value = sanitizedValue);
};

export const handleKeyUp = (e, index, fieldName = "otp") => {
  const container = document.getElementById(fieldName); // scope to correct group
  if (!container) return;

  const inputFields = container.querySelectorAll("input");
  const currentInput = inputFields[index];
  const nextInput = inputFields[index + 1];
  const prevInput = inputFields[index - 1];

  if (
    e.key !== "Backspace" &&
    currentInput.value.length === currentInput.maxLength
  ) {
    nextInput?.focus();
  } else if (e.key === "Backspace" && currentInput.value.length === 0) {
    prevInput?.focus();
  }
};

export const formatAadhaarInput = (e, maxLength) => {
  const input = e.target;
  let value = input.value;
  let cleaned = value.replace(/\D/g, ""); // Keeps only digits
  cleaned = cleaned.slice(0, maxLength);

  let formatted = cleaned;
  if (cleaned.length > 0) {
    formatted = cleaned.match(/.{1,4}/g)?.join("-") ?? "";
  }
  input.value = formatted;
};

export const formatAadhaarOnPrefill = (value) => {
  // const onlyDigits = value?.replace(/\D/g, "") ?? "";
  return (value || "").match(/.{1,4}/g)?.join("-") ?? "";
};

export const handleIndianPhoneInput = (e) => {
  let input = e.target.value;

  // Allow only digits and optional + at the beginning
  input = input.replace(/[^\d+]/g, "");

  // If "+" exists, ensure it’s only at the beginning
  if (input.includes("+")) {
    input = "+" + input.replace(/\+/g, "");
  }

  // Optional: Limit total length (e.g., max 13 for +91XXXXXXXXXX)
  if (input.startsWith("+")) {
    input = input.slice(0, 13);
  } else {
    input = input.slice(0, 10);
  }

  e.target.value = input;
};

export const handleIFSCInput = (e) => {
  let value = e.target.value.toUpperCase(); // Ensure uppercase
  // Allow only up to 11 alphanumeric characters
  value = value.replace(/[^A-Z0-9]/g, "").slice(0, 11);
  e.target.value = value;
};

export const validateContactNumber = (e) => {
  let value = e.target.value;

  // Remove non-numeric characters
  value = value.replace(/\D/g, "");

  // Ensure the first digit is 6 or more
  if (value && parseInt(value[0], 10) < 6) {
    value = value.slice(1);
  }

  e.target.value = value;
};

export const getYearOptionsFromDOB = (dob) => {
  if (!dob) return [];

  // Parse using Luxon with correct format
  const dobDate = DateTime.fromFormat(dob, "dd-MM-yyyy");

  if (!dobDate.isValid) return [];

  const birthYear = dobDate.year;
  const minYear = birthYear + 12;
  const currentYear = DateTime.now().year;

  if (minYear > currentYear) return [];

  const years = [];
  for (let year = currentYear; year >= minYear; year--) {
    years.push({ label: year.toString(), value: year.toString() });
  }

  return years;
};
export function validateEmail(email) {
  if (!email || email.trim() === "") {
    return "E-Mail Id is required";
  }
  if (email.length > 100) {
    return "E-Mail must be less than 100 characters";
  }
  const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z.-]+\.(com|in|net)$/;
  if (!regex.test(email)) {
    return "Invalid email format. Please check and try again.";
  }
  const isBlocked = blockedDomains.some((domain) =>
    email.toLowerCase().endsWith("@" + domain.toLowerCase())
  );
  if (isBlocked) {
    return "Emails from this domain are not allowed";
  }
  return null; // means valid
}

// eg. removeCharAddSpace('Hello-World', '-') = hello world
export const removeCharAddSpace = (str, char) => {
  return str.replace(new RegExp(char, "g"), " ");
};

export const formatDate = ({ value, format }) => {
  if (!value) return "";

  if (!DateTime.fromISO(value).isValid) {
    return value;
  }
  if (format === "relative") {
    return (
      DateTime.fromISO(value).toRelative({
        style: "short",
      }) || ""
    );
  }
  return DateTime.fromISO(value).toFormat(format || "dd-MM-yyyy, hh:mm a");
};
