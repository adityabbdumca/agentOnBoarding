import { Controller } from "react-hook-form";
import Select, { components } from "react-select";
import { useSelector } from "react-redux";
import { Error } from "./GlobalStyles";
import { Tooltip } from "@mui/material";
import { useController } from "react-hook-form";
import { HiOutlineInformationCircle } from "react-icons/hi";

const CustomOption = (props) => {
  const { data } = props;

  return (
    <Tooltip
      title={data.tooltip || ""}
      arrow
      placement="right"
      enterDelay={300}
      leaveDelay={100}
      slotProps={{
        tooltip: {
          sx: {
            bgcolor: "white",
            color: "black",
            border: "1px solid #ccc",
            fontSize: "12px",
            maxWidth: "300px",
            whiteSpace: "pre-line",
            "& .MuiTooltip-arrow": {
              color: "white",
              "&:before": {
                border: "1px solid #ccc",
              },
            },
          },
        },
      }}>
      <div>
        <components.Option {...props} />
      </div>
    </Tooltip>
  );
};

const Dropdown = ({
  control,
  name,
  label,
  placeholder,
  errors,
  isRequired,
  Height,
  isMulti,
  modern = false,
  brokerDataShuffle = false,
  isDisabled = false,
  options,
  readOnly,
  onChange,
  description = "",
  labelKey = "label",
  valueKey = "value",
  ...rest
}) => {
  const { theme } = useSelector((state) => state.theme);
  // const { errorMessage } = useGetConditionalErrorMessage({
  //   errors,
  //   id: name,
  // });
  const { fieldState } = useController({
    control,
    name,
  });
  const errorMessage = fieldState?.error?.message;
  // const customStyles = {

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      animation: errorMessage ? "shake 0.3s ease-in-out" : "none",
      width: "100%",
      border: errorMessage
        ? "2px solid red"
        : state.isFocused
          ? `2px solid ${theme?.primaryColor}`
          : modern
            ? "none"
            : "2px solid #E0E0E0",
      borderRadius: "8px",
      height: "40px",
      backgroundColor: state.isDisabled
        ? "#f0f0f0"
        : readOnly
          ? "#F0F0F0"
          : !modern
            ? "transparent"
            : "#E2E2E2",

      fontSize: "12px",
      minHeight: 40,
      maxHeight: isMulti ? 80 : 48,
      boxShadow: state.isFocused ? "0 0 0 0.2rem transparent" : "none",
      padding: brokerDataShuffle ? "0 10px" : "0 5px",
      cursor: state.isDisabled
        ? "not-allowed"
        : readOnly
          ? "not-allowed"
          : "pointer",
      pointerEvents: "auto !important",
      "&:hover": {
        border:
          errors && !!errors[name]
            ? "2px solid red"
            : state.isFocused
              ? `2px solid ${theme?.primaryColor}`
              : "",
      },
    }),
    menu: (provided) => ({
      ...provided,
      zIndex: 100,
      margin: "5px 0 0 0",
      padding: 0,
      "& > div:first-type-of": {
        padding: "0",
        maxHeight: `${Height || 140}px !important`,
      },
      // To remove border of last option
      "* > div:last-child": {
        border: "none",
      },
      "*::-webkit-scrollbar": {
        width: "3px",
      },
      "*::-webkit-scrollbar-track": {
        backgroundColor: "lightgrey",
      },
      "*::-webkit-scrollbar-thumb": {
        backgroundColor: `${theme.inputLabelColor}`,
      },
    }),
    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
    dropdownIndicator: (provided) => ({
      ...provided,
      border: 0,
      padding: 0,
      display: isDisabled ? "none" : "",
    }),
    option: (styles, { isFocused, isSelected }) => ({
      ...styles,
      fontWeight: 600,
      letterSpacing: "0.5px",
      fontSize: "12px",
      fontFamily: theme?.fontFamily,
      color: `${theme.inputLabelColor}`,
      // borderBottom: `1px solid grey`,
      background: isSelected
        ? `${theme.secondaryColor}`
        : isFocused
          ? "#E8E8E8"
          : "",
      // overflow: "hidden",
      // textOverflow: "ellipsis",
      // whiteSpace: "nowrap",
      padding: "8px",
      cursor: "pointer",
      transition: "all 0.2s ease",
    }),
    placeholder: (provided) => ({
      ...provided,
      fontSize: "12px",
      opacity: 1,
      letterSpacing: "0.5px",
      fontFamily: theme?.fontFamily,
      color: "#757575",
      whiteSpace: "nowrap",
      textOverflow: "ellipsis",
      overflow: "hidden",
      cursor: "pointer",
    }),
    valueContainer: (provided, state) => {
      const selected_elements = state?.children?.[0];
      const is_more_than_four_selected =
        Array.isArray(selected_elements) && selected_elements?.length >= 3;
      return {
        ...provided,
        padding: "0",
        maxHeight: isMulti ? 64 : 32,
        overflowY: is_more_than_four_selected && "auto",
        "::-webkit-scrollbar": {
          width: "2px",
        },
        "::-webkit-scrollbar-track": {
          margin: "5px 0",
          backgroundColor: "lightgrey",
        },
        "::-webkit-scrollbar-thumb": {
          backgroundColor: "#2BB9A8",
        },
      };
    },
    indicatorsContainer: (provided) => ({
      ...provided,
      display: isDisabled ? "none" : "flex",
      padding: "0",
      "& div": {
        padding: "0",
        display: "flex",
        jsutifyContent: "center",
        alignItems: "center",
      },
      "& span": {
        display: "none",
      },
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "#000",
      fontFamily: theme.fontFamily,
    }),
    multiValue: (provided) => ({
      ...provided,
      color: theme.primaryColor,
      fontFamily: theme.fontFamily,
      borderRadius: "5px",
      margin: "5px",
      background: theme.secondaryColor,
      fontSize: "12px",
      fontWeight: "600",
    }),
    multiValueLabel: (provided) => ({
      ...provided,
      color: theme.primaryColor,
    }),
  };

  return (
    <div className="relative">
      <div className="flex justify-between mb-1">
        {label && (
          <label
            className="text-gray-700 text-xs font-semibold pl-1 truncate capitalize"
            data-required={isRequired}>
            {label}
            {isRequired && <span className="text-red-500 ml-0.5">*</span>}
          </label>
        )}
        {description && (
          <Tooltip title={description} arrow placement="top">
            <div>
              <HiOutlineInformationCircle
                className={"text-[0.75rem] ml-1 relative top-0"}
              />
            </div>
          </Tooltip>
        )}
      </div>
      <Controller
        control={control}
        name={name}
        defaultValue={rest?.defaultValue}
        render={({
          field: { onChange: defaultOnChange, ...field },
          fieldState: { error },
        }) => {
          return (
            <Select
              isDisabled={isDisabled}
              isRequired={isRequired}
              getOptionLabel={(e) => e?.[labelKey]?.toString() || ""}
              getOptionValue={(e) => e?.[valueKey]?.toString()}
              value={field?.value || rest?.defaultValue}
              options={options}
              onChange={(e) => {
                onChange?.(e);
                defaultOnChange(e);
              }}
              {...field}
              placeholder={placeholder}
              label={label}
              isClearable={true}
              isSearchable={true}
              isMulti={isMulti}
              styles={customStyles}
              errors={error && error?.message}
              // helperText={errorMessage}
              closeMenuOnSelect={!isMulti}
              maxMenuHeight={200}
              menuPortalTarget={document.body}
              className={`${isDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
              components={{
                Option: CustomOption,
              }}
              {...rest}
            />
          );
        }}
      />
      {!!errorMessage && <Error>{errorMessage}</Error>}
    </div>
  );
};

export default Dropdown;
