import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import { Toaster } from "react-hot-toast";
import LoginPage from "./features/auth/pages/LoginPage";
import RegisterPage from "./features/auth/pages/RegisterPage";
import ForgotPasswordPage from "./features/auth/pages/ForgotPasswordPage";
import VerifyEmailPage from "./features/auth/pages/VerifyEmailPage";
import ResetPasswordPage from "./features/auth/pages/ResetPasswordPage";

import CandidateDashboardPage from "./candidate/pages/DashboardPage.tsx";
import RecruiterDashboardPage from "./recruiter/pages/DashboardPage.tsx";
import AdminDashboardPage from "./admin/DashboardPage";

import RecruiterMainLayout from "./recruiter/layouts/RecruiterLayout.tsx";
import ManageJobsPage from "./recruiter/pages/ManageJobsPage.tsx";
import CompanyProfilePage from "./recruiter/pages/CompanyProfilePage.tsx";
import SettingsPage from "./recruiter/pages/SettingsPage.tsx";
import ApplicantsPage from "./recruiter/pages/ApplicantsPage.tsx";
import AnalyticsPage from "./recruiter/pages/AnalyticsPage.tsx";
import JobDetailPage from "./recruiter/pages/JobDetailPage.tsx";
import JobsPage from "./pages/JobsPage.tsx";
import PublicLayout from "./layouts/PublicLayout.tsx";
import SavedJobs from "./candidate/pages/SavedJobs.tsx";
import CandidateLayout from "./layouts/CandidateLayout.tsx";
import CandidateJobsPage from "./candidate/pages/CandidateJobsPage.tsx";
import CandidateProfilePage from "./candidate/pages/CandidateProfilePage.tsx";
import CandidateSettingsPage from "./candidate/pages/CandidateSettingsPage.tsx";
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
        {/* Public */}
        <Route
          path="/"
          element={
            <PublicLayout>
              <HomePage />
            </PublicLayout>
          }
        />
        <Route
          path="/jobs"
          element={
            <PublicLayout>
              <JobsPage />
            </PublicLayout>
          }
        />

        {/* Auth */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/verify-email/:token" element={<VerifyEmailPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

        {/* Candidate */}
        <Route path="/candidate" element={<CandidateLayout />}>
          <Route path="dashboard" element={<CandidateDashboardPage />} />
          <Route path="saved-jobs" element={<SavedJobs />} />
          <Route path="jobs" element={<CandidateJobsPage />} />
          <Route path="profile" element={<CandidateProfilePage />} />
          <Route path="settings" element={<CandidateSettingsPage />} />
        </Route>

        {/* Recruiter */}
        <Route path="/recruiter" element={<RecruiterMainLayout />}>
          <Route path="dashboard" element={<RecruiterDashboardPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="applicants" element={<ApplicantsPage />} />
          <Route path="company" element={<CompanyProfilePage />} />
          <Route path="jobs" element={<ManageJobsPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="jobs/:jobId" element={<JobDetailPage />} />
        </Route>

        {/* Admin */}
        <Route path="/admin">
          <Route path="dashboard" element={<AdminDashboardPage />} />
        </Route>
      </Routes>
    </>
  );
};

export default App;
