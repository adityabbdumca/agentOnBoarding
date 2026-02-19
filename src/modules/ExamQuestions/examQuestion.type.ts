import { IQuestionData } from "@/services/hooks/examQuestionListing/examQuestion.type";
import { IOption } from "@/services/types/global.types";

interface IAddEditExamFormSchema {
  type: { label: string; value: string | number; tooltip?: string };
  question: string;
  correct: IOption;
  options: { value: string }[];
}

  interface OptionsPayload  {
    option1:string;
    option2:string;
    option3?:string;
    option4?:string
  }
interface OptionItem {
  [key:string]:string
}
interface IRowData {
  title: string;
  data: IQuestionData | null;
}

export type { IAddEditExamFormSchema, IRowData, OptionsPayload, OptionItem};
