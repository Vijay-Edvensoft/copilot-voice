import { authState } from "@/redux/slice/authSlice";
import {
  addChart,
  addDashboardAndChart,
  dashboardState,
  resetDashboardStatus,
} from "@/redux/slice/dashboardSlice";
import type { AppDispatch } from "@/redux/store/store";
import { getDuration } from "@/utils/reusableFunctions";
import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

type Props = {
  queryId: any;
  reference: any;

  setChartData: Dispatch<SetStateAction<any>>;
};

const AddChartToDashboard = ({
  queryId,
  reference,

  setChartData,
}: Props) => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector(authState);
  const { dashboards } = useSelector(dashboardState);
  const [isInputEnabled, setIsInPutEnabled] = useState<boolean>(false);
  const [dashBoardName, setDashBoardName] = useState<string>("");
  // const [added, setAdded] = useState(null);

  const handleAddDashboard = async () => {
    // alert(dashBoardName);
    try {
      const dashboardData = await dispatch(
        addDashboardAndChart({
          user_id: user.user_id,
          name: dashBoardName,
          chat_query_id: queryId,
        })
      ).unwrap();
      console.log(dashboardData);
      if (dashboardData) {
        setDashBoardName("");
        setChartData((prev: any) => ({
          ...prev,
          dashboard: dashboardData?.dashboard,
        }));
        setTimeout(() => {
          toast.success(dashboardData.message);
          // dispatch(resetDashboardStatus());
          reference.current.close();
        }, 500);
      }
    } catch (error: any) {
      toast.error(error);
    }
  };

  const handleAddChart = async (dashboardId: number) => {
    try {
      const dashboardData = await dispatch(
        addChart({
          user_id: user.user_id,
          dashboard_id: dashboardId,
          chat_query_id: queryId,
        })
      ).unwrap();
      console.log(dashboardData.dashboard);
      if (dashboardData) {
        setChartData((prev: any) => ({
          ...prev,
          dashboard: dashboardData?.dashboard,
        }));
        setTimeout(() => {
          toast.success(dashboardData.message);
          // dispatch(resetDashboardStatus());
          reference.current.close();
        }, 500);
      }
    } catch (error: any) {
      toast.error(error);
    }

    // setAdded(dashboardData?.dashboard);
    // if (dashboardStatus === "failed") {
    //   toast.error(dashboardMessage);
    // }
  };

  // useEffect(() => {
  //   // if (!reference.current) return;

  //   console.log(dashboardStatus, dashboardMessage);
  //   // toast.dismiss();
  //   if (dashboardStatus === "success" && dashboardMessage) {
  //     console.log("inside useeffect", dashboardMessage);

  //     setTimeout(() => {
  //       toast.success(dashboardMessage);
  //       // dispatch(resetDashboardStatus());
  //       reference.current.close();
  //     }, 500);
  //   }
  //   if (dashboardStatus === "failed" && dashboardMessage) {
  //     toast.error(dashboardMessage);
  //     // dispatch(resetDashboardStatus());
  //   }
  // }, [dashboardStatus, dashboardMessage]);

  useEffect(() => {
    return () => {
      dispatch(resetDashboardStatus());
    };
  }, []);

  // useEffect(() => {
  //   if (user.user_id) {
  //     console.log("add to dashboard mounting");
  //     dispatch(getDashboards(user?.user_id));
  //   }
  // }, []);
  // const toastConfig: ToastContainerProps = {
  //   position: "top-right",
  //   autoClose: 1000,
  //   hideProgressBar: true,
  // };

  return (
    <div>
      {/* <ToastContainer {...toastConfig} /> */}
      <div className="bg-gray-800 rounded-xl shadow-2xl w-[30vw] max-w-2xl border border-gray-700">
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center space-x-3">
            <i className="fa-solid fa-chart-pie text-blue-400 text-2xl"></i>

            <div>
              <h3 className="text-xl font-bold text-white">
                Add Chart to Dashboard
              </h3>
              <p className="text-gray-400 text-sm">
                Choose a dashboard or create a new one
              </p>
            </div>
          </div>
          <form method="dialog">
            {" "}
            <button className=" text-gray-400 hover:text-white transition duration-200 cursor-pointer">
              <i className="fa-solid fa-xmark text-xl"></i>
            </button>
          </form>
        </div>

        <div className="p-6">
          {/* <!-- Create New Dashboard --> */}
          <div className="mb-6">
            <button
              className="w-full bg-blue-600 hover:bg-blue-700 cursor-pointer text-white px-6 py-4 rounded-lg transition duration-200 flex items-center justify-center space-x-3 font-medium"
              onClick={() => setIsInPutEnabled(true)}
            >
              <i className="fa-solid fa-circle-plus text-2xl"></i>

              <span>Create New Dashboard</span>
            </button>
          </div>

          {/* <!-- New Dashboard Form --> */}
          {isInputEnabled && (
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
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 cursor-pointer py-2 rounded-lg"
                  onClick={handleAddDashboard}
                >
                  Create &amp; Add
                </button>
                <button
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 cursor-pointer text-white rounded-lg"
                  onClick={() => {
                    setDashBoardName("");
                    setIsInPutEnabled(false);
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
          {/* <!-- Existing Dashboards --> */}
          {dashboards.length > 0 ? (
            <div>
              <h4 className="text-white font-semibold mb-3">
                Select Existing Dashboard
              </h4>
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {dashboards?.map((dashboard) => {
                  return (
                    <div
                      key={dashboard.dashboard_id}
                      onClick={() => handleAddChart(dashboard.dashboard_id)}
                      className="bg-gray-900 hover:bg-gray-700 border border-gray-700 hover:border-blue-500 p-4 rounded-lg cursor-pointer transition duration-200"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <i className="fa-solid fa-chart-line text-blue-400 text-xl"></i>

                          <div>
                            <h5 className="text-white font-medium">
                              {dashboard.name}
                            </h5>
                            <p className="text-gray-400 text-sm">
                              Last updated {getDuration(dashboard.updated_at)}{" "}
                              ago
                            </p>
                          </div>
                        </div>{" "}
                        <i className="fa-solid fa-chevron-right text-gray-500 "></i>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div>
              <h2>No Dashboards available</h2>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddChartToDashboard;
