import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import React, { memo, useMemo, useState } from "react";
import { HiSortAscending } from "react-icons/hi";
import { useHookMasterTable } from "./Service";
import TableSkeleton from "./TableSkeleton";
import DynamicTableFooter from "./DynamicTableFooter";
import styled from "styled-components";
import { Checkbox, Tooltip } from "@mui/material";
import { useSelector } from "react-redux";
import { HiDocument } from "react-icons/hi2";

function MasterTable({
  api = "",
  method = "POST",
  payload = {},
  className = "",
  customActions = null,
  setOpenTableModal = () => {},
  noDataText,
  mutateObj = [],
  renderTopToolbarCustomActions = null,
  customCellRenderers = {},
  watch,
  columnSizes = {}, // Accept dynamic column sizes
}) {
  const [pagination, setPagination] = useState({
    pageIndex: 1,
    pageSize: 10,
  });

  const { theme } = useSelector((state) => state.theme);

  const {
    tableData,
    tableColumns: tableColumnsFromApi,
    tablePagination,
    isPending,
  } = useHookMasterTable(api, method, payload, pagination, "DESC");

  const tableDataMemo = useMemo(() => {
    return tableData;
  }, [tableData]);

  const paginationFromApi = useMemo(() => {
    return tablePagination || { pageIndex: 1, pageSize: 10 };
  }, [tablePagination]);

  const currentEntries = useMemo(() => {
    return tableData?.length ?? 0;
  }, [tableData]);

  const tableColumns = useMemo(() => {
    return tableColumnsFromApi?.map((column) => {
      let obj = {};

      if (customCellRenderers?.[column.accessorKey]) {
        obj = {
          cell: customCellRenderers[column.accessorKey],
        };
      } else {
        switch (column?.type?.toLowerCase()) {
          case "string":
            obj = {
              cell: ({ cell }) => {
                const isStringLengthGreaterThan20 =
                  cell?.getValue()?.length > 30;
                return isStringLengthGreaterThan20 ? (
                  <Tooltip arrow title={cell?.getValue()}>
                    <span className="line-clamp-2 break-words">
                      {cell?.getValue()}
                    </span>
                  </Tooltip>
                ) : (
                  <span>{cell?.getValue() || "N/A"}</span>
                );
              },
            };
            break;
          case "checkbox":
            obj = {
              cell: ({ row }) => {
                return (
                  <Checkbox
                    size="small"
                    name={column.accessorKey}
                    defaultChecked={row.original[column.accessorKey]}
                    checked={row.original[column.accessorKey]}
                    onChange={(e) => {
                      mutateObj?.[0]({
                        menu_id: row?.original?.menu_id,
                        role_id: watch["role"]?.value,
                        access: {
                          [column.accessorKey]: e.target.checked,
                        },
                      });
                    }}
                    sx={{
                      "&.Mui-checked": { color: theme.primaryColor },
                      "&.MuiCheckbox-root": {
                        borderRadius: "30px !important",
                        padding: "0 !important",
                      },
                      "& .MuiSvgIcon-root": {
                        borderRadius: "40px !important",
                      },
                    }}
                  />
                );
              },
            };
            break;
          case "file":
            obj = {
              cell: ({ row }) => {
                const pdfURL = row.original?.[column.accessorKey];
                return pdfURL ? (
                  <div style={{ cursor: "pointer" }}>
                    <HiDocument
                      className="text-primary"
                      size={18}
                      onClick={() => {
                        window.open(pdfURL, "_blank");
                      }}
                    />
                  </div>
                ) : (
                  <p>N/A</p>
                );
              },
            };
            break;
          case "switch_button":
            obj = {
              cell: ({ row }) => {
                return (
                  <div style={{ display: "flex", gap: "10px" }}>
                    <ApproveButton
                      onClick={() => {
                        setOpenTableModal({
                          open: true,
                          data: row?.original,
                          result: "Pass",
                        });
                      }}
                    >
                      Pass
                    </ApproveButton>
                    <RejectButton
                      onClick={() => {
                        setOpenTableModal({
                          open: true,
                          data: row?.original,
                          result: "Fail",
                        });
                      }}
                    >
                      Fail
                    </RejectButton>
                  </div>
                );
              },
            };
            break;
          default:
            obj = {
              cell: ({ cell }) => <span>{cell?.getValue() || "N/A"}</span>,
            };
            break;
        }
      }

      return {
        ...column,
        ...obj,
        size: columnSizes[column.accessorKey] || column.size || 140,
        minSize: 80,
        maxSize: 500,
      };
    });
  }, [tableColumnsFromApi, customCellRenderers, columnSizes]);

  const table = useReactTable({
    columns: customActions
      ? [
          ...tableColumns,
          {
            id: "Actions",
            accessorKey: "Actions",
            header: "Actions",
            enableSorting: false,
            enableGlobalFilter: false,
            cell: (props) => customActions(props),
          },
        ]
      : tableColumns,
    data: tableDataMemo ?? [],
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    globalFilterFn: "includesString",
    initialState: {
      columnPinning: {
        left: [],
        right: ["Actions"],
      },
    },
  });

  const getCommonPinningStyles = (column, isHeader = false) => {
    const isPinned = column.getIsPinned();
    const isLastLeftPinnedColumn =
      isPinned === "left" && column.getIsLastColumn("left");
    const isFirstRightPinnedColumn =
      isPinned === "right" && column.getIsFirstColumn("right");

    return {
      position: isPinned ? "sticky" : "relative",
      left: isPinned === "left" ? `${column.getStart("left")}px` : undefined,
      right: isPinned === "right" ? `${column.getAfter("right")}px` : undefined,
      boxShadow: isLastLeftPinnedColumn
        ? "-4px 0 4px -4px gray inset"
        : isFirstRightPinnedColumn
          ? "2px 0 4px -4px gray inset"
          : undefined,
      backgroundColor: isHeader ? "#f5f5f5" : "white",
      borderRight: isLastLeftPinnedColumn ? "1px solid #e5e7eb" : undefined,
      borderLeft: isFirstRightPinnedColumn ? "1px solid #e5e7eb" : undefined,
    };
  };

  if (isPending) return <TableSkeleton />;

  return (
    <div>
      <div
        className={`table_container  overflow-x-auto rounded-lg border border-lightGray overflow-y-auto max-h-[408px] shadow-md ${className}`}
      >
        {renderTopToolbarCustomActions && (
          <div className="sticky top-0 left-0 z-[5] flex border border-lightGray rounded-t-lg p-2 justify-between items-center bg-white">
            {renderTopToolbarCustomActions()}
          </div>
        )}

        {tableColumnsFromApi?.length && tableData?.length ? (
          <table className="min-w-full border-collapse relative border-l border-extraLightGray">
            <thead className="bg-offWhite sticky top-0">
              <tr>
                {table.getHeaderGroups().map((headerGroup) => (
                  <React.Fragment key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      const { column } = header;
                      return (
                        <th
                          key={header.id}
                          style={{
                            ...getCommonPinningStyles(column, true),
                            width: column.getSize(), // Enforce size
                            minWidth: column.columnDef.minSize,
                            maxWidth: column.columnDef.maxSize,
                          }}
                          className="text-sm px-3 py-3 font-light_J text-black/80 text-left whitespace-nowrap max-md:text-md"
                        >
                          <div
                            className={`${
                              header.column.getCanSort()
                                ? "cursor-pointer select-none"
                                : ""
                            } flex items-center gap-x-1 capitalize`}
                            onClick={header.column.getToggleSortingHandler()}
                          >
                            {header.column.columnDef.header.replace(/_/g, " ")}
                            <HiSortAscending />
                          </div>
                        </th>
                      );
                    })}
                  </React.Fragment>
                ))}
              </tr>
            </thead>

            <tbody className="bg-white">
              {table.getRowModel().rows.length > 0 ? (
                table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className="hover:bg-extraLightGray/20 border-b border-extraLightGray"
                  >
                    {row.getVisibleCells().map((cell) => {
                      const { column } = cell;
                      return (
                        <td
                          key={cell.id}
                          style={{
                            ...getCommonPinningStyles(column, false),
                            width: column.getSize(), // Enforce width
                            minWidth: column.columnDef.minSize,
                            maxWidth: column.columnDef.maxSize,
                          }}
                          className="p-2 text-[0.81rem] font-normal text-black max-md:text-md break-words"
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          ) ?? "N/A"}
                        </td>
                      );
                    })}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={table
                      .getHeaderGroups()
                      .reduce((acc, hg) => acc + hg.headers.length, 0)}
                    className="text-center py-4 text-md text-black/60 h-[40vh]"
                  >
                    {noDataText || "No data found"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        ) : (
          <table className="w-full rounded-lg bg-extraLightGray">
            <tbody>
              <tr>
                <td
                  colSpan={table
                    .getHeaderGroups()
                    .reduce((acc, hg) => acc + hg.headers.length, 0)}
                  className="text-center py-4 text-md text-black/60 h-[40vh]"
                >
                  {noDataText || "No data found"}
                </td>
              </tr>
            </tbody>
          </table>
        )}
      </div>

      {currentEntries ? (
        <DynamicTableFooter
          table={table}
          page={pagination.pageIndex || 1}
          totalPages={paginationFromApi?.total_pages || 1}
          setPagination={setPagination}
          totalEntries={paginationFromApi?.total_records || 0}
          currentEntries={currentEntries || 0}
        />
      ) : null}
    </div>
  );
}

export default memo(MasterTable);

export const ApproveButton = styled.div`
  background: #c7fcc9;
  padding: 6px 24px;
  font-size: 0.7rem;
  border-radius: 20px;
  color: #41ad47;
  font-weight: bold;
  cursor: pointer;
`;

export const RejectButton = styled.div`
  background: #ffebee;
  padding: 6px 24px;
  font-size: 0.7rem;
  border-radius: 20px;
  color: #f44336;
  font-weight: bold;
  cursor: pointer;
`;
