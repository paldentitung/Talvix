import DeleteAccountCard from "../../../shared/components/DeleteAccountCard";

export default function DangerTab() {
  return (
    <DeleteAccountCard
      consequences="your profile, job postings, and applicant data"
      onDelete={() => {
        // deleteAccount();
      }}
    />
  );
}
