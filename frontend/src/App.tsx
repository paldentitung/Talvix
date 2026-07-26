import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import { Toaster } from "react-hot-toast";
import LoginPage from "./features/pages/LoginPage";
import RegisterPage from "./features/pages/RegisterPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";

const App = () => {
  return (
    <>
      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "var(--card)",
            color: "var(--text-primary)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-md)",
            boxShadow: "var(--shadow-lg)",
            padding: "12px 14px",
            fontFamily: "Inter, sans-serif",
            fontSize: "14px",
            fontWeight: 500,
          },
          success: {
            iconTheme: {
              primary: "var(--success)",
              secondary: "var(--success-bg)",
            },
            style: {
              background: "var(--success-bg)",
              color: "var(--success)",
              border: "1px solid rgba(22, 163, 74, 0.2)",
            },
          },
          error: {
            iconTheme: {
              primary: "var(--danger)",
              secondary: "var(--danger-bg)",
            },
            style: {
              background: "var(--danger-bg)",
              color: "var(--danger)",
              border: "1px solid rgba(220, 38, 38, 0.2)",
            },
          },
        }}
      />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<LoginPage />} />
      </Routes>
    </>
  );
};

export default App;
