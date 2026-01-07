import { dbConfigState } from "@/redux/slice/dbSlice";
// import { stringUpperCase } from "@/utils/reusableFunctions";
import { useEffect, type Dispatch, type SetStateAction } from "react";

import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
type Props = {
  activeDbConnection: string | null;
  setActiveDbConnection: Dispatch<SetStateAction<string | null>>;
};
const ChatHeader = (props: Props) => {
  // const dbConnectionId = Number(localStorage.getItem("dbConnectionId"));
  const { setActiveDbConnection } = props;

  const navigate = useNavigate();
  // const dispatch = useDispatch<AppDispatch>();
  const { dbConnections } = useSelector(dbConfigState);
  // const { user } = useSelector(authState);
  // const [isEditConfig, setIsEditConfig] = useState(false);
  // const location = useLocation();
  // const tableName = location.state;

  // const [dbs] = dbNames;
  // console.log(dbs);
  // useEffect(() => {
  //   const fetchDbNames = async () => {
  //     try {
  //       const res = await dispatch(
  //         getDbConnections(Number(user.user_id))
  //       ).unwrap();

  //       setDbNames(res);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };
  //   if (user?.user_id) {
  //     fetchDbNames();
  //   }
  // }, [dispatch, user?.user_id]);
  // useEffect(() => {
  //   if (!dbConnections || dbConnections.length === 0) return;
  //   const localActiveDbConnection = localStorage?.getItem("dbConnectionId");
  //   setActiveDbConnection(
  //     localActiveDbConnection
  //       ? localActiveDbConnection
  //       : String(dbConnections[0]?.db_connection_id)
  //   );
  //   return () => {
  //     localStorage.removeItem("dbConnectionId");
  //     setActiveDbConnection("");
  //   };
  // }, []);
  useEffect(() => {
    if (!dbConnections || dbConnections.length === 0) return;
    localStorage.setItem(
      "dbConnectionId",
      String(dbConnections[0]?.db_connection_id)
    );
    setActiveDbConnection(String(dbConnections[0]?.db_connection_id));

    return () => {
      localStorage.removeItem("dbConnectionId");
      setActiveDbConnection("");
    };
  }, []);

  return (
    <div
      id="chat-header"
      className="bg-base-100 border-b border-border-color p-3"
    >
      <div className="flex items-center justify-between  ">
        <div className="flex items-center w-xl space-x-4">
          <h1 className="text-xl font-bold text-white">
            Converse with Database
          </h1>
          {/* {dbConnections && connectionStatus === "success" && (
            <div className="w-70">
              <select
                value={
                  activeDbConnection
                    ? activeDbConnection
                    : dbConnections[0]?.db_connection_id
                }
                className="select   border-primary outline-none  bg-base-100 text-white w-auto m-0 "
                onChange={(e) => {
                  setActiveDbConnection(e?.target?.value);
                  localStorage.setItem("dbConnectionId", e.target.value);
                }}
              >
                
                {dbConnections?.map((db) => {
                  return (
                    <option
                      className="w-fit flex gap-5 "
                      key={db?.db_connection_id}
                      value={db?.db_connection_id}
                    >
                      {`${db?.display_name} (${stringUpperCase(db?.db_type)})`}
                    </option>
                  );
                })}
              </select>
            </div>
          )} */}
        </div>
        <div className="flex items-center space-x-2">
          {/* <button
            className="bg-[#3B82F6] hover:bg-[#60A5FA] text-white px-4 py-2 rounded-lg transition duration-200"
            onClick={() => {
              navigate("/database-tables/intelligence-config", {
                state: { isEditIntelligenceConfig: true },
              });
            }}
          >
            <i className="fa-solid fa-cog mr-2"></i>
            Data Intelligence Config
          </button> */}
          <button
            onClick={() => {
              navigate("/dashboard", {
                state: { isEditConfig: true },
              });
            }}
            className="bg-gray-700 cursor-pointer hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition duration-200 space-x-1"
          >
            <i className="fa-solid fa-chart-line"></i>
            <span> View Dashboards</span>
          </button>
          <button
            className="bg-[#3B82F6] cursor-pointer hover:bg-[#60A5FA] text-white px-4 py-2 rounded-lg transition duration-200"
            onClick={() => {
              navigate("/database-tables", {
                state: { isEditConfig: true },
              });
            }}
          >
            <i className="fa-solid fa-cog mr-2"></i>
            Edit Config
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
