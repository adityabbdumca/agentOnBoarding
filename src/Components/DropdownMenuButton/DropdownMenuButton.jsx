import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { useState } from "react";
import { FaCaretDown } from "react-icons/fa";

const DropdownMenuButton = ({ dropdownList = [], isStatic = false }) => {
  const [value, setValue] = useState(dropdownList[0]);
  return (
    <Menu>
      <div className="flex items-stretch">
        <button
          type="submit"
          className="bg-primary text-white text-sm rounded-l-lg py-2 px-4 font-semibold flex items-center gap-2 cursor-pointer"
          onClick={() => value.onClick()}
        >
          {value?.icon}
          {value?.label}
        </button>
        <MenuButton className="inline-flex items-center gap-2 rounded-r-lg border-l-[0.5px] border-offWhite bg-primary py-1.5 px-2 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-primary/95 cursor-pointer">
          <FaCaretDown className="size-3" />
        </MenuButton>
      </div>

      <MenuItems
        transition
        anchor="bottom end"
        className="origin-top-right rounded-lg border border-black/5 bg-extraLightGray shadow-elevation p-1 text-sm/6 text-body transition duration-100 ease-out z-50 [--anchor-gap:var(--spacing-1)] focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0 min-w-[7.4rem] max-w-52 shadow-md"
      >
        {dropdownList
          ?.filter((item) => value?.label !== item?.label)
          ?.map((communicationType) => (
            <MenuItem key={communicationType?.label}>
              <button
                type="button"
                onClick={() =>
                  !isStatic
                    ? setValue(communicationType)
                    : communicationType.onClick()
                }
                className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 text-sm data-[focus]:bg-white data-[hover]:bg-white cursor-pointer"
              >
                {communicationType?.icon}
                {communicationType?.label}
              </button>
            </MenuItem>
          ))}
      </MenuItems>
    </Menu>
  );
};

export default DropdownMenuButton;
