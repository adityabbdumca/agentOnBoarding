import styled from "styled-components";
import { useDeleteTheme, useSetTheme } from "../service";
import { useEffect } from "react";
import { HiOutlinePencilAlt, HiTrash } from "react-icons/hi";
import { ActionContainer } from "@/UI-Components/GlobalStyles";
import CustomSwitch from "@/UI-Components/CustomSwitch";

// Styled Components
const ThemePreviewContainer = styled.div`
  margin-top: ${({ width }) => (width ? "0px" : "35px")};
  border: 1px solid #dee2e6;
  padding: 8px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: ${(props) => props.width};
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 16px;
`;

const HeaderText = styled.h6`
  font-size: 0.75rem; /* Same as text-xs */
  color: #333;
  margin: 0;
`;

const ColorPreviewContainer = styled.div`
  height: 150px;
  background-color: #979797;
  display: flex;
`;

const ColorBlock = styled.div`
  flex: 1;
  background-color: ${({ color }) => color || "#f0f0f0"};
`;

const ThemePreview = ({
  colorValue,
  control,
  width,
  setValue,
  onClick,
  watch,
}) => {
  useEffect(() => {
    setValue &&
      setValue(`status${colorValue["id"]}`, colorValue["status"] || false);
  }, [colorValue]);

  const { mutate } = useSetTheme();

  const { mutate: deleteTheme } = useDeleteTheme();
  return (
    <ThemePreviewContainer width={width}>
      <Header>
        <HeaderText>{colorValue["themeName"] || "Theme Preview"}</HeaderText>
      </Header>
      <ColorPreviewContainer>
        <ColorBlock color={colorValue["primaryColor"]} />
        <ColorBlock color={colorValue["secondaryColor"]} />
        <ColorBlock color={colorValue["tertiaryColor"]} />
        <ColorBlock color={colorValue["buttonsColor"]} />
        <ColorBlock color={colorValue["textColor"]} />
      </ColorPreviewContainer>
      {width && (
        <div className="flex justify-between items-center mt-2">
          <CustomSwitch
            name={`status${colorValue["id"]}`}
            control={control}
            defaultValue={colorValue["status"] || false}
            onChange={() => [mutate({ id: colorValue["id"] })]}
            disabled={watch(`status${colorValue["id"]}`)}
          />
          <ActionContainer>
            <div>
              <HiOutlinePencilAlt onClick={() => onClick()} />
            </div>
            <div>
              <HiTrash onClick={() => deleteTheme({ id: colorValue["id"] })} />
            </div>
          </ActionContainer>
        </div>
      )}
    </ThemePreviewContainer>
  );
};

export default ThemePreview;
