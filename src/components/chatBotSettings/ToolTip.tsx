const ToolTip = (props: any) => {
  const { icon, title, desc } = props;
  return (
    <div className="tooltip-trigger group  relative  ">
      <i className="fa-solid fa-circle-info   text-gray-400 hover:text-blue-400 cursor-help"></i>
      <div className="tooltip-content opacity-0 group-hover:opacity-100  absolute bottom-full left-[-30px] mb-2 w-80 bg-gray-900 border border-gray-700 rounded-lg shadow-xl p-4 z-200 pointer-events-none">
        <div className="flex items-start space-x-3">
          <i className={`fa-solid ${icon} mt-1`}></i>

          <div>
            <p className="text-white font-medium mb-1">{title}</p>
            <p className="text-gray-400 text-sm">{desc}</p>
          </div>
        </div>
        <div className="absolute bottom-0 left-8 transform translate-y-full">
          <div className="border-8 border-transparent border-t-gray-900"></div>
        </div>
      </div>
    </div>
  );
};

export default ToolTip;
