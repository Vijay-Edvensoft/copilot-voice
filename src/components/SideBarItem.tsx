import {
  chatState,
  deleteChat,
  resetChatMessage,
  resetChatStatus,
  setActiveChat,
  type ChatMessage,
} from "@/redux/slice/chatSlice";
import type { AppDispatch } from "@/redux/store/store";
import { getDuration } from "@/utils/reusableFunctions";
import {
  useEffect,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import { useDispatch, useSelector } from "react-redux";

interface Props {
  chat: ChatMessage;

  setActiveTab: Dispatch<SetStateAction<string>>;
  setChartData: Dispatch<SetStateAction<any | null>>;
  setIsDisplayOpen?: Dispatch<SetStateAction<boolean>>;
  setQuery: Dispatch<SetStateAction<string>>;
}

const SideBarItem = (prop: Props) => {
  const { chat, setActiveTab, setChartData, setIsDisplayOpen, setQuery } = prop;
  // const navigate = useNavigate();
  const modalRef = useRef<HTMLDialogElement>(null);
  const dispatch = useDispatch<AppDispatch>();
  const { activeChat } = useSelector(chatState);
  const [isDeleting, setIsDeleting] = useState<number[]>([]);
  const handleDelete = (queryId: number[]) => {
    setIsDeleting(queryId);
    modalRef.current?.close();
    setTimeout(() => {
      dispatch(deleteChat(queryId));
      setIsDeleting([]);

      if (queryId.includes(Number(activeChat?.query_id))) {
        dispatch(setActiveChat(null));
        setQuery("");
        setIsDisplayOpen?.(false);
      }
    }, 500);
  };

  const handleActiveChat = (chat: ChatMessage) => {
    // navigate(`/chat?chat_id=${chat.query_id}`);

    dispatch(setActiveChat(chat));
    // dispatch(resetGeneratedMessage());
    setActiveTab("answer");
    setChartData(null);
    setIsDisplayOpen?.(true);
  };

  useEffect(() => {
    return () => {
      dispatch(resetChatStatus());
      dispatch(resetChatMessage());
    };
  }, [activeChat]);

  return (
    <div
      className={`chat-history-item group flex items-center   gap-3  hover:bg-gray-600 p-3 rounded-lg cursor-pointer transition duration-200 ${
        activeChat?.query_id === chat.query_id ? "bg-gray-600" : "bg-gray-700"
      } ${isDeleting?.includes(Number(chat.query_id)) && "slide-out-left"} `}
    >
      <div
        className="flex items-center justify-between min-w-0"
        onClick={() => {
          handleActiveChat(chat);
        }}
      >
        <div className="flex-1 min-w-0">
          <p className="text-white text-sm font-medium truncate mb-2">
            {chat.query}
          </p>
          <p className="text-gray-400 text-xs truncate">
            {getDuration(chat.created_at)} ago
          </p>
        </div>
      </div>{" "}
      <button
        className="text-red-400 hover:text-red-300  ml-auto opacity-0 group-hover:opacity-100 cursor-pointer transition-transform duration-200"
        onClick={() => {
          modalRef.current?.showModal();
          // handleDelete([Number(chat?.query_id)]);
        }}
      >
        <i className="fa-solid fa-trash text-xs"></i>
      </button>
      <dialog
        id="my_modal_5"
        className="modal modal-bottom md:modal-middle"
        ref={modalRef}
      >
        {/* <div className="modal-box">
          <h3 className="py-4 text-center text-lg">
            Are you sure want to delete the Chat
          </h3>
          <div className="modal-action flex justify-center w-[100%] ">
            <form method="dialog">
              <div className="flex gap-5">
                {" "}
                <button
                  className="btn bg-primary border-none hover:bg-primary/80"
                  onClick={() => handleDelete([Number(chat?.query_id)])}
                >
                  Yes
                </button>
                <button className="btn bg-gray-600 border-none hover:bg-gray-700">
                  No
                </button>
              </div>
            </form>
          </div>
        </div> */}

        <div className="bg-gray-800 rounded-xl shadow-2xl w-full max-w-md border border-gray-700">
          <div className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-red-900/30 rounded-full flex items-center justify-center">
                <i className="fa-solid fa-triangle-exclamation text-red-400 text-xl"></i>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Remove Chat</h3>
                <p className="text-gray-400 text-sm">
                  Remove chat from chat history
                </p>
              </div>
            </div>
            <p className="text-gray-300 mb-6">
              Are you sure want to delete the Chat
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => {
                  // setSelectedChart(null);
                  modalRef.current?.close();
                }}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition duration-200 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete([Number(chat?.query_id)])}
                className="flex-1 bg-red-500 hover:bg-red-400 text-white px-4 py-2 rounded-lg transition duration-200 cursor-pointer"
              >
                Delete Chat
              </button>
            </div>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default SideBarItem;
