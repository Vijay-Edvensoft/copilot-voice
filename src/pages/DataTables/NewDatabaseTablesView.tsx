import TableCard from "@/components/TableCard";

import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import CompleteSchema from "./CompleteSchema";
import { useDispatch, useSelector } from "react-redux";
import {
  dbConfigState,
  fetchTables,
  saveConfig,
  type ConfigTable,
  type TableStatus,
} from "@/redux/slice/dbSlice";
import type { AppDispatch } from "@/redux/store/store";
import { authState } from "@/redux/slice/authSlice";
import Loader from "@/components/Loader";
import { toast } from "react-toastify";
import MongoDbCard from "@/components/MongoDbCard";
import MongoSchema from "./MongoSchema";

const NewDatabaseTablesView = () => {
  const { user } = useSelector(authState);
  const userId = user?.user_id;
  const dispatch = useDispatch<AppDispatch>();
  const hasFetched = useRef(false);
  const modalRef = useRef<HTMLDivElement | null>(null);
  // const schemaRef = useRef<HTMLElement | null>(null);

  const {
    connectionStatus,
    dbTables,
    activeTable,
    message: dbConfigMessage,
  } = useSelector(dbConfigState);
  const location = useLocation();
  const { db_connection_id, displayName, dbType } = location?.state || {};

  const [isSchemaOpen, setIsSchemaOpen] = useState<boolean>(false);

  const [configuredTables, setConfiguredTables] = useState<TableStatus[]>([]);
  const [selectedTables, setSelectedTables] = useState<TableStatus[]>([
    ...configuredTables,
  ]);
  // const location = useLocation();
  const navigate = useNavigate();

  const handleSelection = (configTable: TableStatus) => {
    // const table_id = Number(e.target.value);
    // const is_configured = e.target.checked;
    const { table_id, is_configured } = configTable;
    setSelectedTables((prev) => {
      // check if table already exists in selectedTables
      const isAvailable = selectedTables
        .map((t) => t.table_id)
        .includes(table_id);

      if (isAvailable) {
        // update only is_configured for that table_id
        return prev.map((t) =>
          t.table_id === table_id ? { ...t, is_configured } : t
        );
      } else {
        // add new table entry
        return [...prev, { ...configTable }];
      }
    });
  };

  const handleSelectAll = () => {
    const updatedSelectedData = dbTables.map((t) => {
      return {
        table_id: Number(t.table_id),
        is_configured: true,
        name: t.collection_name || t.table_name,
      };
    });
    const updatedUnSelectedData = dbTables.map((t) => {
      return {
        table_id: Number(t.table_id),
        is_configured: false,
        name: t.collection_name || t.table_name,
      };
    });
    // console.log(updatedSelectedData, dbTables, 'selectall')/

    if (
      selectedTables?.filter((t) => t.is_configured).length !== dbTables.length
    ) {
      setSelectedTables(updatedSelectedData);
    } else {
      setSelectedTables(updatedUnSelectedData);
    }
  };

  // configuration table
  async function handleConfigure(): Promise<void> {
    if (!selectedTables) return;
    if (selectedTables?.length === 0 && configuredTables.length === 0) {
      return;
    }

    try {
      const configTables: ConfigTable = { tables: selectedTables };
      await dispatch(
        saveConfig({
          payload: configTables,
          db_connection_id: db_connection_id,
        })
      ).unwrap();
      hasFetched.current = false;
      modalRef.current?.classList.add("modal-open");

      // dispatch(
      //   fetchTables({
      //     userId: Number(userId),
      //     dbType: dbType,
      //     dbConnectionId: db_connection_id,
      //   })
      // );
      // navigate("/database-tables/intelligence-config");

      // Navigate on success
      // navigate("/database-tables/intelligence-config");

      // Reset status
      // dispatch(resetDbStatus());
    } catch (error) {
      console.error("❌ Configuration failed:", error);
      toast.error(
        typeof error === "string" ? error : "Failed to configure tables"
      );
    }
  }

  useEffect(() => {
    // if (!hasFetched.current) {
    //   console.log(userId, db_connection_id, dbType);
    if (hasFetched.current) return;
    if (dbType && db_connection_id && userId) {
      dispatch(
        fetchTables({
          userId: Number(userId),
          dbType: dbType,
          dbConnectionId: db_connection_id,
        })
      ).unwrap();
    }
    hasFetched.current = true;
    // }
  }, [dbType, db_connection_id, userId, dispatch]);

  useEffect(() => {
    if (!dbTables?.length) return;
    const configured = dbTables
      ?.filter((t) => t.is_configured)
      .map((t) => ({
        table_id: t.table_id,
        is_configured: t.is_configured,
        name: t.collection_name || t.table_name,
      }));

    // setConfiguredTables((prev) => [...prev, ...configured]);
    setConfiguredTables(configured);
    setSelectedTables(configured);
    // return () => {
    //   setConfiguredTables([]);
    //   setSelectedTables([]);
    // };
  }, [dbTables]);

  // useEffect(() => {
  //   if (configuredTables.length > 0) {
  //     setSelectedTables((prev) => {
  //       const existingIds = new Set(prev.map((t) => t.table_id));
  //       const newOnes = configuredTables.filter(
  //         (t) => !existingIds.has(t.table_id)
  //       );
  //       return [...prev, ...newOnes];
  //     });
  //   }
  // }, [configuredTables]);

  return (
    <main id="main-content" className={` p-6 `}>
      <div className="max-w-7xl mx-auto">
        <div id="header-section" className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                {dbType === "mongoDB" && "Database Collections"}
                {dbType === "mySQL" && "Database Tables"}
              </h1>
              <p className="text-gray-400">
                Connected to:{" "}
                <span className="text-primary font-medium">{displayName}</span>
              </p>
            </div>
            <div className="flex items-center space-x-4">
              {" "}
              {/* {isEditConfig && (
                <button
                  className="bg-[#3B82F6] hover:bg-secondary text-white px-6 py-2 rounded-lg transition duration-200 "
                  onClick={handleNavigate}
                >
                  Back To Chat
                </button>
              )} */}
              <button
                className="bg-gray-600 hover:bg-gray-400 text-white cursor-pointer px-4 py-2 rounded-lg transition duration-200"
                // disabled={selectedTables.length === 0}
                onClick={() => {
                  dispatch(
                    fetchTables({
                      userId: Number(userId),
                      dbType: dbType,
                      dbConnectionId: db_connection_id,
                    })
                  ).unwrap();
                }}
              >
                <i className="fa-solid fa-refresh mr-2"></i>
                Refresh
              </button>
            </div>
          </div>
        </div>
        {/*   Table Selection Controls  */}
        <div
          id="table-controls"
          className="max-w-7xl mx-auto mb-6 bg-[#1F2937] rounded-lg border border-border-color p-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center  space-x-4">
              <label className="flex items-center space-x-2 text-white">
                <input
                  type="checkbox"
                  id="select-all"
                  className="w-4 h-4 text-primary bg-gray-700 border-gray-600 rounded focus:ring-primary focus:ring-2"
                  checked={
                    selectedTables?.filter((t) => t.is_configured).length ===
                    dbTables?.length
                  }
                  // checked={
                  //   dbTables.filter((t) => !t.is_configured).length > 0 &&
                  //   selectedTables?.length ===
                  //     dbTables.filter((t) => !t.is_configured).length
                  // }
                  onChange={handleSelectAll}
                />
                <span>
                  Select All {dbType === "mySQL" ? "Tables" : "Collections"}
                </span>
              </label>
              <span id="selected-count" className="text-gray-400 text-sm">
                {`${selectedTables?.filter((t) => t.is_configured).length} ${
                  dbType === "mySQL" ? "tables" : "collections"
                } selected`}
              </span>
            </div>
            <div className="flex gap-5">
              <button
                id="configure-btn"
                className="bg-[#3B82F6] hover:bg-secondary cursor-pointer text-white px-6 py-2 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => handleConfigure()}
                disabled={
                  (selectedTables.length === configuredTables.length &&
                    selectedTables.length !== dbTables?.length &&
                    selectedTables?.filter((t) => t.is_configured).length ===
                      configuredTables?.filter((t) => t.is_configured)
                        .length) ||
                  selectedTables?.filter((t) => t.is_configured).length === 0
                }
              >
                <i className="fa-solid fa-cog mr-2"></i>
                Configure Selected
              </button>
            </div>
          </div>
        </div>
        {/* Tables Grid */}
        <div className="grid grid-cols-1 gap-4 ">
          <div id="tables-grid" className="w-full">
            <h3 className="text-lg font-semibold text-white mb-4">
              Available {dbType === "mySQL" ? "Tables" : "Collections"}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {dbTables?.length > 0 ? (
                dbTables?.map((table) => {
                  if (dbType === "mySQL") {
                    return (
                      <TableCard
                        key={table.table_id}
                        selectedTables={selectedTables}
                        table={table}
                        setIsSchemaOpen={setIsSchemaOpen}
                        onChange={handleSelection}
                        db_type={dbType}
                      />
                    );
                  } else if (dbType === "mongoDB") {
                    return (
                      <MongoDbCard
                        key={table.table_id}
                        selectedTables={selectedTables}
                        onChange={handleSelection}
                        table={table}
                        db_type={dbType}
                        setIsSchemaOpen={setIsSchemaOpen}
                      />
                    );
                  }
                })
              ) : (
                <p className="flex items-center justify-center">
                  Tables not available
                </p>
              )}
              {connectionStatus === "loading" && <Loader />}
            </div>
          </div>
        </div>{" "}
      </div>

      {isSchemaOpen && (
        <div>
          {activeTable?.db_type === "mySQL" && (
            <CompleteSchema setIsSchemaOpen={setIsSchemaOpen} />
          )}{" "}
          {activeTable?.db_type === "mongoDB" && (
            <MongoSchema setIsSchemaOpen={setIsSchemaOpen} />
          )}
        </div>
      )}

      {/* {connectionStatus === "loading" && <Loader />} */}
      {connectionStatus === "failed" && (
        <div className="flex flex-1 justify-center items-center">
          <h2 className="text-red-500">{dbConfigMessage}</h2>
        </div>
      )}
      <div
        id="my_modal_5"
        className="modal modal-bottom sm:modal-middle   "
        ref={modalRef}
      >
        <div className="modal-box bg-base-100 rounded-xl shadow-2xl w-full max-w-2xl border border-border-color">
          <div className="flex items-center space-x-3">
            <i
              className="fa-solid fa-circle-check fa-xl"
              style={{ color: "#66bb6a" }}
            ></i>
            <div>
              <h3 className="text-xl font-bold text-white">
                Configuration Successful
              </h3>{" "}
              <p className="text-gray-400 text-sm">
                What would you like to do next?
              </p>
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* <!-- Continue to Chatbot --> */}
              <div
                onClick={() => navigate("/chat")}
                className="bg-gray-800 hover:bg-gray-700 border-2 border-border-color hover:border-primary p-6 rounded-xl cursor-pointer transition duration-300 transform hover:scale-105"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mb-4">
                    <i className="text-primary text-lg" data-fa-i2svg="">
                      {" "}
                      <i className="fa-solid fa-comments  fa-lg"></i>
                    </i>
                  </div>
                  <h3 className="text-white font-semibold text-lg mb-2">
                    Continue to Chatbot
                  </h3>
                  <p className="text-gray-400 text-sm">
                    Start conversing with your configured data sources
                  </p>
                </div>
              </div>

              {/* <!-- Add Another Data Source --> */}
              <div
                onClick={() => navigate("/onboarding/datasource")}
                className="bg-gray-800 hover:bg-gray-700 border-2 border-border-color hover:border-primary p-6 rounded-xl cursor-pointer transition duration-300 transform hover:scale-105"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-green-900/30 rounded-full flex items-center justify-center mb-4">
                    {/* <i className="text-green-400 text-2xl" data-fa-i2svg=""> */}
                    <i className="fa-solid fa-circle-plus text-green-400  fa-lg"></i>
                    {/* </i> */}
                  </div>
                  <h3 className="text-white font-semibold text-lg mb-2">
                    Add Another Data Source
                  </h3>
                  <p className="text-gray-400 text-sm">
                    Connect to additional databases or collections
                  </p>
                </div>
              </div>
            </div>

            {/* <!-- Connected Data Sources Summary --> */}
            {/* <div className="mt-6 bg-blue-900/50 border border-blue-800 rounded-lg p-4">
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
                    Connected Data Sources
                  </p>
                  <div id="connected-sources-list" className="space-y-1">
                    <p className="text-blue-200">
                      • db (MYSQL) - fitnessAImodel
                    </p>
                  </div>
                </div>
              </div>
            </div> */}
          </div>
        </div>
      </div>

      {/* <MongoSchema ref={schemaRef} /> */}
    </main>
  );
};

export default NewDatabaseTablesView;
