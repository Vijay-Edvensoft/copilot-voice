import Header from "@/components/Header";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <div className="min-h-screen max-h-screen flex flex-col ">
      <Header />
      <div className="flex  justify-center   bg-base-100 overflow-auto scrollbar-width">
        {" "}
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;
