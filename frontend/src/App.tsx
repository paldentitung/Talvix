import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import { Toaster } from "react-hot-toast";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";

const App = () => {
  return (
    <>
      <Toaster
        position="bottom-right"
        toastOptions={{
          success: {
            style: {
              background: "green",
            },
          },
          error: {
            style: {
              background: "red",
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
