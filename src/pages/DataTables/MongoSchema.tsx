import Loader from "@/components/Loader";
import { authState } from "@/redux/slice/authSlice";
import { dbConfigState, getSchema } from "@/redux/slice/dbSlice";
import type { AppDispatch } from "@/redux/store/store";
import { stringUpperCase } from "@/utils/reusableFunctions";
import {
  useEffect,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import { useDispatch, useSelector } from "react-redux";

type Props = {
  // tableName: string;

  setIsSchemaOpen: Dispatch<SetStateAction<boolean>>;
};
const MongoSchema = (props: Props) => {
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
  // const {
  //   table: { collection_name, sample_document },
  // } = activeTable;
  const [schema, setSchema] = useState<any>(null);
  const hasFetched = useRef<boolean>(false);

  useEffect(() => {
    const fetchColumn = async () => {
      try {
        const res = await dispatch(
          getSchema({
            userId: Number(user_id),
            tableId: table?.table_id,
          })
        );

        setSchema(res?.payload);
      } catch (error) {
        console.log(error);
      }
    };
    if (!hasFetched.current) {
      fetchColumn();
      hasFetched.current = true;
    }
  }, []);
  return (
    <div
      id="schema-modal"
      className="fixed inset-0 bg-black/50  z-50 flex items-center justify-center p-4 "
    >
      <div className="bg-base-100 rounded-xl shadow-2xl w-full max-w-4xl min-h-[85vh] max-h-[90vh] border border-border-color flex flex-col">
        {/* <!-- Modal Header --> */}
        <div className="flex items-center justify-between p-6 border-b border-border-color">
          <div className="flex items-center space-x-3">
            <i className="fa-solid fa-table text-primary text-xl"></i>
            <div>
              <h3
                className="text-xl font-bold text-white"
                id="modal-table-name"
              >
                {stringUpperCase(schema?.collection_name)}- Collection Schema
              </h3>
              <p className="text-gray-400 text-sm" id="modal-table-info">
                MongoDB Collection
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              // dispatch(resetActiveTable());
              setIsSchemaOpen(false);
            }}
            className="text-gray-400 hover:text-white cursor-pointer transition duration-200"
          >
            <i className="fa-solid fa-times text-xl"></i>
          </button>
        </div>

        {/* <!-- Modal Content --> */}
        <div className="p-2 flex-1 overflow-y-auto">
          <div id="modal-schema-content" className="space-y-4">
            <div className="bg-gray-800 px-4 rounded-lg">
              <h4 className="text-white font-semibold mb-3">
                Sample Document Structure
              </h4>
              {connectionStatus === "loading" && <Loader />}
              {connectionStatus === "failed" && (
                <div>
                  <p>{message}</p>
                </div>
              )}
              <pre className="text-gray-300 p-4 w-fit text-sm text-pretty overflow-x-hidden whitespace-pre-wrap break-words">
                {`${JSON.stringify(schema?.sample_document, null, 2)}`}
              </pre>
            </div>
            {/* <div className="mt-4 space-y-2">
              <div className="bg-gray-800 p-3 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-gray-200 font-medium">
                    Total Documents
                  </span>
                  <span className="text-primary">1743</span>
                </div>
              </div>
              <div className="bg-gray-800 p-3 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-gray-200 font-medium">
                    Average Document Size
                  </span>
                  <span className="text-primary">34 KB</span>
                </div>
              </div>
              <div className="bg-gray-800 p-3 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-gray-200 font-medium">Indexes</span>
                  <span className="text-primary">3</span>
                </div>
              </div>
            </div> */}
          </div>
        </div>

        {/* <!-- Modal Footer --> */}
        <div className="flex items-center justify-end p-3 border-t border-border-color">
          <button
            onClick={() => {
              // dispatch(resetActiveTable());
              setIsSchemaOpen(false);
            }}
            className="bg-gray-600 hover:bg-gray-500 cursor-pointer text-white px-6 py-2 rounded-lg transition duration-200"
          >
            Close
          </button>
          {/* <button className="bg-primary hover:bg-secondary text-white px-6 py-2 rounded-lg transition duration-200">
            <i className="mr-2" data-fa-i2svg="">
              <svg
                className="svg-inline--fa fa-download"
                aria-hidden="true"
                focusable="false"
                data-prefix="fas"
                data-icon="download"
                role="img"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
                data-fa-i2svg=""
              >
                <path
                  fill="currentColor"
                  d="M288 32c0-17.7-14.3-32-32-32s-32 14.3-32 32V274.7l-73.4-73.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l128 128c12.5 12.5 32.8 12.5 45.3 0l128-128c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L288 274.7V32zM64 352c-35.3 0-64 28.7-64 64v32c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V416c0-35.3-28.7-64-64-64H346.5l-45.3 45.3c-25 25-65.5 25-90.5 0L165.5 352H64zm368 56a24 24 0 1 1 0 48 24 24 0 1 1 0-48z"
                ></path>
              </svg>
            </i>
            Export Schema
          </button> */}
        </div>
      </div>
    </div>
  );
};

export default MongoSchema;
