import {
  useEffect,
  useState,
  useMemo,
  type Dispatch,
  type SetStateAction,
} from "react";
import SideBarItem from "./SideBarItem";
import UserMenu from "./UserMenu";
import { useDispatch, useSelector } from "react-redux";
import {
  chatState,
  getChatHistory,
  setActiveChat,
} from "@/redux/slice/chatSlice";
import type { AppDispatch } from "@/redux/store/store";
import { authState } from "@/redux/slice/authSlice";
import DashboardMenu from "./Dashboard/DashboardMenu";
import { useNavigate } from "react-router-dom";
import Loader from "./Loader";

// import { useLocation } from "react-router-dom";

type Props = {
  setChartData: Dispatch<SetStateAction<any | null>>;
  activeTab: string;
  setActiveTab: Dispatch<SetStateAction<string>>;
  setQuery: Dispatch<SetStateAction<string>>;
  setIsDisplayOpen?: Dispatch<SetStateAction<boolean>>;
  routeName?: string | null;
};

const SideBar = (props: Props) => {
  const { setActiveTab, setChartData, setQuery, setIsDisplayOpen, routeName } =
    props;
  // const { routeName } = props;
  const { activeChat } = useSelector(chatState);
  const [isOpen, setIsopen] = useState<boolean>(true);
  const { user } = useSelector(authState);
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const {
    chats,
    message: chatMessage,
    status: chatStatus,
  } = useSelector(chatState);
  console.log(activeChat);
  // console.log(message);
  // const handleDelete = () => {
  //   dispatch(deleteChat(selectedChats));
  // };

  function toggleSidebar(): void {
    setIsopen((prev) => !prev);
  }
  // console.log(message);
  useEffect(() => {
    const getChats = async () => {
      await dispatch(getChatHistory(Number(user?.user_id))).unwrap();
    };

    if (!routeName) getChats();
  }, []);

  const startNewChat = () => {
    setQuery("");

    dispatch(setActiveChat(null));
    setIsDisplayOpen?.(false);
  };

  const topButton = useMemo(
    () =>
      routeName == "dashboard" ? (
        <button
          onClick={() => {
            navigate("/chat");
          }}
          className="w-full bg-gray-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition duration-200 text-center flex items-center justify-center space-x-2 cursor-pointer"
        >
          <i data-fa-i2svg="">
            {/* <img src="../twinChat.svg" alt="chat icon" /> */}
            <svg
              className="svg-inline--fa fa-comments"
              aria-hidden="true"
              focusable="false"
              data-prefix="fas"
              data-icon="comments"
              role="img"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 640 512"
              data-fa-i2svg=""
            >
              <path
                fill="currentColor"
                d="M208 352c114.9 0 208-78.8 208-176S322.9 0 208 0S0 78.8 0 176c0 38.6 14.7 74.3 39.6 103.4c-3.5 9.4-8.7 17.7-14.2 24.7c-4.8 6.2-9.7 11-13.3 14.3c-1.8 1.6-3.3 2.9-4.3 3.7c-.5 .4-.9 .7-1.1 .8l-.2 .2 0 0 0 0C1 327.2-1.4 334.4 .8 340.9S9.1 352 16 352c21.8 0 43.8-5.6 62.1-12.5c9.2-3.5 17.8-7.4 25.3-11.4C134.1 343.3 169.8 352 208 352zM448 176c0 112.3-99.1 196.9-216.5 207C255.8 457.4 336.4 512 432 512c38.2 0 73.9-8.7 104.7-23.9c7.5 4 16 7.9 25.2 11.4c18.3 6.9 40.3 12.5 62.1 12.5c6.9 0 13.1-4.5 15.2-11.1c2.1-6.6-.2-13.8-5.8-17.9l0 0 0 0-.2-.2c-.2-.2-.6-.4-1.1-.8c-1-.8-2.5-2-4.3-3.7c-3.6-3.3-8.5-8.1-13.3-14.3c-5.5-7-10.7-15.4-14.2-24.7c24.9-29 39.6-64.7 39.6-103.4c0-92.8-84.9-168.9-192.6-175.5c.4 5.1 .6 10.3 .6 15.5z"
              ></path>
            </svg>
          </i>

          {isOpen && <span> Go to Chat</span>}
        </button>
      ) : (
        <button
          onClick={startNewChat}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition duration-200 text-center flex items-center justify-center space-x-2 cursor-pointer"
        >
          <i className="fa-solid fa-plus"></i>

          {isOpen && <span>New Chat</span>}
        </button>
      ),
    [routeName, isOpen]
  );

  return (
    <div
      id="chat-sidebar"
      className={`${
        isOpen ? "w-80" : "w-16"
      } bg-base-100 border-r relative border-border-color flex flex-col justify-start duration-300 min-h-screen max-h-screen
    `}
    >
      <div className="p-4 border-b border-border-color">
        <div className="flex items-center justify-between mb-4">
          {isOpen && (
            <div className="flex items-center space-x-3">
              <img
                className="w-15 h-10 object-cover"
                src="/Data_copilot.png"
                alt="DataBot Logo"
              />
              <h2 className="text-lg font-bold text-white">Data Copilot</h2>
            </div>
          )}
          <button
            id="sidebar-toggle"
            onClick={toggleSidebar}
            className="bg-primary hover:bg-secondary text-white p-2 rounded-lg transition duration-200"
          >
            <i className="fa-solid fa-bars"></i>
          </button>
        </div>{" "}
        {/* <button
          onClick={startNewChat}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition duration-200 text-center flex items-center justify-center space-x-2 cursor-pointer"
        >
          <i className="fa-solid fa-plus"></i>

          {isOpen && <span>{routeName!=="dashboard"?"New Chat": "Go to Chat"}</span>}
        </button> */}
        {topButton}
      </div>

      {!routeName ? (
        <div
          id="chat-history"
          className={`flex flex-col  p-4 space-y-2  overflow-y-auto  ${
            !isOpen && "hidden"
          }`}
          style={{ scrollbarWidth: "thin" }}
        >
          <h3 className="text-sm font-semibold text-gray-400 uppercase mb-3">
            Chat History
          </h3>
          {chats?.length > 0 ? (
            chats?.map((chat, idx) => (
              <SideBarItem
                chat={chat}
                key={idx}
                setActiveTab={setActiveTab}
                setChartData={setChartData}
                setIsDisplayOpen={setIsDisplayOpen}
                setQuery={setQuery}
              />
            ))
          ) : (
            <div className="p-4 ">
              {chatStatus === "loading" ? (
                <Loader />
              ) : (
                <p
                  className={`flex justify-center items-center min-h-[60vh] max-h-screen overflow-auto text-white text-center ${
                    !isOpen ? "hidden" : ""
                  }`}
                >
                  {chatStatus === "failed" ? (
                    <span className="text-red-500">{chatMessage}</span>
                  ) : (
                    "Start your Conversation"
                  )}
                </p>
              )}
            </div>
          )}
        </div>
      ) : (
        <DashboardMenu isOpen={isOpen} />
      )}

      <div className="p-4 border-t mt-auto border-border-color">
        <UserMenu isSideMenuOpen={isOpen} />
      </div>
    </div>
  );
};

export default SideBar;
