interface IBlackListAgentDataSchema {
  id: number;
  name: string;
  pan_number: string;
  reason: string | null;
  agency_code: string | null;
  blacklisted_on: string;
  created_at: string;
  updated_at?: string;
}

type TColumnHeadAttribute = {
  accessorKey: string;
  header: string;
  type: string;
};

interface IBlackListAgentServiceSchema {
  data: IBlackListAgentDataSchema[];
  column_head: TColumnHeadAttribute[];
}
interface ISingleBlackListAgentServiceSchema {
  data: IBlackListAgentDataSchema;
  column_head: TColumnHeadAttribute[];
}
export type {
  IBlackListAgentServiceSchema,
  ISingleBlackListAgentServiceSchema,
  IBlackListAgentDataSchema,
  TColumnHeadAttribute,
};
