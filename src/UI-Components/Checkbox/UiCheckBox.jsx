import { CheckIcon } from "lucide-react";

const UiCheckbox = ({
  enabled,
  setEnabled,
  id,
  className,
  containerClass = "",
  label = "",
  labelClassName = "",
}) => {
  return (
    <div className={`flex items-center gap-2 ${containerClass}`}>
      <label
        htmlFor={id}
        data-checked={enabled}
        className={`group rounded ring-1 ring-gray data-[checked=true]:bg-primary
         data-[checked=true]:ring-primary flex items-center justify-center cursor-pointer ${className}`}
      >
        <CheckIcon className="hidden text-white group-data-[checked=true]:block" />
      </label>
      {label && (
        <span className={`text-xs font-medium ${labelClassName}`}>{label}</span>
      )}
      <input
        id={id}
        type="checkbox"
        checked={enabled}
        onChange={setEnabled?.bind(this)}
        className="border-transparent hidden"
      />
    </div>
  );
};

export default UiCheckbox;
