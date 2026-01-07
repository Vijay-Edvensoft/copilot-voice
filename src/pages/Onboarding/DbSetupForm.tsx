import Input from "@/components/Input";
import type { InputType } from "./AuthVerification";
import { useEffect, useState, type FormEvent } from "react";

import {
  dbConfigState,
  // dbConfigState,
  saveDbConfig,
  testDbConfig,
  type DbConfigType,
} from "@/redux/slice/dbSlice";
import { useDispatch, useSelector } from "react-redux";
import { authState } from "@/redux/slice/authSlice";
import { toast } from "react-toastify";
import { type AppDispatch } from "@/redux/store/store";
import { useLocation, useNavigate } from "react-router-dom";
import { stringUpperCase } from "@/utils/reusableFunctions";

const DbSetupForm = () => {
  const DEFAULT_PORTS: Record<string, number> = {
    mySQL: 3306,
    PostgreSQL: 5432,
    mongoDB: 27017,
    Oracle: 1521,
    "SQL Server": 1433,
    Redis: 6379,
    Snowflake: 443,
    "Amazon Redshift": 5439,
    "Google BigQuery": 443,
    "Azure SQL": 1433,
  };

  // useDispatch from redux
  const dispatch = useDispatch<AppDispatch>();
  const [isTesting, setIsTesting] = useState<boolean>(false);

  const navigate = useNavigate();

  const location = useLocation();
  const dbType = location?.state.db_type;
  // userId from Auth state
  const {
    user: { user_id },
  } = useSelector(authState);
  const { connectionStatus } = useSelector(dbConfigState);

  // const { connectionStatus, dbConfig, message } = useSelector(dbConfigState);
  const getDefaultPort = (dbType: string): number => {
    return DEFAULT_PORTS[dbType];
  };

  const initialValue: DbConfigType = {
    db_type: dbType,
    host: "",
    port: dbType ? getDefaultPort(dbType) : 0,
    db_name: "",
    username: "",
    password: "",
  };

  // FormData to save db credentials
  const [formData, setFormData] = useState<DbConfigType>(initialValue);

  const isAllInputsFilled = (): boolean => {
    return Object.entries(formData).every(([, value]) => {
      // Allow numeric values like port, only check strings
      if (typeof value === "string") {
        return value.trim() !== "";
      }
      return value !== null && value !== undefined;
    });
  };

  // change event function to set form values to the formdata
  const handleChange = (name: string, value: string): void => {
    setFormData((prev) => ({ ...prev, [name]: value.trim() }));
  };

  // DbConfig form Input form details
  const dbSetupInput: InputType[] = [
    {
      name: "display_name",
      label: "Display Name",
      type: "text",
      placeholder: "e.g., Production DB, Analytics DB",
      required: true,
      description: "A friendly name to identify this connection",
      onChange: handleChange,
      icon: "fa-solid fa-globe absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400",
      className: "md:col-span-2",
    },
    {
      name: "host",
      label: "Server / Host",
      type: "text",
      placeholder: "IP address or hostname",
      required: true,
      description: "",
      onChange: handleChange,
      icon: "fa-solid fa-globe absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400",
      className: "md:col-span-2",
    },
    {
      name: "port",
      label: "Port",
      type: "number",
      placeholder: "Enter your Port",
      required: true,
      description: "",
      onChange: handleChange,
      icon: "fa-solid fa-plug absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400",
      value: formData.port,
    },
    {
      name: "db_name",
      label: "Database Name",
      type: "text",
      placeholder: "e.g., SalesDB",
      required: true,
      description: "",
      onChange: handleChange,
      icon: "fa-solid fa-database absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400",
    },
    {
      name: "username",
      label: "Username",
      type: "text",
      placeholder: "e.g., sa",
      required: true,
      description: "",
      onChange: handleChange,
      icon: "fa-solid fa-user-shield absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400",
    },
    {
      name: "password",
      label: "Password",
      type: "password",
      placeholder: "Enter Password",
      required: true,
      description: "",
      onChange: handleChange,
      icon: "fa-solid fa-lock absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400",
    },
  ];

  const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // if (!isAllInputsFilled()) return;

    formData.user = user_id;

    try {
      const result = await dispatch(saveDbConfig(formData)).unwrap();
      toast.success(result.message || "Database connected successfully!");
      // localStorage.setItem("dbConfig", JSON.stringify(formData));
      navigate("/database-tables", {
        state: {
          isNewDbAdded: true,
          db_connection_id: result.db_connection_id,
          displayName: result.display_name,
          dbType: dbType,
        },
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.log("❌ Error:", error);

      toast.error(error || "Failed to connect to database");
    }
  };

  const testConnection = async () => {
    setIsTesting(true);
    try {
      const result = await dispatch(testDbConfig(formData)).unwrap();
      // if (result) {
      //   console.log(result);
      toast.success(result || "Database connection successful!");
      // }
    } catch (error: any) {
      console.log(error);
      toast.error(error);
    } finally {
      setIsTesting(false);
    }
  };

  useEffect(() => {
    toast.dismiss();
  }, []);

  return (
    <div className="xl:w-[40vw] 2xl:w-[32vw] sm:w-full lg:w-[60vw] ">
      <div className="text-center mb-8">
        {" "}
        <h1 className="text-3xl font-bold text-white mb-2">
          {stringUpperCase(dbType)} Connection
        </h1>
        <p className="text-gray-400">
          Configure your {stringUpperCase(dbType)} database connection
        </p>
      </div>
      <form
        id="database-form"
        className="space-y-6"
        onSubmit={handleFormSubmit}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {dbSetupInput.map((input, idx) => (
            <Input {...input} key={idx} />
          ))}
        </div>

        <div className="bg-blue-900/50 border border-blue-800 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <i className="fa-solid fa-info-circle text-blue-400 mt-0.5"></i>
            <div className="text-sm text-blue-300">
              <p className="font-medium text-blue-200 mb-1">
                Connection Security
              </p>
              <p>
                Your database credentials are encrypted and stored securely. We
                use industry-standard security protocols to protect your data.
              </p>
            </div>
          </div>
        </div>

        <div className="flex space-x-4 text-sm ">
          <button
            type="button"
            onClick={() => navigate("/onboarding/datasource")}
            className="bg-gray-600 hover:bg-gray-500 cursor-pointer text-white font-medium py-3 px-6 rounded-lg transition duration-200"
          >
            <i className="fa-solid fa-arrow-left mr-2"></i>
            Back
          </button>
          <button
            type="button"
            onClick={testConnection}
            className="flex-1 gap-3 bg-gray-600 hover:bg-gray-500 text-white font-medium py-3 px-6 rounded-lg transition duration-200 cursor-pointer  disabled:cursor-not-allowed disabled:opacity-50"
            disabled={!isAllInputsFilled() || connectionStatus === "loading"}
          >
            {connectionStatus === "loading" && isTesting ? (
              <span key="loading">
                {" "}
                <i className="text-blue-500 text-md  mb-4" data-fa-i2svg="">
                  <svg
                    className="svg-inline--fa fa-spinner fa-spin"
                    aria-hidden="true"
                    focusable="false"
                    data-prefix="fas"
                    data-icon="spinner"
                    role="img"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 512 512"
                    data-fa-i2svg=""
                  >
                    <path
                      fill="currentColor"
                      d="M304 48a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zm0 416a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zM48 304a48 48 0 1 0 0-96 48 48 0 1 0 0 96zm464-48a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zM142.9 437A48 48 0 1 0 75 369.1 48 48 0 1 0 142.9 437zm0-294.2A48 48 0 1 0 75 75a48 48 0 1 0 67.9 67.9zM369.1 437A48 48 0 1 0 437 369.1 48 48 0 1 0 369.1 437z"
                    ></path>
                  </svg>
                </i>
              </span>
            ) : (
              <span key="flask">
                {" "}
                <i className="fa-solid fa-flask mr-2"></i>
              </span>
            )}
            Test Connection
          </button>
          <button
            type="submit"
            className="flex-1 gap-3 bg-[#3B82F6] hover:bg-secondary text-white font-medium py-3 px-6 rounded-lg transition duration-200 transform hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
            disabled={!isAllInputsFilled() || connectionStatus === "loading"}
          >
            {" "}
            {connectionStatus === "loading" ? (
              <span key="loading">
                {" "}
                <i className="text-gray-600 text-md  mb-4" data-fa-i2svg="">
                  <svg
                    className="svg-inline--fa fa-spinner fa-spin"
                    aria-hidden="true"
                    focusable="false"
                    data-prefix="fas"
                    data-icon="spinner"
                    role="img"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 512 512"
                    data-fa-i2svg=""
                  >
                    <path
                      fill="currentColor"
                      d="M304 48a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zm0 416a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zM48 304a48 48 0 1 0 0-96 48 48 0 1 0 0 96zm464-48a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zM142.9 437A48 48 0 1 0 75 369.1 48 48 0 1 0 142.9 437zm0-294.2A48 48 0 1 0 75 75a48 48 0 1 0 67.9 67.9zM369.1 437A48 48 0 1 0 437 369.1 48 48 0 1 0 369.1 437z"
                    ></path>
                  </svg>
                </i>
              </span>
            ) : (
              <span key="check">
                <i className="fa-solid fa-check mr-2"></i>
              </span>
            )}
            <span> Connect Database</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default DbSetupForm;
