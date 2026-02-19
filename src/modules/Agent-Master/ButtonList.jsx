import React from "react";
import { filterArray } from "./AgentMasterIndex";
import { Checkbox, FormControlLabel } from "@mui/material";
import { useSelector } from "react-redux";
import { Controller, useForm } from "react-hook-form";
import Button from "@/UI-Components/Button";

const ButtonList = ({ setButtonArray, buttonArray }) => {
  const { theme } = useSelector((state) => state.theme);
  const { control, handleSubmit } = useForm();
  const onSubmit = (data) => {
    // I want to filter the buttonArray based on the data
    const filteredArray = buttonArray.filter((item) => data[item?.stage]);
    setButtonArray(filteredArray);
    setOpenStageFilter(false);
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div style={{ display: "flex", flexDirection: "column" }}>
        {filterArray.map((item) => (
          <Controller
            key={item?.id}
            name={item?.stage}
            control={control}
            render={({ field }) => (
              <FormControlLabel
                control={
                  <Checkbox
                    {...field}
                    name={item?.stage}
                    // defaultChecked={buttonArray
                    //   .map((val) => val?.stage)
                    //   .includes(item?.stage)}
                    onChange={(e) => field.onChange(e.target.checked)}
                    control={control}
                    size="small"
                    sx={{ "&.Mui-checked": { color: theme.primaryColor } }}
                  />
                }
                label={item?.stage}
              />
            )}
          />
        ))}
        <Button type="submit">Submit</Button>
      </div>
    </form>
  );
};

export default ButtonList;
