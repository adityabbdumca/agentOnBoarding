import OCRDetails from "./OCRDetails";
import { Modal } from "@mui/material";
import { StyledBox } from "../../Pincode/PincodeIndex";
import InlineLoader from "@/Components/Loader/InlineLoader";
import { useCkycData, usePrefillOCRData } from "../service";
import Drawer from "@/UI-Components/Drawer";

const OCRForm = ({
  setValue,
  control,
  errors,
  clearErrors,
  watch,
  register,
  openModal,
  setOpenModal,
}) => {
  const {
    data: ocrData,
    mutate: ocrMutate,
    isPending: ocrIsPending,
  } = usePrefillOCRData();

  const {
    data: ckycData,
    mutate: ckycMutate,
    isPending: ckycPending,
  } = useCkycData();

  return (
    <>
      {/* <OCRDIV>
        <span className="font-semibold text-xs sm:text-sm text-slate-700">
          Upload File to AutoFill Data through OCR
        </span>
        <Button
          width={"auto"}
          variant={"outlined"}
          onClick={() => setOpenModal(true)}
        >
          Upload
        </Button>
      </OCRDIV> */}

      <Drawer
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        title={"Document OCR Processing"}
        width={"100%"}
        maxHeight={700}
      >
        <OCRDetails
          ocrMutate={ocrMutate}
          setOpenModal={setOpenModal}
          ckycMutate={ckycMutate}
          setValue={setValue}
          control={control}
          errors={errors}
          clearErrors={clearErrors}
          register={register}
          watch={watch}
        />
      </Drawer>
      {(ocrIsPending || ckycPending) && (
        <Modal
          open={ocrIsPending || ckycPending}
          onClose={!ocrIsPending || !ckycPending}
        >
          <StyledBox>
            <InlineLoader />
            <span>Fetching Data</span>
          </StyledBox>
        </Modal>
      )}
    </>
  );
};

export default OCRForm;
