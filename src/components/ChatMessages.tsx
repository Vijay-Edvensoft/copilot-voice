"use client";
import { api, getErrorMessage } from "@/config/config";
import { chatState, regenerateChart } from "@/redux/slice/chatSlice";
// import type { AppDispatch } from "@/redux/store/store";
import React, {
  useEffect,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import ReactMarkdown from "react-markdown";
import { useDispatch, useSelector } from "react-redux";
// import type { VisualizationSpec } from "vega-embed";
import VegaChart from "./VegaChart";
import remarkGfm from "remark-gfm";

import AddChartToDashboard from "./AddChartToDashboard";
import ChatLoader from "./ChatLoader";
import type { AppDispatch } from "@/redux/store/store";
import { getDashboards, removeChart } from "@/redux/slice/dashboardSlice";
import { authState } from "@/redux/slice/authSlice";
import { toast } from "react-toastify";

// import type { AppDispatch } from "@/redux/store/store";

type Props = {
  // editChat?: ChatMessage | null;
  activeTab: string;
  setActiveTab: Dispatch<SetStateAction<string>>;
  chartData: any;
  setChartData: Dispatch<SetStateAction<any>>;
  // setEditChat: Dispatch<SetStateAction<ChatMessage | null>>;
};

const ChatMessages = (props: Props) => {
  const { chartData, setChartData, activeTab, setActiveTab } = props;
  const chatResponseRef = useRef<HTMLPreElement>(null);
  const [isCopied, setIsCopied] = useState(false);
  // const { status: dashboardStatus, message: dashboardMessage } =
  //   useSelector(dashboardState);

  const { user } = useSelector(authState);

  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);

  // const dispatch = useDispatch<AppDispatch>();
  const dispatch = useDispatch<AppDispatch>();
  const modalRef = useRef<HTMLDialogElement>(null);

  // const [activeTab, setActiveTab] = React.useState("answer");
  //   const [chartData, setChartData] = React.useState<any | null>(null);
  const [chartLoading, setChartLoading] = React.useState(false);
  const [chartError, setChartError] = React.useState<string>("");
  const [vegaError, setVegaError] = React.useState<string>("");
  const [embeded, setEmbeded] = React.useState<any>();
  // const [chartIcon] = React.useState(
  //   <i className="fa fa-pie-chart" aria-hidden="true"></i>
  // );
  const { status, message, activeChat } = useSelector(chatState);
  // console.log(chartError);
  const generateChartData = async () => {
    // console.log("generateChartData called", editChat, generatedMessage);
    if (chartData === null) {
      if (activeChat?.query_id) {
        setChartLoading(true);
        try {
          const response = await api.post(
            `/api/chatbot/generate-chart/${activeChat.query_id}/`
          );
          // console.log("sr", response);
          if (response.status === 200) {
            setChartError("");
            // console.log(response)
            if (response.data.chart_available) {
              console.log(
                JSON.stringify(response.data.chart_available),
                "chartData"
              );
              setChartData(response.data);
            } else if (!response.data.chart_available) {
              setChartError(response.data.message);
            }
          }
        } catch (error) {
          console.log(error);
          setChartError(getErrorMessage(error));
        } finally {
          setChartLoading(false);
        }
      }
      //  else {
      //   setChartLoading(true);
      //   try {
      //     const response = await api.post(
      //       `/api/chatbot/generate-chart/${generatedQueryId}/`
      //     );
      //     // console.log("sr", response);
      //     if (response.status === 200) {
      //       setChartError("");
      //       // console.log(response)
      //       if (response.data.chart_available) {
      //         setChartData(response.data);
      //       } else if (!response.data.chart_available) {
      //         setChartError(response.data.message);
      //       }
      //     }
      //   } catch (error) {
      //     console.log("error generate chart", error);
      //     setChartError(getErrorMessage(error));
      //   } finally {
      //     setChartLoading(false);
      //   }
      // }
    }
  };

  const handleRetryChart = async (queryId: number) => {
    setChartLoading(true);
    try {
      const res = await dispatch(regenerateChart(queryId)).unwrap();
      if (res) {
        setChartData(res.data);
        console.log(res);
      }
    } catch (error: any) {
      setChartError(error);
    }
  };

  const downloadPNG = async () => {
    if (!embeded?.view) return;
    const url = await embeded?.view.toImageURL("png");
    const a = document.createElement("a");
    a.href = url;
    a.download = "chart.png";
    a.click();
  };

  const updateMarkDownText = (text: string) => {
    return text
      .split("\\n")
      .join("\n")
      .replace(
        /(\n(?:\* |- |\d+\. ).+)(?=\n(\| |# |\*\*|> |`{3}|!\[|<))/g,
        "$1\n"
      )
      .replace(/(\|.*\|\s*\n)+(?=\S)/g, (match) => match + "\n");
    // .replace(
    //   /(\n(?:\* |- |\d+\. ).+)(?=\n(?!\* |- |\d+\.))/g,
    //   "$1\n"
    // );
  };

  const handleRemoveChart = async (dashboard: any) => {
    console.log(dashboard);
    try {
      const res = await dispatch(
        removeChart({
          user_id: user?.user_id,
          dashboard_id: dashboard?.dashboard_id,
          chart_id: dashboard?.chart_id,
        })
      ).unwrap();

      if (res) {
        console.log(res);
        toast.success(res);
        setChartData((prev: any) => ({
          ...prev,
          dashboard: null,
        }));
      }
    } catch (error: any) {
      console.log(error);
      toast.error(error);
    }
  };

  const handleCopy = async () => {
    // let timestamp: any;
    try {
      if (chatResponseRef.current) {
        const content = chatResponseRef.current;
        await navigator.clipboard.write([
          new ClipboardItem({
            "text/html": new Blob([content?.innerHTML], { type: "text/html" }),
            "text/plain": new Blob([content?.innerText], {
              type: "text/plain",
            }),
          }),
        ]);
      }
      setIsCopied(true);
      setTimeout(() => {
        setIsCopied(false);
      }, 1000);
    } catch (error: any) {
      toast.error(error);
    }
  };

  // useEffect(() => {
  //   if (dashboardStatus === "success" && dashboardMessage) {
  //     toast.success(dashboardMessage);
  //     dispatch(resetDashboardStatus());
  //   }
  //   if (dashboardStatus === "failed" && dashboardMessage) {
  //     toast.error(dashboardMessage);
  //     dispatch(resetDashboardStatus());
  //   }
  // }, [dashboardStatus, dashboardMessage, dispatch]);

  useEffect(() => {
    if (activeChat && activeTab === "chart") {
      // console.log("chart called");
      generateChartData();
    }
    return () => {
      setChartData(null);

      // dispatch(resetGeneratedMessage());
    };
  }, [activeChat]);

  useEffect(() => {
    // console.log(modalRef.current?.open);
    if (!modalRef.current?.open) {
      dispatch(getDashboards(Number(user?.user_id)));
    }
  }, [modalRef]);

  useEffect(() => {
    if (chatResponseRef.current) {
      chatResponseRef.current.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  }, [activeChat, activeTab]);

  // useEffect(() => {
  //   return () => {
  //     // dispatch(resetDashboardStatus());
  //     dispatch(resetChatStatus());
  //   };
  // }, []);

  // const toastConfig: ToastContainerProps = {
  //   position: "top-right",
  //   autoClose: 500,
  //   hideProgressBar: true,
  // };

  return (
    <div className="">
      {/* <ToastContainer {...toastConfig} /> */}
      <div className="bg-gray-800  overflow-hidden">
        <div className="flex border-b border-gray-700 rounded-t-lg bg-gray-800">
          <button
            id="answer-tab-btn"
            onClick={() => {
              setActiveTab("answer");
              setEmbeded(null);
            }}
            className={`px-6 py-4  font-medium ${
              activeTab === "answer" && "border-b-2 text-white  border-blue-500"
            }  flex items-center text-gray-400 space-x-2 cursor-pointer`}
          >
            <i className="fa-solid fa-comment-dots"></i>
            <span>Answer</span>
          </button>
          <button
            id="chart-tab-btn"
            onClick={() => {
              if (!activeChat?.query_id) {
                setActiveTab("chart");
                setChartError("No Query Id");
                return;
              }
              generateChartData();
              setActiveTab("chart");
            }}
            className={`px-6 py-4 text-gray-400 font-medium  ${
              activeTab === "chart" && "border-b-2  border-blue-500 text-white"
            }    flex items-center text-gray-400 space-x-2 cursor-pointer`}
          >
            {" "}
            <i className="fa-solid fa-chart-bar"></i>
            <span>Chart</span>
          </button>
        </div>
        {/* {embeded && activeTab === "chart" && (
          <div>
            <button
              className="text-center py-4 px-8 text-primary cursor-pointer text-xl "
              onClick={downloadPNG}
            >
              <i className="fa-solid fa-download"></i>
            </button>
          </div>
        )} */}
      </div>

      <div className="mt-0 p-4">
        {activeTab === "answer" && (
          <div id="answer-result" className="">
            <div className="space-y-4">
              <div className="bg-gray-900 ps-4 py-4 rounded-lg">
                <div className="flex items-center justify-between mb-3 px-4">
                  <h3 className="text-white font-semibold flex space-x-2 items-center">
                    {" "}
                    <i className="fa-solid fa-table text-primary"></i>
                    <span> Results</span>
                  </h3>
                  <button
                    onClick={() => {
                      handleCopy();
                    }}
                    className="text-gray-400 hover:text-white transition duration-200 flex items-center space-x-2 text-sm cursor-pointer"
                  >
                    {isCopied ? (
                      <div
                        key="copied"
                        className="flex gap-2 items-center text-green-400"
                      >
                        <i className="fa-solid fa-check"></i>
                        <span>Copied</span>
                      </div>
                    ) : (
                      <div key="copy" className="flex gap-2 items-center">
                        <i className="fa-solid fa-copy"></i>
                        <span>Copy</span>
                      </div>
                    )}
                  </button>
                </div>
                {activeTab === "answer" && (
                  <div className="px-0  min-h-auto max-h-auto">
                    {status === "loading" ? (
                      <ChatLoader activeTab={activeTab} />
                    ) : status === "failed" ? (
                      <div className="bg-gray-800 border flex border-gray-700 rounded-lg  mt-4 h-[35vh]  justify-center items-center ">
                        <pre className=" rounded-lg p-3 overflow-x-auto text-sm whitespace-pre-wrap h-full flex  font-sans">
                          <div className="flex flex-col justify-center items-center">
                            <h3 className=" text-lg text-red-600">{message}</h3>
                            {/* <button
                              className="text-2xl cursor-pointer text-primary active:text-primary/50"
                              // onClick={() => handleQuery()}
                            >
                              <i className="fa-solid fa-arrows-rotate"></i>
                            </button> */}
                          </div>
                        </pre>
                      </div>
                    ) : (
                      <div className="ps-2 pe-0  h-[35vh]">
                        <pre
                          className="bg-gray-900 rounded-lg p-2 overflow-x-auto text-sm whitespace-pre-line leading-none h-full font-sans"
                          ref={chatResponseRef}
                        >
                          {/* <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            rehypePlugins={[rehypeRaw]}
                            components={{
                              ul: ({ children }) => (
                                <ul className=" mt-0 mb-0 space-y-0  list-disc pl-4  ">
                                  {children}
                                </ul>
                              ),
                              ol: ({ children }) => (
                                <ul className=" mt-0 mb-0 list-disc pl-4 ">
                                  {children}
                                </ul>
                              ),
                              strong: ({ children }) => (
                                <strong className="font-bold ">
                                  {children}
                                </strong>
                              ),
                              li: ({ children }) => (
                                <li className="ml-5 mt-0 mb-[-10px] leading-relaxed  list-disc ">
                                  {children}
                                </li>
                              ),
                              table: ({ children }) => (
                                // <div className="overflow-x-auto  m-0 p-0 ">
                                <table className="min-w-full m-0 p-0  border border-gray-600 text-sm">
                                  {children}
                                </table>
                                // </div>
                              ),
                              th: ({ children }) => (
                                <th className="border border-gray-600 px-3 py-1 text-left bg-gray-800 font-semibold">
                                  {children}
                                </th>
                              ),
                              td: ({ children }) => (
                                <td className="border border-gray-600 px-3 py-1">
                                  {children}
                                </td>
                              ),
                              a: ({ href, children }) => (
                                <a href={href} className="text-blue-500">
                                  {children}
                                </a>
                              ),
                            }}
                          >
                            {cleanMarkDown(
                              generatedMessage || editChat?.response_text || ""
                            )}
                          </ReactMarkdown> */}
                          <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={{
                              p: ({ children }) => (
                                <p className="mb-0 mt-0 leading-relaxed  pb-0 mr-2">
                                  {children}
                                </p>
                              ),
                              ul: ({ children }) => (
                                <ul className=" mt-0 mb-2 space-y-0  list-disc pl-4  ">
                                  {children}
                                </ul>
                              ),
                              ol: ({ children }) => (
                                <ul className=" mt-0 mb-0 list-disc pl-4 ">
                                  {children}
                                </ul>
                              ),
                              strong: ({ children }) => (
                                <strong className="font-bold ">
                                  {children}
                                </strong>
                              ),
                              li: ({ children }) => (
                                <li className="ml-5 mt-0 mb-[-10px] leading-relaxed  list-disc ">
                                  {children}
                                </li>
                              ),
                              table: ({ children }) => (
                                <div className="overflow-x-auto ">
                                  <table className="min-w-full border mt-2 border-gray-600 text-sm">
                                    {children}
                                  </table>
                                </div>
                              ),
                              th: ({ children }) => (
                                <th className="border border-gray-600 px-3 py-1 text-left bg-gray-800 font-semibold">
                                  {children}
                                </th>
                              ),
                              td: ({ children }) => (
                                <td className="border border-gray-600 px-3 py-1">
                                  {children}
                                </td>
                              ),
                              a: ({ href, children }) => (
                                <a href={href} className="text-blue-500">
                                  {children}
                                </a>
                              ),
                            }}
                          >
                            {/* {cleanMarkDown(
                              generatedMessage || editChat?.response_text || ""
                            )} */}

                            {updateMarkDownText(
                              activeChat?.response_text || ""
                            )}
                          </ReactMarkdown>
                        </pre>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        {activeTab === "chart" && (
          <div className="px-3 min-h-auto max-h-auto">
            {/* <p>Your chart will be displayed here.</p> */}
            {chartLoading ? (
              <ChatLoader activeTab={activeTab} />
            ) : vegaError || chartError ? (
              <div className="bg-gray-800 border flex border-gray-700 rounded-lg  mt-4 h-[35vh]  justify-center items-center ">
                <pre className=" rounded-lg p-3 overflow-x-auto text-sm whitespace-pre-wrap h-full flex  font-sans">
                  <div className="flex flex-col justify-center items-center">
                    <h3 className=" text-lg text-red-600">
                      {chartError || vegaError}
                    </h3>
                    {!chartError && vegaError && (
                      <button
                        key="button"
                        className="text-2xl cursor-pointer text-primary active:text-primary/50"
                        onClick={() => {
                          handleRetryChart(Number(activeChat?.query_id));
                        }}
                      >
                        <i className="fa-solid fa-arrows-rotate"></i>
                      </button>
                    )}
                  </div>
                </pre>
              </div>
            ) : (
              <div className={` px-2 py-2  `}>
                {chartData?.dashboard !== null && (
                  <div
                    id="chart-dashboard-info"
                    className="mb-4 bg-green-900/30 w-full border border-green-700 rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <i className="fa-solid fa-circle-check text-green-400 text-xl"></i>
                        <div>
                          <p className="text-green-300 font-medium">
                            Added to Dashboard
                          </p>
                          <p
                            className="text-green-400 text-sm"
                            id="added-dashboard-name"
                          >
                            {chartData?.dashboard?.dashboard_name}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          handleRemoveChart(chartData?.dashboard);
                        }}
                        className="bg-red-500 hover:bg-red-400 text-white px-4 py-2 rounded-lg text-sm flex items-center space-x-2 transition duration-200 cursor-pointer"
                      >
                        <i className="fa-solid fa-xmark"></i>
                        <span>Remove from Dashboard</span>
                      </button>
                    </div>
                  </div>
                )}
                <div className="flex justify-end space-x-2 mb-4 text-sm">
                  <button
                    onClick={() => {
                      setIsFullScreen(true);
                    }}
                    className="bg-gray-700 cursor-pointer hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm flex items-center space-x-2"
                  >
                    <i className="fa-solid fa-expand"></i>

                    <span>Full Screen</span>
                  </button>
                  <button
                    onClick={downloadPNG}
                    className="bg-gray-700 cursor-pointer hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm flex items-center space-x-2"
                  >
                    {" "}
                    <i className="fa-solid fa-download"></i>
                    <span>Download</span>
                  </button>
                  <button
                    onClick={() => {
                      modalRef.current?.showModal();
                    }}
                    disabled={chartData?.dashboard !== null}
                    className="bg-blue-600 cursor-pointer hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm flex items-center space-x-2 disabled:cursor-not-allowed disabled:bg-blue-400"
                  >
                    {" "}
                    <i className="fa-solid fa-plus"></i>
                    <span>Add to Dashboard</span>
                  </button>
                </div>
                <div
                  // className='flex-1 h-full p-2 overflow-y-auto rounded-lg'
                  className={`bg-gray-900 rounded-lg text-sm whitespace-pre-wrap ${
                    isFullScreen
                      ? "fixed inset-0 z-50 h-[100vh] w-screen p-0 rounded-none"
                      : "h-[50vh]  p-2 pb-2"
                  } font-sans `}
                >
                  {/* if  Full screen is enabled */}
                  {isFullScreen && (
                    <div className="flex items-center justify-between p-0 bg-gray-900 border-b border-gray-700 px-5 py-2">
                      <h3 className="text-xl font-bold text-white">
                        Chart - Full Screen View
                      </h3>
                      <div className="flex items-center space-x-5">
                        <button
                          onClick={downloadPNG}
                          className="bg-gray-700 cursor-pointer hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm flex items-center space-x-2"
                        >
                          <i className="fa-solid fa-download"></i>

                          <span>Download</span>
                        </button>
                        <button
                          onClick={() => setIsFullScreen(false)}
                          className="text-gray-400 cursor-pointer hover:text-white transition duration-200"
                        >
                          <i className="fa-solid fa-xmark text-2xl text-gray-400"></i>
                        </button>
                      </div>
                    </div>
                  )}
                  <div
                    className={`h-full flex flex-col justify-center items-center ${
                      isFullScreen && "pb-18"
                    }`}
                  >
                    <VegaChart
                      setEmbeded={setEmbeded}
                      spec={chartData?.response}
                      // spec={{
                      //   $schema:
                      //     "https://vega.github.io/schema/vega-lite/v5.json",
                      //   data: {
                      //     values: [
                      //       {
                      //         status: "paused",
                      //         percentage: 4.0,
                      //       },
                      //       {
                      //         status: "draft",
                      //         percentage: 12.0,
                      //       },
                      //       {
                      //         status: "active",
                      //         percentage: 60.0,
                      //       },
                      //       {
                      //         status: "completed",
                      //         percentage: 24.0,
                      //       },
                      //     ],
                      //   },
                      //   title: "Percentage Distribution of Campaign Status",
                      //   mark: {
                      //     type: "arc",
                      //     outerRadius: 120,
                      //     innerRadius: 80,
                      //   },
                      //   encoding: {
                      //     theta: {
                      //       field: "percentage",
                      //       type: "quantitative",
                      //       stack: true,
                      //     },
                      //     color: {
                      //       field: "status",
                      //       type: "nominal",
                      //       title: "Campaign Status",
                      //     },
                      //     order: {
                      //       field: "percentage",
                      //       sort: "descending",
                      //     },
                      //     tooltip: [
                      //       {
                      //         field: "status",
                      //         type: "nominal",
                      //         title: "Status",
                      //       },
                      //       {
                      //         field: "percentage",
                      //         type: "quantitative",
                      //         format: ".1f",
                      //         title: "Percentage (%)",
                      //       },
                      //     ],
                      //   },
                      // }}
                      setVegaError={setVegaError}
                    />
                  </div>
                </div>
                {/* Add To Dashboard Modal */}
                <dialog
                  id="my_modal_5"
                  className="modal modal-bottom sm:modal-middle"
                  ref={modalRef}
                >
                  <AddChartToDashboard
                    queryId={Number(activeChat?.query_id)}
                    reference={modalRef}
                    setChartData={setChartData}
                  />
                </dialog>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessages;
