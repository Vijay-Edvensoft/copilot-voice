import {
  dbConfigState,
  fetchTables,
  resetDbStatus,
  saveConfig,
  type ConfigTable,
  type TableStatus,
  type TableType,
} from "@/redux/slice/dbSlice";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import TableCard from "./TableCard";
import type { AppDispatch } from "@/redux/store/store";
import { toast } from "react-toastify";
import MongoDbCard from "./MongoDbCard";
import { authState } from "@/redux/slice/authSlice";
// import Loader from "./Loader";
import CompleteSchema from "@/pages/DataTables/CompleteSchema";
import MongoSchema from "@/pages/DataTables/MongoSchema";
import { stringUpperCase } from "@/utils/reusableFunctions";
import { dataSourcesByTitle } from "@/config/dataSources";

const TableDropDown = (props: any) => {
  const openRef = useRef<HTMLDivElement>(null);
  const {
    db_connection_id,
    db_type,
    display_name,
    activeDb,
    setActiveDb,
    db_name,
  } = props;
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector(authState);
  // const [activeDb, setActiveDb] = useState<number | null>(null);

  const userId = user.user_id;
  // state of dbconfig
  const { activeTable } = useSelector(dbConfigState);
  const [dbTables, setDbTables] = useState<TableType[]>([]);

  const [isSchemaOpen, setIsSchemaOpen] = useState<boolean>(false);
  const [configuredDb, setConfiguredDb] = useState<boolean>(true);
  // Handle Dropdown

  const handleToggleDropdown = (dbConnectionId: any) => {
    // setIsOpen((prev) => !prev);
    if (dbConnectionId === activeDb) {
      setActiveDb(null);
      return;
    } else {
      setActiveDb(dbConnectionId);
      openRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  };
  // state of configured Tables
  const [configuredTables, setConfiguredTables] = useState<TableStatus[]>([]);
  //   State of Selected Tables
  const [selectedTables, setSelectedTables] = useState<TableStatus[]>([
    ...configuredTables,
  ]);

  // handle selection function
  const handleSelection = (configTable: TableStatus) => {
    // const table_id = Number(e.target.value);
    // const is_configured = e.target.checked;
    console.log(configTable);
    const { table_id, is_configured } = configTable;

    setSelectedTables((prev) => {
      // check if table already exists in selectedTables
      const isAvailable = selectedTables
        .map((t) => t.table_id)
        .includes(table_id);
      console.log(isAvailable);
      if (isAvailable) {
        console.log(
          prev.map((t) =>
            t.table_id === table_id ? { ...t, is_configured } : t
          )
        );
        // update only is_configured for that table_id
        return prev.map((t) =>
          t.table_id === table_id ? { ...t, is_configured } : t
        );
      } else {
        // add new table entry
        console.log([...prev, configTable]);
        return [...prev, { ...configTable, is_configured: true }];
      }
    });
  };

  //   Handle select all function
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
    // console.log(updatedSelectedData, dbTables, 'selectall')

    if (
      selectedTables?.filter((t) => t.is_configured).length !== dbTables.length
    ) {
      console.log(updatedSelectedData);
      setSelectedTables(updatedSelectedData);
    } else {
      setSelectedTables(updatedUnSelectedData);
    }
  };

  async function handleSaveConfig(): Promise<void> {
    if (!selectedTables) return;
    if (selectedTables?.length === 0 && configuredTables.length === 0) {
      return;
    }

    try {
      const configTables: ConfigTable = { tables: selectedTables };
      const res = await dispatch(
        saveConfig({
          payload: configTables,
          db_connection_id: db_connection_id,
        })
      ).unwrap();

      toast.success(res);
      // Navigate on success
      // navigate("/database-tables/intelligence-config");

      // Reset status
      dispatch(resetDbStatus());
    } catch (error) {
      console.error("❌ Configuration failed:", error);
      toast.error(
        typeof error === "string" ? error : "Failed to configure tables"
      );
    }
  }

  useEffect(() => {
    const fetch = async () => {
      const res = await dispatch(
        fetchTables({
          userId: Number(userId),
          dbType: db_type,
          dbConnectionId: db_connection_id,
        })
      ).unwrap();
      setDbTables(res);
    };
    fetch();
    // hasFetched.current = true;
  }, [dispatch, userId, db_type, db_connection_id]);

  // use effect to setConfigured Table on component mount
  useEffect(() => {
    if (!dbTables?.length) return;
    const configured = dbTables
      ?.filter((t) => t.is_configured)
      .map((t) => ({
        table_id: t.table_id,
        is_configured: t.is_configured,
        name: t.collection_name || t.table_name,
      }));

    setConfiguredTables(configured);
    setSelectedTables(configured);
    return () => {
      setConfiguredTables([]);
      setSelectedTables([]);
    };
  }, [dbTables]);
  // console.log(configuredTables);
  const { color, img } = dataSourcesByTitle[db_type];

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
    <div className="bg-gray-800 rounded-lg border-2 border-blue-500 overflow-hidden">
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4 flex-1">
            <label className="relative inline-flex items-center cursor-pointer mt-1">
              <input
                type="checkbox"
                className="sr-only peer"
                value={db_connection_id}
                defaultChecked={configuredDb}
                onChange={(e) => {
                  if (e.target.checked) {
                    setConfiguredDb(false);
                  } else {
                    setConfiguredDb(true);
                  }
                }}
              />
              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>

            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <div
                  className={`w-10 h-10 ${
                    color.split(" ")[0]
                  } rounded-lg flex items-center justify-center `}
                >
                  <i
                    className={`${color.split(" ")[1]} text-xl`}
                    data-fa-i2svg=""
                  >
                    <img src={img} alt="sql server" className="w-5 h-5 " />
                  </i>
                </div>
                {/* <div className="w-10 h-10 bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <i className="text-blue-400 text-xl" data-fa-i2svg="">
                    <svg
                      className="svg-inline--fa fa-database"
                      aria-hidden="true"
                      focusable="false"
                      data-prefix="fas"
                      data-icon="database"
                      role="img"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 448 512"
                      data-fa-i2svg=""
                    >
                      <path
                        fill="currentColor"
                        d="M448 80v48c0 44.2-100.3 80-224 80S0 172.2 0 128V80C0 35.8 100.3 0 224 0S448 35.8 448 80zM393.2 214.7c20.8-7.4 39.9-16.9 54.8-28.6V288c0 44.2-100.3 80-224 80S0 332.2 0 288V186.1c14.9 11.8 34 21.2 54.8 28.6C99.7 230.7 159.5 240 224 240s124.3-9.3 169.2-25.3zM0 346.1c14.9 11.8 34 21.2 54.8 28.6C99.7 390.7 159.5 400 224 400s124.3-9.3 169.2-25.3c20.8-7.4 39.9-16.9 54.8-28.6V432c0 44.2-100.3 80-224 80S0 476.2 0 432V346.1z"
                      ></path>
                    </svg>
                  </i>
                </div> */}
                <div>
                  <h3 className="text-xl font-bold text-white">
                    {display_name}
                  </h3>
                  <p className="text-gray-400 text-sm">
                    {" "}
                    {stringUpperCase(db_type)} • {db_name}
                  </p>
                </div>
              </div>

              {/* <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
                <div>
                  <p className="text-gray-500">Server</p>
                  <p className="text-white font-medium">192.168.1.100:1433</p>
                </div>
                <div>
                  <p className="text-gray-500">Username</p>
                  <p className="text-white font-medium">sa</p>
                </div>
              </div> */}
            </div>
          </div>

          {/* <button
            onClick={() => {}}
            className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition duration-200 flex items-center space-x-2 text-sm"
          >
            <i data-fa-i2svg="">
              <svg
                className="svg-inline--fa fa-key"
                aria-hidden="true"
                focusable="false"
                data-prefix="fas"
                data-icon="key"
                role="img"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
                data-fa-i2svg=""
              >
                <path
                  fill="currentColor"
                  d="M336 352c97.2 0 176-78.8 176-176S433.2 0 336 0S160 78.8 160 176c0 18.7 2.9 36.8 8.3 53.7L7 391c-4.5 4.5-7 10.6-7 17v80c0 13.3 10.7 24 24 24h80c13.3 0 24-10.7 24-24V448h40c13.3 0 24-10.7 24-24V384h40c6.4 0 12.5-2.5 17-7l33.3-33.3c16.9 5.4 35 8.3 53.7 8.3zM376 96a40 40 0 1 1 0 80 40 40 0 1 1 0-80z"
                ></path>
              </svg>
            </i>
            <span>Update Credentials</span>
          </button> */}
        </div>
      </div>

      <button
        onClick={() => handleToggleDropdown(db_connection_id)}
        className={`w-full text-left p-2 bg-gray-800 hover:bg-gray-700 border border-border-color text-white font-semibold flex justify-between items-center ${
          db_connection_id === activeDb && "border-b-0"
        } shadow-xl transition duration-200 ease-in-out`}
      >
        {/* <div className="flex items-center justify-between w-[95%] gap-4">
          <div className="flex gap-5 items-center">
            <i
              className="fa-solid fa-database text-2xl"
              style={{ color: "#74C0FC" }}
            ></i>
            <div className="flex flex-col items-start space-x-3">
              <span>{display_name}</span>
              <span className="text-gray-400 text-sm">
                {stringUpperCase(db_type)}
              </span>
            </div>
          </div>
        </div> */}

        {/* Dropdown Arrow Icon */}
        <div className="flex flex-1 justify-end">
          <svg
            className={`w-5 h-5 transition-transform duration-300 ${
              db_connection_id === activeDb
                ? "rotate-180 text-blue-400"
                : "text-gray-400"
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"
            ></path>
          </svg>
        </div>
      </button>
      {db_connection_id === activeDb && (
        <div
          className={`w-full bg-gray-800 border border-gray-700 rounded-b-xl shadow-2xl transition-all duration-500 ease-in-out overflow-hidden
                    ${
                      db_connection_id === activeDb
                        ? "max-h-auto  p-3 border-opacity-100 border-t-0"
                        : "max-h-0 border-opacity-0"
                    }`}
          ref={openRef}
        >
          {/* Configure Selected Bar (from second image) */}
          <div className="flex justify-between items-center mb-4 p-3 bg-gray-900 rounded-lg border border-gray-700">
            <label className="flex items-center space-x-3 text-sm font-medium text-gray-300">
              <input
                type="checkbox"
                checked={
                  selectedTables?.filter((t) => t.is_configured).length ===
                  dbTables.length
                }
                onChange={handleSelectAll}
                className="w-5 h-5 text-blue-500 bg-gray-700 border-gray-600 rounded-md focus:ring-blue-500 cursor-pointer"
              />
              <span>Select All </span>
              <span className="text-blue-400 font-semibold">
                {`${selectedTables?.filter((t) => t.is_configured).length} ${
                  db_type === "mySQL" ? "tables" : "collections"
                } selected`}
              </span>
            </label>
            {selectedTables.length > 0 && db_connection_id === activeDb && (
              <button
                className="bg-[#3B82F6] hover:bg-secondary text-white px-6 py-2 rounded-lg transition duration-200 cursor-pointer"
                onClick={handleSaveConfig}
              >
                Save Config
              </button>
            )}
          </div>
          {isSchemaOpen && activeTable.db_type === "mySQL" && (
            <div className="fixed inset-0 z-10">
              <CompleteSchema setIsSchemaOpen={setIsSchemaOpen} />
            </div>
          )}

          {isSchemaOpen && activeTable.db_type === "mongoDB" && (
            <div className="fixed inset-0 z-10">
              <MongoSchema setIsSchemaOpen={setIsSchemaOpen} />
            </div>
          )}
          {/* {connectionStatus === "loading" && <Loader />} */}
          {/* Grid of Cards */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {dbTables.map((table) => {
              if (db_type === "mySQL") {
                return (
                  <TableCard
                    key={table.table_id}
                    selectedTables={selectedTables}
                    table={table}
                    setIsSchemaOpen={setIsSchemaOpen}
                    onChange={handleSelection}
                    db_type={db_type}
                  />
                );
              } else if (db_type === "mongoDB") {
                return (
                  <MongoDbCard
                    key={table.table_id}
                    selectedTables={selectedTables}
                    onChange={handleSelection}
                    table={table}
                    db_type={db_type}
                    setIsSchemaOpen={setIsSchemaOpen}
                  />
                );
              }
            })}
          </div>
        </div>
      )}
    </div>

    // <div className="relative w-full max-w-7xl mx-auto my-auto" ref={openRef}>
    //   {/* Dropdown Toggle Button */}
    //   <button
    //     onClick={() => handleToggleDropdown(db_connection_id)}
    //     className={`w-full text-left p-4 bg-gray-800 hover:bg-gray-700 border border-border-color text-white font-semibold flex justify-between items-center ${
    //       db_connection_id === activeDb ? "rounded-t-xl" : "rounded-xl"
    //     } shadow-xl transition duration-200 ease-in-out`}
    //   >
    //     <div className="flex items-center justify-between w-[95%] gap-4">
    //       <div className="flex gap-5 items-center">
    //         <i
    //           className="fa-solid fa-database text-2xl"
    //           style={{ color: "#74C0FC" }}
    //         ></i>
    //         <div className="flex flex-col items-start space-x-3">
    //           {/* Checkbox mimicking the first image's header */}

    //           <span>{display_name}</span>
    //           <span className="text-gray-400 text-sm">
    //             {stringUpperCase(db_type)}
    //           </span>
    //         </div>
    //         <div></div>{" "}
    //       </div>{" "}
    //     </div>

    //     {/* Dropdown Arrow Icon */}
    //     <svg
    //       className={`w-5 h-5 transition-transform duration-300 ${
    //         db_connection_id === activeDb
    //           ? "rotate-180 text-blue-400"
    //           : "text-gray-400"
    //       }`}
    //       fill="none"
    //       stroke="currentColor"
    //       viewBox="0 0 24 24"
    //       xmlns="http://www.w3.org/2000/svg"
    //     >
    //       <path
    //         strokeLinecap="round"
    //         strokeLinejoin="round"
    //         strokeWidth="2"
    //         d="M19 9l-7 7-7-7"
    //       ></path>
    //     </svg>
    //   </button>

    //   {/* Dropdown Panel: Conditionally Rendered */}
    // {db_connection_id === activeDb && (
    //   <div
    //     className={`w-full bg-gray-800 border border-gray-700 rounded-b-xl shadow-2xl transition-all duration-500 ease-in-out overflow-hidden
    //               ${
    //                 db_connection_id === activeDb
    //                   ? "max-h-auto  p-3 border-opacity-100"
    //                   : "max-h-0 border-opacity-0"
    //               }`}
    //     ref={openRef}
    //   >
    //     {/* Configure Selected Bar (from second image) */}
    //     <div className="flex justify-between items-center mb-4 p-3 bg-gray-900 rounded-lg border border-gray-700">
    //       <label className="flex items-center space-x-3 text-sm font-medium text-gray-300">
    //         <input
    //           type="checkbox"
    //           checked={
    //             selectedTables?.filter((t) => t.is_configured).length ===
    //             dbTables.length
    //           }
    //           onChange={handleSelectAll}
    //           className="w-5 h-5 text-blue-500 bg-gray-700 border-gray-600 rounded-md focus:ring-blue-500 cursor-pointer"
    //         />
    //         <span>Select All </span>
    //         <span className="text-blue-400 font-semibold">
    //           {`${selectedTables?.filter((t) => t.is_configured).length} ${
    //             db_type === "mySQL" ? "tables" : "collections"
    //           } selected`}
    //         </span>
    //       </label>
    //       {selectedTables.length > 0 && db_connection_id === activeDb && (
    //         <button
    //           className="bg-[#3B82F6] hover:bg-secondary text-white px-6 py-2 rounded-lg transition duration-200 "
    //           onClick={handleSaveConfig}
    //         >
    //           Save Config
    //         </button>
    //       )}
    //     </div>
    //     {isSchemaOpen && activeTable.db_type === "mySQL" && (
    //       <div className="fixed inset-0 z-10">
    //         <CompleteSchema setIsSchemaOpen={setIsSchemaOpen} />
    //       </div>
    //     )}

    //     {isSchemaOpen && activeTable.db_type === "mongoDB" && (
    //       <div className="fixed inset-0 z-10">
    //         <MongoSchema setIsSchemaOpen={setIsSchemaOpen} />
    //       </div>
    //     )}
    //     {connectionStatus === "loading" && <Loader />}
    //     {/* Grid of Cards */}
    //     <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
    //       {dbTables.map((table) => {
    //         if (db_type === "mySQL") {
    //           return (
    //             <TableCard
    //               key={table.table_id}
    //               selectedTables={selectedTables}
    //               table={table}
    //               setIsSchemaOpen={setIsSchemaOpen}
    //               onChange={handleSelection}
    //               db_type={db_type}
    //             />
    //           );
    //         } else if (db_type === "mongoDB") {
    //           return (
    //             <MongoDbCard
    //               key={table.table_id}
    //               selectedTables={selectedTables}
    //               onChange={handleSelection}
    //               table={table}
    //               db_type={db_type}
    //               setIsSchemaOpen={setIsSchemaOpen}
    //             />
    //           );
    //         }
    //       })}
    //     </div>
    //   </div>
    // )}
    // </div>
  );
};

export default TableDropDown;
