import React from "react";
import {
  ActionContainer,
  StyledBg,
  StyledContainer,
} from "@/UI-Components/GlobalStyles";
import Header from "@/Components/Header/Header";
import { MdOutlineEvent } from "react-icons/md";
import MasterTable from "@/Components/MasterTable";
import Button from "@/UI-Components/Button";
import { useState } from "react";
import GlobalModal from "@/UI-Components/Modals/GlobalModal";
import AddEvent from "./AddEvent";
import { RiEdit2Line } from "react-icons/ri";
const EventIndex = () => {
  const [open, setOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("Add");
  const [rowData, setRowData] = useState(null);
  return (
    <StyledBg>
      <Header icon={<MdOutlineEvent />} title={"Event Master"} />
      <StyledContainer>
        <MasterTable
          api={"listEvent"}
          renderTopToolbarCustomActions={() => {
            return (
              <ActionContainer>
                <Button
                  variant="outlined"
                  width={"auto"}
                  onClick={() => setOpen(true)}
                >
                  Add Event
                </Button>
              </ActionContainer>
            );
          }}
          isActions={true}
          customActions={({ row }) => (
            <ActionContainer>
              <RiEdit2Line
                onClick={() => [
                  setOpen(true),
                  setRowData(row?.original),
                  setModalTitle("Edit"),
                ]}
              />
            </ActionContainer>
          )}
        />
      </StyledContainer>
      <GlobalModal
        open={open}
        onClose={() => [setOpen(false), setRowData(null)]}
        width={600}
        title={`${modalTitle} Event`}
      >
        <AddEvent setOpen={setOpen} rowData={rowData} />
      </GlobalModal>
    </StyledBg>
  );
};

export default EventIndex;
