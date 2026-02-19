import { icons as lucideIcons } from "lucide-react";

const icons = lucideIcons;

function UiCapsule({
  color = "#444444",
  text,
  className,
  icon,
  onClick,
  ...rest
}) {
  const Icon = icons[icon] || icons["Circle"];
  return (
    <div
      {...rest}
      style={{ backgroundColor: color + "17", color }}
      className={`text-xs font-semibold px-2 h-6 w-max flex items-center 
        justify-center gap-2 capitalize rounded-full  ${className}`}
      onClick={onClick}
    >
      {icon && <Icon className="size-4" />}
      <span className="text-nowrap">{text}</span>
    </div>
  );
}

export default UiCapsule;
