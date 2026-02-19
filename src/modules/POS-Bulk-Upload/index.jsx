import { useState } from "react";
import MainContainer from "../OnboardingDetails/Components/MainContainer";
import ButtonWrapper from "@/UI-Components/ButtonWrapper";
import Button from "@/UI-Components/Button";
import MasterTable from "@/Components/MasterTable";
import { MdPointOfSale } from "react-icons/md";
import POSBulkForm from "./Components/POSBulkForm";
import Drawer from "@/UI-Components/Drawer";

const POSIndex = () => {
  const [openModal2, setOpenModal2] = useState({
    open: false,
    data: null,
    title: "",
  });

  return (
    <MainContainer Icon={MdPointOfSale} title="POSP Bulk Upload">
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
          Create POSP
        </Button>
      </ButtonWrapper>
      <MasterTable api={"listPOSDetails"} />

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
        <POSBulkForm />
      </Drawer>
    </MainContainer>
  );
};

export default POSIndex;
