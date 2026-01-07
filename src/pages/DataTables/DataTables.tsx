import { useLocation } from "react-router-dom";
import NewDatabaseTablesView from "./NewDatabaseTablesView";
import DbSetupConfigView from "./DbSetupConfigView";

const DataTables = () => {
  const location = useLocation();

  const { isNewDbAdded } = location?.state || {};

  return (
    <div
      id="table-details-page"
      className=" min-h-screen min-w-[80vw] lg:min-w-[70vw] p-0 m-0"
    >
      {isNewDbAdded ? <NewDatabaseTablesView /> : <DbSetupConfigView />}
    </div>
  );
};

export default DataTables;
