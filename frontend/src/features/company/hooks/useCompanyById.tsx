import { useQuery } from "@tanstack/react-query";
import { getCompanyById } from "../api/companyApi";
import type { CompanyDetail, CompanyDetailRaw } from "../types/company.types";

const flatten = (raw: CompanyDetailRaw): CompanyDetail => {
  const p = raw.recruiterProfile;
  return {
    id: raw.id,
    firstName: raw.firstName,
    lastName: raw.lastName,
    avatar: raw.avatar ?? null,
    isVerified: raw.isVerified,
    createdAt: raw.createdAt,
    jobs: raw.jobs,
    companyName: p?.companyName ?? null,
    companyLogo: p?.companyLogo ?? null,
    companyWebsite: p?.companyWebsite ?? null,
    companyDescription: p?.companyDescription ?? null,
    location: p?.companyLocation ?? null,
    status: raw.status,
    tagline: p?.companyTagline ?? null,
  };
};

export const useCompanyById = (id: string | null) =>
  useQuery({
    queryKey: ["company", id],
    queryFn: () => getCompanyById(id!),
    enabled: !!id,
    select: (res) => flatten(res.data),
  });
