import { dbConfigState, type ColumnType } from "@/redux/slice/dbSlice";
import { useSelector } from "react-redux";

type props = {
  schemaData: ColumnType;
};

const Schema = (props: props) => {
  const { dbTables } = useSelector(dbConfigState);
  const {
    schemaData: {
      column_name,
      column_type,
      is_nullable,
      column_key,
      // default: defaultValue,
    },
  } = props;

  const getBadge = (key: string) => {
    return key === "PRI" ? (
      <span className="bg-blue-900 text-blue-300 px-2 py-1 rounded text-xs">
        Primary Key
      </span>
    ) : key === "MUL" ? (
      <span className="bg-green-900 text-green-300 px-2 py-1 rounded text-xs">
        Foreign Key
      </span>
    ) : key === "UK" ? (
      <span className="bg-yellow-900 text-yellow-300 px-2 py-1 rounded text-xs">
        Unique Key
      </span>
    ) : (
      ""
    );
  };

  const getBorderColor = (key: string) => {
    return key === "PRI"
      ? "border-blue-500"
      : key === "MUL"
      ? "border-green-500"
      : key === "UK"
      ? "border-yellow-500"
      : "border-gray-600";
  };

  const getReferenceTable = (columnName: string) => {
    const column = columnName.split("_")[0];

    const [reference_table] = dbTables.filter((ta) =>
      ta?.table_name?.includes(column)
    );

    return `References ${reference_table?.table_name} (${columnName})`;
  };

  return (
    <div className="px-6 py-2 max-h-[70vh] overflow-y-auto">
      <div id="modal-schema-content" className="space-y-4"></div>
      <div
        className={`bg-gray-800 p-4 rounded-lg border-l-4 ${getBorderColor(
          column_key
        )}`}
      >
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-200 font-semibold text-lg">
            {column_name.charAt(0).toUpperCase() + column_name.slice(1)}
          </span>
          <div className="flex space-x-2">
            {" "}
            {getBadge(column_key)}
            {is_nullable === "YES" ? (
              <span className="bg-gray-700 text-gray-400 px-2 py-1 rounded text-xs">
                Optional
              </span>
            ) : (
              <span className="bg-gray-600 text-gray-300 px-2 py-1 rounded text-xs">
                Required
              </span>
            )}
          </div>
        </div>
        <div className="text-gray-400 text-sm">
          <span className="font-medium">{column_type}</span> •
          <span> {is_nullable === "YES" ? "NULL" : "NOT NULL"}</span>
          {column_key === "MUL" && (
            <span>• {getReferenceTable(column_name)} </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Schema;
