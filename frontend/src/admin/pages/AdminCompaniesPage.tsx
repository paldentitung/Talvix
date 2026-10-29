import { useMemo, useState } from "react";
import {
  Search,
  Building2,
  ChevronDown,
  ExternalLink,
  Ban,
  RotateCcw,
} from "lucide-react";
import { useCompanies } from "../../features/company/hooks/useCompanies";
import Pagination from "../../shared/components/Pagination";
import type { CompanyListItem } from "../../features/company/types/company.types";
import relativeTime from "../../shared/utils/relativeTime";
import VerifiedBadge from "../../features/company/components/VerifiedBadge";
import { tintFor } from "../../shared/utils/avatarTint";
import RowMenu from "../../shared/components/RowMenu";
import BottomSheet from "../../components/ui/BottomSheet";
import CompanyDetailView from "../../features/users/components/CompanyDetailView";
import Modal from "../../components/ui/Modal";
import toast from "react-hot-toast";
import { useUpdateUserStatus } from "../../features/users/hooks/useUpdateUserStatus";
import StatusBadge from "../../features/company/components/StatusBadge";
const FILTERS = ["All", "Verified", "Unverified"] as const;
type Filter = (typeof FILTERS)[number];

const AdminCompaniesPage = () => {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("All");
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const limit = 10;
  const [viewId, setViewId] = useState<string | null>(null);

  const { data, isLoading, isError } = useCompanies(page, limit, query);

  const companies: CompanyListItem[] = data?.data.companies ?? [];
  const total = data?.data.total ?? 0;
  const totalPages = data?.data.totalPages ?? 1;

  const updateStatus = useUpdateUserStatus();
  const [statusTarget, setStatusTarget] = useState<CompanyListItem | null>(
    null,
  );

  const confirmStatusChange = async () => {
    if (!statusTarget) return;
    const next = statusTarget.status === "SUSPENDED" ? "ACTIVE" : "SUSPENDED";
    try {
      await updateStatus.mutateAsync({ userId: statusTarget.id, status: next });
      toast.success(
        next === "SUSPENDED" ? "Company suspended" : "Company reactivated",
      );
      setStatusTarget(null);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to update status");
    }
  };

  const filtered = useMemo(() => {
    return companies.filter((c) => {
      if (filter === "Verified") return c.isVerified;
      if (filter === "Unverified") return !c.isVerified;
      return true;
    });
  }, [companies, filter]);

  return (
    <div onClick={() => openMenuId && setOpenMenuId(null)}>
      {/* Card */}
      <div
        className="overflow-hidden rounded-2xl border"
        style={{
          background: "var(--card)",
          borderColor: "var(--border)",
          boxShadow: "var(--shadow-md)",
        }}
      >
        {/* Toolbar */}
        <div
          className="flex flex-wrap items-center justify-between gap-3 border-b p-5"
          style={{ borderColor: "var(--border)" }}
        >
          <div className="relative w-full max-w-xs">
            <Search
              size={16}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2"
              style={{ color: "var(--text-muted)" }}
            />
            <input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              placeholder="Search companies..."
              className="w-full rounded-full border py-2.5 pl-10 pr-4 text-sm outline-none transition-shadow focus:ring-2"
              style={{
                borderColor: "var(--border)",
                background: "var(--bg)",
                color: "var(--text-primary)",
              }}
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {FILTERS.map((f) => {
              const active = filter === f;
              return (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className="rounded-full px-4 py-1.5 text-sm font-medium transition-colors"
                  style={
                    active
                      ? { background: "var(--primary)", color: "#fff" }
                      : {
                          background: "var(--bg)",
                          color: "var(--text-secondary)",
                        }
                  }
                >
                  {f}
                </button>
              );
            })}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] border-collapse text-left">
            <thead>
              <tr
                className="text-xs font-semibold uppercase tracking-wide"
                style={{ color: "var(--text-muted)" }}
              >
                <th className="px-6 py-3.5 font-semibold">Company</th>
                <th className="px-6 py-3.5 font-semibold">Open jobs</th>
                <th className="px-6 py-3.5 font-semibold">Verified</th>
                <th className="px-6 py-3.5 font-semibold">Status</th>
                <th className="px-6 py-3.5 font-semibold">
                  <span className="inline-flex items-center gap-1">
                    Joined
                    <ChevronDown size={12} />
                  </span>
                </th>
                <th className="px-6 py-3.5" />
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-16 text-center text-sm"
                    style={{ color: "var(--text-muted)" }}
                  >
                    Loading companies…
                  </td>
                </tr>
              )}

              {isError && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-16 text-center text-sm"
                    style={{ color: "var(--danger)" }}
                  >
                    Failed to load companies.
                  </td>
                </tr>
              )}

              {!isLoading &&
                !isError &&
                filtered.map((c) => {
                  const name =
                    c.companyName ?? `${c.firstName} ${c.lastName}`.trim();
                  const tint = tintFor(name);
                  return (
                    <tr
                      key={c.id}
                      className="border-t transition-colors hover:bg-slate-50/70"
                      style={{ borderColor: "var(--border)" }}
                    >
                      <td className="px-6 py-3.5">
                        <div className="flex items-center gap-3">
                          {c.companyLogo ? (
                            <img
                              src={c.companyLogo}
                              alt=""
                              className="h-9 w-9 shrink-0 rounded-full object-cover"
                            />
                          ) : (
                            <div
                              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
                              style={{ background: tint.bg, color: tint.fg }}
                            >
                              <Building2 size={16} />
                            </div>
                          )}
                          <div className="min-w-0">
                            <p
                              className="truncate text-sm font-semibold"
                              style={{ color: "var(--text-primary)" }}
                            >
                              {name}
                            </p>
                            {c.companyWebsite && (
                              <a
                                href={c.companyWebsite}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 truncate text-xs hover:underline"
                                style={{ color: "var(--text-muted)" }}
                                onClick={(e) => e.stopPropagation()}
                              >
                                {c.companyWebsite.replace(/^https?:\/\//, "")}
                                <ExternalLink size={10} />
                              </a>
                            )}
                          </div>
                        </div>
                      </td>
                      <td
                        className="px-6 py-3.5 text-sm"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {c._count.jobs}
                      </td>
                      <td className="px-6 py-3.5">
                        <VerifiedBadge verified={c.isVerified} />
                      </td>
                      <td className="px-6 py-3.5">
                        <StatusBadge status={c.status} />
                      </td>
                      <td
                        className="px-6 py-3.5 text-sm"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        {relativeTime(c.createdAt)}
                      </td>
                      <td
                        className="px-6 py-3.5 text-right"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setViewId(c.id)}
                            className="rounded-full border border-(--border) bg-(--card) px-3.5 py-1.5 text-xs font-semibold text-(--text-secondary) transition-colors hover:border-(--primary) hover:text-(--primary)"
                          >
                            View
                          </button>
                          <RowMenu
                            id={c.id}
                            open={openMenuId === c.id}
                            onToggle={setOpenMenuId}
                            items={[
                              c.status === "SUSPENDED"
                                ? {
                                    label: "Reactivate",
                                    onClick: () => setStatusTarget(c),
                                    tone: "success",
                                    icon: RotateCcw,
                                  }
                                : {
                                    label: "Suspend company",
                                    onClick: () => setStatusTarget(c),
                                    tone: "danger",
                                    icon: Ban,
                                  },
                            ]}
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })}

              {!isLoading && !isError && filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center">
                    <p
                      className="text-sm font-medium"
                      style={{ color: "var(--text-primary)" }}
                    >
                      No companies match your search
                    </p>
                    <p
                      className="mt-1 text-sm"
                      style={{ color: "var(--text-muted)" }}
                    >
                      Try a different name or filter.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
          total={total}
          itemLabel="companies"
          isFetching={isLoading}
        />

        <BottomSheet
          isOpen={!!viewId}
          onClose={() => setViewId(null)}
          title="Company details"
        >
          {viewId && <CompanyDetailView id={viewId} />}
        </BottomSheet>

        {(() => {
          const suspending = statusTarget?.status !== "SUSPENDED";
          const name = statusTarget?.companyName ?? "this company";
          return (
            <Modal
              isOpen={!!statusTarget}
              onClose={() => setStatusTarget(null)}
              title={suspending ? "Suspend company?" : "Reactivate company?"}
              maxWidth="max-w-sm"
              footer={
                <>
                  <button
                    onClick={() => setStatusTarget(null)}
                    className="rounded-(--radius-md) border border-(--border) bg-(--card) px-4 py-2 text-sm font-semibold text-(--text-secondary) hover:bg-(--bg)"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmStatusChange}
                    disabled={updateStatus.isPending}
                    className={`rounded-(--radius-md) px-4 py-2 text-sm font-semibold text-white disabled:opacity-60 ${
                      suspending
                        ? "bg-red-600 hover:bg-red-700"
                        : "bg-(--primary) hover:bg-(--primary-dark)"
                    }`}
                  >
                    {updateStatus.isPending
                      ? "Saving..."
                      : suspending
                        ? "Suspend"
                        : "Reactivate"}
                  </button>
                </>
              }
            >
              <p className="text-sm text-(--text-secondary)">
                {suspending
                  ? `${name} and its recruiter will no longer be able to log in.`
                  : `${name} will be able to log in again.`}
              </p>
            </Modal>
          );
        })()}
      </div>
    </div>
  );
};

export default AdminCompaniesPage;
