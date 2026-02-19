import useGlobalRoutesHandler from "@/hooks/useGlobalHandleRouter";
import UiButton from "@/UI-Components/Buttons/UiButton";
import UiCapsule from "@/UI-Components/Capsules/UiCapsule";
import { ArrowLeft, User } from "lucide-react";
import useRegisterRequest from "../../hooks/useRegisterRequest";
import { lazy, useEffect, useState } from "react";
import Swal from "sweetalert2";
import PrudentialLoader from "@/Components/Loader/PrudentialLoader";
const CommonDetailsLazyFormPage = lazy(
  () => import("../../component/CommonDetailsForm/CommonDetailsForm")
);
const AddressDetailsFormLazyPage = lazy(
  () => import("../../component/AddressDetailForm/AddressDetailsForm")
);
const LicenseDetailsFormLazyPage = lazy(
  () => import("../../component/LicenseDetailsForm/LicenseDetailsForm")
);
const BankDetailsFormLazyPage = lazy(
  () => import("../../component/BankDetailsForm/BankDetailsForm")
);
const NameDetailsFormLazyPage = lazy(
  () => import("../../component/NameDetailsForm/NameDetailsForm")
);

const NomineeDetailsFormLazyPage = lazy(
  () => import("../../component/NomineeDetailsForm/NomineeDetailsForm")
);

const RegisterRequestPage = () => {
  const { subRoute, navigate } = useGlobalRoutesHandler();
  const {
    services: { getAllAgentService },
  } = useRegisterRequest();
  const [allAgentData, setAllAgentData] = useState("");
  const text = allAgentData?.service_type;
  const endorsementName = allAgentData?.endorsement_type_name;
  const description = allAgentData?.description;

  useEffect(() => {
    if (subRoute) {
      getAllAgentService.mutate(
        { id: subRoute },
        {
          onSuccess: (response) => {
            if (response?.status === 200) {
              setAllAgentData(response?.data);
              return;
            } else {
              Swal.fire("Error", response?.data?.message, "error");
            }
          },
        }
      );
    }
  }, [subRoute]);

  const renderForm = () => {
    switch (subRoute) {
      case "1":
      case "2":
      case "3":
      case "9":
      case "10":
        return <CommonDetailsLazyFormPage allAgentData={allAgentData} />;
      case "4":
      case "5":
        return <AddressDetailsFormLazyPage allAgentData={allAgentData} />;
      case "7":
        return <LicenseDetailsFormLazyPage allAgentData={allAgentData} />;
      case "8":
        return <BankDetailsFormLazyPage allAgentData={allAgentData} />;
      case "6":
        return <NameDetailsFormLazyPage allAgentData={allAgentData} />;
      case "11":
        return <NomineeDetailsFormLazyPage allAgentData={allAgentData} />;
      default:
        return <div>Invalid form type</div>;
    }
  };

  if (getAllAgentService?.isPending) {
    return <PrudentialLoader />;
  }
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col items-start ">
        <UiButton
          buttonType="tertiary"
          text="Back To Endorsements"
          className="flex-row-reverse gap-4 text-sm hover:bg-lightGray/40 p-2"
          icon={
            <ArrowLeft className="size-4 text-black flex flex-row-reverse" />
          }
          onClick={() => {
            navigate(-1);
          }}
        />

        <div className="flex items-center gap-3 mb-1">
          <User className="size-6 text-blue-600" />
          <h1 className="text-lg font-bold text-gray-900">{endorsementName}</h1>
          <UiCapsule
            text={text}
            color={text == "Auto" ? "#16a34a" : "#F97A00"}
            className="p-2"
          />
        </div>

        <p className="text-gray-600 text-sm">{description}</p>
      </div>

      <div>{renderForm()}</div>
    </div>
  );
};

export default RegisterRequestPage;
