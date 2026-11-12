import { useRef, useState } from "react";
import { Eye, FileText, Loader2, Trash2, Upload } from "lucide-react";
import toast from "react-hot-toast";
import { useUploadResume } from "../../../features/users/hooks/useUploadResume";
import { useRemoveResume } from "../../../features/users/hooks/useRemoveResume";
import { Title, cardCls, iconBtn } from "./shared";

const MAX_SIZE = 5 * 1024 * 1024;

export default function ResumeTab({ resumeUrl }: { resumeUrl: string | null }) {
  const [dragOver, setDragOver] = useState(false);
  const dragDepth = useRef(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const uploadResume = useUploadResume();
  const removeResume = useRemoveResume();
  const uploading = uploadResume.isPending;

  const pick = (file?: File) => {
    if (!file || uploading) return;
    if (file.type !== "application/pdf")
      return void toast.error("Upload a PDF file");
    if (file.size > MAX_SIZE)
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

  const openPicker = () => {
    if (!uploading) inputRef.current?.click();
  };

  const resetDrag = () => {
    dragDepth.current = 0;
    setDragOver(false);
  };

  const fileName = resumeUrl
    ? decodeURIComponent(resumeUrl.split("/").pop() ?? "")
    : "";

  return (
    <div className={cardCls}>
      <Title>Resume</Title>

      {resumeUrl && (
        <div className="mb-4 flex items-center gap-3 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg)] px-3.5 py-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[var(--radius-sm)] bg-[var(--primary-light)] text-[var(--primary)]">
            <FileText className="h-4 w-4" />
          </div>

          {/* min-w-0 lets the filename truncate instead of pushing buttons around */}
          <div className="min-w-0 flex-1">
            <p
              className="truncate text-sm font-medium text-[var(--text-primary)]"
              title={fileName}
            >
              {fileName}
            </p>
            <p className="text-xs text-[var(--text-muted)]">PDF</p>
          </div>

          {/* Always a row, never shrinks */}
          <div className="flex shrink-0 items-center gap-2">
            <a
              href={`${import.meta.env.VITE_API_BACKEND_URL}${resumeUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="View resume"
              className="inline-flex h-9 items-center gap-1.5 rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface)] px-2.5 text-xs font-medium text-[var(--text-secondary)] transition hover:border-[var(--primary)] hover:text-[var(--primary)] sm:px-3"
            >
              <Eye className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">View</span>
            </a>
            <button
              type="button"
              aria-label="Remove resume"
              onClick={handleRemove}
              disabled={removeResume.isPending}
              className={`${iconBtn} hover:!bg-[var(--danger-bg)] hover:!text-[var(--danger)] disabled:cursor-not-allowed disabled:opacity-50`}
            >
              {removeResume.isPending ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Trash2 className="h-3.5 w-3.5" />
              )}
            </button>
          </div>
        </div>
      )}

      <div
        role="button"
        tabIndex={0}
        aria-disabled={uploading}
        onClick={openPicker}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            openPicker();
          }
        }}
        onDragEnter={(e) => {
          e.preventDefault();
          dragDepth.current += 1;
          setDragOver(true);
        }}
        onDragOver={(e) => e.preventDefault()}
        onDragLeave={() => {
          dragDepth.current -= 1;
          if (dragDepth.current <= 0) resetDrag();
        }}
        onDrop={(e) => {
          e.preventDefault();
          resetDrag();
          pick(e.dataTransfer.files?.[0]);
        }}
        className={`flex cursor-pointer flex-col items-center gap-1.5 rounded-[var(--radius-md)] border-2 border-dashed px-4 py-8 text-center transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary)] sm:py-10 ${
          dragOver
            ? "border-[var(--primary)] bg-[var(--primary-light)]"
            : "border-[var(--border)] bg-[var(--bg)]"
        } ${uploading ? "pointer-events-none opacity-60" : ""}`}
      >
        {uploading ? (
          <Loader2 className="h-5 w-5 animate-spin text-[var(--primary)]" />
        ) : (
          <Upload className="h-5 w-5 text-[var(--text-muted)]" />
        )}
        <p className="text-sm text-[var(--text-secondary)]">
          {uploading ? (
            "Uploading..."
          ) : (
            <>
              {resumeUrl
                ? "Drop a new resume to replace it, or "
                : "Drop your resume here or "}
              <span className="font-medium text-[var(--primary)]">browse</span>
            </>
          )}
        </p>
        <p className="text-xs text-[var(--text-muted)]">PDF, up to 5 MB</p>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="application/pdf,.pdf"
        className="hidden"
        onChange={(e) => {
          pick(e.target.files?.[0]);
          e.target.value = "";
        }}
      />
    </div>
  );
}
