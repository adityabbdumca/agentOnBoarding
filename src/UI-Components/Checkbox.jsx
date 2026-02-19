import { Controller } from "react-hook-form";
import { useSelector } from "react-redux";
import styled from "styled-components";

function Checkbox({
  label,
  checkboxFirst,
  control,
  name,
  onClick,
  isDisabled,
  disabled,
  defaultValue,
  onChange,
  open,
  setOpen,
  isForBrokerageRule,
  keyName,
  tileVariant,
  justifyStart,
  flexDirection,
}) {
  const { theme } = useSelector((state) => state.theme);

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue ? defaultValue : false}
      render={({ field }) => (
        <MainContainer
          tileVariant={tileVariant}
          justifyStart={justifyStart}
          flexDirection={flexDirection}
          theme={theme}
        >
          {isForBrokerageRule && (
            <CheckboxStyled
              checkboxFirst={checkboxFirst}
              justifyStart={justifyStart}
              disabled={isDisabled}
              tileVariant={tileVariant}
              htmlFor={name}
            >
              {label}
            </CheckboxStyled>
          )}
          <input
            type="checkbox"
            {...field}
            id={name}
            checked={field.value}
            onClick={(e) => {
              if (onClick) {
                onClick(e);
              }
              if (isForBrokerageRule) {
                setOpen(!open);
              }
            }}
            onChange={(e) => [
              onChange && onChange(e),
              field?.onChange(e) && field.onChange(e),
            ]}
            disabled={
              isDisabled
                ? true
                : disabled
                ? field.value
                  ? false
                  : true
                : false
            }
          />
          {label && !isForBrokerageRule && (
            <label htmlFor={name}>{label}</label>
          )}
        </MainContainer>
      )}
    />
  );
}

export default Checkbox;

const MainContainer = styled.div`
  input[type="checkbox"] {
    display: ${({ tileVariant }) => (tileVariant ? "none" : "")};
  }
  input {
    cursor: pointer;
    accent-color: ${({ theme }) => theme.primaryColor};
  }
`;

const CheckboxStyled = styled.label`
  border-radius: 5px;
  padding: 10px 0;
  flex-grow: 1;
  pointer-events: ${(props) => props.disabled && "none"};
  display: flex;
  gap: 10px;
  flex-direction: ${(props) => (props.checkboxFirst ? "row-reverse" : "row")};
  justify-content: ${({ checkboxFirst }) =>
    checkboxFirst ? "flex-end" : "center"};
  label {
    color: ${(props) => props.disabled && "rgba(0, 0, 0, 0.5)"};
  }
  border: ${({ tileVariant }) => (tileVariant ? "1px solid #C4C4C4" : "")};
  border-radius: 8px;
  padding: ${({ tileVariant }) => (tileVariant ? "10px" : "")};
  cursor: pointer;
  background-color: ${({ tileVariant, isCheckboxCheckedStyle }) =>
    tileVariant && isCheckboxCheckedStyle ? "lightgrey" : "#FAFAFA"};
  :hover {
    background-color: ${({ isCheckboxCheckedStyle, tileVariant }) =>
      tileVariant ? (isCheckboxCheckedStyle ? "" : "#ededed") : ""};
  }
  transition: all 0.15s linear;
`;
