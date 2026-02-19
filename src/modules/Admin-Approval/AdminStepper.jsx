import { ICONS } from "@/constants/ICONS";
import Stack from "@mui/material/Stack";
import Step from "@mui/material/Step";
import StepConnector, {
  stepConnectorClasses,
} from "@mui/material/StepConnector";
import StepLabel from "@mui/material/StepLabel";
import Stepper from "@mui/material/Stepper";
import { styled } from "@mui/material/styles";
import { memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setAgent,
  setAgentName,
  setCompletedName
} from "../OnboardingDetails/agent.slice";

const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 22,
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage:
        "linear-gradient( 95deg,var(--color-primary) 0%,var(--color-secondary) 70% , #ffff 100%)",
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage:
        "linear-gradient( 95deg,var(--color-primary) 0%,var(--color-secondary) 70% , #ffff 100%)",
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 3,
    border: 0,
    backgroundColor: "#eaeaf0",
    borderRadius: 1,
    ...theme.applyStyles("dark", {
      backgroundColor: theme.palette.grey[800],
    }),
  },
}));

const ColorlibStepIconRoot = styled("div")(({ theme }) => ({
  backgroundColor: "#ccc",
  zIndex: 1,
  color: "#fff",
  width: 50,
  height: 50,
  display: "flex",
  borderRadius: "50%",
  justifyContent: "center",
  alignItems: "center",
  ...theme.applyStyles("dark", {
    backgroundColor: theme.palette.grey[700],
  }),
  variants: [
    {
      props: ({ ownerState }) => ownerState.active,
      style: {
        backgroundImage:
          "linear-gradient( 136deg, var(--color-primary) 0%, var(--color-secondary) 70% , #ffff 100%)",
        boxShadow: "0 4px 10px 0 rgba(0,0,0,.25)",
      },
    },
    {
      props: ({ ownerState }) => ownerState.completed,
      style: {
        backgroundImage:
          "linear-gradient( 136deg, var(--color-primary) 0%, var(--color-secondary) 70% , #ffff 100%)",
      },
    },
  ],
}));

export default memo(function AdminStepper() {
  function ColorlibStepIcon(props) {
    const {
      active,
      completed,
      className,
      ownerState: { children },
    } = props;

    const Icon = ICONS[children];

    return (
      <ColorlibStepIconRoot
        ownerState={{ completed, active }}
        className={className}
      >
        {Icon && <Icon />}
      </ColorlibStepIconRoot>
    );
  }
 
  const { theme: ReduxTheme } = useSelector((state) => state.theme);
  const { agentName, completedName, menus,  } = useSelector((state) => state.agent);
 
  const dispatch = useDispatch();
  const completedId = menus?.findIndex((item) => item?.label === completedName);
  const agentId = menus?.findIndex((item) => item?.label === agentName);
  return (
    <Stack
      className="hide-scroll"
      sx={{ height: "100%", overflowY: "auto" }}
      spacing={8}
    >
      <Stepper
        alternativeLabel
        // activeStep={!isRM && completed === 8 ? 4 : completed}
        // {steps.findIndex((item) => item.id === completed)}
        activeStep={
          completedId < agentId
            ? menus.findIndex((item, i) => {
                if (item.label === agentName) {
                  dispatch(setCompletedName(item.label));
                  dispatch(setAgent(i));
                  return true;
                }
                return false;
              })
            : menus.findIndex((item) => item.label === completedName)
        }
        connector={<ColorlibConnector />}
      >
        {menus.map((label, index) => (
          <Step
            key={label.label}
            onClick={() =>
              completedId >= index && [
                dispatch(setAgentName(label.label)),
                dispatch(setAgent(index)),
              ]
            }
            sx={{
              "& .MuiStepLabel-label": {
                color:
                  agentName === label.label ? "green !important" : "#979797",
                fontWeight: agentName === label.label ? "600 !important" : 500,
                fontSize:
                  agentName === label.label ? "11px !important" : "11px",
                fontFamily: ReduxTheme.fontFamily,
              },
            }}
          >
            <StepLabel StepIconComponent={ColorlibStepIcon}>
              {label.label}
            </StepLabel>
          </Step>
        ))}
      </Stepper>
    </Stack>
  );
});
