import type { Job } from "../../features/jobs/types/job.types";

const formatSalary = (job: Job) => {
  const { salaryMin, salaryMax, currency } = job;
  if (salaryMin == null && salaryMax == null) return "Not disclosed";

  const fmt = (n: number) => {
    if (n < 1000) return `${currency} ${n}`;
    const k = (n / 1000).toFixed(1).replace(/\.0$/, "");
    return `${currency} ${k}k`;
  };

  if (salaryMin != null && salaryMax != null)
    return `${fmt(salaryMin)} – ${fmt(salaryMax)}`;
  if (salaryMin != null) return `From ${fmt(salaryMin)}`;
  return `Up to ${fmt(salaryMax!)}`;
};

export default formatSalary;
