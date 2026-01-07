import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "@/redux/store/store";
import { authState } from "@/redux/slice/authSlice";

import {
  chatState,
  generateResponse,
  retryQuestion,
  setActiveChat,
} from "@/redux/slice/chatSlice";
import { useEffect, useRef, type Dispatch, type SetStateAction } from "react";
import ChatMessages from "./ChatMessages";

import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { toast } from "react-toastify";

type Props = {
  activeTab: string;
  setActiveTab: Dispatch<SetStateAction<string>>;
  chartData: any;
  setChartData: Dispatch<SetStateAction<any>>;
  query: string;
  setQuery: Dispatch<SetStateAction<string>>;
  isDisplayOpen: boolean;
  setIsDisplayOpen: Dispatch<SetStateAction<boolean>>;
};

const ChatInput = (props: Props) => {
  const {
    chartData,
    setChartData,
    activeTab,
    setActiveTab,
    query,
    setQuery,
    isDisplayOpen,
    setIsDisplayOpen,
  } = props;

  // const location = useLocation();
  // const dbConnectionId = Number(localStorage.getItem("dbConnectionId"));
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector(authState);
  const { status, activeChat } = useSelector(chatState);
  const {
    transcript,
    resetTranscript,
    listening,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();
  // const [query, setQuery] = useState<string>(editChat ? editChat.query : "");
  // const { isRecording, startRecording, stopRecording, transcript } =
  //   useRecorder();

  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  // const visualizerRef = useRef<HTMLCanvasElement>(null);

  // const { setMessages } = props;
  // const textAreaRef = useRef<HTMLTextAreaElement>(null);
  // console.log("chat input", activeDbConnection);
  function handleQuery(e: any): void {
    e.preventDefault();

    if (listening) {
      SpeechRecognition.stopListening();
    }
    const prompt = {
      user_id: Number(user.user_id),
      // db_connection_id: dbConnectionId,
      query: query.trim(),
    };
    console.log(prompt);
    setIsDisplayOpen(true);
    // dispatch(setActiveChat(null));
    setActiveTab("answer");
    dispatch(generateResponse(prompt));
  }
  const handleEdit = () => {
    setIsDisplayOpen(false);
    setQuery(String(activeChat?.query));
  };

  const handleRetry = () => {
    dispatch(retryQuestion(activeChat?.query_id));
  };

  // const handleClear = () => {
  //   setQuery("");
  //   dispatch(resetGeneratedMessage());
  //   setEditChat(null);
  // };
  // const handleRecording = () => {
  //   console.log("🎤 Click triggered");
  //   if (!browserSupportsSpeechRecognition) {
  //     console.error("❌ Browser does not support SpeechRecognition");
  //     toast.error("Your browser does not support speech recognition.");
  //     return;
  //   }

  //   if (listening) {
  //     SpeechRecognition.stopListening();
  //     // setIsRecording(true);
  //   } else if (!listening) {
  //     if (transcript) {
  //       resetTranscript();
  //     }
  //     resetTranscript();
  //     SpeechRecognition.startListening({
  //       continuous: true,
  //       language: navigator.language,
  //     });
  //     // setIsRecording(false);
  //   }
  // };

  const handleRecording = async () => {
    console.log("🎤 Click triggered");

    // Browser support check
    if (!browserSupportsSpeechRecognition) {
      console.error("❌ Browser does not support SpeechRecognition");
      toast.error("Your browser does not support speech recognition");
      return;
    }

    // Permission check (CRITICAL)
    try {
      const permission = await navigator.permissions.query({
        name: "microphone" as PermissionName,
      });
      console.log("🎙️ Mic permission:", permission.state);
    } catch (err) {
      console.warn("⚠️ Permissions API not supported", err);
    }

    console.log("Listening before click:", listening);

    if (listening) {
      console.log(listening);
      SpeechRecognition.stopListening();
      console.log("🛑 Stopping listening");
    } else {
      console.log("▶️ Starting listening");

      resetTranscript();

      try {
        SpeechRecognition.startListening({
          continuous: true,
          language: navigator.language || "en-US",
        });
      } catch (err) {
        console.error("❌ startListening failed:", err);
        toast.error("Failed to start speech recognition");
      }
    }
  };

  const reSizeTextArea = () => {
    const textArea = textAreaRef.current;

    if (textArea) {
      textArea.style.height = "auto";

      textArea.style.height = `${Math.min(textArea.scrollHeight, 120)}px`;
    }
    return;
  };

  useEffect(() => {
    reSizeTextArea();
  }, [query]);

  useEffect(() => {
    if (activeChat?.query) {
      setQuery(activeChat.query);
    }
  }, [activeChat]);

  useEffect(() => {
    if (transcript) {
      setQuery(transcript);
    }
  }, [transcript, setQuery]);

  useEffect(() => {
    return () => {
      dispatch(setActiveChat(null));
    };
  }, []);
  return (
    <div
      id="chat-input-area"
      className="bg-[#1F2937] border-t border-[#374151]  w-full "
    >
      {/* <div className=" mx-auto  w-full flex flex-col justify-between"> */}
      <div className="bg-gray-800 border-b border-gray-700 p-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-lg font-semibold text-white mb-4">
            Ask Your Question
          </h2>

          {/* {recordedUrl && <audio controls src={recordedUrl} />} */}

          {/* <!-- Question Display (after submission) --> */}
          {isDisplayOpen && (
            <div
              id="question-display"
              className=" mb-4 bg-gray-900 border border-gray-700 rounded-lg p-4"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <i className="fa-solid fa-user text-primary"></i>
                    <span className="text-sm text-gray-400">Your Question</span>
                  </div>
                  <p id="submitted-question" className="text-white text-lg">
                    {query}
                  </p>
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={() => {
                      handleEdit();
                    }}
                    className="text-gray-400 hover:text-white cursor-pointer p-2 rounded-lg hover:bg-gray-700 transition duration-200"
                  >
                    <i className="fa-solid fa-pen-to-square"></i>
                  </button>
                  <button
                    onClick={() => {
                      handleRetry();
                    }}
                    className="text-gray-400 hover:text-white p-2 cursor-pointer rounded-lg hover:bg-gray-700 transition duration-200"
                  >
                    <i className="fa-solid fa-arrow-rotate-right"></i>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* <!-- Question Input --> */}
          {!isDisplayOpen && (
            <div id="question-input-area">
              <div className="flex items-end space-x-2">
                <div className="flex-1 relative">
                  <textarea
                    id="chat-input"
                    ref={textAreaRef}
                    value={query}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && e.shiftKey) {
                        // e.preventDefault();
                        reSizeTextArea();
                      } else if (e.key === "Enter") {
                        e.preventDefault();
                        if (!query.trim()) {
                          return;
                        }

                        handleQuery(e);
                      }
                    }}
                    // rows={2}
                    placeholder="Ask me anything about your database..."
                    className="w-full px-4 py-3 bg-gray-700 border scrollbar-width border-gray-600 text-white scrollbar-width rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none pr-24"
                    onChange={(e) => setQuery(e.target.value)}
                  ></textarea>

                  <div className="flex gap-2 items-center justify-center absolute right-2 bottom-3">
                    <button
                      onClick={() => {
                        console.log("inside voice recognition");
                        handleRecording();
                      }}
                      className=" text-gray-400 text-xl hover:text-white cursor-pointer p-2 rounded-lg hover:bg-gray-600 transition duration-200"
                    >
                      {!listening ? (
                        <span key="start">
                          <i className="fa-solid fa-microphone"></i>
                        </span>
                      ) : (
                        <span key="stop">
                          <i className="fa-solid fa-square"></i>
                        </span>
                      )}
                    </button>
                    <button
                      id="send-btn"
                      // type="submit"
                      onClick={handleQuery}
                      className=" bg-blue-600 cursor-pointer hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={query.trim() === "" || status === "loading"}
                    >
                      <i className="fa-solid fa-paper-plane"></i>
                    </button>
                  </div>
                </div>
              </div>
              <div className="text-xs text-gray-500 mt-2">
                Press Enter to send, Shift+Enter for new line
              </div>
            </div>
          )}
        </div>
      </div>

      <div
        id="response-section"
        className="flex-1 overflow-y-auto scrollbar-width p-6 bg-gray-900 h-[70vh] "
        // style={{ scrollbarWidth: "thin" }}
      >
        <div className="max-w-5xl mx-auto">
          {!isDisplayOpen && !activeChat && (
            <div id="welcome-message" className="text-center py-12 ">
              <p className="text-gray-400 text-lg">
                Ask me anything about your datasource. I can help you analyze
                data and visualize results.
              </p>
            </div>
          )}

          {/* <!-- Response Container --> */}
          {(isDisplayOpen || activeChat) && (
            <div id="response-container" className="">
              <div className="bg-gray-800 border border-gray-700  rounded-lg ">
                <ChatMessages
                  chartData={chartData}
                  setChartData={setChartData}
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
