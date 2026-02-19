import UiButton from "@/UI-Components/Buttons/UiButton";
import Toggle from "./ToggleButton";
import { Minus, Plus } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { useEffect, useState } from "react";
import { usePaymentWaiver } from "../hooks/usePaymentWaiver";

const EditTableDetails = ({ row, setEdit }) => {
  const { control, handleSubmit, setValue, watch } = useForm({
    defaultValues: {
      is_way_of: false,
      re_attempts: 0,
    },
  });
  const {
    mutations: { updatePaymentWayOfMutation },
  } = usePaymentWaiver({});

  const [curentNumber, setCurentNumber] = useState(0);
  const is_way_of = watch("is_way_of");
  useEffect(() => {
    if (row) {
      const isWayOf = row?.status === "active" ? 1 : 0;

      setValue("is_way_of", isWayOf);
      setValue("re_attempts", row?.re_attempt ?? 0);
      setCurentNumber(row?.re_attempt ?? 0);
    }
  }, [row, setValue]);

  const onSubmit = (data) => {
    const status = data?.is_way_of === true ? "active" : "Inactive";
    const payload = {
      re_attempt: data?.re_attempts,
      status: status,
      id: row?.id,
    };
    updatePaymentWayOfMutation(payload, {
      onSuccess: () => {
        setEdit({ open: false, data: {}, modalTitle: "Edit" });
      },
    });
  };

  return (
    <form className="mb-10 " onSubmit={handleSubmit(onSubmit)}>
      <section className="flex justify-center gap-8 mb-4">
        <div className="flex items-center gap-2 pt-3">
          <span className="text-sm font-medium text-gray-700 mr-2">
            Repayment
          </span>
          <Controller
            name="is_way_of"
            control={control}
            render={({ field: { value, onChange } }) => (
              <Toggle value={value} onChange={onChange} />
            )}
          />
        </div>

        <div className="flex items-center mt-3 gap-2">
          <span className="text-sm font-medium text-gray-700">Re-attempts</span>
          <UiButton
            icon={<Minus size={16} />}
            buttonType="secondary"
            onClick={() => {
              const updated = Math.max(0, curentNumber - 1);
              setCurentNumber(updated);
              setValue("re_attempts", updated);
            }}
            className="px-2 py-1 text-primary border rounded-full border-lightGray"
          />
          <span className="font-semibold min-w-[20px] text-center">
            {curentNumber}
          </span>
          <UiButton
            icon={<Plus size={16} />}
            buttonType="secondary"
            onClick={() => {
              const updated = curentNumber + 1;
              setCurentNumber(updated);
              setValue("re_attempts", updated);
            }}
            className="px-2 py-1 text-primary border rounded-full border-lightGray"
          />
        </div>
      </section>

      <div className="flex justify-center mx-auto  items-center">
        <UiButton
          buttonType="primary"
          text="Save"
          width="auto"
          type="submit"
          className="p-4 text-primary"
        />
      </div>
    </form>
  );
};

export default EditTableDetails;
