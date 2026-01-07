const ChatLoader = ({ activeTab }: { activeTab: string }) => {
  return (
    <div
      id="answer-loader"
      className="flex flex-col items-center justify-center py-16 "
    >
      <i className="text-blue-500 text-4xl mb-4" data-fa-i2svg="">
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
      <p className="text-gray-400 text-lg">
        {activeTab === "answer"
          ? "Generating your answer..."
          : "Generating your chart..."}
      </p>
      <p className="text-gray-500 text-sm mt-2">
        {activeTab === "answer"
          ? "This may take a few moments"
          : "Creating Visual Representation"}
      </p>
    </div>
  );
};

export default ChatLoader;
