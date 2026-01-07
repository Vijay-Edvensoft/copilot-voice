import ChatHeader from "@/components/ChatHeader";
import ChatInput from "@/components/ChatInput";
// import ChatMessages from "@/components/ChatMessages";
import SideBar from "@/components/SideBar";
import { authState } from "@/redux/slice/authSlice";
import { chatState, resetChatStatus } from "@/redux/slice/chatSlice";
import { resetMessage } from "@/redux/slice/dashboardSlice";
import { getDbConnections } from "@/redux/slice/dbSlice";
import { type AppDispatch } from "@/redux/store/store";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
// import { dbConfigState, resetDbStatus } from "@/redux/slice/dbSlice";
// import { useEffect } from "react";

export type Message = {
  sender: "user" | "assistant";
  text: string;
};

const ChatBot = () => {
  const dispatch = useDispatch<AppDispatch>();
  // const location = useLocation();
  // const tableName = location.state;
  // console.log(tableName);
  const { activeChat } = useSelector(chatState);
  const { user } = useSelector(authState);
  const navigate = useNavigate();
  // useEffect(() => {
  //   return () => {
  //     console.log("return chatbot", status);
  //     dispatch(resetDbStatus());
  //   };
  // }, []);
  const localActiveDbConnection = localStorage?.getItem("dbConnectionId");

  const [activeDbConnection, setActiveDbConnection] = useState<string | null>(
    localActiveDbConnection || null
  );
  const [chartData, setChartData] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState("answer");
  const [query, setQuery] = useState<string>(
    activeChat ? activeChat?.query : ""
  );
  const [isDiplayOpen, setIsDisplayOpen] = useState<boolean>(false);

  useEffect(() => {
    navigate("/chat");
    dispatch(getDbConnections(Number(user.user_id)));
    return () => {
      dispatch(resetChatStatus());
      dispatch(resetMessage());
    };
  }, []);

  // useEffect(() => {
  //   if (!dbConnections || dbConnections.length === 0) return;
  //   localStorage.setItem(
  //     "dbConnectionId",
  //     String(dbConnections[0]?.db_connection_id)
  //   );

  //   return () => {
  //     localStorage.removeItem("dbConnectionId");
  //     setActiveDbConnection("");
  //   };
  // }, []);

  return (
    <div
      id="converse-page"
      className=" min-h-screen bg-base-100 flex w-full text-sm"
    >
      <SideBar
        setChartData={setChartData}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        setQuery={setQuery}
        setIsDisplayOpen={setIsDisplayOpen}
      />
      <div id="chat-main" className=" flex flex-col flex-1 w-[90vw] max-h-auto">
        <ChatHeader
          activeDbConnection={activeDbConnection}
          setActiveDbConnection={setActiveDbConnection}
        />{" "}
        <div className="h-[calc(100vh-80px)] overflow-y-auto scrollbar-width flex flex-1 mx-0">
          {" "}
          <ChatInput
            chartData={chartData}
            setChartData={setChartData}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            query={query}
            setQuery={setQuery}
            isDisplayOpen={isDiplayOpen}
            setIsDisplayOpen={setIsDisplayOpen}
          />
        </div>
        {/* {chatStatus === "failed" && (
          <div className="flex flex-1 justify-center items-center">
            <h2 className="text-red-500">{message}</h2>
          </div>
        )} */}
      </div>
    </div>
  );
};

export default ChatBot;
