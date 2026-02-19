interface IAgentTypeOptionSchema {
  label: string;
  value: number | string;
  tooltip?: string;
}
interface IAddEditExamPropSchema{
 isOpen:boolean
  handleCloseModal:()=>void;
  examData:{title:string,data:any | null}
  setExamData:any;
  mutation:any;
}
export type { IAgentTypeOptionSchema, IAddEditExamPropSchema };
