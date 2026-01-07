import React, { useEffect, useRef, useState } from "react";
// import { dummy } from "@/pages/Dashboard/dummy";
import { useDispatch, useSelector } from "react-redux";
import { dashboardState, removeChart } from "@/redux/slice/dashboardSlice";
import { authState } from "@/redux/slice/authSlice";
import type { AppDispatch } from "@/redux/store/store";
import VegaChart from "../VegaChart";
import { toast } from "react-toastify";
import { useSearchParams } from "react-router-dom";

interface ChartProps {
  setChartData: React.Dispatch<React.SetStateAction<any>>;
  // correct for setState
}

const Cards = ({ setChartData }: ChartProps) => {
  const { charts, status, message } = useSelector(dashboardState);
  const [param] = useSearchParams();
  console.log(param.get("dashboard_id"));
  // const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector(authState);
  const [embeded, setEmbeded] = useState<any>();
  // const [chartError, setChartError] = useState<any>();

  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);
  const [selectedChart, setSelectedChart] = useState<any>();
  // console.log(chartError);
  const modalRef = useRef<HTMLDialogElement>(null);
  // const toggleMenu = () => {
  //   setMenuOpen((prev) => !prev);
  // };
  const handleDelete = async (chart: any) => {
    // e.stopPropagation();
    console.log(chart, "check-chart");
    try {
      const { id, dashboard_id } = chart;
      console.log(chart);
      const res = await dispatch(
        removeChart({
          user_id: user.user_id,
          dashboard_id,
          chart_id: id,
        })
      ).unwrap();
      toast.success(res);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleDownload = async (title: string) => {
    if (!embeded?.view) return;
    const url = await embeded?.view.toImageURL("png");
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title.split(" ").join("_")}.png`;
    a.click();
  };
  // const toastConfig: ToastContainerProps = {
  //   position: "top-right",
  //   autoClose: 1000,
  //   hideProgressBar: true,
  // };
  useEffect(() => {
    if (status === "success" && modalRef.current) {
      modalRef.current?.close();
    }
    if (status === "failed" && message) {
      toast.error(message);
    }
  }, [status, message]);

  return (
    <>
      {charts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-4 p-6 pb-1    bg-gray-900   w-full ">
          {charts?.map(
            (chart: any, index: number) =>
              chart?.chat_query?.vega_spec !== null && (
                <div
                  key={index}
                  className="bg-[#1B2330] border border-[#273247] group rounded-xl shadow-md p-0 flex flex-col gap-1 hover:shadow-lg transition h-fit hover:border-blue-500"
                  // onMouseOver={() =>
                  //   navigate(
                  //     `?dashboard_id=${chart.dashboard_id}&chart_id=${chart?.id}`
                  //   )
                  // }
                  // onMouseLeave={() =>
                  //   navigate(`?dashboard_id=${chart.dashboard_id}`)
                  // }
                >
                  {/* Header */}
                  <div className="flex justify-between items-center gap-3 min-h-12.5 max-h-15 border-b border-b-[#273247] px-3 py-auto ">
                    <h3 className="text-white font-semibold flex items-center w-[96%]">
                      <i className="fa-solid fa-chart-bar text-blue-400 mr-2"></i>

                      {chart?.chat_query?.vega_spec?.title}
                    </h3>

                    <div className="flex space-x-3 text-md opacity-0 group-hover:opacity-100 transition-all duration-200 ease-in-out">
                      {" "}
                      <button
                        className="text-gray-400 hover:text-white  cursor-pointer transition duration-200"
                        // onClick={toggleMenu}
                        onClick={(e) => {
                          e.stopPropagation();
                          console.log(chart.chat_query.query_id);
                          setIsFullScreen(true);
                          setSelectedChart(chart);
                        }}
                      >
                        <i className="fa-solid fa-expand "></i>
                      </button>
                      <button
                        className="text-gray-400 hover:text-white  cursor-pointer transition duration-200"
                        onClick={() =>
                          handleDownload(chart?.chat_query?.vega_spec?.title)
                        }
                      >
                        <i className="fa-solid fa-download "></i>
                      </button>
                      <button
                        className="text-red-400 hover:text-red-300 cursor-pointer hover:bg-red-900/20 transition duration-200"
                        onClick={() => {
                          console.log(chart);
                          setSelectedChart(chart);

                          modalRef.current?.show();
                        }}
                      >
                        <i className="fa-solid fa-trash "></i>
                      </button>
                    </div>
                  </div>

                  {/* Chart container */}
                  <div
                    className={`   ${
                      isFullScreen &&
                      chart.chat_query.query_id ===
                        selectedChart?.chat_query?.query_id
                        ? "fixed inset-0 z-50 h-[100%] w-screen pb-20 rounded-none bg-gray-900/90 "
                        : " w-full h-70 flex justify-center items-center rounded-md pb-2 cursor-pointer "
                    }`}
                  >
                    {" "}
                    {isFullScreen && (
                      <div className="flex items-center justify-between p-0 bg-gray-900 border-b border-gray-700 px-5 py-2">
                        <h3 className="text-xl font-bold text-white">
                          Chart - Full Screen View
                        </h3>
                        <div className="flex items-center space-x-5">
                          <button
                            onClick={() =>
                              handleDownload(
                                chart?.chat_query?.vega_spec?.title
                              )
                            }
                            className="bg-gray-700 cursor-pointer hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm flex items-center space-x-2"
                          >
                            <i className="fa-solid fa-download"></i>

                            <span>Download</span>
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setIsFullScreen(false);
                              setChartData(0);

                              //   setSelectedChart(null);
                            }}
                            className="text-gray-400 cursor-pointer hover:text-white transition duration-200"
                          >
                            <i className="fa-solid fa-xmark text-2xl text-gray-400"></i>
                          </button>
                        </div>
                      </div>
                    )}
                    <VegaChart
                      spec={chart.chat_query.vega_spec}
                      setEmbeded={setEmbeded}
                      //   width={260} // fits card
                      //   height={150}
                    />
                  </div>
                </div>
              )
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
                      Remove Chart
                    </h3>
                    <p className="text-gray-400 text-sm">
                      Remove from dashboard
                    </p>
                  </div>
                </div>
                <p className="text-gray-300 mb-6">
                  Are you sure you want to remove{" "}
                  <span
                    id="chart-to-delete"
                    className="text-white font-semibold"
                  >
                    {selectedChart?.chat_query?.vega_spec?.title}
                  </span>{" "}
                  from this dashboard?
                </p>
                <div className="flex space-x-3">
                  <button
                    onClick={() => {
                      // setSelectedChart(null);
                      modalRef.current?.close();
                    }}
                    className="flex-1 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition duration-200 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleDelete(selectedChart)}
                    className="flex-1 bg-red-500 hover:bg-red-400 text-white px-4 py-2 rounded-lg transition duration-200 cursor-pointer"
                  >
                    Remove Chart
                  </button>
                </div>
              </div>
            </div>
          </dialog>
        </div>
      ) : (
        <div className="w-[100%] h-100 flex flex-1 items-center justify-center">
          <p className=" text-2xl text-center">{"No Charts available"}</p>
        </div>
      )}
    </>
  );
};

export default Cards;
//  status === "failed" ? (
//         <div className="w-[100%] h-100 flex flex-1 items-center justify-center">
//           <p className=" text-2xl text-center">{message}</p>
//         </div>
//       )
