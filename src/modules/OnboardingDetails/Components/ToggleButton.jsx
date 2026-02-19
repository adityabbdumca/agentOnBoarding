import { MdFemale, MdMale } from "react-icons/md";
import { TbGenderThird } from "react-icons/tb";

export default function GenderToggle({ setValue, gender }) {
  const options = [
    {
      value: "Male",
      label: "Male",
      icon: <MdMale size={16} />,
      color: "text-blue-500",
    },
    {
      value: "Female",
      label: "Female",
      icon: <MdFemale size={16} />,
      color: "text-pink-400",
    },
    {
      value: "Third Gender",
      label: "Third Gender",
      icon: <TbGenderThird size={16} />,
      color: "text-green-500",
    },
  ];

  return (
    <div className="inline-flex gap-1 p-1 rounded-full bg-[#f0f4f8]">
      {options.map((option) => (
        <button
          key={option.value}
          className={`flex items-center gap-2 py-2 px-6 rounded-full transition-all duration-200 text-xs
            ${
              gender === option.value
                ? "bg-white text-gray-900 shadow-sm"
                : "bg-transparent text-gray-500 hover:text-gray-700"
            }`}
          onClick={() => setValue("profile.gender", option.value)}
          type="button"
        >
          <span className={option.color}>{option.icon}</span>
          {option.label}
        </button>
      ))}
    </div>
  );
}
