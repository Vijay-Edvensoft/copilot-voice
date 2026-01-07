const Loader = () => {
  return (
    // <div className="fixed inset-0 bg-black/50 flex items-center justify-center text-white p-8 ">
    //   <span className="loading loading-spinner text-accent"></span>
    // </div>
    <div className="h-full absolute inset-0 bg-gray-700/50  z-50 flex items-center justify-center text-white p-8 ">
      <span className="loading loading-spinner text-accent"></span>
    </div>
  );
};

export default Loader;
