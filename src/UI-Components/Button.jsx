import { LoaderCircle } from "lucide-react";

const Button = ({
  variant,
  startIcon = null,
  endIcon = null,
  id,
  disabled = false,
  type = "button",
  width,
  children,
  classNameProps,
  onClick,
  isLoading = false,
  ...rest
}) => {
  let flag = true;
  const handleClick = (e) => {
    if (flag) {
      flag = false;
      const time = setTimeout(() => {
        if (onClick) {
          flag = true;
          onClick(e);
        }
      }, 0);
      return () => clearTimeout(time);
    }
  };
  return (
    <button
      {...rest}
      onClick={handleClick}
      id={id}
      // eslint-disable-next-line react/button-has-type
      type={type}
      disabled={isLoading || disabled}
      data-variant={variant || "contained"}
      style={{ width: width }}
      data-disabled={disabled}
      className={`text-sm h-9 data-[variant=outlined]:bg-transparent data-[variant=outlined]:ring-1 flex items-center justify-center  cursor-pointer  text-white data-[variant=outlined]:text-primary rounded-lg data-[variant=outlined]:hover:bg-primary data-[variant=outlined]:hover:text-white hover:brightness-90  transition-all active:scale-95 active:shadow-md
          active:brightness-90 disabled:opacity-60 disabled:cursor-not-allowed outline-gray
          bg-primary  py-2 px-4 font-semibold gap-2 ${classNameProps}`}
    >
      {startIcon && <span className=" text-lg">{startIcon}</span>}
      {isLoading ? (
        <LoaderCircle className="size-5 animate-spin text-body" />
      ) : (
        children
      )}
      {endIcon && <span className="text-lg">{endIcon}</span>}
    </button>
  );
};

export default Button;
