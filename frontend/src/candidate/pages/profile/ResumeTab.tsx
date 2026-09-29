import { useState } from "react";
import { Eye, FileText, Trash2, Upload } from "lucide-react";
import toast from "react-hot-toast";
import { useUploadResume } from "../../../features/users/hooks/useUploadResume";
import { useRemoveResume } from "../../../features/users/hooks/useRemoveResume";
import { Title, cardCls, iconBtn } from "./shared";

export default function ResumeTab({ resumeUrl }: { resumeUrl: string | null }) {
  const [dragOver, setDragOver] = useState(false);
  const uploadResume = useUploadResume();
  const removeResume = useRemoveResume();

  const pick = (file?: File) => {
    if (!file) return;
    if (file.type !== "application/pdf")
      return void toast.error("Upload a PDF file");
    if (file.size > 5 * 1024 * 1024)
      return void toast.error("File must be under 5 MB");
    uploadResume.mutate(file, {
      onSuccess: () => toast.success("Resume uploaded successfully"),
      onError: () => toast.error("Failed to upload resume"),
    });
  };

  const handleRemove = () =>
    removeResume.mutate(undefined, {
      onSuccess: () => toast.success("Resume removed successfully"),
      onError: () => toast.error("Failed to remove resume"),
    });

  return (
    <div className={cardCls}>
      <Title>Resume</Title>

      {resumeUrl && (
        <div className="mb-4 flex items-center justify-between rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg)] px-3.5 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-[var(--radius-sm)] bg-[var(--primary-light)] text-[var(--primary)]">
              <FileText className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-medium text-[var(--text-primary)]">
                {resumeUrl.split("/").pop()}
              </p>
              <p className="text-xs text-[var(--text-muted)]">PDF</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={`${import.meta.env.VITE_API_BACKEND_URL}${resumeUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-xs font-medium text-[var(--text-secondary)] transition hover:border-[var(--primary)] hover:text-[var(--primary)]"
            >
              <Eye className="h-3.5 w-3.5" />
              View
            </a>
            <button
              type="button"
              aria-label="Remove resume"
              onClick={handleRemove}
              disabled={removeResume.isPending}
              className={`${iconBtn} hover:!bg-[var(--danger-bg)] hover:!text-[var(--danger)] disabled:cursor-not-allowed disabled:opacity-50`}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}

      <label
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          pick(e.dataTransfer.files?.[0]);
        }}
        className={`flex cursor-pointer flex-col items-center gap-1.5 rounded-[var(--radius-md)] border-2 border-dashed px-4 py-10 text-center transition ${
          dragOver
            ? "border-[var(--primary)] bg-[var(--primary-light)]"
            : "border-[var(--border)] bg-[var(--bg)]"
        }`}
      >
        <input
          type="file"
          accept=".pdf"
          className="hidden"
          disabled={uploadResume.isPending}
          onChange={(e) => {
            pick(e.target.files?.[0]);
            e.target.value = "";
          }}
        />
        <Upload className="h-5 w-5 text-[var(--text-muted)]" />
        <p className="text-sm text-[var(--text-secondary)]">
          {resumeUrl
            ? "Drop a new resume to replace it, or "
            : "Drop your resume here or "}
          <span className="font-medium text-[var(--primary)]">browse</span>
        </p>
        <p className="text-xs text-[var(--text-muted)]">PDF, up to 5 MB</p>
      </label>
    </div>
  );
}
