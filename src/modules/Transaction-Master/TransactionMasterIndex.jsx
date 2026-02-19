import { useState } from "react";
import Input from "@/UI-Components/Input";
import MasterTable from "@/Components/MasterTable";
import MainContainer from "../OnboardingDetails/Components/MainContainer";
import { debounce } from "lodash";
const TransactionMasterIndex = () => {
  const [searchData, setSearchData] = useState({});

  return (
    <MainContainer
      heading={"Transaction Master"}
      subHeading={"Master to keep track of all the transactions"}
    >
      <MasterTable
        api={"transactionList"}
        methods={"POST"}
        payload={searchData}
        renderTopToolbarCustomActions={() => {
          return (
            <div className="flex items-center justify-end w-full">
              <Input
                name="search_value"
                placeholder={"Search Table"}
                onChange={debounce(
                  (e) => setSearchData({ search_value: e.target.value }),
                  300
                )}
              />
            </div>
          );
        }}
        // isActions={true}
      />
    </MainContainer>
  );
};

export default TransactionMasterIndex;
