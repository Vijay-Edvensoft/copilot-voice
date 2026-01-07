import { useState } from "react";
import AuthVerification, { type FormType } from "./AuthVerification";
import UserDetailsForm from "./UserDetailsForm";

const OnboardingFlow = () => {
  const [steps, setSteps] = useState<number>(1);

  const [formData, setFormData] = useState<FormType>({
    username: "",
    email: "",
    password: "user@123",
  });

  const handleChange = (name: string, value: string | number): void => {
    setFormData((prev) => ({
      ...prev,
      [name]: typeof value === "string" ? value.trim() : value,
    }));
  };

  return (
    <div className="w-[24vw]">
      {steps === 1 && (
        <AuthVerification
          onNext={() => setSteps((prev) => prev + 1)}
          formData={formData}
          onChange={handleChange}
          setFormData={setFormData}
        />
      )}
      {steps === 2 && (
        <UserDetailsForm
          formData={formData}
          onChange={handleChange}
          setFormData={setFormData}
        />
      )}
    </div>
  );
};

export default OnboardingFlow;
