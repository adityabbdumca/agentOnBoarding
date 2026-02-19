import { Skeleton } from "@mui/material";
import styled from "styled-components";

function TableSkeleton({ marginTop }) {
  return (
    <TableSkeletonContainerStyled marginTop={marginTop}>
      <div className="header">
        {Array(6)
          .fill(null)
          .map((_, i) => {
            return <Skeleton key={i} variant="text" width={120} height={50} />;
          })}
      </div>
      <div className="body">
        {Array(4)
          .fill(null)
          .map((_, i) => {
            return <Skeleton key={i} variant="text" height={60} />;
          })}
      </div>
    </TableSkeletonContainerStyled>
  );
}

export default TableSkeleton;

const TableSkeletonContainerStyled = styled.div`
  margin-top: ${(props) => (props.marginTop ? "20px" : 0)};
  width: 100%;
  .header {
    padding: 0 10px !important;
    background: #eff3f6b3 !important;
    display: flex !important;
    flex-direction: row !important;
    width: 100%;
    gap: 30px;
    justify-content: space-between;
  }
`;
