import React from "react";

export const validatePAN = (event: React.ChangeEvent<HTMLInputElement>) => {
  const { value } = event.target;

  if (value && !/^[A-Z]{3}P[A-Z][0-9]{4}[A-Z]$/.test(value.toUpperCase())) {
    return "Invalid PAN format. Please enter a valid 10-character PAN.";
  }

  return null;
};
export const panValidation = (e: React.ChangeEvent<HTMLInputElement>) => {
  let value = e.target.value.toUpperCase();

  // Allow only A-Z and 0-9
  value = value.replace(/[^A-Z0-9]/g, "");

  // Structure enforcement
  let formatted = "";

  // First 5 letters
  if (value.length > 0) formatted += value.slice(0, 5).replace(/[^A-Z]/g, "");
  // Next 4 digits
  if (value.length > 5) formatted += value.slice(5, 9).replace(/[^0-9]/g, "");
  // Last letter
  if (value.length > 9) formatted += value.slice(9, 10).replace(/[^A-Z]/g, "");

  e.target.value = formatted.slice(0, 10);
};


export const allowOnlyNumbers = (
  e: React.ChangeEvent<HTMLInputElement>,
  maxLength?: number
) => {
  let sanitizedValue = e.target.value.replace(/[^0-9]/g, ""); // only digits

  if (maxLength) {
    sanitizedValue = sanitizedValue.slice(0, maxLength); // limit length
  }

  e.target.value = sanitizedValue; // update UI value

  return sanitizedValue;
};
