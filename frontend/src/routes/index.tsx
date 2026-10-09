import { lazy, Suspense } from "react";
import { Navigate, useRoutes, type RouteObject } from "react-router-dom";
import { USER_ROLE, type UserRole } from "../shared/types/user.types";

import ProtectedRoute from "./ProtectedRoute";
import RoleRoute from "./RoleRoute";
import HomeRedirect from "./HomeRedirect";

import PublicLayout from "../layouts/PublicLayout";
import CandidateLayout from "../layouts/CandidateLayout";
import RecruiterLayout from "../layouts/RecruiterLayout";
import AdminLayout from "../layouts/AdminLayout";

import LoginPage from "../features/auth/pages/LoginPage";
import RegisterPage from "../features/auth/pages/RegisterPage";
import ForgotPasswordPage from "../features/auth/pages/ForgotPasswordPage";
import VerifyEmailPage from "../features/auth/pages/VerifyEmailPage";
import ResetPasswordPage from "../features/auth/pages/ResetPasswordPage";

// Public pages
import AboutPage from "../pages/AboutPage";
import ContactPage from "../pages/ContactPage";
import JobsPage from "../pages/JobsPage";
import JobDetailPage from "../pages/JobDetailPage";

// Role pages are lazy-loaded: a candidate never downloads admin code
const CandidateDashboardPage = lazy(
  () => import("../candidate/pages/CandidateDashboardPage"),
);
const CandidateSavedJobsPage = lazy(
  () => import("../candidate/pages/CandidateSavedJobsPage"),
);
const CandidateJobsPage = lazy(
  () => import("../candidate/pages/CandidateJobsPage"),
);
const CandidateApplicationsPage = lazy(
  () => import("../candidate/pages/CandidateApplicationsPage"),
);
const CandidateProfilePage = lazy(
  () => import("../candidate/pages/profile/CandidateProfilePage"),
);
const CandidateSettingsPage = lazy(
  () => import("../candidate/pages/settings/CandidateSettingsPage"),
);

const RecruiterDashboardPage = lazy(
  () => import("../recruiter/pages/RecruiterDashboardPage"),
);
const AnalyticsPage = lazy(() => import("../recruiter/pages/AnalyticsPage"));
const ApplicantsPage = lazy(() => import("../recruiter/pages/ApplicantsPage"));
const CompanyProfilePage = lazy(
  () => import("../recruiter/pages/CompanyProfilePage"),
);
const ManageJobsPage = lazy(() => import("../recruiter/pages/ManageJobsPage"));
const RecruiterSettingsPage = lazy(
  () => import("../recruiter/pages/RecruiterSettingsPage"),
);

const AdminDashboardPage = lazy(
  () => import("../admin/pages/AdminDashboardPage"),
);
const AdminUsersPage = lazy(() => import("../admin/pages/AdminUsersPage"));
const AdminJobsPage = lazy(() => import("../admin/pages/AdminJobsPage"));
const AdminCompaniesPage = lazy(
  () => import("../admin/pages/AdminCompaniesPage"),
);

// Wraps a layout with the auth + role guards, so each role is one call
const guarded = (
  role: UserRole,
  path: string,
  layout: React.ReactElement,
  children: RouteObject[],
): RouteObject => ({
  element: <ProtectedRoute />,
  children: [
    {
      element: <RoleRoute allowedRoles={[role]} />,
      children: [{ path, element: layout, children }],
    },
  ],
});

const routes: RouteObject[] = [
  // Public: one layout route instead of wrapping every page
  {
    element: <PublicLayout />,
    children: [
      { path: "/", element: <HomeRedirect /> },
      { path: "/about", element: <AboutPage /> },
      { path: "/contact", element: <ContactPage /> },
      { path: "/jobs", element: <JobsPage /> },
      { path: "/jobs/:jobId", element: <JobDetailPage /> },
    ],
  },

  // Auth
  { path: "/register", element: <RegisterPage /> },
  { path: "/login", element: <LoginPage /> },
  { path: "/verify-email", element: <VerifyEmailPage /> },
  { path: "/verify-email/:token", element: <VerifyEmailPage /> },
  { path: "/forgot-password", element: <ForgotPasswordPage /> },
  { path: "/reset-password/:token", element: <ResetPasswordPage /> },

  guarded(USER_ROLE.CANDIDATE, "/candidate", <CandidateLayout />, [
    { path: "dashboard", element: <CandidateDashboardPage /> },
    { path: "saved-jobs", element: <CandidateSavedJobsPage /> },
    { path: "jobs", element: <CandidateJobsPage /> },
    { path: "jobs/:jobId", element: <JobDetailPage /> },
    { path: "applications", element: <CandidateApplicationsPage /> },
    { path: "profile", element: <CandidateProfilePage /> },
    { path: "settings", element: <CandidateSettingsPage /> },
  ]),

  guarded(USER_ROLE.RECRUITER, "/recruiter", <RecruiterLayout />, [
    { path: "dashboard", element: <RecruiterDashboardPage /> },
    { path: "analytics", element: <AnalyticsPage /> },
    { path: "applicants/:id", element: <ApplicantsPage /> },
    { path: "company", element: <CompanyProfilePage /> },
    { path: "jobs", element: <ManageJobsPage /> },
    { path: "jobs/:jobId", element: <JobDetailPage /> },
    { path: "settings", element: <RecruiterSettingsPage /> },
  ]),

  guarded(USER_ROLE.ADMIN, "/admin", <AdminLayout />, [
    { path: "dashboard", element: <AdminDashboardPage /> },
    { path: "users", element: <AdminUsersPage /> },
    { path: "jobs", element: <AdminJobsPage /> },
    { path: "companies", element: <AdminCompaniesPage /> },
  ]),

  // Unknown URL: replace with a real NotFoundPage when you have one
  { path: "*", element: <Navigate to="/" replace /> },
];

export const AppRoutes = () => (
  <Suspense fallback={<div className="p-8 text-sm">Loading…</div>}>
    {useRoutes(routes)}
  </Suspense>
);
