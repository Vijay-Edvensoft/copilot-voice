import { useEffect, useState, type FormEvent } from "react";
import type { InputType, Props } from "./AuthVerification";
import Input from "@/components/Input";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "@/redux/store/store";
import { authState, registerUser } from "@/redux/slice/authSlice";
import { toast } from "react-toastify";
// import Select from "@/components/Select";

const UserDetailsForm = (props: Props) => {
  const { onChange, formData } = props;

  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { status, user, message } = useSelector(authState);

  // const [profileConfig, setProfileConfig] = useState(false);
  const [orgName, setOrgName] = useState<string>("");

  const handleChange = (name: string, value: string): void => {
    console.log(name);
    setOrgName(value);
  };

  const userDetailsInput: InputType[] = [
    {
      name: "username",
      label: "Full Name",
      type: "text",
      placeholder: "Enter your Full Name",
      required: true,
      description: "",
      onChange: onChange,
      icon: "fa-solid fa-user absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400",
    },
    {
      name: "organizationName",
      label: "Organization Name",
      type: "text",
      placeholder: "Enter your Company Name",
      required: true,
      description: "",
      onChange: handleChange,
      icon: "fa-solid fa-building absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400",
    },
  ];

  function handleSubmit(e: FormEvent<HTMLFormElement>): void {
    e.preventDefault();
    dispatch(registerUser(formData)).unwrap();
  }

  useEffect(() => {
    if (status === "success") {
      localStorage.setItem("user", JSON.stringify(user));

      toast.success(message);
      navigate("/onboarding/datasource");
    }
    if (status === "failed") {
      toast.error(message);
    }
  }, [status, user, navigate, message, orgName]);

  return (
    <div>
      {" "}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          Complete Your Profile
        </h1>
        <p className="text-gray-400">Please provide your details to continue</p>
      </div>
      <form id="user-form" className="space-y-6" onSubmit={handleSubmit}>
        {userDetailsInput.map((input, idx) => {
          return <Input {...input} key={idx} />;
        })}

        <button
          type="submit"
          className="w-full bg-[#3B82F6]  hover:bg-secondary text-white font-medium py-3 px-6 rounded-lg transition duration-200 transform hover:scale-105"
        >
          Continue to Database Setup
        </button>
      </form>
    </div>
  );
};

export default UserDetailsForm;
