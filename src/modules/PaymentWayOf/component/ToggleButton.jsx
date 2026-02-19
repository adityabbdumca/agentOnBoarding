const Toggle = ({ value, onChange }) => {
  const handleToggle = () => {
    onChange(!value);
  };

  return (
    <div
      onClick={handleToggle}
      className={`relative flex items-center rounded-full cursor-pointer transition-colors duration-300 p-0.5 ${
        value ? "bg-primary" : "bg-gray-300"
      }`}
      style={{ width: "70px", height: "30px" }}
    >
      <div
        className={`absolute bg-white rounded-full shadow-md transition-all duration-300 ${
          value ? "left-[42px]" : "left-[2px]"
        }`}
        style={{ width: "26px", height: "26px" }}
      />
      <div className="flex w-full justify-between items-center h-full px-1.5 z-10">
        <span
          className={`text-xs font-medium transition-opacity duration-200 ${
            value ? "opacity-100 text-white" : "opacity-0"
          }`}
        >
          Yes
        </span>
        <span
          className={`text-xs font-medium transition-opacity duration-200 ${
            !value ? "opacity-100 text-gray-700" : "opacity-0"
          }`}
        >
          No
        </span>
      </div>
    </div>
  );
};

export default Toggle;
