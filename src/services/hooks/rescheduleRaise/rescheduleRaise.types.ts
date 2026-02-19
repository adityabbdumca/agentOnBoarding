type Attributes = {
  accessorKey: string;
  header: string;
  type: string;
};

interface IRescheduleRaiseResponseSchema {
  data: {
    application_number: string;
    exam_center: string;
    id: number;
    mobile: string;
    name: string;
    selected_date: string;
    state: string;
  }[];
  status: boolean;
  column_head: Attributes[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total_records: number;
  };
}

export type { IRescheduleRaiseResponseSchema };
