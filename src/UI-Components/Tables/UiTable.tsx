import { UseQueryResult } from "@tanstack/react-query";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";
import React, { useEffect, useMemo, useState } from "react";
import UiTextInputBase from "../Input/UiTextInputBase";
import useGlobalRoutesHandler from "@/hooks/useGlobalHandleRouter";
import { LoaderCircle, RefreshCcw, Search, X } from "lucide-react";
import UiButton from "../Buttons/UiButton";
import { TableRow } from "./component/TableRow";
import { TableCell } from "./component/TableCell";
import { AnimatePresence } from "motion/react";
import TableMetaData from "./component/TableMetaData";
import UiDateRangePicker from "../DateInput/UiDateRangePicker";
import { datetimeUtility } from "@/utlities/dateTime.utility";
import { DateRange } from "react-day-picker";

type UiTableBaseProps = {
  deleteEntries?: (ids: number[]) => void;
  dataSet: UseQueryResult<any, Error>;
  columnsSchema: ColumnDef<any>[];
  query?: string;
  setQuery?: (arg: string) => void;
  searchPlaceHolder?: string;
  actionButtonComponent?: React.ReactNode;
  maxHeightClassName?: string;
  maxWidthClassName?: string;
  showDateRangeFilter?: boolean;
};

const UiTable = ({
  deleteEntries,
  dataSet,
  columnsSchema,
  query,
  setQuery,
  searchPlaceHolder = "Type to search...",
  maxHeightClassName = "max-h-[calc(100vh-340px)]",
  actionButtonComponent,
  showDateRangeFilter,
}: UiTableBaseProps) => {
  const [filterState, setFilterState] = useState("");
  const [columnVisibility, setColumnVisibility] = useState({});
  const [dateRange, setDateRange]=useState<DateRange>()

  const tableData = useMemo(
    () => dataSet?.data?.data?.data ?? [],
    [dataSet?.data?.data?.data]
  );

  const tableMetaData = dataSet?.data?.data?.meta || {};
  const dataRefetchLoading = dataSet?.isFetching || false;
  const isTableLoading = dataSet?.isLoading || false;

  const table = useReactTable({
    data: tableData,
    columns: columnsSchema,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getRowId: (row) => row?.id,
    state: {
      columnVisibility: columnVisibility,
      globalFilter: filterState.trim(),
    },
    defaultColumn: {
      enableSorting: false,
    },
    initialState: {
      columnPinning: { left: ["id"] },
    },
    onGlobalFilterChange: setFilterState,
    onColumnVisibilityChange: setColumnVisibility,
  });

  const { urlQueries, navigateTo, searchParams, setSearchParams } =
    useGlobalRoutesHandler();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (query === undefined) {
      setFilterState(event.target.value);
    } else {
      setQuery?.(event.target.value);
    }
    navigateTo({
      to: {
        "t-search": event.target.value,
      },
    });
  };

  useEffect(() => {
    const tSearchText = urlQueries?.["t-search"];
    if (tSearchText) {
      if (query === undefined) {
        setFilterState(tSearchText);
      } else {
        setQuery?.(tSearchText);
      }
    }
  }, []);

  return (
    <div className="flex flex-col ">
      <section className="flex items-center justify-between py-2 ">
        <div className="flex items-center gap-4">
          <section className="w-56">
            <UiTextInputBase
              type="text"
              value={query || filterState}
              onChange={handleChange}
              placeholder={searchPlaceHolder}
              className=" w-full !pr-10 pl-2 !h-8 ring-1 ring-lightGray/90 border-none text-xs text-body focus:ring-primary/50"
              icon={
                <>
                  {query || filterState ? (
                    <button
                      type="button"
                      className="flex items-center rounded justify-center bg-primary/10 text-primary p-0.5"
                      onClick={() => {
                        setFilterState("");
                        setQuery?.("");
                        navigateTo({
                          remove: `t-search`,
                        });
                      }}>
                      <X className="size-4" />
                    </button>
                  ) : (
                    <Search className="size-4" />
                  )}
                </>
              }
            />
          </section>
        </div>

        <div className="flex items-center self-end gap-2">
          {showDateRangeFilter && (
            <UiDateRangePicker
              label=""
              value={dateRange}
              onChange={(range) => {
                setDateRange(range);
                if (range?.from && range?.to) {
                  const from = datetimeUtility.formatJsDate({value:range?.from,format:"yyyy-MM-dd"});
                  const to = datetimeUtility.formatJsDate({value:range?.to,format:"yyyy-MM-dd"});
                  searchParams.set("from", from);
                  searchParams.set("to", to);
                  setSearchParams(searchParams);
                } else {
                  navigateTo({ remove: ["from", "to"] });
                }
              }}
              isRequired
            />
          )}
          <UiButton
            disabled={dataRefetchLoading}
            icon={
              <RefreshCcw
                className={`size-4 text-body ${dataRefetchLoading ? "animate-spin" : ""}`}
              />
            }
            className="h-8 px-4 flex-row-reverse text-body text-xs border border-lightGray "
            buttonType="tertiary"
            text={"Refresh"}
            onClick={() => {
              dataSet.refetch?.();
            }}
            isLoading={false}
          />
          {actionButtonComponent || <></>}
        </div>
      </section>
      {!isTableLoading ? (
        <div
          className={`flex flex-col  border border-lightGray/60  overflow-y-auto overflow-x-auto ${maxHeightClassName} 
        `}>
          <table className="w-full">
            <thead className="h-10">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow type="head" key={headerGroup.id}>
                  {headerGroup?.headers?.map((header) => {
                    return (
                      <TableCell
                        type="th"
                        key={header.id}
                        dataColumnId={header.id}>
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </thead>

            {table?.getRowModel()?.rows?.length === 0 ? (
              <tbody>
                <tr className="text-body ">
                  <td
                    colSpan={table.getHeaderGroups()[0].headers.length}
                    className="h-10 rounded">
                    <div className="flex items-center justify-center h-full">
                      <p className="font-medium text-sm">
                        No data available to show!
                      </p>
                    </div>
                  </td>
                </tr>
              </tbody>
            ) : (
              <tbody>
                <AnimatePresence
                  initial={false}
                  mode="sync"
                  key={tableMetaData?.total}>
                  {table?.getRowModel()?.rows?.map((row) => (
                    <TableRow key={row?.index}>
                      {row.getVisibleCells()?.map((cell) => {
                        return (
                          <TableCell
                            type="td"
                            key={cell.id}
                            dataColumnId={cell.column.id}>
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  ))}
                </AnimatePresence>
              </tbody>
            )}
          </table>
        </div>
      ) : (
        <section
          className={` w-full flex items-center justify-center bg-extraLightGray rounded h-[calc(100vh-340px)] ${maxHeightClassName}`}>
          <LoaderCircle className="size-6 animate-spin text-gray" />
        </section>
      )}
      <TableMetaData
        table={table}
        tableData={tableData}
        tableMetaData={tableMetaData}
      />
    </div>
  );
};

export default UiTable;
