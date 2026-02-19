import { ColumnRenderer } from "./columnRendere";

interface IAttributes {
  accessorKey: string;
  header: string;
  type: string;
}

const generateDynamicColumnSchema = (attributes: IAttributes[]) => {
  const dynamicColumns =
    attributes?.map((attr) => ({
      header: attr.header,
      accessorKey: attr.accessorKey,
      cell: ({ row }: { row: any }) => {
        const value = attr.accessorKey.includes(".")
          ? attr.accessorKey
              .split(".")
              .reduce((acc, key) => acc?.[key], row.original)
          : row.original?.[attr.accessorKey];

        const renderer = ColumnRenderer[attr.type] || ColumnRenderer.default;

        return attr.type === "NameWithIcon"
          ? renderer(row.original, attr.accessorKey)
          : renderer(value);
      },
    })) ?? [];

  return [...dynamicColumns];
};

export default generateDynamicColumnSchema;
