import { useEffect, useState } from "react";
import { FileText, Upload, RefreshCw } from "lucide-react";
import Modal from "../../../components/ui/Modal";
import Button from "../../../components/ui/Button";
import { assetUrl } from "../../../shared/utils/assetUrl";

const MAX_SIZE = 5 * 1024 * 1024;

type ApplyJobModalProps = {
  isOpen: boolean;
  onClose: () => void;
  jobTitle: string;
  existingResumeUrl?: string | null; // user.resumeUrl from the profile
  onSubmit: (data: {
    coverLetter: string;
    resume?: File; // only when uploading a new one
    useProfileResume: boolean;
  }) => Promise<void>;
};

const ApplyJobModal = ({
  isOpen,
  onClose,
  jobTitle,
  existingResumeUrl,
  onSubmit,
}: ApplyJobModalProps) => {
  const [coverLetter, setCoverLetter] = useState("");
  const [resume, setResume] = useState<File | null>(null);
  const [useProfileResume, setUseProfileResume] = useState(!!existingResumeUrl);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  console.log("existingResumeUrl:", existingResumeUrl);

  // Profile may finish loading after the modal mounts, so re-sync on open/change
  useEffect(() => {
    if (isOpen) {
      setUseProfileResume(!!existingResumeUrl);
      setResume(null);
      setError("");
    }
  }, [isOpen, existingResumeUrl]);

  const hasValidResume = useProfileResume ? !!existingResumeUrl : !!resume;

  const resetForm = () => {
    setCoverLetter("");
    setResume(null);
    setError("");
    setUseProfileResume(!!existingResumeUrl);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = ""; // allow re-selecting the same file later
    if (!file) return;

    if (file.type !== "application/pdf") {
      setError("Only PDF files are allowed.");
      return;
    }
    if (file.size > MAX_SIZE) {
      setError("File must be 5MB or smaller.");
      return;
    }

    setError("");
    setResume(file);
    setUseProfileResume(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!hasValidResume) return;

    try {
      setIsSubmitting(true);
      await onSubmit({
        coverLetter,
        resume: useProfileResume ? undefined : (resume ?? undefined),
        useProfileResume,
      });
      resetForm();
    } catch (err) {
      console.error("Failed to submit application:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (isSubmitting) return;
    resetForm();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Apply for this job"
      description={jobTitle}
      maxWidth="max-w-xl"
      footer={
        <>
          <Button
            type="button"
            onClick={handleClose}
            disabled={isSubmitting}
            variant="ghost"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form="apply-job-form"
            disabled={!hasValidResume || isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit application"}
          </Button>
        </>
      }
    >
      <form id="apply-job-form" onSubmit={handleSubmit} className="space-y-5">
        {/* Cover Letter (unchanged) */}
        <div>
          <label
            htmlFor="coverLetter"
            className="mb-2 block text-sm font-medium text-(--text-primary)"
          >
            Cover letter
          </label>
          <textarea
            id="coverLetter"
            value={coverLetter}
            onChange={(e) => setCoverLetter(e.target.value)}
            placeholder="Tell the recruiter why you're interested in this position..."
            rows={7}
            className="w-full resize-none rounded-(--radius-md) border border-(--border) bg-(--bg) p-3 text-sm text-(--text-primary) outline-none placeholder:text-(--text-muted) focus:border-(--primary)"
          />
          <p className="mt-1.5 text-xs text-(--text-muted)">
            Briefly explain why you are a good fit for this position.
          </p>
        </div>

        {/* Resume */}
        <div>
          <span className="mb-2 block text-sm font-medium text-(--text-primary)">
            Resume
          </span>

          {existingResumeUrl && useProfileResume ? (
            <div className="flex items-center justify-between rounded-(--radius-md) border border-(--primary) bg-(--bg) p-4">
              <div className="flex min-w-0 items-center gap-3">
                <FileText size={28} className="shrink-0 text-(--primary)" />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-(--text-primary)">
                    Your profile resume
                  </p>
                  <a
                    href={assetUrl(existingResumeUrl) ?? "#"}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-(--primary) hover:underline"
                  >
                    View PDF
                  </a>
                </div>
              </div>

              <label
                htmlFor="resume"
                className="flex cursor-pointer items-center gap-1.5 text-xs font-medium text-(--primary) hover:underline"
              >
                <RefreshCw size={14} />
                Use a different one
              </label>
            </div>
          ) : (
            <label
              htmlFor="resume"
              className="flex cursor-pointer flex-col items-center justify-center rounded-(--radius-md) border border-dashed border-(--border) bg-(--bg) px-5 py-8 text-center hover:border-(--primary)"
            >
              {resume ? (
                <>
                  <FileText size={28} className="text-(--primary)" />
                  <p className="mt-2 text-sm font-medium text-(--text-primary)">
                    {resume.name}
                  </p>
                  <p className="mt-1 text-xs text-(--text-muted)">
                    {(resume.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </>
              ) : (
                <>
                  <Upload size={28} className="text-(--text-secondary)" />
                  <p className="mt-2 text-sm font-medium text-(--text-primary)">
                    Upload your resume
                  </p>
                  <p className="mt-1 text-xs text-(--text-muted)">
                    PDF only · Maximum 5MB
                  </p>
                </>
              )}
            </label>
          )}

          {existingResumeUrl && !useProfileResume && (
            <button
              type="button"
              onClick={() => {
                setUseProfileResume(true);
                setResume(null);
                setError("");
              }}
              className="mt-2 text-xs font-medium text-(--primary) hover:underline"
            >
              Use my profile resume instead
            </button>
          )}

          {error && <p className="mt-2 text-xs text-red-500">{error}</p>}

          <input
            id="resume"
            name="resume"
            type="file"
            accept=".pdf,application/pdf"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
      </form>
    </Modal>
  );
};

export default ApplyJobModal;
