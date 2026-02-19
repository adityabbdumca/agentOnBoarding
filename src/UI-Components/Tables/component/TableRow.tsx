import React from "react";
import * as motion from "motion/react-client";

export const TableRow = ({
  children,
  type = "row",
  className = "",
}: {
  children: React.ReactNode;
  type?: string;
  className?: string;
}) => {
  return (
    <motion.tr
      initial={type === "head" ? false : { opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      data-head={type === "head"}
      className={`text-left data-[head=true]:sticky data-[head=true]:top-0  data-[head=true]:bg-extraLightGray
       bg-white z-[10] hover:bg-offWhite/40 ${className}`}
    >
      {children}
    </motion.tr>
  );
};
