import { useLocation } from "react-router-dom";

export const useGetConditionalErrorMessage = ({ errors, id = "" }) => {
  const location = useLocation();
  const isReport = location.pathname === "/report-configurator-listing";

  let errorMessage = "";
  const isMultipleFieldsErrors = id?.includes(".");

  const get_fields_in_id = (id) => {
    const fieldData = id?.split(".");
    const memberPartToFormat = fieldData?.[0];
    const idPartForMutlipleFields = fieldData?.[1];
    const isMemberPartToFormatDirty = /[\[]/.test(memberPartToFormat);
    // const isMemberPartToFormatDirty = /\[/.test(memberPartToFormat);
    if (isMemberPartToFormatDirty) {
      const index = memberPartToFormat.indexOf("[");
      const memberPart = memberPartToFormat?.substring(0, index);
      const indexPart = memberPartToFormat?.substring(index);
      return [memberPart, indexPart, idPartForMutlipleFields];
    }

    if (id) {
      return id?.split(".");
    }

    return [];
  };

  const [memberPart, indexPart, fieldId] = get_fields_in_id(id);

  // To handle nested errors
  const getNestedErrorMessage = (errorObj, path) => {
    return path.reduce((acc, key) => acc && acc[key], errorObj);
  };
  const specificError = getNestedErrorMessage(errors, [
    memberPart,
    ...(indexPart ? [indexPart] : []),
    fieldId,
  ]);

  const index = indexPart?.split("")?.[1];
  if (specificError && isReport) {
    errorMessage = specificError?.message;
  } else if (isMultipleFieldsErrors && !errors?.[memberPart]) {
    errorMessage = errors?.[fieldId]?.message;
  } else if (isMultipleFieldsErrors && fieldId) {
    errorMessage = errors?.[memberPart]?.[index]?.[fieldId]?.message;
  } else if (isMultipleFieldsErrors) {
    errorMessage = errors?.[memberPart]?.[indexPart]?.message;
  } else {
    errorMessage = errors?.[id]?.message 
  }

  return { errorMessage };
};
