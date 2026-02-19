import { useState } from "react";
import ThemeForm from "./Components/ThemeForm";
import Drawer from "@/UI-Components/Drawer";
import { useGetTheme } from "./service";
import ThemePreview from "./Components/ThemePreview";
import Button from "@/UI-Components/Button";
import styled from "styled-components";
import { useForm } from "react-hook-form";
import MainContainer from "../OnboardingDetails/Components/MainContainer";
import { IoColorPalette } from "react-icons/io5";
const ThemeIndex = () => {
  const { control, setValue, watch } = useForm();
  const [open, setOpen] = useState({
    open: false,
    data: null,
    modalTitle: "Add",
  });

  const { data: themeColor } = useGetTheme();

  return (
    <MainContainer
      heading={"Theme Configuration"}
      pageActions={
        <Button
          width={"auto"}
          variant="outlined"
          startIcon={<IoColorPalette />}
          onClick={() => {
            setOpen({
              open: true,
              data: null,
              modalTitle: "Add",
            });
          }}
        >
          Add Theme
        </Button>
      }
      subHeading={"View and manage the list of themes"}
    >
      <FlexDiv>
        {themeColor?.data?.return_data &&
          themeColor.data.return_data.map((item) => (
            <ThemePreview
              colorValue={item}
              key={item?.id}
              width={"300px"}
              control={control}
              setValue={setValue}
              watch={watch}
              onClick={() =>
                setOpen({ open: true, data: item, modalTitle: "Edit" })
              }
            />
          ))}
      </FlexDiv>
      <Drawer
        isOpen={open.open}
        onClose={() =>
          setOpen({
            open: false,
            data: null,
            modalTitle: "",
          })
        }
        width={"400px"}
      >
        <ThemeForm data={open} setOpen={setOpen} />
      </Drawer>
    </MainContainer>
  );
};

export default ThemeIndex;

export const FlexDiv = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  align-items: center;
`;
