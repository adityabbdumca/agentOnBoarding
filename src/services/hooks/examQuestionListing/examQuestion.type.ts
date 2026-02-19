import { IOption } from "@/services/types/global.types";

type Attributes = {
  accessorKey: string;
  header: string;
  type: string;
};

interface IQuestionData {
  question_id: number;
  question: string;
  correct: IOption;
  set: string | null;
  category_id: number | null;
  status: string | null;
  created_by: string | null;
  created_by_ip_address: string | null;
  modify_by_ip_address: string | null;
  created_at: string | null;
  updated_at: string | null;
  deleted_at: string | null;
  user_type:IOption | null;
  user_type_id: number | null;
  options: IOption[];
  master_type: string | null;
}
interface IExamQuestionServiceSchema {
  data: IQuestionData[];
  status: boolean;
  column_head: Attributes[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total_records: number;
  };
}
export type { IExamQuestionServiceSchema, IQuestionData };
