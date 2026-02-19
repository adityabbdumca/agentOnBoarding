import useGlobalRoutesHandler from "@/hooks/useGlobalHandleRouter";
import useEndorsement from "../../hooks/useEndorsement";
import EndorsementCard from "../../component/EndorsementCard/EndorsementCard";
import PrudentialLoader from "@/Components/Loader/PrudentialLoader";

const EndorsementPage = () => {
  const verticalId = parseInt(localStorage.getItem("vertical_id"), 10);
  const { navigateTo } = useGlobalRoutesHandler();
  const {
    service: { getAllEndorsementTypesService },
  } = useEndorsement();
  const endorsementTypeData =
    getAllEndorsementTypesService?.data?.data?.data || [];
  if (getAllEndorsementTypesService?.isPending) {
    return <PrudentialLoader />;
  }
  return (
    <div>
      <div className="mb-8 flex flex-col gap-1">
        <h2 className="text-lg font-semibold text-gray-900">
          Select Endorsement Type
        </h2>
        <p className="text-gray-600 text-sm">
          Choose the type of profile update you want to request
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {endorsementTypeData.map((endorsement) => (
          <EndorsementCard
            key={endorsement.id}
            endorsement={endorsement}
            handleClick={() => {
              if (verticalId === 4) {
                navigateTo({
                  url: `/agent/servicing-module/register-request/${endorsement?.id}`,
                });
                return;
              }
              navigateTo({
                url: `/servicing-module/register-request/${endorsement?.id}`,
              });
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default EndorsementPage;
