import Loader from "@/components/Loader";
import Schema from "@/components/Schema";
import { authState } from "@/redux/slice/authSlice";
import {
  dbConfigState,
  getColumns,
  type ColumnType,
} from "@/redux/slice/dbSlice";
import { type AppDispatch } from "@/redux/store/store";
import { stringUpperCase } from "@/utils/reusableFunctions";

import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { useDispatch, useSelector } from "react-redux";

type props = {
  setIsSchemaOpen: Dispatch<SetStateAction<boolean>>;
};

const CompleteSchema = (props: props) => {
  const { setIsSchemaOpen } = props;
  const {
    activeTable: { table },
    connectionStatus,
    message,
  } = useSelector(dbConfigState);

  const dispatch = useDispatch<AppDispatch>();
  const {
    user: { user_id },
  } = useSelector(authState);

  function handleClose(): void {
    setIsSchemaOpen(false);
  }
  const [columns, setColumns] = useState<any | null>(null);

  useEffect(() => {
    const fetchColumn = async () => {
      try {
        const res = await dispatch(
          getColumns({
            userId: Number(user_id),
            tableId: table?.table_id,
          })
        );

        setColumns(res?.payload);
      } catch (error) {
        console.log(error);
      }
    };
    fetchColumn();
  }, []);

  return (
    <div
      id="schema-modal"
      className=" fixed inset-0 bg-base-100/80 flex items-center justify-center min-h-[90vh] "
    >
      <div
        id="inside"
        className="  bg-base-100  rounded-xl shadow-2xl w-full max-w-4xl max-h-[100vh] border border-[#374151]"
      >
        <div className="flex items-center justify-between p-6 border-b border-[#374151]">
          <div className="flex items-center space-x-3">
            <i className="fa-solid fa-table text-primary text-xl"></i>
            <div>
              <h3
                className="text-xl font-bold text-white mb-2"
                id="modal-table-name"
              >
                {table?.table_name && stringUpperCase(table?.table_name)}-
                Complete Schema{" "}
              </h3>
              <p className="text-gray-400 text-sm" id="modal-table-info">
                {columns?.columns?.length} columns
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-white cursor-pointer transition duration-200"
          >
            <i className="fa-solid fa-times text-xl"></i>
          </button>
        </div>{" "}
        <div
          className="overflow-y-scroll max-h-[75vh]  border-b border-[#374151]"
          style={{ scrollbarWidth: "none" }}
        >
          {connectionStatus === "loading" && <Loader />}
          {connectionStatus === "failed" && (
            <div>
              <p>{message}</p>
            </div>
          )}

          {columns?.columns?.map((schemaData: ColumnType, idx: number) => (
            <Schema schemaData={schemaData} key={idx} />
          ))}
        </div>{" "}
        <div className="flex items-center justify-end p-2 mx-6 border-t border-[#374151] space-x-3">
          <button
            className="bg-gray-600 hover:bg-gray-500 cursor-pointer text-white px-6 py-2 rounded-lg transition duration-200"
            onClick={handleClose}
          >
            Close
          </button>
          {/* <button className="bg-primary hover:bg-secondary text-white px-6 py-2 rounded-lg transition duration-200">
            <i className="fa-solid fa-download mr-2"></i>
            Export Schema
          </button> */}
        </div>
      </div>{" "}
    </div>
  );
};

export default CompleteSchema;
