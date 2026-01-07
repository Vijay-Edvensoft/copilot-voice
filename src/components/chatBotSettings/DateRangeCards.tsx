import {
  settingsState,
  type SettingsInitialState,
} from "@/redux/slice/chatBotSettingsSlice";
// import type { AppDispatch } from "@/redux/store/store";
import type { Dispatch, SetStateAction } from "react";
import {  useSelector } from "react-redux";

interface DateRangeCardsProps {
  name: keyof SettingsInitialState;
  value: string;
  icon: string;
  title: string;
  desc: string;
  color: "blue" | "green" | "purple";
  setIsCustom?: Dispatch<SetStateAction<boolean>>;
  isCustom?: boolean;
  handleChange: Dispatch<SetStateAction<any>>;
}
const DateRangeCards = (props: DateRangeCardsProps) => {
  // const dispatch = useDispatch<AppDispatch>();
  const { settings, updatedSettings } = useSelector(settingsState);
  //   console.log(settings);
  const {
    icon,
    title,
    desc,
    name,
    value,

    color,
    handleChange,
  } = props;

  const isActive = (updatedSettings?.[name] ?? settings?.[name]) === value;

  const borderColor: Record<string, string> = {
    blue: "border-blue-400  hover:border-blue-400",
    green: "border-green-400 hover:border-green-400",
    purple: "border-purple-400 hover:border-purple-400",
  };
  const textColor: Record<string, string> = {
    blue: "text-blue-400  ",
    green: "text-green-400",
    purple: "text-purple-400",
  };
  console.log(borderColor[color]);
  return (
    <label
      className={`context-option bg-gray-900 border-2 
      } rounded-lg p-4 cursor-pointer transition duration-200  
        ${
          (updatedSettings.context_time_window === "custom" &&
            value === "custom") ||
          isActive
            ? `${borderColor[color]}`
            : ` border-gray-700 hover:${borderColor[color]}`
        }`}
    >
      <input
        type="radio"
        name={name}
        value={value}
        checked={isActive}
        className="hidden peer"
        onChange={(e) => {
          console.log(e.target.value);
          handleChange(e);
          // if (e.target.value !== "custom") {
          //   if (isCustom) setIsCustom?.(false);
          // } else {
          //   setIsCustom?.((prev: boolean) => !prev);
          // }
        }}
      />
      <div className="flex flex-col items-center text-center ">
        <span
          className={
            (updatedSettings.context_time_window === "custom" &&
              value === "custom") ||
            isActive
              ? `${textColor[color]}`
              : "text-gray-400"
          }
        >
          <i className={`fa-solid ${icon} text-2xl mb-2`} />
        </span>
        {/* <i className="text-2xl mb-2 text-gray-400" data-fa-i2svg="">
          <svg
            className="svg-inline--fa fa-calendar-days"
            aria-hidden="true"
            focusable="false"
            data-prefix="fas"
            data-icon="calendar-days"
            role="img"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 448 512"
            data-fa-i2svg=""
          >
            <path
              fill="currentColor"
              d="M128 0c17.7 0 32 14.3 32 32V64H288V32c0-17.7 14.3-32 32-32s32 14.3 32 32V64h48c26.5 0 48 21.5 48 48v48H0V112C0 85.5 21.5 64 48 64H96V32c0-17.7 14.3-32 32-32zM0 192H448V464c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V192zm64 80v32c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16V272c0-8.8-7.2-16-16-16H80c-8.8 0-16 7.2-16 16zm128 0v32c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16V272c0-8.8-7.2-16-16-16H208c-8.8 0-16 7.2-16 16zm144-16c-8.8 0-16 7.2-16 16v32c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16V272c0-8.8-7.2-16-16-16H336zM64 400v32c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16V400c0-8.8-7.2-16-16-16H80c-8.8 0-16 7.2-16 16zm144-16c-8.8 0-16 7.2-16 16v32c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16V400c0-8.8-7.2-16-16-16H208zm112 16v32c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16V400c0-8.8-7.2-16-16-16H336c-8.8 0-16 7.2-16 16z"
            ></path>
          </svg>
        </i> */}
        <span className="text-white font-medium">{title}</span>
        <span className="text-gray-500 text-xs mt-1">{desc}</span>
      </div>
    </label>
  );
};

export default DateRangeCards;
