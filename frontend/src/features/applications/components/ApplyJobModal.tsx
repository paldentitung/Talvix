import { useState } from "react";
import { FileText, Upload } from "lucide-react";
import Modal from "../../../components/ui/Modal";
import Button from "../../../components/ui/Button";
type ApplyJobModalProps = {
  isOpen: boolean;
  onClose: () => void;
  jobTitle: string;
  onSubmit: (data: { coverLetter: string; resume: File }) => Promise<void>;
};

const ApplyJobModal = ({
  isOpen,
  onClose,
  jobTitle,
  onSubmit,
}: ApplyJobModalProps) => {
  const [coverLetter, setCoverLetter] = useState("");
  const [resume, setResume] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!resume) {
      return;
    }

    try {
      setIsSubmitting(true);

      await onSubmit({
        coverLetter,
        resume,
      });

      setCoverLetter("");
      setResume(null);
    } catch (error) {
      console.error("Failed to submit application:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (isSubmitting) return;

    setCoverLetter("");
    setResume(null);
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
            disabled={!resume || isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit application"}
          </Button>
        </>
      }
    >
      <form id="apply-job-form" onSubmit={handleSubmit} className="space-y-5">
        {/* Cover Letter */}
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
          <label
            htmlFor="resume"
            className="mb-2 block text-sm font-medium text-(--text-primary)"
          >
            Resume
          </label>

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

            <input
              id="resume"
              name="resume"
              type="file"
              accept=".pdf,application/pdf"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0] ?? null;
                setResume(file);
              }}
            />
          </label>
        </div>
      </form>
    </Modal>
  );
};

export default ApplyJobModal;
