import UiCapsule from "@/UI-Components/Capsules/UiCapsule";
import { datetimeUtility } from "@/utlities/dateTime.utility";

const ColumnRenderer = {
  NameWithIcon: (rowData: any, baseKey?: string) => {
    const keys = baseKey?.split(".");
    const parentKey = keys?.[0];
    const data = rowData[String(parentKey)];
    if (!data) return <span className="text-gray">---</span>;

    if (data) {
      return (
        <UiCapsule text={data} className={"!bg-primary/10 !text-primary"} />
      );
    }
  },
  currency: (value: number) => <span>{value && `₹ ${value}`}</span>,
  percentage: (value: number) => <span>{value ? `${value}%` : "---"}</span>,
  date: (value: string) => (
    <span>
      {datetimeUtility.formatJsDate({
        value: String(value),
        format: "dd-MM-yyyy",
      })}
    </span>
  ),
  default: (value: any) => <span>{value && (value ?? "---")}</span>,
};

export { ColumnRenderer };
