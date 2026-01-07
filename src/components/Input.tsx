import type { InputType } from "@/pages/Onboarding/AuthVerification";
import { useState } from "react";

const Input = (props: InputType) => {
  const {
    name,
    label,
    type,
    placeholder,
    required,
    onChange,
    value,
    className,
    icon,
    options,
    description,
  } = props;
  const [isProtected, setIsProtected] = useState(true);

  const handleType = (type: string) => {
    if (type === "text") return "text";
    if (type === "email") return "email";
    if (type === "number") return "number";
    if (type === "password") {
      return isProtected ? "password" : "text";
    }
  };
  function togglePassword(): void {
    setIsProtected((prev) => !prev);
  }
  return (
    <div className={className}>
      <label
        className="block text-sm text-start font-medium text-gray-300 mb-2"
        htmlFor={name}
      >
        {label}
      </label>
      {options ? (
        <div className="relative">
          <select
            className="p-1 w-full px-4 py-3 bg-gray-700 border border-border-color text-white rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent pl-12"
            name={name}
            id=""
            onChange={(e) => onChange(e?.target?.name, e?.target?.value)}
            required
          >
            <option className="bg-border-color/50 " value="">
              Select Type
            </option>
            {options.map((option, idx) => {
              return (
                <option
                  className="bg-border-color border rounded-md"
                  key={option}
                  value={idx + 1}
                >
                  {option}
                </option>
              );
            })}
          </select>{" "}
          <i className={icon}></i>
        </div>
      ) : (
        <div className="relative">
          <input
            type={handleType(type)}
            id={name}
            name={name}
            defaultValue={value && value}
            className="w-full px-4 py-3 bg-gray-700 border border-border-color text-white rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent pl-12 "
            placeholder={placeholder}
            required={required}
            onChange={(e) => onChange(e?.target?.name, e?.target?.value)}
          />
          <i className={icon}></i>
          {type === "password" && (
            <button
              type="button"
              onClick={() => togglePassword()}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200 "
            >
              {isProtected ? (
                <span key="protected">
                  {" "}
                  <i className="fa-solid fa-eye"></i>
                </span>
              ) : (
                <span key="open">
                  {" "}
                  <i className="fa-solid fa-eye-slash"></i>
                </span>
              )}
            </button>
          )}
        </div>
      )}
      {description && (
        <p className="text-xs text-gray-500 mt-1">{description}</p>
      )}
    </div>
  );
};

export default Input;
