import { resetAuthState } from "@/redux/slice/authSlice";
import { resetChatState } from "@/redux/slice/chatSlice";
import { resetDbState } from "@/redux/slice/dbSlice";

import type { AppDispatch } from "@/redux/store/store";
import { useState, type MouseEventHandler } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const UserMenu = ({ isSideMenuOpen }: { isSideMenuOpen: boolean }) => {
  const user = localStorage.getItem("user");
  const { username, email } = user && JSON.parse(user);
  const dispatch = useDispatch<AppDispatch>();

  const [isOpen, setIsopen] = useState<boolean>(false);
  const navigate = useNavigate();
  function toggleUserMenu(): MouseEventHandler<HTMLButtonElement> | void {
    setIsopen((prev) => !prev);
  }
  function logout(): MouseEventHandler<HTMLSpanElement> | void {
    localStorage.clear();
    dispatch(resetAuthState());
    dispatch(resetDbState());
    dispatch(resetChatState());

    navigate("/onboarding");
  }
  return (
    // <>
    <>
      <div className="relative ">
        {" "}
        <button
          id="user-menu-btn"
          className="flex items-center space-x-3 bg-gray-700 hover:bg-gray-600  rounded-lg transition-all duration-300 ease-in-out"
          onClick={toggleUserMenu}
        >
          {!isSideMenuOpen ? (
            <span key="notOpen">
              {" "}
              <i className="fa-solid fa-circle-user text-3xl"></i>
            </span>
          ) : (
            <div
              key="open"
              className="flex items-center space-x-3 w-70 bg-gray-700 hover:bg-gray-600 px-3 py-3 rounded-lg transition duration-200"
            >
              {" "}
              <i className="fa-solid fa-circle-user text-3xl"></i>
              <div className="flex-1 text-left">
                <p className="text-white text-sm font-medium">{username}</p>
                <p className="text-gray-400 text-xs">{email}</p>
              </div>
              <i className="fa-solid fa-ellipsis-h text-gray-400"></i>
            </div>
          )}
        </button>
        <div
          id="user-dropdown"
          className={`${!isOpen && "hidden"} ${
            !isSideMenuOpen && "w-[200px]"
          } absolute bottom-full left-0 right-0 mb-2 z-10  bg-base-100 rounded-lg shadow-xl border border-border-color`}
        >
          <div className="p-4 border-b border-border-color">
            <p className="text-white font-medium">{username}</p>
            <p className="text-gray-400 text-sm">{email}</p>
          </div>
          <div className="py-2">
            <span className="flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white transition duration-200 cursor-pointer">
              <i className="fa-solid fa-user mr-3"></i>
              User Profile
            </span>
            <span
              className="flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white transition duration-200 cursor-pointer"
              onClick={() => navigate("/settings")}
            >
              <i className="fa-solid fa-cog mr-3"></i>
              Settings
            </span>
            <hr className="my-2 border-border-color" />
            <span
              className="flex items-center px-4 py-2 text-red-400 hover:bg-red-900/20 hover:text-red-300 transition duration-200 cursor-pointer"
              onClick={logout}
            >
              <i className="fa-solid fa-sign-out-alt mr-3"></i>
              Log Out
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserMenu;
