// import { useState } from "react";
import ToolTip from "./ToolTip";
import DateRangeCards from "./DateRangeCards";
// import { DayPicker, getDefaultClassNames } from "react-day-picker";
import "react-day-picker/style.css";
import { useSelector } from "react-redux";
import {
  settingsState,
  // setUpdateSettings,
} from "@/redux/slice/chatBotSettingsSlice";

const ContextAwareness = (props: any) => {
  // const divRef = React.useRef<HTMLDivElement>(null);
  const { handleChange } = props;
  const { settings, updatedSettings } = useSelector(settingsState);
  console.log(settings);
  // const [settings, setSettingsForm] = useState({
  //   context_time_window: "Always",
  //   genBi_Mode: true,
  //   auto_synonyms: false,
  // });
  // const [isCalenderEnabled, setIsCalenderEnabled] = useState<boolean>(false);
  // const getDaysCount = (from: any, to: any) => {
  //   const start = new Date(from);
  //   const end = new Date(to);

  //   // Reset time to avoid time-zone issues
  //   start.setHours(0, 0, 0, 0);
  //   end.setHours(0, 0, 0, 0);

  //   const diff =
  //     Math.abs(end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);

  //   return diff + 1; // +1 to include both start & end dates
  // };

  // const [range, setRange] = useState<any>();
  const dateRange = [
    {
      icon: "fa-infinity",
      title: "Always",
      desc: "All historical data",
      name: "context_time_window",
      value: "always",
      color: "blue",
      // setIsCustom: setIsCustom,
      // isCustom: isCustom,

      // ref: divRef,
    },
    {
      icon: "fa-calendar-week",
      title: "Last Week",
      desc: "7 days",
      name: "context_time_window",
      value: "last_week",
      color: "blue",
      // setIsCustom: setIsCustom,
      // isCustom: isCustom,
      // ref: divRef,
    },
    {
      icon: "fa-calendar-days",
      title: "Last Month",
      desc: "30 days",
      name: "context_time_window",
      value: "last_month",
      color: "blue",
      // setIsCustom: setIsCustom,
      // isCustom: isCustom,
      // ref: divRef,
    },
    {
      icon: "fa-sliders",
      title: "Custom",
      desc: "Select range",
      name: "context_time_window",
      value: "custom",
      color: "blue",
      // setIsCustom: setIsCustom,
      // isCustom: isCustom,
    },
  ] as const;

  return (
    <div
      id="context-awareness-section"
      className="bg-gray-800 rounded-lg border border-gray-700 "
    >
      <div className="bg-gradient-to-right from-blue-900/50 to-gray-800 p-6 border-b border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
            <i className="fa-solid fa-brain -white -xl"></i>
          </div>
          <div>
            <h3 className="-xl font-bold -white">
              Context Awareness &amp; Reporting
            </h3>
            <p className="-gray-400 -sm">
              Control how the chatbot understands temporal context and generates
              insights
            </p>
          </div>
        </div>
      </div>
      <div className="p-6 space-y-6">
        <div className="setting-item">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center space-x-2">
              <label className="-white font-semibold">
                Context Time Window
              </label>
              <ToolTip
                icon={"fa-chart-line -green-400"}
                title={"What is GenBI Mode?"}
                desc={`Generative Business Intelligence mode
                                automatically generates charts, graphs, and
                                visual dashboards from your queries. When
                                enabled, the chatbot will create visual
                                representations of data insights.`}
              />
            </div>
          </div>
          <p className="-gray-400 -sm mb-3">
            Select the default time period for data analysis
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {dateRange.map((range, idx) => (
              <DateRangeCards
                key={idx}
                {...range}
                handleChange={handleChange}

                // setSettingsForm={setSettingsForm}
              />
            ))}
          </div>
          {(updatedSettings.context_time_window === "custom" ||
            (settings?.context_time_window &&
              (updatedSettings.context_custom_days ??
                settings?.context_custom_days))) && (
            <div
              id="custom-date-range"
              // ref={divRef}
              className="mt-4 bg-gray-900 rounded-lg p-4 border border-gray-700"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block -sm -gray-400 mb-2">
                    Number of Days
                  </label>
                  <input
                    type="number"
                    id="custom-days"
                    name="context_custom_days"
                    min="1"
                    max="365"
                    value={
                      updatedSettings?.context_custom_days ??
                      settings?.context_custom_days ??
                      ""
                    }
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 -white rounded-lg focus:ring-2 focus:ring-blue-500"
                    onChange={(e) => {
                      handleChange(e);
                    }}
                  />
                </div>
                {/* <div className="dropdown dropdown-start cursor-pointer">
                  <label className="block -sm -gray-400 mb-2">
                    Or Select Date Range
                  </label>
                  <button
                    className="w-full cursor-pointer px-4 py-2 btn  bg-gray-800 border border-gray-700 -white rounded-lg hover:bg-gray-700 transition duration-200 flex items-center justify-center space-x-2"
                    tabIndex={0}
                  >
                    <i data-fa-i2svg="">
                      <svg
                        className="svg-inline--fa fa-calendar"
                        aria-hidden="true"
                        focusable="false"
                        data-prefix="fas"
                        data-icon="calendar"
                        role="img"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 448 512"
                        data-fa-i2svg=""
                      >
                        <path
                          fill="currentColor"
                          d="M96 32V64H48C21.5 64 0 85.5 0 112v48H448V112c0-26.5-21.5-48-48-48H352V32c0-17.7-14.3-32-32-32s-32 14.3-32 32V64H160V32c0-17.7-14.3-32-32-32S96 14.3 96 32zM448 192H0V464c0 26.5 21.5 48 48 48H400c26.5 0 48-21.5 48-48V192z"
                        ></path>
                      </svg>
                    </i>
                    <span>Pick Dates</span>
                  </button>

                  <div
                    className="dropdown-content   mt-1 bg-gray-700 -white flex  flex-col justify-center items-center w-full border border-gray-700 rounded-lg p-4 z-10"
                    tabIndex={-1}
                  >
                    <DayPicker
                      navLayout="around"
                      captionLayout="dropdown"
                      mode="range"
                      classNames={{
                        selected: `bg-blue-400  text-black rounded-full`,
                        day: `m-1 w-10 h-10 rounded-full`,
                        today: `font-bold text-blue-600`,
                        // dropdown: `bg-gray-400 cursor-pointer`,
                        // dropdown_root: `select  border-0`,
                        months_dropdown: "select select-ghost bg-gray-600 ",
                        years_dropdown: "select select-ghost bg-gray-600 ",
                        // button: `text-blue-400`,
                        chevron: ` fill-black-800`,
                      }}
                      selected={range}
                      reverseYears
                      onSelect={(selected) => {
                        setRange(selected);
                        if (selected?.from && selected?.to) {
                          setUpdateSettings({
                            context_custom_days: String(
                              getDaysCount(selected?.from, selected?.to)
                            ),
                          });
                        }
                      }}
                      footer={
                        range ? (
                          <p className="text-sm text-gray-400 text-center mt-2">
                            Number of Days: {getDaysCount(range.from, range.to)}
                          </p>
                        ) : (
                          `Pick a day to see it is in time zone.`
                        )
                      }
                    />
                  </div>
                </div> */}
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-gray-700 pt-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <label className="-white font-semibold">GenBI Mode</label>
                {/* <div className="tooltip-trigger group  relative ">
                        <i className="fa-solid fa-circle-info   -gray-400 hover:-blue-400 cursor-help"></i> */}
                <ToolTip
                  icon={"fa-chart-line text-green-400"}
                  title={"What is GenBI Mode?"}
                  desc={`Generative Business Intelligence mode
                                automatically generates charts, graphs, and
                                visual dashboards from your queries. When
                                enabled, the chatbot will create visual
                                representations of data insights.`}
                />
                {/* 
                        <div className="tooltip-content opacity-0 group-hover:opacity-100  absolute bottom-full left-[-30px] mb-2 w-80 bg-gray-900 border border-gray-700 rounded-lg shadow-xl p-4 z-50 pointer-events-none">
                          <div className="flex items-start space-x-3">
                            <i className="fa-solid fa-chart-line -green-400 mt-1"></i>
                          
                            <div>
                              <p className="-white font-medium mb-1">
                                What is GenBI Mode?
                              </p>
                              <p className="-gray-400 -sm">
                                Generative Business Intelligence mode
                                automatically generates charts, graphs, and
                                visual dashboards from your queries. When
                                enabled, the chatbot will create visual
                                representations of data insights.
                              </p>
                            </div>
                          </div>
                          <div className="absolute bottom-0 left-8 transform translate-y-full">
                            <div className="border-8 border-transparent border-t-gray-900"></div>
                          </div>
                        </div> */}
                {/* </div> */}
              </div>
              <p className="-gray-400 -sm">
                Automatically generate charts and visual insights from queries
              </p>
            </div>
            <input
              type="checkbox"
              name="enable_genbi"
              checked={updatedSettings.enable_genbi ?? settings?.enable_genbi}
              onChange={handleChange}
              className="toggle -white border-gray-700 outline-none bg-gray-700 checked:bg-blue-600 checked:border-blue-600 "
            />
          </div>
        </div>

        <div className="border-t border-gray-700 pt-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <label className="-white font-semibold">Auto-Synonyms</label>
                <ToolTip
                  icon={"fa-language text-purple-400"}
                  title={"What are Auto-Synonyms?"}
                  desc={` Enables intelligent matching of similar terms.
                                For example, "revenue", "sales", and "income"
                                will be treated as related concepts. Helps the
                                chatbot understand your intent even with
                                different terminology.`}
                />
                {/* <div className="tooltip-trigger relative">
                        <i
                          className="-gray-400 hover:-blue-400 cursor-help"
                          data-fa-i2svg=""
                        >
                          <svg
                            className="svg-inline--fa fa-circle-info"
                            aria-hidden="true"
                            focusable="false"
                            data-prefix="fas"
                            data-icon="circle-info"
                            role="img"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 512 512"
                            data-fa-i2svg=""
                          >
                            <path
                              fill="currentColor"
                              d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336h24V272H216c-13.3 0-24-10.7-24-24s10.7-24 24-24h48c13.3 0 24 10.7 24 24v88h8c13.3 0 24 10.7 24 24s-10.7 24-24 24H216c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z"
                            ></path>
                          </svg>
                        </i>
                        <div className="tooltip-content hidden absolute bottom-full left-0 mb-2 w-80 bg-gray-900 border border-gray-700 rounded-lg shadow-xl p-4 z-50">
                          <div className="flex items-start space-x-3">
                            <i
                              className="-purple-400 mt-1"
                              data-fa-i2svg=""
                            >
                              <svg
                                className="svg-inline--fa fa-language"
                                aria-hidden="true"
                                focusable="false"
                                data-prefix="fas"
                                data-icon="language"
                                role="img"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 640 512"
                                data-fa-i2svg=""
                              >
                                <path
                                  fill="currentColor"
                                  d="M0 128C0 92.7 28.7 64 64 64H256h48 16H576c35.3 0 64 28.7 64 64V384c0 35.3-28.7 64-64 64H320 304 256 64c-35.3 0-64-28.7-64-64V128zm320 0V384H576V128H320zM178.3 175.9c-3.2-7.2-10.4-11.9-18.3-11.9s-15.1 4.7-18.3 11.9l-64 144c-4.5 10.1 .1 21.9 10.2 26.4s21.9-.1 26.4-10.2l8.9-20.1h73.6l8.9 20.1c4.5 10.1 16.3 14.6 26.4 10.2s14.6-16.3 10.2-26.4l-64-144zM160 233.2L179 276H141l19-42.8zM448 164c11 0 20 9 20 20v4h44 16c11 0 20 9 20 20s-9 20-20 20h-2l-1.6 4.5c-8.9 24.4-22.4 46.6-39.6 65.4c.9 .6 1.8 1.1 2.7 1.6l18.9 11.3c9.5 5.7 12.5 18 6.9 27.4s-18 12.5-27.4 6.9l-18.9-11.3c-4.5-2.7-8.8-5.5-13.1-8.5c-10.6 7.5-21.9 14-34 19.4l-3.6 1.6c-10.1 4.5-21.9-.1-26.4-10.2s.1-21.9 10.2-26.4l3.6-1.6c6.4-2.9 12.6-6.1 18.5-9.8l-12.2-12.2c-7.8-7.8-7.8-20.5 0-28.3s20.5-7.8 28.3 0l14.6 14.6 .5 .5c12.4-13.1 22.5-28.3 29.8-45H448 376c-11 0-20-9-20-20s9-20 20-20h52v-4c0-11 9-20 20-20z"
                                ></path>
                              </svg>
                            </i>
                            <div>
                              <p className="-white font-medium mb-1">
                                What are Auto-Synonyms?
                              </p>
                              <p className="-gray-400 -sm">
                                Enables intelligent matching of similar terms.
                                For example, "revenue", "sales", and "income"
                                will be treated as related concepts. Helps the
                                chatbot understand your intent even with
                                different terminology.
                              </p>
                            </div>
                          </div>
                          <div className="absolute bottom-0 left-8 transform translate-y-full">
                            <div className="border-8 border-transparent border-t-gray-900"></div>
                          </div>
                        </div>
                      </div> */}
              </div>
              <p className="-gray-400 -sm">
                Intelligently match similar terms and concepts in queries
              </p>
            </div>
            <input
              type="checkbox"
              name="enable_auto_synonyms"
              checked={
                updatedSettings.enable_auto_synonyms ??
                settings?.enable_auto_synonyms
              }
              onChange={handleChange}
              className="toggle -white border-gray-700 outline-none bg-gray-700 checked:bg-blue-600 checked:border-blue-600 "
            />
            {/* <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      id="auto-synonyms"
                      className="sr-only peer"
                      onchange="toggleAutoSynonyms(this)"
                    />
                    <div className="w-14 h-7 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-600"></div>
                  </label> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContextAwareness;
