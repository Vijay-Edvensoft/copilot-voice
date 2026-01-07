import { stringUpperCase } from "@/utils/reusableFunctions";
import { useNavigate } from "react-router-dom";

const DbCards = (props: any) => {
  const navigate = useNavigate();
  return (
    <div
      className="datasource-card bg-gray-800 hover:bg-gray-700 border-2 border-border-color hover:border-primary  py-2 rounded-xl cursor-pointer transition duration-300 transform hover:scale-105"
      onClick={() => {
        navigate("/onboarding/db-setup", {
          state: { db_type: props?.title },
        });
      }}
      //   onclick="selectDataSource('sqlserver')"
    >
      <div className="flex flex-col items-center text-center">
        <div
          className={`w-16 h-16 ${
            props.color.split(" ")[0]
          } rounded-full flex items-center justify-center mb-4`}
        >
          <i
            className={`${props.color.split(" ")[1]} text-xl`}
            data-fa-i2svg=""
          >
            <img src={props.img} alt="sql server" className="w-5 h-5 " />
          </i>
        </div>
        <h3 className="text-white font-semibold text-lg mb-2">
          {stringUpperCase(props.title)}
        </h3>
        <p className="text-gray-400 text-sm">{props.desc}</p>
      </div>
    </div>
  );
};

export default DbCards;
