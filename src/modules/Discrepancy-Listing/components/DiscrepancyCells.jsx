export const DiscrepancyCells = {
  discrypancy_status: ({ row }) => {
    const statusValue = row.getValue("discrypancy_status");
    const statusMap = {
      Raised: { bg: "bg-red-100 text-red-600 w-fit", dot: "bg-red-500" },
      "Re-Open": {
        bg: "bg-purple-100 text-purple-600 w-fit",
        dot: "bg-purple-500",
      },
      "Re-Submitted": {
        bg: "bg-yellow-100 text-yellow-700 w-32",
        dot: "bg-yellow-700",
      },
      Approved: {
        bg: "bg-green-100 text-green-600 w-fit",
        dot: "bg-green-500",
      },
    };

    return (
      <span
        className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium capitalize ${
          statusMap[statusValue].bg || "bg-gray-100 text-gray-600"
        } `}
      >
        <div
          className={`size-1.5 rounded-full ${
            statusMap[statusValue].dot || "bg-gray-600"
          }`}
        />
        <p>{statusValue}</p>
      </span>
    );
  },
};
