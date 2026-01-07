// import type { AppDispatch } from "@/redux/store/store";

import { authState } from "@/redux/slice/authSlice";
import { dbConfigState, getDataSources } from "@/redux/slice/dbSlice";
import type { AppDispatch } from "@/redux/store/store";
import { useEffect, useState, type FormEvent } from "react";
import { useDispatch, useSelector } from "react-redux";

import { useLocation, useNavigate } from "react-router-dom";

const DataIntelligenceConfig = () => {
  const [guardrail, setguardrail] = useState("Refuse Ambiguous");

  const navigate = useNavigate();
  const location = useLocation();
  const isEditConfig = location?.state?.isEditIntelligenceConfig;

  const { dbTables } = useSelector(dbConfigState);
  const { user } = useSelector(authState);

  const dispatch = useDispatch<AppDispatch>();

  // const location = useLocation();
  // const selectedTables = location.state;
  function handleNavigate(e: FormEvent<HTMLFormElement>): void {
    e.preventDefault();
    navigate("/chat", { replace: true, state: { isEditConfig: false } });
  }

  useEffect(() => {
    dispatch(getDataSources(Number(user.user_id)));
  }, []);

  return (
    <form
      className="min-w-0 max-w-[63%] bg-[#1f2a38] my-auto flex flex-col items-center justify-center px-2 py-2 mt-5 border-2 rounded-2xl border-border-color gap-2  "
      onSubmit={handleNavigate}
    >
      <div className="bg-[#1f2a38] shadow-lg px-12 w-full max-w-6xl border-b border-border-color content-around ">
        <h1 className="text-2xl font-semibold text-white mb-2">
          Data Intelligence Configuration
        </h1>
        <p className="text-white mb-6">
          This layer helps Data Copilot understand your data context to generate
          accurate results
        </p>
      </div>
      <div className=" grid md:grid-cols-6 lg:grid-cols-2 gap-2 ">
        {/* Data Source Intelligence */}
        <div className="bg-[#1f2a38] border border-border-color rounded-xl p-5 ">
          <div className="flex justify-between">
            <div>
              <h3 className="font-semibold text-white mb-3">
                Data Source Intelligence
              </h3>
            </div>
            {/* <div className="flex gap-3">
              <span className="text-sm">Torab FRF</span>
              <span className="text-sm">SynclestedF</span>
            </div> */}
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex gap-2">
              <p className="text-white">Connected Systems :</p>
              <span>fleet_management DB</span>
            </div>

            <div className="flex justify-between  ">
              <p className="text-white">Schema Understanding</p>
              <div className="flex gap-1">
                <span className="inline-block bg-green-100 text-green-700 text-xs font-medium px-2 py-1 rounded-md mt-1">
                  {dbTables?.length} Tables Scanned
                </span>{" "}
                <span className="inline-block bg-green-100 text-green-700 text-xs font-medium px-3 py-1 rounded-md mt-1">
                  {dbTables?.filter((t) => t.is_configured).length} Tables
                  Configured
                </span>
              </div>
            </div>

            <div>
              <p className="text-white">Business Entities Detected</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {[
                  "Customers",
                  "Drivers",
                  "Trips",
                  "Invoices",
                  "Transactions",
                ].map((e) => (
                  <span
                    key={e}
                    className="px-2 py-1 bg-gray-200 text-gray-700 rounded-md text-xs font-medium"
                  >
                    {e}
                  </span>
                ))}
              </div>
            </div>

            <p className="text-xs text-white mt-3">
              Data Copilot automatically maps relationships and metadata from
              your connected systems.
            </p>
          </div>
        </div>
        {/* Context Awareness */}

        <div className="bg-[#1f2a38] border border-border-color rounded-xl p-5 ">
          <h3 className="font-semibold text-white mb-3">
            Context Awareness & Reporting
          </h3>
          <div className="space-y-4 text-sm">
            <div className="flex justify-between border-none rounded-xl">
              <p className="block text-white mb-1">Context Awareness</p>
              <div className="space-y-3">
                {/* Always Option */}
                <label className="flex items-center space-x-3">
                  <input
                    type="radio"
                    name="context"
                    value="always"
                    checked={true}
                    // onChange={(e) => setMode(e.target.value)}
                    className="text-blue-500 focus:ring-blue-500"
                  />
                  <span>Always</span>
                </label>

                {/* Set Time Option */}
                <label className="flex items-center space-x-3">
                  <input
                    type="radio"
                    name="context"
                    value="setTime"
                    // onChange={(e) => setMode(e.target.value)}
                    className="text-blue-500 focus:ring-blue-500 "
                  />
                  <span>Set Time:</span>
                  <input
                    type="number"
                    min="1"
                    // disabled={mode !== "setTime"}
                    // value={days}
                    // onChange={(e) => setDays(Number(e.target.value))}
                    className="w-20 p-1  rounded border-0  border-b-2 border-white disabled:bg-gray-600 text-white"
                  />
                  <span>Days</span>
                </label>
              </div>
            </div>

            <div className="flex justify-between">
              <label htmlFor="">GenBI mode</label>
              <input
                type="checkbox"
                checked={false}
                disabled
                className="toggle checked:text-amber-50 border-none checked:bg-primary bg-white text-primary disabled:bg-gray-600 "
              />
            </div>

            <div className="flex justify-between">
              <label htmlFor="">Auto-Synonyms</label>
              <input
                type="checkbox"
                defaultChecked
                className="toggle checked:text-amber-50 border-none checked:bg-primary bg-white text-primary "
              />
            </div>
          </div>
        </div>
        {/* Accuracy Awareness */}
        <div className="bg-[#1f2a38] border border-border-color rounded-xl p-5 md:col-span-2 lg:col-span-1">
          <h3 className="font-semibold text-white mb-3">Accuracy Awareness</h3>

          <div className="space-y-4 text-sm">
            <div>
              <p className="text-white mb-1">Out-of-Scope Guardrail</p>
              <div className="flex gap-2 ">
                {["Ask for Clarification", "Refuse Ambiguous"].map((opt) => {
                  return (
                    <label
                      htmlFor="Refuse Ambiguous"
                      key={opt}
                      className={`px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-md checked:bg-gray-600 cursor-pointer ${
                        guardrail === opt
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-blue-100 text-blue-700 border-transparent hover:bg-blue-200"
                      }`}
                      // defaultChecked
                      onClick={() => setguardrail(opt)}
                    >
                      <input
                        type="radio"
                        name="guardrail"
                        value={opt}
                        defaultChecked={guardrail === opt}
                        id=""
                        className="hidden"
                      />
                      {opt}
                    </label>
                  );
                })}
              </div>
            </div>
            {/* <button className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-md">
                  Ask for Clarification
                </button>
                <button className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-md">
                  Refuse Ambiguous
                </button> */}
            <div className="text-white flex flex-col gap-2">
              <div className="flex justify-between">
                <label htmlFor="">Auto Join intelligence</label>
                <input
                  type="checkbox"
                  defaultChecked
                  disabled
                  className="toggle checked:text-amber-50 border-none checked:bg-primary bg-white text-primary "
                />
              </div>
              {/* <div>
                <div className="flex justify-between">
                  <label htmlFor="">Model/Confidence Indicator</label>
                  <input
                    type="checkbox"
                    defaultChecked
                    className="toggle checked:text-amber-50 border-none checked:bg-primary bg-white text-primary transition-all"
                  />
                </div>
              </div> */}
              {/* <div className="flex justify-between">
                <label htmlFor="">Feedback Loop</label>
                <input
                  type="checkbox"
                  defaultChecked
                  disabled
                  className="toggle checked:text-amber-50 border-none checked:bg-primary bg-white text-primary "
                />
              </div> */}
            </div>
          </div>
        </div>
        {/* Model Understanding */}

        <div className=" border border-border-color rounded-xl p-5 ">
          <h3 className="font-semibold text-white mb-3">Model Understanding</h3>

          <div className="space-y-4 text-sm">
            <div className="flex justify-between">
              <label className="block text-white mb-1">
                Knowledge Refresh Interval
              </label>
              <select
                className="border rounded-md px-2 py-1 text-sm text-gray-950 bg-white disabled:cursor-not-allowed disabled:bg-white/10 disabled:border-none"
                defaultValue={"Daily"}
                disabled
              >
                <option value={"Daily"}>Daily</option>
                <option value={"Weekly"}>Weekly</option>
              </select>
            </div>
            <div className="text-white flex flex-col gap-2">
              <div className="flex justify-between ">
                <label htmlFor="">Language/tone</label>
                <select
                  className="border rounded-md px-2 py-1 text-sm  text-gray-950 bg-white"
                  defaultValue={"Business"}
                >
                  {["Business", "Technical", "Hybrid"].map((opt) => {
                    return (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    );
                  })}
                </select>
              </div>
              <div className="space-y-4 text-sm">
                <div>
                  <p className="text-white mb-1">Data Sources</p>
                  <div className="flex gap-2 ">
                    {["MySQL", "MongoDB", "PDF", "Doc"].map((opt) => {
                      return (
                        <label
                          key={opt}
                          htmlFor="Refuse Ambiguous"
                          className={`px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-md checked:bg-gray-600  ${
                            opt === "MySQL"
                              ? "bg-blue-600 text-white border-blue-600 cursor-pointer"
                              : "bg-blue-100 text-blue-700 border-transparent disabled"
                          }`}
                          // defaultChecked
                          onClick={() => setguardrail(opt)}
                        >
                          <input
                            type="radio"
                            name="language"
                            value={opt}
                            disabled={opt !== "MySQL"}
                            defaultChecked={opt === "MySQL"}
                            id=""
                            className="hidden"
                          />
                          {opt}
                        </label>
                      );
                    })}
                  </div>
                </div>
                {/* <button className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-md">
                  Ask for Clarification
                </button>
                <button className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-md">
                  Refuse Ambiguous
                </button> */}
                <div className="text-white flex flex-col gap-2">
                  {/* <div className="flex justify-between">
                    <label htmlFor="">Auto Join intelligence</label>
                    <input
                      type="checkbox"
                      defaultChecked
                      disabled
                      className="toggle checked:text-amber-50 border-none checked:bg-primary bg-white text-primary "
                    />
                  </div> */}
                  {/* <div>
                <div className="flex justify-between">
                  <label htmlFor="">Model/Confidence Indicator</label>
                  <input
                    type="checkbox"
                    defaultChecked
                    className="toggle checked:text-amber-50 border-none checked:bg-primary bg-white text-primary transition-all"
                  />
                </div>
              </div> */}
                  {/* <div className="flex justify-between">
                <label htmlFor="">Feedback Loop</label>
                <input
                  type="checkbox"
                  defaultChecked
                  disabled
                  className="toggle checked:text-amber-50 border-none checked:bg-primary bg-white text-primary "
                />
              </div> */}
                </div>
              </div>

              {/* <div className="flex justify-between">
                <label htmlFor="">Explainability Layer</label>
                <input
                  type="checkbox"
                  defaultChecked
                  className="toggle checked:text-amber-50 border-none checked:bg-primary bg-white text-primary"
                />
              </div> */}
            </div>

            <p className="text-xs text-white">
              Your data never leaves your environment — only metadata is
              processed securely for accuracy.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="my-5 px-10 flex justify-end w-full ">
        {/* <div className=" flex items-center gap-5 max-w-screen">
          <p className="text-sm text-white ">Learning in progress</p>

          <progress
            className="progress progress-info w-90"
            value="95"
            max="100"
          ></progress>
        </div> */}

        <button
          className="btn btn-primary py-0 flex items-center text-center gap-2"
          type="submit"
        >
          {isEditConfig ? (
            <>
              {" "}
              <span>Continue To Chat</span>
              <i className="fa-solid fa-arrow-right"></i>
            </>
          ) : (
            "Continue"
          )}
        </button>
      </div>
    </form>
  );
};

export default DataIntelligenceConfig;
