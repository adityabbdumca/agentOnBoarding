import React from "react";

export const TableCell = ({
  type = "td",
  children,
  className,
  leftOffset, // Receive leftOffset as prop instead of calculating
  dataColumnId,
}: {
  children: React.ReactNode;
  type: React.ElementType;
  className?: string;
  leftOffset?: number;
  dataColumnId?: string;
}) => {
  const Component = type;

  if (type === "th") {
    return (
      <Component
        data-column-id={dataColumnId}
        className={`px-4 relative cursor-pointer text-sm h-10 data-[mobile=true]:min-w-[160px]  text-nowrap ${className}
        font-semibold text-body bg-lightGray/40 border-r border-lightGray `}
        style={{
          position: leftOffset !== undefined ? "sticky" : "",
          left: leftOffset !== undefined ? `${leftOffset - 0.2}px` : "",
          zIndex: leftOffset !== undefined ? 1 : "",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        <p className="flex justify-between items-center gap-2 tracking-wider">
          {children}
        </p>
      </Component>
    );
  }
  return (
    <Component
      className={`px-4 relative  h-10 data-[mobile=true]:min-w-[160px] border-b border-r border-lightGray/30 text-nowrap ${className}
        ${type === "th" ? "font-semibold text-body text-sm  " : " text-heading text-xs tracking-wider  "}`}
      style={{
        position: leftOffset !== undefined ? "sticky" : "",
        left: leftOffset !== undefined ? `${leftOffset - 0.2}px` : "",
        zIndex: leftOffset !== undefined ? 1 : "",
        overflow: "hidden",
        textOverflow: "ellipsis",
      }}
      data-column-id={dataColumnId}
    >
      {children}
    </Component>
  );
};
