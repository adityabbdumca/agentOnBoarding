const AgentWatermark = () => {
  return (
    <div className="pointer-events-none size-1/2 absolute inset-56 flex items-center justify-center z-9 -rotate-30 opacity-20">
      <svg
        width="250"
        height="250"
        viewBox="0 0 250 250"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <filter id="grunge">
            <feTurbulence
              type="turbulence"
              baseFrequency="0.9"
              numOctaves="2"
              result="turbulence"
            />
            <feDisplacementMap in2="turbulence" in="SourceGraphic" scale="3" />
          </filter>
        </defs>

        <circle
          cx="125"
          cy="125"
          r="100"
          fill="none"
          stroke="#00a63e"
          strokeWidth="10"
          filter="url(#grunge)"
        />

        <circle
          cx="125"
          cy="125"
          r="85"
          fill="none"
          stroke="#00a63e"
          strokeWidth="5"
          strokeDasharray="6,6"
        />

        <text
          x="125"
          y="60"
          textAnchor="middle"
          fill="#00a63e"
          fontSize="14"
          fontWeight="bold"
          fontFamily="Arial, sans-serif"
        >
          ★ ★ ★
        </text>

        <text
          x="125"
          y="190"
          textAnchor="middle"
          fill="#00a63e"
          fontSize="14"
          fontWeight="bold"
          fontFamily="Arial, sans-serif"
        >
          ★ ★ ★
        </text>

        <text
          x="125"
          y="125"
          textAnchor="middle"
          fill="#00a63e"
          fontSize="18"
          fontWeight="bold"
          fontFamily="Arial, sans-serif"
          alignmentBaseline="middle"
        >
          AGENT VERIFIED
        </text>

        <text
          x="125"
          y="145"
          textAnchor="middle"
          fill="#00a63e"
          fontSize="12"
          fontWeight="normal"
          fontFamily="Arial, sans-serif"
          alignmentBaseline="middle"
        >
          Certified and Authorized
        </text>
      </svg>
    </div>
  );
};

export default AgentWatermark;
