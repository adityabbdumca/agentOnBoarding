import { DateTime } from "luxon";

interface IDateTimeUtilityFunctionProps {
  value: string | Date;
  format?:
    | "dd-MM-yyyy hh:mm:ss"
    | "dd-MM-yyyy, hh:mm a"
    | "dd-MM-yyyy"
    | "yyyy-MM-dd"
    | "yyyy-MM-dd hh:mm:ss"
    | "yyyy-MM-dd hh:mm:ss a"
    | "yyyy-MM-dd HH:mm:ss"
    | "yyyy-MM-dd HH:mm:ss a"
    | "relative"
    | "MMM d, h:mm a"
    | "MMM d"
    | "d MMM yy"
    | "dd LLLL yyyy"
    | "LLLL yyyy"
    | "cccc"
    | "HH:mm:ss"
    | "LLL dd, yyyy"
    | "dd"
    | "hh:mm:ss a"
    | "hh:mm a";
}

const formatJsDate = ({
  value,
  format,
}: IDateTimeUtilityFunctionProps): string => {
  if (format === "relative") {
    return DateTime.fromJSDate(new Date(value)).toRelative() || "";
  }
  return DateTime.fromJSDate(new Date(value)).toFormat(format || "d-MMM");
};

const isBeforeToday = (dateString:string) => {
  if (!dateString) return false;

    const inputDate = DateTime
      .fromFormat(dateString, "dd-MM-yyyy HH:mm")
      .startOf("day");

    const today = DateTime.now().startOf("day");

    return inputDate <= today;
};

export const datetimeUtility = {
  formatJsDate,
  isBeforeToday,
};
