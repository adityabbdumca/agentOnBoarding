interface IUserResponseSchema {
  data: {
    application_number: number;
    email: string;
    employee_code: string;
    last_login: string;
    mobile: string;
    name: string;
    roleName: string;
    role_id: number;
    status: boolean;
    user_id: number;
    verticalId: number;
    verticalName: string;
  };
  message: string;
  status: number;
}

export type { IUserResponseSchema };
