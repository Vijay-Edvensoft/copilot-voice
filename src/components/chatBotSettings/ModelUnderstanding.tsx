import DateRangeCards from "./DateRangeCards";
import ToolTip from "./ToolTip";
import SelectableCard from "./SelectableCard";
// import { useSelector } from "react-redux";
// import { settingsState } from "@/redux/slice/chatBotSettingsSlice";

const ModelUnderstanding = (props: any) => {
  const { handleChange } = props;
  // const { settings } = useSelector(settingsState);
  const rangeData = [
    {
      icon: "fa-bolt",
      title: "Real-time",
      desc: "Instant updates",
      name: "knowledge_refresh_interval",
      value: "realtime",
      color: "purple",
    },
    {
      icon: "fa-clock",
      title: "Hourly",
      desc: "Every hour",
      name: "knowledge_refresh_interval",
      value: "hourly",
      color: "purple",
    },
    {
      icon: "fa-calendar-day",
      title: "Daily",
      desc: "Once per day",
      name: "knowledge_refresh_interval",
      value: "daily",
      color: "purple",
    },
    {
      icon: "fa-calendar-week",
      title: "Weekly",
      desc: "Once per week",
      name: "knowledge_refresh_interval",
      value: "weekly",
      color: "purple",
    },
  ] as const;

  const responseData = [
    {
      icon: "fa-briefcase",
      title: "Business",
      desc: "Professional, executive-friendly language with business context",
      name: "response_tone",
      value: "business",
      color: "purple",
    },
    {
      icon: "fa-code",
      title: "Technical",
      desc: "Detailed with SQL queries, metrics, and technical explanations",
      name: "response_tone",
      value: "technical",
      color: "purple",
    },
    {
      icon: "fa-comment-smile",
      title: "Casual",
      desc: "Conversational and easy to understand for all users",
      name: "response_tone",
      value: "casual",
      color: "purple",
    },
    {
      icon: "fa-compress",
      title: "Concise",
      desc: "Brief, direct answers with minimal explanation",
      name: "response_tone",
      value: "concise",
      color: "purple",
    },
  ] as const;

  // const [settings, setSettingsForm] = useState({
  //   knowledge_refresh_interval: "Real-time",
  //   response_language_tone: "Business",
  // });

  return (
    <div
      id="model-understanding-section"
      className="bg-gray-800 rounded-lg border border-gray-700 "
    >
      <div className="bg-gradient-to-r from-purple-900/50 to-gray-800 p-6 border-b border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center">
            <i className="text-white text-xl" data-fa-i2svg="">
              <svg
                className="svg-inline--fa fa-robot"
                aria-hidden="true"
                focusable="false"
                data-prefix="fas"
                data-icon="robot"
                role="img"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 640 512"
                data-fa-i2svg=""
              >
                <path
                  fill="currentColor"
                  d="M320 0c17.7 0 32 14.3 32 32V96H472c39.8 0 72 32.2 72 72V440c0 39.8-32.2 72-72 72H168c-39.8 0-72-32.2-72-72V168c0-39.8 32.2-72 72-72H288V32c0-17.7 14.3-32 32-32zM208 384c-8.8 0-16 7.2-16 16s7.2 16 16 16h32c8.8 0 16-7.2 16-16s-7.2-16-16-16H208zm96 0c-8.8 0-16 7.2-16 16s7.2 16 16 16h32c8.8 0 16-7.2 16-16s-7.2-16-16-16H304zm96 0c-8.8 0-16 7.2-16 16s7.2 16 16 16h32c8.8 0 16-7.2 16-16s-7.2-16-16-16H400zM264 256a40 40 0 1 0 -80 0 40 40 0 1 0 80 0zm152 40a40 40 0 1 0 0-80 40 40 0 1 0 0 80zM48 224H64V416H48c-26.5 0-48-21.5-48-48V272c0-26.5 21.5-48 48-48zm544 0c26.5 0 48 21.5 48 48v96c0 26.5-21.5 48-48 48H576V224h16z"
                ></path>
              </svg>
            </i>
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">
              Model Understanding
            </h3>
            <p className="text-gray-400 text-sm">
              Configure how the AI model learns and communicates
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        <div className="setting-item">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <label className="text-white font-semibold">
                  Knowledge Refresh Interval
                </label>
                <ToolTip
                  icon={"text-yellow-400 fa-rotate"}
                  title={"What is Knowledge Refresh?"}
                  desc={` Determines how often the chatbot updates its
                          understanding of your database schema, relationships,
                          and data patterns. More frequent refreshes ensure
                          accuracy with rapidly changing data.`}
                />
              </div>
              <p className="text-gray-400 text-sm mb-3">
                How often should the model refresh its database knowledge?
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {rangeData.map((range) => (
              <DateRangeCards
                {...range}
                // settings={settings}
                handleChange={handleChange}
              />
            ))}
          </div>
        </div>

        <div className="border-t border-gray-700 pt-6">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <label className="text-white font-semibold">
                  Response Language &amp; Tone
                </label>{" "}
                <ToolTip
                  icon={"text-pink-400 fa-comment-dots"}
                  title={"What is Response Tone?"}
                  desc={` Determines the style and complexity of chatbot
                          responses. Business tone is formal and
                          executive-friendly, Technical is detailed with SQL and
                          metrics, Casual is conversational, and Concise
                          provides brief, direct answers.`}
                />
              </div>
              <p className="text-gray-400 text-sm mb-3">
                Choose the style and complexity of responses
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {responseData.map((response) => (
              <SelectableCard
                {...response}
                handleChange={handleChange}
                // setSettingsForm={setSettingsForm}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModelUnderstanding;
