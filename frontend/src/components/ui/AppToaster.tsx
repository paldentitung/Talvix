import { Toaster } from "react-hot-toast";

const AppToaster = () => (
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
        iconTheme: { primary: "var(--danger)", secondary: "var(--danger-bg)" },
        style: {
          background: "var(--danger-bg)",
          color: "var(--danger)",
          border: "1px solid rgba(220, 38, 38, 0.2)",
        },
      },
    }}
  />
);

export default AppToaster;
