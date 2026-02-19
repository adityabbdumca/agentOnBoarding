import { useEffect } from "react";
import GlobalModal from "@/UI-Components/Modals/GlobalModal";
import { StyledModal } from "@/UI-Components/GlobalStyles";
import Dropdown from "@/UI-Components/Dropdown";
import { Grid2 } from "@mui/material";
import ButtonWrapper from "@/UI-Components/ButtonWrapper";
import Button from "@/UI-Components/Button";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { setAgentType } from "../agent.slice";
import { useDispatch } from "react-redux";
import { useAgentType } from "../service";
import { useParams } from "react-router";
import { AGENT_TYPE_OPTIONS } from "../../Exam-Config/ExamConfigConstants";
import UiButton from "@/UI-Components/Buttons/UiButton";

const AgentTypeModal = ({ userData, open, setOpen, setValue }) => {
  useEffect(() => {
    if (userData?.has_license === 0) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [userData?.has_license]);

  const dispatch = useDispatch();

  const modalSchema = yup.object({
    agent_type: yup.mixed().required("Agent Type is required"),
  });
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      agent_type: null,
    },
    resolver: yupResolver(modalSchema),
  });
  const { updateAgentTypeMutation } = useAgentType();

  const id = +useParams().id;
  const onSubmit = (data) => {
    const payload = {
      id,
      user_type: data?.agent_type?.label.toLowerCase(),
      user_type_id: data?.agent_type?.value,
      // insurance_type: data?.insurance_type?.label.toLowerCase(),
      // existing_general_insurance_company_name: data?.general_insurance?.label,
      // existing_life_insurance_name: data?.life_insurance?.label,
      // existing_health_insurance_name: data?.health_insurance?.label,
      // existing_health_insurance_noc_date: data?.noc_date,
    };
    updateAgentTypeMutation.mutateAsync(payload).then(() => {
      dispatch(setAgentType({ ...data, agent_type: data?.agent_type }));
      !id &&
        localStorage.setItem("agentType", JSON.stringify(data?.agent_type));
      localStorage.setItem("has_license", "1");
      setOpen(false);
      if (data?.agent_type?.label.toLowerCase() === "composite") {
        setValue("profile.insurers", [
          {
            insurer_type: "",
            name_of_issurer: "",
            agency_code: "",
            date_of_agent_appointment: "",
            date_of_agent_cessation: "",
            reason_of_cessation: "",
          },
        ]);
      } else {
        setValue("profile.insurers", []);
      }
    });
  };

  return (
    <>
      <GlobalModal
        open={open}
        onClose={() => setOpen(false)}
        title="Select Agent Type"
        width={400}
        overflowVisible={true}
        showESC={userData?.has_license === 0 ? false : true}
      >
        <StyledModal>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid2 container spacing={2}>
              <Grid2 item size={{ lg: 12, md: 12, sm: 12, xs: 12 }}>
                <Dropdown
                  control={control}
                  name="agent_type"
                  label="Agent Type"
                  placeholder={"Enter Agent Type"}
                  errors={errors}
                  readOnly={!!userData?.user_approval_status}
                  isRequired={true}
                  options={AGENT_TYPE_OPTIONS}
                />
              </Grid2>
            </Grid2>
            <ButtonWrapper style={{ marginTop: "20px" }}>
              <UiButton
                buttonType="primary"
                type="submit"
                text={"Submit"}
                isLoading={updateAgentTypeMutation.isPending}
                className="px-4"
              />
            </ButtonWrapper>
          </form>
        </StyledModal>
      </GlobalModal>
    </>
  );
};

export default AgentTypeModal;
