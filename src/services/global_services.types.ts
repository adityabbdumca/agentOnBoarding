interface IGetServicePropsSchema {
  page?: string;
  per_page?: string;
  enableQuery?: boolean;
  cacheKeys?: string[];
  filters?: Record<string, string | string[]>;
}

export type { IGetServicePropsSchema };
