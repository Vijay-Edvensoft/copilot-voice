import { Navigate, Route, Routes } from "react-router-dom";
import "./index.css";
import OnboardingFlow from "./pages/Onboarding/OnboardingFlow";
import DbSetupForm from "./pages/Onboarding/DbSetupForm";
import MainLayout from "./layout/MainLayout";
import DataTables from "./pages/DataTables/DataTables";
import ChatLayout from "./layout/ChatLayout";
import ChatBot from "./pages/Chat/ChatBot";
import { ToastContainer, type ToastContainerProps } from "react-toastify";
import DataIntelligenceConfig from "./pages/DataTables/DataIntelligenceConfig";
import DataSource from "./pages/Onboarding/DataSource";
import OnboardingLayout from "./layout/OnboardingLayout";
import DashboardLayout from "./layout/DashboardLayout";
import Dashboard from "./pages/Dashboard/Dashboard";
import "react-toastify/dist/ReactToastify.css";
import ChatBotSettings from "./pages/chatBotSettings/ChatBotSettings";
import ProtectedRoute from "./layout/ProtectedRoute";

function App() {
  const toastConfig: ToastContainerProps = {
    position: "top-right",
    autoClose: 1000,
    hideProgressBar: true,
    theme: "light",
  };

  return (
    <div>
      <ToastContainer {...toastConfig} />
      <Routes>
        <Route path="/" element={<Navigate to={"/onboarding"} />} />
        <Route path="/onboarding" element={<OnboardingLayout />}>
          <Route index element={<OnboardingFlow />} />
          <Route path="datasource" element={<DataSource />} />
          <Route path="db-setup" element={<DbSetupForm />} />
        </Route>
        <Route element={<ProtectedRoute />}>
          <Route path="/database-tables" element={<MainLayout />}>
            <Route index element={<DataTables />} />{" "}
            <Route
              path="intelligence-config"
              element={<DataIntelligenceConfig />}
            />
          </Route>{" "}
          <Route path="/chat" element={<ChatLayout />}>
            <Route index element={<ChatBot />} />
          </Route>
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<Dashboard />} />
          </Route>
          <Route path="/settings" element={<ChatBotSettings />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
