import {
  setActiveTable,
  type TableStatus,
  type TableType,
} from "@/redux/slice/dbSlice";
import type { AppDispatch } from "@/redux/store/store";

import { stringUpperCase } from "@/utils/reusableFunctions";
import { type Dispatch, type SetStateAction } from "react";
import { useDispatch } from "react-redux";

type Props = {
  table: TableType;

  setIsSchemaOpen: Dispatch<SetStateAction<boolean>>;

  onChange: (e: TableStatus) => void;
  selectedTables: TableStatus[];
  db_type: string;
  // isChecked: boolean;
};
const TableCard = (props: Props) => {
  const { table, db_type, setIsSchemaOpen, onChange, selectedTables } = props;
  const dispatch = useDispatch<AppDispatch>();

  // const rowCounts: Record<string, string> = {
  //   customers: "1,247",
  //   orders: "3,892",
  //   products: "567",
  //   employees: "89",
  //   suppliers: "34",
  //   inventory: "2,156",
  // };
  const { table_name, table_id, columns, is_configured } = table;
  function handleViewDetails(): void {
    setIsSchemaOpen(true);

    dispatch(setActiveTable({ table, db_type }));
  }
  console.log(selectedTables);
  const isChecked = selectedTables?.find((t) => t.table_id === table_id);
  console.log(isChecked);
  return (
    <div key={table.table_id}>
      <div
        className="table-card bg-[#1F2937] rounded-lg border border-border-color p-4 hover:border-primary transition duration-200 relative"
        data-table="customers"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              name="is_configured"
              value={table_id}
              className="table-checkbox w-4 h-4 text-[#3B82F6] bg-gray-700 border-gray-600 rounded focus:ring-primary focus:ring-2"
              onChange={(e) =>
                onChange({
                  name: table_name,
                  table_id: table_id,
                  is_configured: e.target.checked,
                })
              }
              // checked={
              //   // Priority 1: If table exists in selectedTables, use that is_configured value
              //   selectedTables.filter((t) => t.table_id === table.table_id)
              //     ? selectedTables.find((t) => t.table_id === table.table_id)
              //         ?.is_configured
              //     : // Priority 2: fallback to table.is_configured (initial DB config)
              //       table.is_configured
              // }
              checked={
                selectedTables?.find((t) => t.table_id === table_id)
                  ?.is_configured ?? is_configured
              }
              // checked={isChecked}
              // checked={}
            />
            <i className="fa-solid fa-table text-[#3B82F6] text-lg"></i>
          </div>
        </div>
        <div className="mb-3">
          <h4 className="text-white font-medium mb-1">
            {table_name && stringUpperCase(table_name)}
          </h4>
          <p className="text-gray-400 text-sm">{columns?.length} columns</p>
        </div>
        <button
          className="view-details-btn w-full cursor-pointer bg-[#3B82F6] hover:bg-secondary text-white py-2 px-4 rounded-lg transition duration-200 text-sm"
          onClick={handleViewDetails}
        >
          <i className="fa-solid fa-eye mr-2"></i>
          View Details
        </button>
      </div>
    </div>
  );
};

export default TableCard;
