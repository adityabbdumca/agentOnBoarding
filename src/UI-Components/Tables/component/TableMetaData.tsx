import useGlobalRoutesHandler from "@/hooks/useGlobalHandleRouter";
import UiButton from "@/UI-Components/Buttons/UiButton";
import { Table } from "@tanstack/react-table";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { createSearchParams } from "react-router-dom";

const TableMetaData = ({
  tableMetaData,
  tableData,
  table,
}: {
  tableMetaData: any;
  tableData: any;
  table: Table<any>;
}) => {
  const { navigate, urlQueries } = useGlobalRoutesHandler();

  return tableMetaData?.per_page ? (
    <div className="flex items-center justify-between  h-10 px-4 w-full  ">
      <section className="flex items-center gap-2 text-sm font-medium text-darkGray">
        <p>
          Showing: {tableData?.length} out of {tableMetaData?.total_records || tableMetaData?.total}
        </p>
      </section>
      <section className="flex items-center justify-end gap-3 ">
        <>
          <UiButton
            text="First"
            buttonType="tertiary"
            className="h-7 flex-row-reverse font-semibold"
            icon={<ChevronsLeft className="size-4" />}
            disabled={tableMetaData?.current_page === 1}
            onClick={() => {
              table.resetRowSelection();
              navigate({
                search: createSearchParams({
                  ...urlQueries,
                  page: "1",
                }).toString(),
              });
            }}
            isLoading={false}
          />
          <UiButton
            disabled={tableMetaData?.current_page === 1}
            onClick={() => {
              table.resetRowSelection();
              navigate({
                search: createSearchParams({
                  ...urlQueries,
                  page: String(tableMetaData?.current_page - 1),
                }).toString(),
              });
            }}
            text="Prev"
            buttonType="tertiary"
            className="h-7 flex-row-reverse font-semibold"
            icon={<ChevronLeft className="size-4" />}
            isLoading={false}
          />
          {!!tableData.length && (
            <span className="flex items-center gap-1 text-sm">
              <span className="font-medium"> Page </span>
              <strong>{tableMetaData?.current_page} </strong>
              <span className="font-medium"> of </span>
              <strong> {tableMetaData?.last_page}</strong>
            </span>
          )}
          <UiButton
            disabled={tableMetaData?.current_page === tableMetaData?.last_page}
            icon={<ChevronRight className="size-4" />}
            onClick={() => {
              table.resetRowSelection();
              navigate({
                search: createSearchParams({
                  ...urlQueries,
                  page: tableMetaData?.current_page + 1,
                }).toString(),
              });
            }}
            text="Next"
            buttonType="tertiary"
            className=" h-7 font-semibold"
            isLoading={false}
          />
          <UiButton
            disabled={tableMetaData?.current_page === tableMetaData?.last_page}
            icon={<ChevronsRight className="size-4" />}
            onClick={() => {
              table.resetRowSelection();
              navigate({
                search: createSearchParams({
                  ...urlQueries,
                  page: tableMetaData?.last_page,
                }).toString(),
              });
            }}
            text="Last"
            buttonType="tertiary"
            className=" h-7 font-semibold"
            isLoading={false}
          />
        </>
      </section>
    </div>
  ) : (
    <></>
  );
};

export default TableMetaData;
