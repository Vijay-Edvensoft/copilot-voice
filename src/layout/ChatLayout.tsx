import { Outlet } from "react-router-dom";

const ChatLayout = () => {
  return (
    <div className=" min-h-screen max-h-screen overflow-hidden bg-base-200 flex ">
      <Outlet />
    </div>
  );
};

export default ChatLayout;
