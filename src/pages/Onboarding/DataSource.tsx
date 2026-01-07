import DbCards from "@/components/DbCards";
import { dataSources } from "@/config/dataSources";

const DataSource = () => {
  return (
    <div>
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-1">
          {" "}
          Connect To Datasource
        </h1>
        <p className="text-gray-400 text-[18px]">
          Choose you preferred data source to get started
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-7">
        {dataSources.map((db, idx) => {
          return <DbCards Key={idx} {...db} />;
        })}
      </div>
      {/* <div className="bg-blue-900/50 border border-blue-800 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <i className="fa-solid fa-info-circle text-blue-400 mt-0.5"></i>
          <div className="text-sm text-blue-300">
            <p className="font-medium text-blue-200 mb-1">
              Multiple Data Sources
            </p>
            <p>
              You can connect to multiple data sources later from your dashboard
              settings.
            </p>
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default DataSource;
