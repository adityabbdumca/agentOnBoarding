import React from "react";

function UiPageWrapper({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={`overflow-x-hidden  ${className}`}>{children}</div>;
}

export default UiPageWrapper;
