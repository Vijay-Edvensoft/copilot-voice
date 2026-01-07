import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { authState } from "@/redux/slice/authSlice";
import { createDashboard, dashboardState } from "@/redux/slice/dashboardSlice";
import type { AppDispatch } from "@/redux/store/store";
import { toast } from "react-toastify";

export interface ChartProps {
  onExport: React.Dispatch<React.SetStateAction<any>>; // correct for setState
}

const Header = () => {
  const modalRef = useRef<HTMLDialogElement>(null);
  const [dashBoardName, setDashBoardName] = useState<string>("");
  const { user } = useSelector(authState);
  const dispatch = useDispatch<AppDispatch>();
  const { activeDashboard } = useSelector(dashboardState);
  const showCreateDashboardModal = () => {
    modalRef.current?.showModal();
  };

  const handleAddDashboard = async () => {
    // alert(dashBoardName);
    try {
      const res = await dispatch(
        createDashboard({
          user_id: user.user_id,
          name: dashBoardName,
        })
      ).unwrap();
      setDashBoardName("");
      toast.success(res);
      modalRef.current?.close();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="bg-gray-800 border-b border-gray-700 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1
            id="current-dashboard-name"
            className="text-2xl font-bold text-white mb-1"
          >
            {activeDashboard?.name}
          </h1>
          {activeDashboard?.updated_at && (
            <p className="text-gray-400">
              Last updated:{" "}
              {new Date(String(activeDashboard?.updated_at)).toLocaleString()}
            </p>
          )}
        </div>
        <div className="flex items-center space-x-3">
          {/* <button
            className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
            onClick={onExport}
          >
            <i data-fa-i2svg="">
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
            <span>Export</span>
          </button>
          <button className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
            <i data-fa-i2svg="">
              <svg
                className="svg-inline--fa fa-gear"
                aria-hidden="true"
                focusable="false"
                data-prefix="fas"
                data-icon="gear"
                role="img"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
                data-fa-i2svg=""
              >
                <path
                  fill="currentColor"
                  d="M495.9 166.6c3.2 8.7 .5 18.4-6.4 24.6l-43.3 39.4c1.1 8.3 1.7 16.8 1.7 25.4s-.6 17.1-1.7 25.4l43.3 39.4c6.9 6.2 9.6 15.9 6.4 24.6c-4.4 11.9-9.7 23.3-15.8 34.3l-4.7 8.1c-6.6 11-14 21.4-22.1 31.2c-5.9 7.2-15.7 9.6-24.5 6.8l-55.7-17.7c-13.4 10.3-28.2 18.9-44 25.4l-12.5 57.1c-2 9.1-9 16.3-18.2 17.8c-13.8 2.3-28 3.5-42.5 3.5s-28.7-1.2-42.5-3.5c-9.2-1.5-16.2-8.7-18.2-17.8l-12.5-57.1c-15.8-6.5-30.6-15.1-44-25.4L83.1 425.9c-8.8 2.8-18.6 .3-24.5-6.8c-8.1-9.8-15.5-20.2-22.1-31.2l-4.7-8.1c-6.1-11-11.4-22.4-15.8-34.3c-3.2-8.7-.5-18.4 6.4-24.6l43.3-39.4C64.6 273.1 64 264.6 64 256s.6-17.1 1.7-25.4L22.4 191.2c-6.9-6.2-9.6-15.9-6.4-24.6c4.4-11.9 9.7-23.3 15.8-34.3l4.7-8.1c6.6-11 14-21.4 22.1-31.2c5.9-7.2 15.7-9.6 24.5-6.8l55.7 17.7c13.4-10.3 28.2-18.9 44-25.4l12.5-57.1c2-9.1 9-16.3 18.2-17.8C227.3 1.2 241.5 0 256 0s28.7 1.2 42.5 3.5c9.2 1.5 16.2 8.7 18.2 17.8l12.5 57.1c15.8 6.5 30.6 15.1 44 25.4l55.7-17.7c8.8-2.8 18.6-.3 24.5 6.8c8.1 9.8 15.5 20.2 22.1 31.2l4.7 8.1c6.1 11 11.4 22.4 15.8 34.3zM256 336a80 80 0 1 0 0-160 80 80 0 1 0 0 160z"
                ></path>
              </svg>
            </i>
            <span>Settings</span>
          </button> */}
          <button
            onClick={showCreateDashboardModal}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 cursor-pointer"
          >
            <i className="fa-solid fa-plus text-white"></i>

            <span>New Dashboard</span>
          </button>
        </div>
      </div>
      <dialog id="my_modal_1" className="modal" ref={modalRef}>
        <div className="modal-box">
          <div
            id="new-dashboard-form"
            className=" mb-6 bg-gray-900 p-4 rounded-lg border border-gray-700"
          >
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Dashboard Name
            </label>
            <input
              type="text"
              id="new-dashboard-name"
              value={dashBoardName}
              placeholder="e.g., Sales Analytics, Marketing Metrics"
              onChange={(e) => setDashBoardName(e.target.value)}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-3"
            />
            <div className="flex space-x-2">
              <button
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg cursor-pointer"
                onClick={handleAddDashboard}
              >
                Create
              </button>
              <button
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg"
                onClick={() => {
                  setDashBoardName("");
                  modalRef.current?.close();
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default Header;
//Show trend of total revenue (net amount) generated each month.
