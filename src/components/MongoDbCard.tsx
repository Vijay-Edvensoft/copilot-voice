import {
  setActiveTable,
  type TableStatus,
  type TableType,
} from "@/redux/slice/dbSlice";
import type { AppDispatch } from "@/redux/store/store";
import { stringUpperCase } from "@/utils/reusableFunctions";

import { useEffect, type Dispatch, type SetStateAction } from "react";
import { useDispatch } from "react-redux";

type Props = {
  table: TableType;

  setIsSchemaOpen: Dispatch<SetStateAction<boolean>>;
  // setSchema: Dispatch<SetStateAction<TableType | undefined>>;
  onChange: (t: TableStatus) => void;
  selectedTables: TableStatus[];
  db_type: string;
  // isChecked: boolean;
};

const MongoDbCard = (props: Props) => {
  const { table, onChange, selectedTables, db_type, setIsSchemaOpen } = props;
  const dispatch = useDispatch<AppDispatch>();

  const { collection_name } = table;

  const handleViewSchema = () => {
    dispatch(setActiveTable({ table, db_type }));
    setIsSchemaOpen(true);
  };

  useEffect(() => {}, []);
  return (
    <div
      className="table-card bg-base-100 rounded-lg border border-border-color p-4 hover:border-primary transition duration-200 relative"
      data-table="orders"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            className="table-checkbox w-4 h-4 text-primary bg-gray-700 border-gray-600 rounded focus:ring-primary focus:ring-2"
            onChange={(e) =>
              onChange({
                name: table.collection_name,
                table_id: table.table_id,
                is_configured: e.target.checked,
              })
            }
            value={table.table_id}
            checked={
              selectedTables.find((t) => t.table_id === table.table_id)
                ?.is_configured ?? table.is_configured
            }
            // checked={
            //   selectedTables.filter((t) => t.table_id === table.table_id)
            //     ? selectedTables.find((t) => t.table_id === table.table_id)
            //         ?.is_configured
            //     : // Priority 2: fallback to table.is_configured (initial DB config)
            //       is_configured
            // }
          />
          <i className="fa-solid fa-folder" style={{ color: "#66bb6a" }}></i>
        </div>
        {/* <span className="bg-green-900/30 text-green-400 px-2 py-1 rounded text-xs">
          Active
        </span> */}
      </div>
      <div className="mb-3">
        <h4 className="text-white font-medium mb-1">
          {collection_name && stringUpperCase(collection_name)}
        </h4>
        <p className="text-gray-400 text-sm">
          {" "}
          {table?.sample_document &&
            Object.keys(table?.sample_document)?.length}{" "}
          fields
        </p>
      </div>
      <button
        className="view-details-btn w-full cursor-pointer bg-primary hover:bg-secondary text-white py-2 px-4 rounded-lg transition duration-200 text-sm"
        onClick={handleViewSchema}
      >
        <i className="fa-solid fa-eye mr-2"></i>
        View Schema
      </button>
    </div>
  );
};

export default MongoDbCard;
