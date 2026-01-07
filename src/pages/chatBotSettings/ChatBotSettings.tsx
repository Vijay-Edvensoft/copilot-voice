import AccuracyPrecision from "@/components/chatBotSettings/AccuracyPrecision";
import ContextAwareness from "@/components/chatBotSettings/ContextAwareness";
import ModelUnderstanding from "@/components/chatBotSettings/ModelUnderstanding";
import {
  getSettings,
  resetSettingsMessage,
  resetSettingsStatus,
  resetUpdates,
  settingsState,
  setUpdateSettings,
  updateSettings,
} from "@/redux/slice/chatBotSettingsSlice";
import { type AppDispatch } from "@/redux/store/store";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const ChatBotSettings = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const {
    settings,
    status: settingsStatus,
    message: settingsMessage,
    updatedSettings,
  } = useSelector(settingsState);
  // const [isCustom, setIsCustom] = useState<boolean>(false);
  // const initialState = {
  //   context_time_window: "last_month",
  //   enable_genbi: true,
  //   enable_auto_synonyms: false,
  //   out_of_context_behavior: "refuse_ambiguous",
  //   enable_auto_join: true,
  //   knowledge_refresh_interval: "daily",
  //   response_tone: "technical",
  // };

  // const [settingsForm, setSettingsForm] = useState<SettingsInitialState | null>(
  //   null
  // );
  console.log(settings);
  // console.log(settingsForm);
  const handleChange = (e: any) => {
    if (e.target.type === "checkbox") {
      dispatch(
        setUpdateSettings({
          [e.target.name]: e.target.checked ? true : false,
        })
      );
    } else {
      dispatch(
        setUpdateSettings({
          [e.target.name]: e.target.value,
        })
      );
      // console.log(updatedSettings);
    }
  };

  useEffect(() => {
    if (!settings) {
      dispatch(getSettings());
    }
  }, [dispatch, settings]);

  useEffect(() => {
    if (settingsStatus === "success" && settingsMessage) {
      toast.success(settingsMessage);
    }
    if (settingsStatus === "failed" && settingsMessage) {
      toast.error(settingsMessage);
    }
    return () => {
      dispatch(resetSettingsStatus());
      dispatch(resetSettingsMessage());
    };
  }, [settingsStatus, settingsMessage]);

  return (
    <div>
      {/* header and nav section */}
      <nav
        id="settings-nav"
        className="bg-gray-800 border-b border-gray-700 px-6 py-4 text-sm"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img
              className="w-15 h-10 object-cover"
              src="/Data_copilot.png"
              alt="DataBot Logo"
            />
            <h1 className="text-xl font-bold text-white">Chatbot Settings</h1>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => {
                dispatch(resetUpdates());
              }}
              className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition duration-200 flex items-center space-x-2 cursor-pointer "
            >
              <i className="fa-solid fa-rotate-left text-white"></i>

              <span>Reset to Defaults</span>
            </button>
            <button
              disabled={
                settingsStatus === "loading" ||
                Object.keys(updatedSettings).length === 0
              }
              onClick={() => {
                if (
                  updatedSettings.context_time_window === "custom" &&
                  !updatedSettings.context_custom_days
                ) {
                  toast.error("Enter Number of days");
                  return;
                } else {
                  dispatch(updateSettings(updatedSettings));
                  dispatch(resetUpdates());
                }
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition duration-200 flex items-center space-x-2 cursor-pointer disabled:cursor-not-allowed disabled:bg-blue-500"
            >
              {" "}
              {settingsStatus === "loading" ? (
                <span key="loading">
                  {" "}
                  <i className="text-gray-600 text-md  mb-4" data-fa-i2svg="">
                    <svg
                      className="svg-inline--fa fa-spinner fa-spin"
                      aria-hidden="true"
                      focusable="false"
                      data-prefix="fas"
                      data-icon="spinner"
                      role="img"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 512 512"
                      data-fa-i2svg=""
                    >
                      <path
                        fill="currentColor"
                        d="M304 48a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zm0 416a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zM48 304a48 48 0 1 0 0-96 48 48 0 1 0 0 96zm464-48a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zM142.9 437A48 48 0 1 0 75 369.1 48 48 0 1 0 142.9 437zm0-294.2A48 48 0 1 0 75 75a48 48 0 1 0 67.9 67.9zM369.1 437A48 48 0 1 0 437 369.1 48 48 0 1 0 369.1 437z"
                      ></path>
                    </svg>
                  </i>
                </span>
              ) : (
                <span key="idle">
                  <i className="fa-solid fa-check text-white"></i>
                </span>
              )}
              <span>Save Changes</span>
            </button>
            <button
              onClick={() => {
                navigate("/chat");
              }}
              className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition duration-200 flex items-center space-x-2 cursor-pointer"
            >
              <i className="fa-solid fa-arrow-left text-white"></i>
              <span>Back to Chat</span>
            </button>
          </div>
        </div>
      </nav>

      {/* main content */}
      <main className="py-6 flex flex-col max-w-5xl mx-auto">
        <div className="">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white mb-2">
              Configure Your Chatbot Experience
            </h2>
            <p className="text-gray-400">
              Customize how the chatbot interprets and responds to your queries
            </p>
          </div>
        </div>
        {/* setting */}
        <div className="space-y-6">
          {/* context Awareness & reporting */}
          <ContextAwareness
            handleChange={handleChange}
            // isCustom={isCustom}
            // setIsCustom={setIsCustom}
          />
          {/* Accuracy & precision */}
          <AccuracyPrecision handleChange={handleChange} />
          {/* Model Understanding */}
          <ModelUnderstanding handleChange={handleChange} />{" "}
          <div className="bg-blue-900/30 border border-blue-800 rounded-lg p-6  my-4">
            <div className="flex items-start space-x-3">
              <i className="text-yellow-400 text-xl mt-1" data-fa-i2svg="">
                <svg
                  className="svg-inline--fa fa-lightbulb"
                  aria-hidden="true"
                  focusable="false"
                  data-prefix="fas"
                  data-icon="lightbulb"
                  role="img"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 384 512"
                  data-fa-i2svg=""
                >
                  <path
                    fill="currentColor"
                    d="M272 384c9.6-31.9 29.5-59.1 49.2-86.2l0 0c5.2-7.1 10.4-14.2 15.4-21.4c19.8-28.5 31.4-63 31.4-100.3C368 78.8 289.2 0 192 0S16 78.8 16 176c0 37.3 11.6 71.9 31.4 100.3c5 7.2 10.2 14.3 15.4 21.4l0 0c19.8 27.1 39.7 54.4 49.2 86.2H272zM192 512c44.2 0 80-35.8 80-80V416H112v16c0 44.2 35.8 80 80 80zM112 176c0 8.8-7.2 16-16 16s-16-7.2-16-16c0-61.9 50.1-112 112-112c8.8 0 16 7.2 16 16s-7.2 16-16 16c-44.2 0-80 35.8-80 80z"
                  ></path>
                </svg>
              </i>
              <div>
                <p className="text-blue-200 font-medium mb-2">
                  Pro Tip: Optimize Your Settings
                </p>
                <p className="text-blue-300 text-sm">
                  For best results with frequently changing data, use "Daily"
                  refresh with "Ask for Clarification" mode. Enable Auto-Join
                  Intelligence for complex multi-table queries. Choose
                  "Business" tone for executive dashboards and "Technical" for
                  data analysis teams.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ChatBotSettings;
