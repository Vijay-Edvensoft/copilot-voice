import Input from "@/components/Input";
// import { authState, registerUser } from "@/redux/slice/authSlice";
// import type { AppDispatch } from "@/redux/store/store";

import {
  useState,
  type Dispatch,
  type FC,
  type FormEvent,
  type SetStateAction,
} from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { toast } from "react-toastify";

export interface InputType {
  name: string;
  label: string;
  type: string;
  placeholder: string;
  required: boolean;
  onChange: (name: string, value: string) => void;
  description: string;
  error?: string;
  icon?: string;
  className?: string;
  options?: string[];
  value?: string | number;
}
export interface FormType {
  username: string;
  email: string;
  password: string;
}

export type Props = {
  onNext?: (() => void) | undefined;
  formData: FormType;
  onChange: (name: string, value: string) => void;
  setFormData: Dispatch<SetStateAction<FormType>>;
};

const AuthVerification: FC<Props> = (props: Props) => {
  // userState with status and user

  const { onNext, onChange } = props;
  // const { status, user, message } = useSelector(authState);
  // const dispatch = useDispatch<AppDispatch>();
  const [isOtp, setIsOtp] = useState<boolean>(false);

  // const [formData, setFormData] = useState<FormType>({
  //   username: "",
  //   email: "",
  //   password: "user@123",
  // });

  const handleChange = (): void => {
    setIsOtp(true);
  };

  function handleSubmit(e: FormEvent<HTMLFormElement>): void {
    e.preventDefault();

    if (isOtp === false) {
      setIsOtp(true);
    } else if (isOtp === true) {
      onNext?.();
    }
  }

  // Inputs for Auth Form
  const emailInput: InputType = {
    name: "email",
    label: "Email Address",
    type: "email",
    placeholder: "Enter your Email",
    required: false,
    description: "",
    onChange: onChange,
    icon: "fa-solid fa-envelope absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400",
  };

  const otpInput: InputType = {
    name: "otp",
    label: "OTP code",
    type: "text",
    placeholder: "Enter 6-digit OTP",
    required: true,
    description: "",
    onChange: handleChange,
    icon: "fa-solid fa-key absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400",
  };
  // useEffect(() => {
  //   if (status === "success") {
  //     localStorage.setItem("user", JSON.stringify(user));
  //     toast.success(message);
  //     onNext();
  //   }
  //   if (status === "failed") {
  //     toast.error(message);
  //   }
  // }, [status, user, onNext, message]);

  return (
    <div id="login-page" className="mb-8 ">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
        <p className="text-gray-400 ">
          Sign in to access your database connection
        </p>
      </div>

      <form id="login-form" className="space-y-6" onSubmit={handleSubmit}>
        <Input {...emailInput} />

        {isOtp && (
          <div>
            <Input {...otpInput} />
            <p className="text-sm text-gray-500 mt-2">
              We've sent a 6-digit code to your email
            </p>
          </div>
        )}

        <button
          type="submit"
          id="login-btn"
          className="w-full bg-[#3B82F6] hover:bg-secondary text-white font-medium py-3 px-6 rounded-lg transition duration-200 transform hover:scale-105"
        >
          {isOtp ? "Verify OTP" : "Send OTP"}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-500">
          Secure database connection setup
        </p>
      </div>
      {/* </div> */}
    </div>
  );
};

export default AuthVerification;
