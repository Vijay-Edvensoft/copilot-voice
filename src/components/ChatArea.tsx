import type { Message } from "@/pages/Chat/ChatBot";
import { type Dispatch, type SetStateAction } from "react";
export type ChatProps = {
  messages: Message[];
  setMessages: Dispatch<SetStateAction<Message[]>>;
};

const ChatArea = (props: ChatProps) => {
  const { messages } = props;

  return (
    <div
      id="chat-messages"
      className="flex-1 p-6 overflow-y-auto bg-gradient-to-b from-base-200 to-gray-900 overflow-y"
    >
      {/* <!-- Welcome Message --> */}
      <div className="max-w-4xl mx-auto">
        {messages.length === 0 && (
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-[#3B82F6]/20 rounded-full mb-4">
              <i className="fa-solid fa-robot text-[#3B82F6] text-2xl"></i>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Welcome to DataBot Chat
            </h2>
            <p className="text-gray-400">
              Ask me anything about your database. I can help you analyze data,
              generate reports, and write SQL queries.
            </p>
          </div>
        )}

        {/* <!-- Chat Messages Container --> */}
        {messages.map((message, idx) =>
          message.sender === "user" ? (
            <div id="messages-container" className="space-y-6" key={idx}>
              <div className="flex justify-end">
                <div className="max-w-3xl">
                  <div className="bg-[#3B82F6] text-white p-4 rounded-lg rounded-br-none">
                    <p className="whitespace-pre-wrap">{message.text}</p>
                  </div>
                  <div className="flex justify-end mt-1">
                    <span className="text-xs text-gray-500">
                      {new Date().toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex justify-start">
              <div className="max-w-3xl">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-[#3B82F6]/20 rounded-full flex items-center justify-center">
                    <i className="fa-solid fa-robot text-[#3B82F6] text-sm"></i>
                  </div>
                  <div className="bg-[#1F2937] border border-[#374151] text-gray-200 p-4 rounded-lg rounded-bl-none">
                    <p className="whitespace-pre-wrap">
                      {message.text.replace(
                        /sql\n([\s\S]*?)\n/g,
                        '<pre className="bg-gray-800 text-green-400 p-3 rounded mt-2 mb-2 overflow-x-auto"><code>$1</code></pre>'
                      )}
                    </p>
                  </div>
                </div>
                <div className="flex justify-start mt-1 ml-11">
                  <span className="text-xs text-gray-500">
                    {new Date().toLocaleTimeString()}
                  </span>
                </div>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default ChatArea;
