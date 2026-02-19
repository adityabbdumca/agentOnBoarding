import { useCheckBlackListAgentServices } from "@/services/hooks/blacklistAgent/useBlackListAgentServices";
import { useState } from "react";

const useCheckBlacklistAgent = ({
  panNumber,
}: {
  panNumber: string | null;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const {
    services: { getCheckBlackListAgentServices },
  } = useCheckBlackListAgentServices({
    panNumber: panNumber,
    enableQuery: panNumber ? true : false,
  });

  return {
    states: { isOpen, setIsOpen },
    service: { getCheckBlackListAgentServices },
  };
};

export default useCheckBlacklistAgent;
