import MainContainer from "../OnboardingDetails/Components/MainContainer";
import { ICONS } from "@/constants/ICONS";
import Drawer from "@/UI-Components/Drawer";
import { useState } from "react";
import Button from "@/UI-Components/Button";
import QuestionsForm from "./Components/QuestionsForm";
import MasterTable from "@/Components/MasterTable";
import { URLs } from "@/lib/ApiService/constants/URLS";
import { ActionContainer } from "@/UI-Components/GlobalStyles";
import { HiPencilAlt } from "react-icons/hi";
import { Tooltip } from "@mui/material";

const ExamQuestionsIndex = () => {
  const [drawerObj, setDrawerObj] = useState({
    open: false,
    data: null,
    title: "Add",
  });
  return (
    <MainContainer
      title={"Exam Questions"}
      Icon={ICONS["Exam Details"]}
      heading={"Exam Questions"}
      subHeading={
        " Upload the questions for your Insurance Agent qualification exam"
      }
      pageActions={
        <>
          <Button
            variant={"outlined"}
            startIcon={ICONS["Upload"]}
            width={"auto"}
            onClick={() => {
              setDrawerObj({
                open: true,
                data: null,
                title: "Upload Questions",
              });
            }}
          >
            Upload
          </Button>
        </>
      }
    >
      <MasterTable
        api={URLs.EXAM_QUESTIONS_LISTING}
        customActions={({ row }) => {
          return (
            <ActionContainer>
              <Tooltip title="Update" arrow placement="top">
                <div
                  className="cursor-pointer"
                  onClick={() => {
                    setDrawerObj({
                      data: row?.original,
                      open: true,
                      title: "Update",
                    });
                  }}
                >
                  <HiPencilAlt />
                </div>
              </Tooltip>
            </ActionContainer>
          );
        }}
      />
      <Drawer
        isOpen={drawerObj.open}
        onClose={() => setDrawerObj({ data: null, open: false, title: "" })}
        title={`${drawerObj.title} Questions`}
      >
        <QuestionsForm drawerObj={drawerObj} setDrawerObj={setDrawerObj} />
      </Drawer>
    </MainContainer>
  );
};

export default ExamQuestionsIndex;
