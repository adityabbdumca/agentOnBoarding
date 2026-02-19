///? This footer component used for dynamic pagination if you want tanstack pagination used <TableFooter/> component
import { HiChevronDoubleLeft, HiChevronLeft } from "react-icons/hi";

const DynamicTableFooter = ({
  table,
  page,
  setPagination = () => {},
  totalPages,
  totalEntries,
  currentEntries = 0,
}) => {
  return (
    <div className="table_footer dynamic_footer flex max-md:grid max-md:grid-cols-4 justify-between  items-center  mt-3 pb-3 max-md:gap-5">
      <div className="text-sm text-slate-700 max-md:text-md max-md:whitespace-nowrap">
        <span className="max-md:hidden ">Showing&nbsp;</span>
        {(page - 1) * table.getState().pagination.pageSize + 1} to&nbsp;
        {(page - 1) * table.getState().pagination.pageSize + currentEntries}
        &nbsp;of&nbsp;{totalEntries}
        <span className=" ml-5 max-md:ml-0">
          <label htmlFor="show" className="mr-2">
            show
          </label>
          <select
            id="show"
            value={table.getState().pagination.pageSize}
            onChange={(e) => {
              table.setPageSize(Number(e.target.value));
              setPagination({
                pageIndex: 1,
                pageSize: Number(e.target.value),
              });
            }}
            className="p-1 border rounded-lg border-lightGray bg-transparent focus:outline-none max-md:text-md"
          >
            {[10, 20, 30, 50, 100].map((pageSize) => {
              return (
                <option key={pageSize} value={pageSize}>
                  {pageSize}
                </option>
              );
            })}
          </select>
        </span>
      </div>
      <div className="text-sm text-slate-700 flex gap-3 items-center max-md:text-md  max-md:flex-wrap max-md:justify-between max-md:col-span-2">
        <div className="text-sm flex justify-center gap-3 max-md:text-md">
          <button
            type="button"
            className={
              page === 1
                ? "text-slate-300"
                : "bg-white ring-1 ring-lightGray p-1.5 rounded-md hover:bg-gray-100  transition-colors disabled:cursor-not-allowed cursor-pointer "
            }
            data-disabled={page === 1}
            disabled={page === 1}
            onClick={() => {
              setPagination({
                pageIndex: 1,
                pageSize: table.getState().pagination.pageSize,
              });
            }}
          >
            {/* <BiFirstPage className="inline" /> */}
            <span className="max-md:hidden">
              <HiChevronDoubleLeft />
            </span>
          </button>
          <button
            type="button"
            className={
              page > 1
                ? "bg-white ring-1 ring-lightGray p-1.5 rounded-md hover:bg-gray-100  transition-colors cursor-pointer"
                : "text-slate-300"
            }
            disabled={page === 1}
            onClick={() => {
              setPagination({
                pageIndex: page - 1,
                pageSize: table.getState().pagination.pageSize,
              });
            }}
          >
            {/* <GrFormPrevious className="inline" /> */}
            <span className="max-md:hidden">
              <HiChevronLeft />
            </span>
          </button>
          <span className="mx-2 ring ring-lightGray rounded-lg py-1 px-2.5 flex items-center justify-center">
            {page}
          </span>
          <button
            type="button"
            className={
              page === totalPages
                ? "text-slate-300 "
                : "bg-white ring-1 ring-lightGray p-1.5  rounded-md hover:bg-gray-100  transition-colors cursor-pointer"
            }
            disabled={page === totalPages}
            onClick={() => {
              setPagination({
                pageIndex: page + 1,
                pageSize: table.getState().pagination.pageSize,
              });
            }}
          >
            <span className="max-md:hidden">
              {" "}
              <HiChevronLeft className="rotate-180" />
            </span>
          </button>
          <button
            type="button"
            disabled={totalPages === page}
            className={
              totalPages === page
                ? "text-slate-300"
                : "bg-white ring-1 ring-lightGray p-1.5 cursor-pointer  rounded-md hover:bg-gray-100  transition-colors"
            }
            onClick={() => {
              setPagination({
                pageIndex: Number(totalPages),
                pageSize: table.getState().pagination.pageSize,
              });
            }}
          >
            <span className="max-md:hidden">
              <HiChevronDoubleLeft className="rotate-180" />
            </span>
            {/* <BiLastPage className="inline" /> */}
          </button>
        </div>

        <span>
          Page {page} of {totalPages}
        </span>
        {/* <span className="ml-5 max-md:ml-0">
          <span className="max-md:hidden">Page</span>&nbsp;&nbsp;
          <input
            type="number"
            value={page}
            onChange={(e) => {
              setPagination({
                pageIndex: +e.target.value,
                pageSize: table.getState().pagination.pageSize,
              });
            }}
            className="border p-1 border-lightGray rounded w-12 bg-transparent hover:outline-none focus:outline-none focus:border-black"
            min="1"
            max={totalPages}
          />
        </span> */}
      </div>
    </div>
  );
};

export default DynamicTableFooter;
