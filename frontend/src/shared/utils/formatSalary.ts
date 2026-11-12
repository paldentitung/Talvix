import type { Job } from "../../features/jobs/types/job.types";

function formatCurrencyAmount(amount: number, currency: string): string {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
      notation: amount >= 100000 ? "compact" : "standard",
    }).format(amount);
  } catch {
    return `${currency} ${amount.toLocaleString()}`;
  }
}

const formatSalary = (
  job: Pick<Job, "salaryMin" | "salaryMax" | "currency">,
): string => {
  const { salaryMin, salaryMax, currency } = job;

  if (salaryMin == null && salaryMax == null) return "Salary not disclosed";

  if (salaryMin != null && salaryMax != null) {
    return `${formatCurrencyAmount(salaryMin, currency)} - ${formatCurrencyAmount(salaryMax, currency)}`;
  }

  if (salaryMin != null)
    return `From ${formatCurrencyAmount(salaryMin, currency)}`;
  return `Up to ${formatCurrencyAmount(salaryMax!, currency)}`;
};

export default formatSalary;
