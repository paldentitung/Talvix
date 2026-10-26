import prisma from "../../lib/prisma.js";

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
