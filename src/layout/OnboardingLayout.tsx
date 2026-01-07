import { Outlet } from "react-router-dom";

const OnboardingLayout = () => {
  return (
    <div className="flex items-center justify-center min-h-screen ">
      {" "}
      <fieldset className=" fieldset bg-base-100  rounded-2xl shadow-xl  max-w-3xl px-5 pb-5 pt-0 my-5 border border-border-color ">
        <img
          className="mx-auto w-25 h-25 mb-0 p-0 object-contain "
          src="/Data_copilot.png"
          alt="modern logo design combining robot/bot icon with database symbol, sleek tech style, blue and white colors, minimalist, professional"
        />
        <Outlet />
      </fieldset>
    </div>
  );
};

export default OnboardingLayout;
