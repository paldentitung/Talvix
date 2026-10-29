import { ShieldAlert } from "lucide-react";

const DetailError = ({ message }: { message: string }) => (
  <div className="flex flex-col items-center gap-2 py-16 text-center">
    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-red-50 text-(--danger)">
      <ShieldAlert size={18} />
    </span>
    <p className="text-sm font-medium text-(--danger)">{message}</p>
    <p className="text-xs text-(--text-muted)">
      Close this panel and try again.
    </p>
  </div>
);

export default DetailError;
