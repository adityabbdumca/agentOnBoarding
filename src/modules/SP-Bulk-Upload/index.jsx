import { useState } from "react";
import MainContainer from "../OnboardingDetails/Components/MainContainer";
import ButtonWrapper from "@/UI-Components/ButtonWrapper";
import Button from "@/UI-Components/Button";
import MasterTable from "@/Components/MasterTable";
import { MdPointOfSale } from "react-icons/md";
import SPBulkForm from "./Components/SPBulkForm";
import Drawer from "@/UI-Components/Drawer";

const SPIndex = () => {
  const [openModal2, setOpenModal2] = useState({
    open: false,
    data: null,
    title: "",
  });

  return (
    <MainContainer Icon={MdPointOfSale} title="SP Bulk Upload">
      <ButtonWrapper>
        <Button
          width={"auto"}
          variant={"outlined"}
          startIcon={<MdPointOfSale />}
          onClick={() =>
            setOpenModal2({
              open: true,
              data: null,
              title: "Create",
            })
          }
        >
          Create SP
        </Button>
      </ButtonWrapper>
      <MasterTable api={"listSPDetails"} />

      <Drawer
        isOpen={openModal2.open}
        onClose={() =>
          setOpenModal2({
            open: false,
            data: null,
            title: "",
          })
        }
      >
        <SPBulkForm />
      </Drawer>
    </MainContainer>
  );
};

export default SPIndex;
