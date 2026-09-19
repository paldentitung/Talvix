import prisma from "../src/lib/prisma.js";
import type { WorkMode, EmploymentType, ExperienceLevel } from "@prisma/client";

const TEST_JOB_PREFIX = "Test Job";

export const seedTestJobs = async (count = 6) => {
  const recruiter = await prisma.user.findUnique({
    where: { email: process.env.TEST_RECRUITER_EMAIL },
  });

  if (!recruiter) {
    throw new Error(
      "Test recruiter not found. Run seedTestUsers first (or check TEST_RECRUITER_EMAIL in .env.test).",
    );
  }

  await prisma.job.deleteMany({
    where: {
      recruiterId: recruiter.id,
      title: { startsWith: TEST_JOB_PREFIX },
    },
  });

  const workModes: WorkMode[] = ["REMOTE", "ONSITE"];
  const employmentTypes: EmploymentType[] = ["FULL_TIME", "PART_TIME"];
  const experienceLevel: ExperienceLevel = "MID";

  const jobsData = Array.from({ length: count }).map((_, i) => ({
    title: `${TEST_JOB_PREFIX} ${i + 1}`,
    description:
      "We are looking for a developer to build and maintain modern web applications.",
    salaryMin: 60000,
    salaryMax: 100000,
    currency: "NPR",
    location: "Kathmandu, Nepal",
    workMode: workModes[i % workModes.length],
    employmentType: employmentTypes[i % employmentTypes.length],
    experienceLevel,
    skills: ["React", "Node.js", "TypeScript"],
    openings: 1,
    deadline: new Date("2026-12-31"),
    featured: false,
    status: "OPEN" as const,
    recruiterId: recruiter.id,
  }));

  await prisma.job.createMany({ data: jobsData });

  console.log(`Seeded ${count} test jobs for ${recruiter.email}.`);

  return jobsData;
};

export const clearTestJobs = async () => {
  const recruiter = await prisma.user.findUnique({
    where: { email: process.env.TEST_RECRUITER_EMAIL },
  });

  if (!recruiter) return;

  await prisma.job.deleteMany({
    where: {
      recruiterId: recruiter.id,
      title: { startsWith: TEST_JOB_PREFIX },
    },
  });
};

const isMain = process.argv[1] && process.argv[1].endsWith("seedTestJobs.ts");

if (isMain) {
  seedTestJobs()
    .catch((error) => {
      console.error("Test job seed failed:", error);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
