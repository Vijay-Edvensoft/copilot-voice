import { resetAuthState } from "@/redux/slice/authSlice";
import { resetChatState } from "@/redux/slice/chatSlice";
import { resetDbState } from "@/redux/slice/dbSlice";

import { type AppDispatch } from "@/redux/store/store";
import { useState, type MouseEventHandler } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const [isOpen, setIsopen] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  const userString = localStorage.getItem("user");
  const { username: userName, email: userEmail } =
    userString && JSON.parse(userString);

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
    <nav
      id="nav-bar"
      className="bg-[#1F2937] border-b border-border-color px-16 py-4"
    >
      <div className="flex items-center justify-between">
        <div
          className="flex items-center space-x-3  cursor-pointer"
          onClick={() => navigate("/database-tables")}
        >
          <img
            className="w-40 object-contain p-0"
            src="/Data_copilot_transparent.png"
            alt="modern logo design combining robot/bot icon with database symbol, sleek tech style, blue and white colors, minimalist, professional"
          />
          {/* <h1 className="text-xl font-bold text-white">Data Copilot</h1> */}
        </div>
        {/* <UserMenu /> */}
        <div className="relative">
          <button
            id="user-menu-btn"
            onClick={toggleUserMenu}
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                e.preventDefault();
                toggleUserMenu();
              }
            }}
            className="flex items-center space-x-3 bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg transition duration-200"
          >
            <i className="fa-solid fa-circle-user text-2xl"></i>
            <span id="user-name" className="text-white font-medium">
              {userName}
            </span>
            <svg
              className={`w-5 h-5 transition-transform duration-600 ${
                isOpen ? "rotate-180 text-blue-400" : "text-gray-400"
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              ></path>
            </svg>
          </button>

          <div
            id="user-dropdown"
            className={`${
              !isOpen && "hidden"
            } absolute right-0 mt-2 w-56 bg-[#1F2937] rounded-lg shadow-xl border border-border-color z-50`}
          >
            <div className="p-4 border-b border-border-color">
              <p className="text-white font-medium">{userName || "John"}</p>
              <p className="text-gray-400 text-sm">{userEmail}</p>
            </div>
            <div className="py-2">
              <span className="flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white transition duration-200 cursor-pointer">
                <i className="fa-solid fa-user mr-3"></i>
                User Profile
              </span>
              <span
                className="flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white transition duration-200 cursor-pointer"
                onClick={() => {
                  navigate("/settings");
                  toggleUserMenu();
                }}
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
      </div>
    </nav>
  );
};

export default Header;
