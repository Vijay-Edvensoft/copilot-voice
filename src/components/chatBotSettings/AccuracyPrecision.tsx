import { useSelector } from "react-redux";
import SelectableCard from "./SelectableCard";
import ToolTip from "./ToolTip";
import { settingsState } from "@/redux/slice/chatBotSettingsSlice";

const AccuracyPrecision = (props: any) => {
  const { handleChange } = props;

  const { settings, updatedSettings } = useSelector(settingsState);

  const cardsData = [
    {
      icon: "fa-comments",
      title: "Ask for Clarification",
      desc: "Chatbot will request more details when queries are unclear",
      name: "out_of_context_behavior",
      value: "ask_clarification",
      color: "green",

      // ref: divRef,
    },
    {
      icon: "fa-ban",
      title: "Refuse Ambiguous",
      desc: "Chatbot will decline to answer unclear quetions",
      name: "out_of_context_behavior",
      value: "refuse_ambiguous",
      color: "green",
      // ref: divRef,
    },
  ] as const;

  // const [settings, setSettingsForm] = useState({
  //   out_of_context_quadrail: "Ask for clarification",
  //   auto_intelligence: true,
  // });

  return (
    <div
      id="accuracy-section"
      className="bg-gray-800 rounded-lg border border-gray-700 "
    >
      <div className="bg-gradient-to-r from-green-900/50 to-gray-800 p-6 border-b border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
            <i className="fa-solid fa-bullseye text-white text-xl"></i>
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">
              Accuracy &amp; Precision
            </h3>
            <p className="text-gray-400 text-sm">
              Fine-tune how the chatbot handles ambiguous or unclear queries
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
                  Out-of-Context Guardrail
                </label>
                <ToolTip
                  icon={"fa-shield-halved text-orange-400"}
                  title={"What is Out-of-Context Guardrail?"}
                  desc={` Controls how the chatbot handles unclear or ambiguous
                          questions. "Ask for Clarification" will prompt you for
                          more details, while "Refuse Ambiguous" will decline to
                          answer unclear queries. `}
                />
              </div>
              <p className="text-gray-400 text-sm mb-3">
                How should the chatbot handle unclear or ambiguous queries?
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {cardsData.map((card) => (
              <SelectableCard {...card} handleChange={handleChange} />
            ))}
          </div>
        </div>

        <div className="border-t border-gray-700 pt-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <label className="text-white font-semibold">
                  Auto-Join Intelligence
                </label>
                <ToolTip
                  icon={"fa-link text-cyan-400"}
                  title={"What is Auto-Join Intelligence?"}
                  desc={` Automatically detects and validates relationships
                          between database tables. When enabled, the chatbot can
                          intelligently join related data across multiple tables
                          without explicit instructions. `}
                />
              </div>
              <p className="text-gray-400 text-sm">
                Automatically detect and validate relationships between tables
              </p>
            </div>
            <input
              type="checkbox"
              name="enable_auto_join"
              checked={
                updatedSettings.enable_auto_join ?? settings?.enable_auto_join
              }
              className="toggle text-white border-gray-700 outline-none bg-gray-700 checked:bg-green-600 checked:border-green-600 "
              onChange={handleChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccuracyPrecision;
