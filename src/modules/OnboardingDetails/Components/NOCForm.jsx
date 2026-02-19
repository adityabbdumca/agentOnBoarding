import { Grid2 } from "@mui/material";
import { allowOnlyName } from "@/HelperFunctions/helperFunctions";
import ButtonWrapper from "@/UI-Components/ButtonWrapper";
import Input from "@/UI-Components/Input";
import Button from "@/UI-Components/Button";
import Dropdown from "@/UI-Components/Dropdown";
import styled from "styled-components";
import { useCreateNOC } from "../service";
import { Controller } from "react-hook-form";
import UiDateInput from "@/UI-Components/UiDateInput";
import { DateTime } from "luxon";

const NOCForm = ({
  control,
  handleSubmit,
  watch,
  setValue,
  register,
  errors,
  id,
}) => {
  const { mutate } = useCreateNOC();

  const onSubmit = (data) => {
    mutate({
      ...data.noc,
      id,
      resignation_reason: data.noc.resignation_reason?.label,
    });
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
      <Grid2 container spacing={2}>
        <Grid2 item size={{ lg: 3, md: 6, sm: 12, xs: 12 }}>
          <Input
            label="Agent Name"
            inputRef={register("noc.agent_name")}
            placeholder={"Enter Agent Name"}
            isRequired={true}
            errors={errors}
            onChange={(e) => {
              return (e.target.value = allowOnlyName(e));
            }}
            name={"noc.agent_name"}
          />
        </Grid2>
        <Grid2 item size={{ lg: 3, md: 6, sm: 12, xs: 12 }}>
          <Input
            label="GC Code"
            inputRef={register("noc.gc_code")}
            placeholder={"Enter GC Code"}
            isRequired={true}
            errors={errors}
            name={"noc.gc_code"}
          />
        </Grid2>
        <Grid2 item size={{ lg: 3, md: 6, sm: 12, xs: 12 }}>
          <Input
            label="PAN No"
            inputRef={register("noc.pan_no")}
            placeholder={"Enter PAN No"}
            isRequired={true}
            errors={errors}
            name={"noc.pan_no"}
          />
        </Grid2>
        <Grid2 item size={{ lg: 3, md: 6, sm: 12, xs: 12 }}>
          <Input
            label="Agency Code"
            inputRef={register("noc.agency_code")}
            placeholder={"Enter Agency Code"}
            isRequired={true}
            errors={errors}
            name={"noc.agency_code"}
          />
        </Grid2>

        <Grid2 item size={{ lg: 3, md: 6, sm: 12, xs: 12 }}>
          <Input
            label="Agent Email"
            inputRef={register("noc.email")}
            placeholder={"Enter Agent Email"}
            isRequired={true}
            errors={errors}
            name={"noc.email"}
            type={"email"}
          />
        </Grid2>
        <Grid2 item size={{ lg: 3, md: 6, sm: 12, xs: 12 }}>
          <Input
            label="E-Mail Id"
            inputRef={register("noc.email")}
            placeholder={"Enter E-Mail Id"}
            isRequired={true}
            errors={errors}
            name={"noc.email"}
          />
        </Grid2>
        <Grid2 item size={{ lg: 3, md: 6, sm: 12, xs: 12 }}>
          <Input
            label="No of Proposal Pending for Submission"
            inputRef={register("noc.proposals_pending")}
            placeholder={"Enter No of Proposal Pending for Submission"}
            isRequired={true}
            errors={errors}
            name={"noc.proposals_pending"}
          />
        </Grid2>
        <Grid2 item size={{ lg: 12, md: 12, sm: 12, xs: 12 }}>
          <TableContainer>
            <Table>
              <thead>
                <tr>
                  <Th>REQUIREMENT</Th>
                  <Th>DEPOSITED</Th>
                  <Th>DEPOSITED DATE</Th>
                  <Th>REMARKS</Th>
                </tr>
              </thead>
              <tbody>
                <Tr>
                  <Td>Appointment letter</Td>
                  <Td>
                    <RadioGroup>
                      <RadioLabel
                        onClick={() =>
                          setValue("noc.appointment_deposited", "Yes")
                        }
                      >
                        <input type="radio" name="appointment_deposited" />
                        Yes
                      </RadioLabel>
                      <RadioLabel
                        onClick={() =>
                          setValue("noc.appointment_deposited", "No")
                        }
                      >
                        <input type="radio" name="appointment_deposited" />
                        No
                      </RadioLabel>
                    </RadioGroup>
                  </Td>
                  <Td>
                    <Controller
                      control={control}
                      name={"noc.appointment_deposited_date"}
                      defaultValue=""
                      rules={{ required: "Appointment date is required" }}
                      render={({ field, fieldState }) => (
                        <UiDateInput
                          label="Appointment date"
                          value={field.value}
                          onChange={field.onChange}
                          isRequired={true}
                          errors={fieldState?.error?.message}
                        />
                      )}
                    />
                  </Td>
                  <Td>
                    <Input
                      placeholder="Enter Remark..."
                      name={"noc.appointment_remark"}
                      inputRef={register("noc.appointment_remark")}
                      errors={errors}
                    />
                  </Td>
                </Tr>
                <Tr>
                  <Td>ID card</Td>
                  <Td>
                    <RadioGroup>
                      <RadioLabel
                        onClick={() => setValue("noc.id_card_deposited", "Yes")}
                      >
                        <input type="radio" name="id_card_deposited" />
                        Yes
                      </RadioLabel>
                      <RadioLabel
                        onClick={() => setValue("noc.id_card_deposited", "No")}
                      >
                        <input type="radio" name="id_card_deposited" />
                        No
                      </RadioLabel>
                    </RadioGroup>
                  </Td>
                  <Td>
                    {/* <Input
                      type="date"
                      inputRef={register("noc.id_card_deposited_date")}
                      control={control}
                      name={"noc.id_card_deposited_date"}
                      label={"ID Card Deposited Date"}
                      errors={errors}
                    /> */}
                    <Controller
                      control={control}
                      name={"noc.id_card_deposited_date"}
                      defaultValue=""
                      render={({ field, fieldState }) => (
                        <UiDateInput
                          label={"ID Card Deposited Date"}
                          value={field.value}
                          onChange={field.onChange}
                          isRequired={false}
                          maxAllowedDate={DateTime.now().minus({ years: 18 })}
                          errors={fieldState?.error?.message}
                        />
                      )}
                    />
                  </Td>
                  <Td>
                    <Input
                      placeholder="Enter Remark..."
                      name={"noc.id_card_remark"}
                      inputRef={register("noc.id_card_remark")}
                      errors={errors}
                    />
                  </Td>
                </Tr>
                <Tr>
                  <Td>Visiting Card</Td>
                  <Td>
                    <RadioGroup>
                      <RadioLabel
                        onClick={() =>
                          setValue("noc.visiting_card_deposited", "Yes")
                        }
                      >
                        <input type="radio" name="visiting_card_deposited" />
                        Yes
                      </RadioLabel>
                      <RadioLabel
                        onClick={() =>
                          setValue("noc.visiting_card_deposited", "No")
                        }
                      >
                        <input type="radio" name="visiting_card_deposited" />
                        No
                      </RadioLabel>
                    </RadioGroup>
                  </Td>
                  <Td>
                    {/* <Input
                      type="date"
                      inputRef={register("noc.visiting_card_deposited_date")}
                      control={control}
                      name={"noc.visiting_card_deposited_date"}
                      label={"Visiting Card Deposited Date"}
                      errors={errors}
                    /> */}
                    <Controller
                      control={control}
                      name={"noc.visiting_card_deposited_date"}
                      defaultValue=""
                      render={({ field, fieldState }) => (
                        <UiDateInput
                          label={"Visiting Card Deposited Date"}
                          value={field.value}
                          onChange={field.onChange}
                          isRequired={false}
                          maxAllowedDate={DateTime.now().minus({ years: 18 })}
                          errors={fieldState?.error?.message}
                        />
                      )}
                    />
                  </Td>
                  <Td>
                    <Input
                      placeholder="Enter Remark..."
                      name={"noc.visiting_card_remark"}
                      inputRef={register("noc.visiting_card_remark")}
                      errors={errors}
                    />
                  </Td>
                </Tr>
              </tbody>
            </Table>
          </TableContainer>
        </Grid2>
        <Grid2 item size={{ lg: 3, md: 6, sm: 12, xs: 12 }}>
          <Dropdown
            control={control}
            name="noc.resignation_reason"
            label="Resignation Reason"
            placeholder={"Enter Resignation Reason"}
            isRequired={true}
            errors={errors}
            options={[
              {
                label: "To apply with other insurance company",
                value: "To apply with other insurance company",
              },
              {
                label: "To apply with employee as other insurance company",
                value: "To apply with employee as other insurance company",
              },
              {
                label: "Alternate code exists in HEGI",
                value: "Alternate code exists in HEGI",
              },
            ]}
          />
        </Grid2>
      </Grid2>
      <ButtonWrapper style={{ marginTop: "20px" }}>
        <Button type="submit" width={"auto"}>
          {watch("approval_access") ? "Next" : "Submit"}
        </Button>
      </ButtonWrapper>
    </form>
  );
};

export default NOCForm;

const TableContainer = styled.div`
  margin: 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  border: 1px solid #eef0f5;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  background: white;
`;

const Th = styled.th`
  background: linear-gradient(to bottom, #f8faff, #f2f6ff);
  padding: 16px 20px;
  text-align: left;
  font-weight: 600;
  color: #2c3345;
  border-bottom: 2px solid #e8ecf3;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  position: relative;

  &:after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 2px;
    background: linear-gradient(to right, #4a90e2, #357abd);
    transform: scaleX(0);
    transition: transform 0.3s ease;
  }

  &:hover:after {
    transform: scaleX(1);
  }
`;

const Td = styled.td`
  padding: 16px 20px;
  border-bottom: 1px solid #eef0f5;
  color: #4a5568;
  font-size: 14px;
  transition: background-color 0.2s;

  &:first-child {
    font-weight: 500;
    color: #2d3748;
  }
`;

const Tr = styled.tr`
  &:hover td {
    background-color: #f8faff;
  }

  &:last-child td {
    border-bottom: none;
  }
`;

const RadioGroup = styled.div`
  display: flex;
  gap: 20px;
  align-items: center;
`;

const RadioLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  user-select: none;
  color: #4a5568;
  font-size: 14px;
  transition: color 0.2s;

  &:hover {
    color: #2b6cb0;
  }

  input {
    appearance: none;
    width: 18px;
    height: 18px;
    border: 2px solid #cbd5e0;
    border-radius: 50%;
    margin: 0;
    transition: all 0.2s;
    position: relative;
    cursor: pointer;

    &:checked {
      border-color: #3182ce;
      background: #3182ce;

      &:after {
        content: "";
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: white;
      }
    }

    &:focus {
      outline: none;
      box-shadow: 0 0 0 3px rgba(49, 130, 206, 0.2);
    }
  }
`;
