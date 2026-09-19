import bcrypt from "bcrypt";
import prisma from "../src/lib/prisma.js";

const TEST_PASSWORD = "TestPassword123!";

const seedTestUsers = async () => {
  const hashedPassword = await bcrypt.hash(TEST_PASSWORD, 10);

  await prisma.user.upsert({
    where: {
      email: "test-candidate@example.com",
    },
    update: {
      password: hashedPassword,
      isVerified: true,
      role: "CANDIDATE",
    },
    create: {
      email: "test-candidate@example.com",
      password: hashedPassword,
      firstName: "Test",
      lastName: "Candidate",
      role: "CANDIDATE",
      isVerified: true,
    },
  });

  await prisma.user.upsert({
    where: {
      email: "test-recruiter@example.com",
    },
    update: {
      password: hashedPassword,
      isVerified: true,
      role: "RECRUITER",
    },
    create: {
      email: "test-recruiter@example.com",
      password: hashedPassword,
      firstName: "Test",
      lastName: "Recruiter",
      role: "RECRUITER",
      isVerified: true,
    },
  });

  await prisma.user.upsert({
    where: {
      email: "test-admin@example.com",
    },
    update: {
      password: hashedPassword,
      isVerified: true,
      role: "ADMIN",
    },
    create: {
      email: "test-admin@example.com",
      password: hashedPassword,
      firstName: "Test",
      lastName: "Admin",
      role: "ADMIN",
      isVerified: true,
    },
  });

  console.log("Test users seeded successfully.");
};

seedTestUsers()
  .catch((error) => {
    console.error("Test seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
