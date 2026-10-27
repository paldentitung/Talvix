import prisma from "../../lib/prisma.js";
import AppError from "../../utils/AppError.js";

const DAYS = 30;
export const getAdminDashboardService = async () => {
  // Start of the window, in UTC, so day buckets are consistent
  const since = new Date();
  since.setUTCDate(since.getUTCDate() - (DAYS - 1));
  since.setUTCHours(0, 0, 0, 0);

  const [
    totalUsers,
    totalCompanies,
    activeJobs,
    pendingReports,
    newUsers,
    roleGroups,
    unverifiedRecruiters,
    usersBeforeWindow,
    usersInWindow,
    pendingReportsList,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.recruiterProfile.count(),
    prisma.job.count({ where: { status: "OPEN" } }),
    prisma.report.count({ where: { status: "PENDING" } }),
    prisma.user.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        role: true,
        createdAt: true,
        isVerified: true,
      },
    }),

    // Users by role
    prisma.user.groupBy({ by: ["role"], _count: { _all: true } }),

    // For the attention banner
    prisma.user.count({ where: { role: "RECRUITER", isVerified: false } }),

    // For the growth chart
    prisma.user.count({ where: { createdAt: { lt: since } } }),
    prisma.user.findMany({
      where: { createdAt: { gte: since } },
      select: { createdAt: true },
    }),

    // For the pending reports card (adjust fields to your Report model)
    prisma.report.findMany({
      where: { status: "PENDING" },
      take: 5,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        reason: true,
        createdAt: true,
        jobId: true, // if set -> "Job post reported"
        reportedUserId: true, // if set -> "User reported"
      },
    }),
  ]);

  // Cumulative users per day
  const perDay = new Map<string, number>();
  for (const u of usersInWindow) {
    const key = u.createdAt.toISOString().slice(0, 10);
    perDay.set(key, (perDay.get(key) ?? 0) + 1);
  }
  let running = usersBeforeWindow;
  const growth = Array.from({ length: DAYS }, (_, i) => {
    const d = new Date(since);
    d.setUTCDate(since.getUTCDate() + i);
    const key = d.toISOString().slice(0, 10);
    running += perDay.get(key) ?? 0;
    return { date: key, total: running };
  });

  return {
    overview: {
      totalUsers,
      totalCompanies,
      activeJobs,
      pendingReports,
      unverifiedRecruiters,
    },
    usersByRole: roleGroups.map((g) => ({
      role: g.role,
      count: g._count._all,
    })),
    growth,
    newUsers,
    pendingReportsList: pendingReportsList.map((r) => ({
      id: r.id,
      reason: r.reason,
      createdAt: r.createdAt,
      type: r.jobId ? "JOB" : "USER",
    })),
  };
};

const PIPELINE_STAGES = [
  "PENDING",
  "REVIEWING",
  "SHORTLISTED",
  "ACCEPTED",
] as const;

export const getRecruiterDashboardService = async (recruiterId: string) => {
  const now = new Date();

  if (!recruiterId) {
    throw new AppError("RecruiterId is required", 400);
  }

  // 30-day window in UTC so the day buckets are consistent
  const since = new Date(now);
  since.setUTCDate(since.getUTCDate() - (DAYS - 1));
  since.setUTCHours(0, 0, 0, 0);

  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const in3Days = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
  const monthStart = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1),
  );

  // Only this recruiter's applications, without withdrawn ones
  const live = {
    job: { recruiterId },
    status: { not: "WITHDRAWN" as const },
  };

  const [
    activeJobs,
    jobsClosingSoon,
    totalApplicants,
    newApplicantsThisWeek,
    awaitingReview,
    hiredThisMonth,
    applicationsInWindow,
    statusGroups,
    jobs,
    newPerJob,
    needsReview,
  ] = await Promise.all([
    prisma.job.count({ where: { recruiterId, status: "OPEN" } }),

    // Open jobs whose deadline is within the next 3 days (banner)
    prisma.job.count({
      where: {
        recruiterId,
        status: "OPEN",
        deadline: { gte: now, lte: in3Days },
      },
    }),

    prisma.application.count({ where: live }),
    prisma.application.count({
      where: { ...live, appliedAt: { gte: weekAgo } },
    }),
    prisma.application.count({ where: { ...live, status: "PENDING" } }),

    // "Hired this month" = applications moved to ACCEPTED this month,
    // read from the status history so the date is accurate
    prisma.applicationStatusHistory.count({
      where: {
        status: "ACCEPTED",
        createdAt: { gte: monthStart },
        application: { job: { recruiterId } },
      },
    }),

    // For the "Applications over time" chart
    prisma.application.findMany({
      where: { ...live, appliedAt: { gte: since } },
      select: { appliedAt: true },
    }),

    // For the pipeline donut
    prisma.application.groupBy({
      by: ["status"],
      where: live,
      _count: { _all: true },
    }),

    // Active jobs list (open + draft, newest first)
    prisma.job.findMany({
      where: { recruiterId, status: { in: ["OPEN", "DRAFT"] } },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        title: true,
        location: true,
        employmentType: true,
        status: true,
        _count: { select: { applications: true } },
      },
    }),

    // "+N new" badge per job (applications in the last 7 days)
    prisma.application.groupBy({
      by: ["jobId"],
      where: { ...live, appliedAt: { gte: weekAgo } },
      _count: { _all: true },
    }),

    // "Needs review" list
    prisma.application.findMany({
      where: { ...live, status: "PENDING" },
      orderBy: { appliedAt: "desc" },
      take: 5,
      select: {
        id: true,
        appliedAt: true,
        job: { select: { id: true, title: true } },
        user: { select: { firstName: true, lastName: true } },
      },
    }),
  ]);

  // Applications per day (30 buckets, zero-filled)
  const perDay = new Map<string, number>();
  for (const a of applicationsInWindow) {
    const key = a.appliedAt.toISOString().slice(0, 10);
    perDay.set(key, (perDay.get(key) ?? 0) + 1);
  }
  const trend = Array.from({ length: DAYS }, (_, i) => {
    const d = new Date(since);
    d.setUTCDate(since.getUTCDate() + i);
    const key = d.toISOString().slice(0, 10);
    return { date: key, count: perDay.get(key) ?? 0 };
  });

  // Pipeline in a fixed stage order, zero-filled
  const byStatus = new Map<string, number>(
    statusGroups.map((g) => [g.status as string, g._count._all]),
  );
  const pipeline = PIPELINE_STAGES.map((stage) => ({
    stage,
    count: byStatus.get(stage) ?? 0,
  }));

  const newByJob = new Map(newPerJob.map((g) => [g.jobId, g._count._all]));

  return {
    overview: {
      activeJobs,
      jobsClosingSoon,
      totalApplicants,
      newApplicantsThisWeek,
      awaitingReview,
      hiredThisMonth,
    },
    trend,
    pipeline,
    jobs: jobs.map((j) => ({
      id: j.id,
      title: j.title,
      location: j.location,
      employmentType: j.employmentType,
      status: j.status,
      applicantsCount: j._count.applications,
      newApplicantsCount: newByJob.get(j.id) ?? 0,
    })),
    needsReview: needsReview.map((a) => ({
      id: a.id,
      appliedAt: a.appliedAt,
      jobId: a.job.id,
      jobTitle: a.job.title,
      candidateName: `${a.user.firstName} ${a.user.lastName}`.trim(),
    })),
  };
};
