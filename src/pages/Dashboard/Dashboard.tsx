import { useEffect, useState } from "react";
import SideBar from "@/components/SideBar";
import { resetDashboardStatus } from "@/redux/slice/dashboardSlice";
import Header from "../../components/Dashboard/Header";
import Cards from "../../components/Dashboard/Cards";
import { useDispatch } from "react-redux";
import { resetDbMessage } from "@/redux/slice/dbSlice";

// import VegaChart from "@/components/VegaChart";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("");
  const [chartData, setChartData] = useState();

  const [query, setQuery] = useState("");
  const dispatch = useDispatch();
  // const { dashboards } = useSelector(dashboardState);
  // const [chartError, setChartError] = React.useState<string>("");
  // const [embeded, setEmbeded] = useState<any>();
  // const navigate = useNavigate();
  console.log(chartData, "chartData");
  // console.log(chartError, "chartError");

  // console.log(displayOpen, "displayOpen");
  console.log(query);

  // const onExport = async () => {
  //   if (!embeded?.view) return;
  //   const url = await embeded?.view.toImageURL("png");
  //   downloadurl(url);
  // };

  useEffect(() => {
    return () => {
      dispatch(resetDashboardStatus());
      dispatch(resetDbMessage());
    };
  }, []);

  return (
    <div
      id="converse-page"
      className=" min-h-screen max-h-[100] bg-base-100 flex w-full text-sm"
    >
      <SideBar
        setActiveTab={setActiveTab}
        activeTab={activeTab}
        setChartData={setChartData}
        setQuery={setQuery}
        routeName="dashboard"
      />

      <div id="chat-main" className=" flex flex-col flex-1 w-[90vw] max-h-auto">
        <Header />
        <div className="min-h-[calc(100vh-80px)] overflow-y-auto bg-gray-900 pb-10   scrollbar-width flex flex-1 mx-0 flex-col ">
          <Cards setChartData={setChartData} />

          {/* {chartData ? (
            <div className="w-[100%] pl-4 absolute bottom-[15%]">
              <button
                onClick={() => {
                  setChartData(undefined);
                }}
                className="btn"
              >
                {" "}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                >
                  <g fill="none">
                    <path d="M24 0v24H0V0zM12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.019-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z" />
                    <path
                      fill="white"
                      d="M3.283 10.94a1.5 1.5 0 0 0 0 2.12l5.656 5.658a1.5 1.5 0 1 0 2.122-2.122L7.965 13.5H19.5a1.5 1.5 0 0 0 0-3H7.965l3.096-3.096a1.5 1.5 0 1 0-2.122-2.121z"
                    />
                  </g>
                </svg>{" "}
                back
              </button>
            </div>
          ) : (
            <></>
          )} */}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
