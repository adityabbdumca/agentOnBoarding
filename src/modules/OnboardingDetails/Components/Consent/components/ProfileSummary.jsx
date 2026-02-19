import { Mail, MapPin, Phone, School, User } from "lucide-react";
import { INSURER_FIELDS } from "../summary.constant";
import InfoCard from "./InfoCard";
import { DateTime } from "luxon";
const ProfileSummary = ({ userData }) => {
  const profileData = userData?.profile;
  const isTransferUserType = userData?.user_type === "transfer";
  const isCompositeUserType = userData?.user_type === "composite";
 

  return (
    <div className="flex flex-col gap-2 w-full ">
      <div className="flex flex-col gap-2 p-2 border border-lightGray rounded-lg ">
        <h2 className="text-sm font-semibold">Personal Details </h2>

        <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-1">
          <InfoCard
            label="Salutation"
            value={profileData?.salutation?.value || profileData?.salutation}
            icon={User}
          />
          <InfoCard
            label="First Name"
            value={profileData?.first_name}
            icon={User}
          />
          <InfoCard
            label="Middle Name"
            value={profileData?.middle_name}
            icon={User}
          />
          <InfoCard
            label="Last Name"
            value={profileData?.last_name}
            icon={User}
          />
          <InfoCard
            label="Father Name"
            value={profileData?.father_name}
            icon={User}
          />
          <InfoCard
            label="Gender"
            value={profileData?.gender?.value || profileData?.gender}
            icon={User}
          />
          <InfoCard
            label="Date of Birth"
            value={DateTime.fromISO(profileData?.dob).toFormat("dd-MM-yyyy")}
            icon={User}
          />
          <InfoCard
            label="Marital Status"
            value={
              profileData?.marital_status?.value || profileData?.marital_status
            }
            icon={User}
          />
          <InfoCard
            label="Mobile No."
            value={profileData?.mobile}
            icon={Phone}
          />
          <InfoCard
            label="Alternate No"
            value={profileData?.alternate_no}
            icon={Phone}
          />
          <InfoCard label="Email Id" value={profileData?.email} icon={Mail} />
          <InfoCard
            label="Nationality"
            value={profileData?.nationality}
            icon={User}
          />
          <InfoCard
            label="Aadhaar No."
            value={profileData?.aadhar_no}
            icon={User}
          />
          <InfoCard label="PAN No." value={profileData?.pan_no} icon={User} />
          <InfoCard
            label="Caste Category"
            value={profileData?.category?.value || profileData?.category}
            icon={User}
          />
          <InfoCard
            label="Address Line 1"
            value={profileData?.address || "—"}
            icon={MapPin}
          />
          <InfoCard
            label="Address Line 2"
            value={profileData?.street || "—"}
            icon={MapPin}
          />
          <InfoCard
            label="Pincode"
            value={profileData?.pincode || "—"}
            icon={MapPin}
          />
          <InfoCard
            label="City"
            value={profileData?.city || "—"}
            icon={MapPin}
          />
          <InfoCard
            label="State"
            value={profileData?.state || "—"}
            icon={MapPin}
          />
          <InfoCard
            label="Is Communication Address Same"
            value={profileData?.is_communication_address_same ? "Yes" : "No"}
            icon={MapPin}
          />
          <InfoCard
            label="Communication Address Line 1"
            value={profileData?.communicational_address || "--"}
            icon={MapPin}
          />
          <InfoCard
            label="Communication Address Line 2"
            value={profileData?.communication_street || "--"}
            icon={MapPin}
          />
          <InfoCard
            label="Communication Pincode"
            value={profileData?.communication_pincode || "--"}
            icon={MapPin}
          />
          <InfoCard
            label="Communication City"
            value={profileData?.communication_city || "--"}
            icon={MapPin}
          />
          <InfoCard
            label="Communication State"
            value={profileData?.communication_state || "--"}
            icon={MapPin}
          />
        </section>
      </div>
      <div className="flex flex-col gap-2 p-2 border border-lightGray rounded-lg">
        <h2 className="text-sm font-semibold">Education Details </h2>
        <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-1">
          <InfoCard
            label="Highest Qualification"
            value={
              profileData?.highest_qualification?.value ||
              profileData?.highest_qualification
            }
            icon={School}
          />
          <InfoCard
            label="Board Name"
            value={profileData?.board_name?.value || profileData?.board_name}
            icon={School}
          />
          <InfoCard
            label="Roll No"
            value={profileData?.roll_no}
            icon={School}
          />
          <InfoCard
            label="Year of Passing"
            value={
              profileData?.year_of_passing?.value ||
              profileData?.year_of_passing
            }
            icon={School}
          />
        </section>
      </div>
      {(isTransferUserType || isCompositeUserType) && (
        <div className="flex flex-col gap-2 p-2 border border-lightGray rounded-lg">
          <h2 className="text-sm font-semibold">Insurer Details </h2>
          <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-1">
            {isTransferUserType && (
              <>
                <InfoCard
                  label="Existing Health Insurer Name"
                  value={profileData?.existing_health_insurance_name}
                  icon={User}
                />
                <InfoCard
                  label="Existing Health Insurer NOC Date"
                  value={profileData?.existing_health_insurance_noc_date}
                  icon={User}
                />
                <InfoCard
                  label="Reason for Transfer"
                  value={profileData?.reason_for_transfer}
                  icon={User}
                />
              </>
            )}
            {profileData?.insurers?.map((insurer, idx) => (
              <div key={idx} className="col-span-4 grid grid-cols-4 gap-4">
                {INSURER_FIELDS.map(({ label, key }) => (
                  <InfoCard
                    key={key}
                    label={label}
                    value={insurer?.[key]?.label || insurer?.[key]}
                    icon={User}
                  />
                ))}
              </div>
            ))}
          </section>
        </div>
      )}
      {/* </UiDiscloserBasic> */}
    </div>
  );
};

export default ProfileSummary;
