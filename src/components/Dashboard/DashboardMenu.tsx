import type { AppDispatch } from "@/redux/store/store";
import { useDispatch, useSelector } from "react-redux";
import {
  setActiveDashboard,
  dashboardState,
  resetMessage,
  getDashboards,
  getCharts,
  type DashboardType,
  deleteDashboard,
} from "@/redux/slice/dashboardSlice";
import { useEffect, useRef, useState } from "react";
import { authState } from "@/redux/slice/authSlice";
import Linegraph from "@/assets/ChartsSvgs/Linegraph";
import PieChart from "@/assets/ChartsSvgs/PieChart";
import Loader from "../Loader";

interface Props {
  // setIsDisplayOpen: Dispatch<SetStateAction<boolean>>;
  isOpen: boolean;
}

const DashboardMenu = (prop: Props) => {
  const { isOpen } = prop;
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector(authState);
  const {
    activeDashboard,
    dashboards,
    status: dashboardStatus,
    message,
  } = useSelector(dashboardState);
  const [selectedDashboard, setSelectedDashboard] = useState<DashboardType>();
  const [isDeleting, setIsDeleting] = useState<number | null>(null);
  const modalRef = useRef<HTMLDialogElement>(null);
  // const navigate = useNavigate();
  console.log(activeDashboard, "activeDashboard");

  const handleDelete = () => {
    setIsDeleting(Number(selectedDashboard?.dashboard_id));
    modalRef.current?.close();
    setTimeout(() => {
      dispatch(
        deleteDashboard({
          dashboard_id: selectedDashboard?.dashboard_id,
          user_id: user?.user_id,
        })
      );

      setIsDeleting(null);
    }, 500);
  };

  useEffect(() => {
    // if (dashboards.length > 0) {
    //   navigate(`/dashboard?dashboard_id=${dashboards[0]?.dashboard_id}`);
    // }
    if (user?.user_id) {
      dispatch(getDashboards(user?.user_id));
    }
  }, []);

  return (
    <div
      id="chat-history"
      className={`flex flex-col  p-4 space-y-2  overflow-y-auto overflow-x-hidden  ${
        !isOpen && "hidden"
      }`}
      style={{ scrollbarWidth: "thin" }}
    >
      <h3 className="text-sm font-semibold text-gray-400 uppercase mb-3">
        MY DASHBOARDS
      </h3>
      {dashboards?.length > 0 ? (
        dashboards?.map((dashboard, idx) => {
          const isActive =
            activeDashboard?.dashboard_id === dashboard?.dashboard_id;
          const deleting = isDeleting === dashboard?.dashboard_id;
          return (
            <div
              className={`chat-history-item group flex items-center gap-2 tooltip  p-2 rounded-lg cursor-pointer transition duration-200 ${
                deleting && "slide-out-left"
              }  ${
                isActive
                  ? "bg-[#2563eb] hover:bg-[#2563eb]"
                  : "bg-gray-700 hover:bg-gray-600"
              }  `}
              data-tip={dashboard.name}
              onClick={() => {
                dispatch(getCharts(dashboard?.dashboard_id));
                dispatch(setActiveDashboard(dashboard));
                dispatch(resetMessage());
                // navigate(`/dashboard?dashboard_id=${dashboard.dashboard_id}`);
              }}
            >
              <div className="flex items-center justify-between min-w-0">
                <div className="flex items-center min-w-0 gap-2">
                  <div className="flex items-center py-3 px-2">
                    {idx % 2 == 0 ? (
                      <Linegraph color={isActive ? "white" : "gray"} />
                    ) : (
                      <PieChart color={isActive ? "white" : "gray"} />
                    )}
                  </div>
                  <div className="flex-1 min-w-0 ">
                    <p className="text-white text-sm  font-medium truncate ">
                      {dashboard.name}
                    </p>
                    {/* <p className="text-gray text-xs  truncate mb-2">7 Charts</p> */}
                  </div>
                </div>
              </div>{" "}
              <button
                className="text-red-400 hover:text-red-300  ml-auto opacity-0 group-hover:opacity-100 cursor-pointer transition-transform duration-200"
                onClick={() => {
                  setSelectedDashboard(dashboard);
                  modalRef.current?.showModal();

                  // handleDelete([Number(chat?.query_id)]);
                }}
              >
                <i className="fa-solid fa-trash text-xs"></i>
              </button>
            </div>
          );
        })
      ) : (
        <div className="p-4 ">
          {" "}
          <p
            className={`flex justify-center items-center min-h-[60vh] max-h-screen overflow-auto text-white text-center ${
              !isOpen ? "hidden" : ""
            }`}
          >
            {dashboardStatus === "failed" ? (
              <span className="text-red-500">{message}</span>
            ) : dashboardStatus === "loading" ? (
              <Loader />
            ) : (
              "Add new dashboard"
            )}
          </p>{" "}
        </div>
      )}
      <dialog
        id="my_modal_5"
        className="modal modal-bottom sm:modal-middle"
        ref={modalRef}
      >
        <div className="bg-gray-800 rounded-xl shadow-2xl w-full max-w-md border border-gray-700">
          <div className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-red-900/30 rounded-full flex items-center justify-center">
                <i className="fa-solid fa-triangle-exclamation text-red-400 text-xl"></i>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">
                  Delete Dashboard
                </h3>
                <p className="text-gray-400 text-sm">
                  This action cannot be undone
                </p>
              </div>
            </div>
            <p className="text-gray-300 mb-6">
              Are you sure you want to delete{" "}
              <span
                id="dashboard-to-delete"
                className="text-white break-all font-semibold"
              >
                {selectedDashboard?.name}
              </span>
              ? All charts in this dashboard will be permanently removed.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => {
                  modalRef.current?.close();
                }}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition duration-200 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 bg-red-500 hover:bg-red-400 text-white px-4 py-2 rounded-lg transition duration-200 cursor-pointer"
              >
                Delete Dashboard
              </button>
            </div>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default DashboardMenu;
