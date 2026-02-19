import { EDUCATION_OPTIONS } from "@/Components/MasterTable/constants";
import { allowOnlyName, alphanumeric } from "@/HelperFunctions/helperFunctions";
import Dropdown from "@/UI-Components/Dropdown";
import Input from "@/UI-Components/Input";
import { Tooltip } from "@mui/material";
import { useGetBoardORUniversity } from "../service";
import { useEffect } from "react";
import useGlobalDebounceHandler from "@/hooks/useGlobalDebounce";

const ProfileEducationDetails = ({
  register,
  errors,
  id,
  control,
  watch,
  passingYearOption,
  setValue,
  getValues,
  userData,
}) => {
  const qualification = getValues("profile.highest_qualification");
  const { mutate, data: qualificationData } = useGetBoardORUniversity();
  const dropdownList = qualificationData?.data?.return_data?.map((item) => {
    return {
      label: item?.university_name || item?.board_name,
      value: item?.university_name || item?.board_name,
    };
  });
  const { debouncedQuery } = useGlobalDebounceHandler(
    qualificationData?.data?.type,
    500
  );
  useEffect(() => {
    if (qualification) {
      mutate({ highest_qualification: qualification?.value });
    }
  }, []);
  useEffect(() => {
    if (userData?.profile?.board_name) {
      const boardNameValue = {
        label: userData?.profile?.board_name,
        value: userData?.profile?.board_name,
      };
      setValue("profile.board_name", boardNameValue);
    }
  }, []);
  return (
    <div
      data-id={!!id}
      className="group ring ring-gray-200 p-4 rounded-lg shadow-md"
    >
      <h2 className="col-span-4 text-lg font-semibold text-gray-600 border-b border-lightGray pb-2">
        Education Details
      </h2>
      <div
        data-id={!!id}
        className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 data-[id=true]:grid-cols-2  mt-4"
      >
        <div>
          <Dropdown
            control={control}
            name={"profile.highest_qualification"}
            label={"Highest Qualification"}
            maxLength={100}
            isRequired
            errors={errors}
            options={EDUCATION_OPTIONS}
            onChange={(e) => {
              if (e?.value) {
                mutate({ highest_qualification: e?.value });
              }
              setValue("profile.board_name", "");
            }}
          />
        </div>
        {watch("profile.highest_qualification")?.value === "Other" && (
          <div>
            <Input
              inputRef={register("profile.other_education")}
              name={"profile.other_education"}
              isRequired
              label={"Enter Qualification"}
              placeholder="Enter Other Qualification"
              errors={errors}
              maxLength={100}
              onChange={alphanumeric}
            />
          </div>
        )}
        <div>
          {/* <Input
            inputRef={register("profile.board_name")}
            name={"profile.board_name"}
            placeholder={"Enter Board Name"}
            isRequired
            label={"Board Name"}
            errors={errors}
            maxLength={100}
            onChange={allowOnlyName}
          /> */}
          <Dropdown
            inputRef={register("profile.board_name")}
            control={control}
            name={"profile.board_name"}
            label={debouncedQuery ? `${debouncedQuery} name` : "name"}
            maxLength={100}
            isRequired
            errors={errors}
            options={dropdownList}
            isDisabled={!watch("profile.highest_qualification")}
          />
        </div>

        <div>
          <Input
            inputRef={register("profile.roll_no")}
            name={"profile.roll_no"}
            isRequired
            label={"Roll No. / Certificate No."}
            placeholder="E1001"
            errors={errors}
            maxLength={100}
            onChange={alphanumeric}
          />
        </div>

        <div>
          {(() => {
            const input = (
              <Dropdown
                control={control}
                name={"profile.year_of_passing"}
                label={"Year of Passing"}
                isRequired
                errors={errors}
                options={passingYearOption}
                isDisabled={!watch("profile.dob")}
              />
            );
            return !watch("profile.dob") ? (
              <Tooltip
                arrow
                title="Please enter DOB first to enable Year of Passing"
              >
                <span>{input}</span>
              </Tooltip>
            ) : (
              input
            );
          })()}
        </div>
      </div>
    </div>
  );
};

export default ProfileEducationDetails;
