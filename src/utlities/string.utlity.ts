import React from "react";

// Add string utilities
const addEllipsisAtEnd = (str: string, len: number): string => {
  return str?.length > len ? str.substring(0, len) + "..." : str;
};



export const onlyAlphabets = (
  event: React.ChangeEvent<HTMLInputElement>,
  len: number = 50
) => {
  let { value } = event.target;
  if (value.startsWith(" ")) {
    value = value.trimStart();
  }
  value = value.charAt(0).toUpperCase() + value.slice(1);
  value = value.replace(/[^a-zA-Z ]/g, "");
  value = value.replace(/\s{2,}/g, " ");
  value = value.slice(0, len);
  event.target.value = value;
};
export const stringUtility = {
  addEllipsisAtEnd,
  onlyAlphabets
};