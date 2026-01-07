import Loader from "@/components/Loader";
import TableDropDown from "@/components/TableDropDown";

import { authState } from "@/redux/slice/authSlice";
import { dbConfigState, getDataSources } from "@/redux/slice/dbSlice";
import type { AppDispatch } from "@/redux/store/store";
import { useEffect, useRef, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const DbSetupConfigView = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector(authState);
  const {
    dataSources,
    message: dbConfigMessage,
    connectionStatus,
  } = useSelector(dbConfigState);
  const navigate = useNavigate();
  const userId = user.user_id;
  // const location = useLocation();
  // const isEditConfig = location?.state?.isEditConfig || false;

  const hasFetched = useRef(false);
  const [activeDb, setActiveDb] = useState<number | null>(null);

  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true;
      dispatch(getDataSources(Number(userId))).unwrap();
    }
  }, []);

  return (
    <main id="main-content" className={` p-6 `}>
      <div className="max-w-7xl mx-auto">
        <div id="header-section" className="mb-8">
          <div className="flex items-center justify-between">
            {/* <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Configure Data Sources
              </h1>
              <p className="text-gray-400">
                Manage tables and collections from your connected resources
              </p>
            </div> */}
            <div className="flex flex-1 items-center justify-between space-x-4 text-sm">
              <div>
                <button
                  className="bg-gray-700 cursor-pointer flex gap-2 items-center hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition duration-200 "
                  onClick={() => navigate("/chat")}
                >
                  <i className="fa-solid fa-comments"></i>
                  <span> Back To Chat</span>
                </button>
              </div>
              <div>
                <button
                  className="bg-[#3B82F6] cursor-pointer hover:bg-secondary text-white px-6 py-2 rounded-lg transition duration-200 "
                  onClick={() => {
                    navigate("/onboarding/datasource");
                  }}
                >
                  {" "}
                  <i className="fa-solid fa-plus"></i>
                  <span> New DataSource</span>
                </button>{" "}
                <button
                  className="bg-gray-600 hover:bg-gray-400 text-white cursor-pointer px-4 py-2 rounded-lg transition duration-200"
                  // disabled={selectedTables.length === 0}
                  onClick={() => {
                    dispatch(getDataSources(Number(userId)));
                  }}
                >
                  <i className="fa-solid fa-refresh mr-2"></i>
                  Refresh
                </button>
              </div>
            </div>
          </div>
        </div>{" "}
        <div className="mb-6 bg-blue-900/50 border border-blue-800 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <i className="text-blue-400 mt-0.5" data-fa-i2svg="">
              <svg
                className="svg-inline--fa fa-circle-info"
                aria-hidden="true"
                focusable="false"
                data-prefix="fas"
                data-icon="circle-info"
                role="img"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
                data-fa-i2svg=""
              >
                <path
                  fill="currentColor"
                  d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336h24V272H216c-13.3 0-24-10.7-24-24s10.7-24 24-24h48c13.3 0 24 10.7 24 24v88h8c13.3 0 24 10.7 24 24s-10.7 24-24 24H216c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z"
                ></path>
              </svg>
            </i>
            <div className="text-sm text-blue-300">
              <p className="font-medium text-blue-200 mb-1">
                Configure Your Data Sources
              </p>
              <p>
                Select which databases you want to use with the chatbot. You can
                also update credentials and modify table/collection selections.
              </p>
            </div>
          </div>
        </div>
        <div className="relative flex flex-col gap-5 ">
          {dataSources?.map((data, idx) => {
            if (data.tables.length > 0) {
              return (
                <TableDropDown
                  key={idx}
                  {...data}
                  setActiveDb={setActiveDb}
                  activeDb={activeDb}
                />
              );
            }
          })}
          {connectionStatus === "loading" && <Loader />}
        </div>
        {connectionStatus === "failed" && (
          <div className="flex h-90  border-t border-t-border-color  justify-center items-center ">
            <h2 className="text-red-500 text-2xl font-semibold">
              {dbConfigMessage}
            </h2>
          </div>
        )}{" "}
      </div>

      {/*   Table Selection Controls  */}
    </main>
  );
};

export default DbSetupConfigView;
