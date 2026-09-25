import { describe, expect, it } from "vitest";
import app from "../../app.js";
import request from "supertest";
import prisma from "../../lib/prisma.js";

describe("GET /api/applications", () => {
  it("should return 401 for unauthenticated user", async () => {
    const response = await request(app).get("/api/applications");

    expect(response.status).toBe(401);
  });

  it("should return 403 for Candidate", async () => {
    const loginResponse = await request(app).post("/api/auth/login").send({
      email: process.env.TEST_CANDIDATE_EMAIL,
      password: process.env.TEST_CANDIDATE_PASSWORD,
    });

    expect(loginResponse.status).toBe(200);

    const cookies = loginResponse.headers["set-cookie"];

    const response = await request(app)
      .get("/api/applications")
      .set("Cookie", cookies);

    expect(response.status).toBe(403);
  });
  it("should return 403 for Recruiter", async () => {
    const loginResponse = await request(app).post("/api/auth/login").send({
      email: process.env.TEST_RECRUITER_EMAIL,
      password: process.env.TEST_RECRUITER_PASSWORD,
    });

    expect(loginResponse.status).toBe(200);

    const cookies = loginResponse.headers["set-cookie"];

    const response = await request(app)
      .get("/api/applications")
      .set("Cookie", cookies);

    expect(response.status).toBe(403);
  });

  it("should return applications data with pagination data for Admin", async () => {
    const loginResponse = await request(app).post("/api/auth/login").send({
      email: process.env.TEST_ADMIN_EMAIL,
      password: process.env.TEST_ADMIN_PASSWORD,
    });

    expect(loginResponse.status).toBe(200);

    const cookies = loginResponse.headers["set-cookie"];

    const response = await request(app)
      .get("/api/applications")
      .set("Cookie", cookies);

    expect(response.body.success).toBe(true);
    expect(response.body).toHaveProperty("data");
    expect(response.body.data).toHaveProperty("applications");
    expect(Array.isArray(response.body.data.applications)).toBe(true);
  });
});
describe("GET /api/applications/recruiter", () => {
  it("should return 401 for unauthenticated user", async () => {
    const response = await request(app).get("/api/applications/recruiter");

    expect(response.status).toBe(401);
  });
  it("should return 403 for Candidate", async () => {
    const loginResponse = await request(app).post("/api/auth/login").send({
      email: process.env.TEST_CANDIDATE_EMAIL,
      password: process.env.TEST_CANDIDATE_PASSWORD,
    });

    expect(loginResponse.status).toBe(200);

    const cookies = loginResponse.headers["set-cookie"];

    const response = await request(app)
      .get("/api/applications/recruiter")
      .set("Cookie", cookies);

    expect(response.status).toBe(403);
  });
  it("should return 403 for Admin", async () => {
    const loginResponse = await request(app).post("/api/auth/login").send({
      email: process.env.TEST_ADMIN_EMAIL,
      password: process.env.TEST_ADMIN_PASSWORD,
    });

    expect(loginResponse.status).toBe(200);

    const cookies = loginResponse.headers["set-cookie"];

    const response = await request(app)
      .get("/api/applications/recruiter")
      .set("Cookie", cookies);

    expect(response.status).toBe(403);
  });
  it("should return applications data with pagination data for Recruiter", async () => {
    const loginResponse = await request(app).post("/api/auth/login").send({
      email: process.env.TEST_RECRUITER_EMAIL,
      password: process.env.TEST_RECRUITER_PASSWORD,
    });

    expect(loginResponse.status).toBe(200);

    const cookies = loginResponse.headers["set-cookie"];

    const response = await request(app)
      .get("/api/applications/recruiter")
      .set("Cookie", cookies);

    console.log(response.body);

    expect(response.body.success).toBe(true);
    expect(response.body).toHaveProperty("data");
    expect(response.body.data).toHaveProperty("applications");
    expect(Array.isArray(response.body.data.applications)).toBe(true);
  });
});
describe("GET /api/applications/me", () => {
  it("should return 401 for unauthenticated user", async () => {
    const response = await request(app).get("/api/applications/me");

    expect(response.status).toBe(401);
  });

  it("should return 403 for Recruiter", async () => {
    const loginResponse = await request(app).post("/api/auth/login").send({
      email: process.env.TEST_RECRUITER_EMAIL,
      password: process.env.TEST_RECRUITER_PASSWORD,
    });

    expect(loginResponse.status).toBe(200);

    const cookies = loginResponse.headers["set-cookie"];

    const response = await request(app)
      .get("/api/applications/me")
      .set("Cookie", cookies);

    expect(response.status).toBe(403);
  });

  it("should return 403 for Admin", async () => {
    const loginResponse = await request(app).post("/api/auth/login").send({
      email: process.env.TEST_ADMIN_EMAIL,
      password: process.env.TEST_ADMIN_PASSWORD,
    });

    expect(loginResponse.status).toBe(200);

    const cookies = loginResponse.headers["set-cookie"];

    const response = await request(app)
      .get("/api/applications/me")
      .set("Cookie", cookies);

    expect(response.status).toBe(403);
  });

  it("should return applications data with pagination data for Candidate", async () => {
    const loginResponse = await request(app).post("/api/auth/login").send({
      email: process.env.TEST_CANDIDATE_EMAIL,
      password: process.env.TEST_CANDIDATE_PASSWORD,
    });

    expect(loginResponse.status).toBe(200);

    const cookies = loginResponse.headers["set-cookie"];

    const response = await request(app)
      .get("/api/applications/me")
      .set("Cookie", cookies);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body).toHaveProperty("data");
    expect(response.body.data).toHaveProperty("applications");
    expect(Array.isArray(response.body.data.applications)).toBe(true);
  });
});
describe("POST /api/applications", () => {
  it("should return unauthenticated user", async () => {
    const response = await request(app).post("/api/applications").send({});
    expect(response.status).toBe(401);
  });

  it("should reject recruiter with 403", async () => {
    const loginResponse = await request(app).post("/api/auth/login").send({
      email: process.env.TEST_RECRUITER_EMAIL,
      password: process.env.TEST_RECRUITER_PASSWORD,
    });
    expect(loginResponse.status).toBe(200);

    const cookies = loginResponse.headers["set-cookie"];

    const response = await request(app)
      .post("/api/applications")
      .set("Cookie", cookies)
      .send({});
    expect(response.status).toBe(403);
  });
  it("should reject Admin with 403", async () => {
    const loginResponse = await request(app).post("/api/auth/login").send({
      email: process.env.TEST_ADMIN_EMAIL,
      password: process.env.TEST_ADMIN_PASSWORD,
    });
    expect(loginResponse.status).toBe(200);

    const cookies = loginResponse.headers["set-cookie"];

    const response = await request(app)
      .post("/api/applications")
      .set("Cookie", cookies)
      .send({});
    expect(response.status).toBe(403);
  });
  it("should allow candidate to apply for a job", async () => {
    const loginResponse = await request(app).post("/api/auth/login").send({
      email: process.env.TEST_CANDIDATE_EMAIL,
      password: process.env.TEST_CANDIDATE_PASSWORD,
    });

    expect(loginResponse.status).toBe(200);

    const cookies = loginResponse.headers["set-cookie"];

    const jobResponse = await request(app)
      .get("/api/jobs")
      .query({ page: 1, pageSize: 10 });

    expect(jobResponse.status).toBe(200);
    expect(jobResponse.body.data).toHaveProperty("jobs");
    expect(Array.isArray(jobResponse.body.data.jobs)).toBe(true);

    const job = jobResponse.body.data.jobs[1];
    expect(job).toBeDefined();

    const response = await request(app)
      .post("/api/applications")
      .set("Cookie", cookies)
      .field("jobId", job.id)
      .field("coverLetter", "I am interested in this position.")
      .attach("resume", Buffer.from("Test from content"), "resume.pdf");
    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe("Application submitted successfully");
    expect(response.body.data).toHaveProperty("id");
  });
  it("should reject duplicate application", async () => {
    const loginResponse = await request(app).post("/api/auth/login").send({
      email: process.env.TEST_CANDIDATE_EMAIL,
      password: process.env.TEST_CANDIDATE_PASSWORD,
    });

    expect(loginResponse.status).toBe(200);

    const cookies = loginResponse.headers["set-cookie"];

    const recruiter = await prisma.user.findUnique({
      where: {
        email: process.env.TEST_RECRUITER_EMAIL,
      },
    });

    expect(recruiter).toBeDefined();

    const job = await prisma.job.create({
      data: {
        title: "Duplicate Application Test Job",
        description: "Job for testing duplicate applications",
        salaryMin: 50000,
        salaryMax: 80000,
        currency: "NPR",
        location: "Kathmandu, Nepal",
        workMode: "REMOTE",
        employmentType: "FULL_TIME",
        experienceLevel: "ENTRY",
        skills: ["React", "TypeScript"],
        openings: 1,
        deadline: new Date("2026-12-31"),
        featured: false,
        status: "OPEN",
        recruiterId: recruiter!.id,
      },
    });

    // First application should succeed
    const firstResponse = await request(app)
      .post("/api/applications")
      .set("Cookie", cookies)
      .field("jobId", job.id)
      .field("coverLetter", "First application")
      .attach("resume", Buffer.from("Test resume"), "resume.pdf");

    expect(firstResponse.status).toBe(201);

    // Second application should be rejected
    const secondResponse = await request(app)
      .post("/api/applications")
      .set("Cookie", cookies)
      .field("jobId", job.id)
      .field("coverLetter", "Second application")
      .attach("resume", Buffer.from("Test resume"), "resume.pdf");

    expect(secondResponse.status).toBe(409);
    expect(secondResponse.body.message).toBe(
      "You have already applied for this job",
    );
  });
  it("should reject application without resume", async () => {
    const loginResponse = await request(app).post("/api/auth/login").send({
      email: process.env.TEST_CANDIDATE_EMAIL,
      password: process.env.TEST_CANDIDATE_PASSWORD,
    });

    expect(loginResponse.status).toBe(200);

    const cookies = loginResponse.headers["set-cookie"];

    const jobResponse = await request(app)
      .get("/api/jobs")
      .query({ page: 1, pageSize: 10 });

    const job = jobResponse.body.data.jobs[0];

    const response = await request(app)
      .post("/api/applications")
      .set("Cookie", cookies)
      .field("jobId", job.id)
      .field("coverLetter", "I am interested in this position.");

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Resume is required");
  });
  it("should reject application for non-existent job", async () => {
    const loginResponse = await request(app).post("/api/auth/login").send({
      email: process.env.TEST_CANDIDATE_EMAIL,
      password: process.env.TEST_CANDIDATE_PASSWORD,
    });

    expect(loginResponse.status).toBe(200);

    const cookies = loginResponse.headers["set-cookie"];

    const response = await request(app)
      .post("/api/applications")
      .set("Cookie", cookies)
      .field("jobId", "00000000-0000-0000-0000-000000000000")
      .field("coverLetter", "I am interested in this position.")
      .attach("resume", Buffer.from("Test resume"), "resume.pdf");

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Job not found");
  });
  it("should reject application for closed job", async () => {
    const loginResponse = await request(app).post("/api/auth/login").send({
      email: process.env.TEST_CANDIDATE_EMAIL,
      password: process.env.TEST_CANDIDATE_PASSWORD,
    });

    expect(loginResponse.status).toBe(200);

    const cookies = loginResponse.headers["set-cookie"];

    const recruiter = await prisma.user.findUnique({
      where: {
        email: process.env.TEST_RECRUITER_EMAIL,
      },
    });

    expect(recruiter).toBeDefined();

    const job = await prisma.job.create({
      data: {
        title: "Closed Job Test",
        description: "Job for testing closed jobs",
        salaryMin: 50000,
        salaryMax: 80000,
        currency: "NPR",
        location: "Kathmandu, Nepal",
        workMode: "REMOTE",
        employmentType: "FULL_TIME",
        experienceLevel: "ENTRY",
        skills: ["React", "TypeScript"],
        openings: 1,
        deadline: new Date("2026-12-31"),
        featured: false,
        status: "CLOSED",
        recruiterId: recruiter!.id,
      },
    });

    const response = await request(app)
      .post("/api/applications")
      .set("Cookie", cookies)
      .field("jobId", job.id)
      .field("coverLetter", "I am interested in this position.")
      .attach("resume", Buffer.from("Test resume"), "resume.pdf");

    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      "This job is no longer accepting applications",
    );
  });
  it("should reject application after deadline", async () => {
    const loginResponse = await request(app).post("/api/auth/login").send({
      email: process.env.TEST_CANDIDATE_EMAIL,
      password: process.env.TEST_CANDIDATE_PASSWORD,
    });

    expect(loginResponse.status).toBe(200);

    const cookies = loginResponse.headers["set-cookie"];

    const recruiter = await prisma.user.findUnique({
      where: {
        email: process.env.TEST_RECRUITER_EMAIL,
      },
    });

    expect(recruiter).toBeDefined();

    const job = await prisma.job.create({
      data: {
        title: "Expired Job Test",
        description: "Job for testing expired deadline",
        salaryMin: 50000,
        salaryMax: 80000,
        currency: "NPR",
        location: "Kathmandu, Nepal",
        workMode: "REMOTE",
        employmentType: "FULL_TIME",
        experienceLevel: "ENTRY",
        skills: ["React", "TypeScript"],
        openings: 1,
        deadline: new Date("2025-01-01"),
        featured: false,
        status: "OPEN",
        recruiterId: recruiter!.id,
      },
    });

    const response = await request(app)
      .post("/api/applications")
      .set("Cookie", cookies)
      .field("jobId", job.id)
      .field("coverLetter", "I am interested in this position.")
      .attach("resume", Buffer.from("Test resume"), "resume.pdf");

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("The application deadline has passed");
  });
});

describe("DELETE /api/applications/:id/withdraw", () => {
  it("should give 403 for admin to withdraw", async () => {
    const loginResponse = await request(app).post("/api/auth/login").send({
      email: process.env.TEST_ADMIN_EMAIL,
      password: process.env.TEST_ADMIN_PASSWORD,
    });

    expect(loginResponse.status).toBe(200);

    const cookies = loginResponse.headers["set-cookie"];

    const application = await prisma.application.findFirst();

    const response = await request(app)
      .delete(`/api/applications/${application!.id}/withdraw`)
      .set("Cookie", cookies);

    expect(response.status).toBe(403);
  });
  it("should give 403 for recruiter to withdraw", async () => {
    const loginResponse = await request(app).post("/api/auth/login").send({
      email: process.env.TEST_RECRUITER_EMAIL,
      password: process.env.TEST_RECRUITER_PASSWORD,
    });

    expect(loginResponse.status).toBe(200);

    const cookies = loginResponse.headers["set-cookie"];

    const application = await prisma.application.findFirst();

    const response = await request(app)
      .delete(`/api/applications/${application!.id}/withdraw`)
      .set("Cookie", cookies);

    expect(response.status).toBe(403);
  });
  it("should allow candidate  to withdraw the application", async () => {
    const loginResponse = await request(app).post("/api/auth/login").send({
      email: process.env.TEST_CANDIDATE_EMAIL,
      password: process.env.TEST_CANDIDATE_PASSWORD,
    });

    expect(loginResponse.status).toBe(200);

    const cookies = loginResponse.headers["set-cookie"];

    const candidate = await prisma.user.findUnique({
      where: {
        email: process.env.TEST_CANDIDATE_EMAIL,
      },
    });
    const application = await prisma.application.findFirst({
      where: {
        userId: candidate!.id,
        status: "PENDING",
      },
    });
    expect(application).not.toBeNull();

    const response = await request(app)
      .delete(`/api/applications/${application!.id}/withdraw`)
      .set("Cookie", cookies);

    expect(response.status).toBe(200);
  });
});

describe("PATCH /api/applications/:id/status", () => {
  it("should give 403 for admin to change status", async () => {
    const loginResponse = await request(app).post("/api/auth/login").send({
      email: process.env.TEST_ADMIN_EMAIL,
      password: process.env.TEST_ADMIN_PASSWORD,
    });

    expect(loginResponse.status).toBe(200);

    const cookies = loginResponse.headers["set-cookie"];

    const application = await prisma.application.findFirst();

    const response = await request(app)
      .patch(`/api/applications/${application!.id}/status`)
      .set("Cookie", cookies);

    expect(response.status).toBe(403);
  });
  it("should give 403 for candidate to change status", async () => {
    const loginResponse = await request(app).post("/api/auth/login").send({
      email: process.env.TEST_CANDIDATE_EMAIL,
      password: process.env.TEST_CANDIDATE_PASSWORD,
    });

    expect(loginResponse.status).toBe(200);

    const cookies = loginResponse.headers["set-cookie"];

    const application = await prisma.application.findFirst();

    const response = await request(app)
      .patch(`/api/applications/${application!.id}/status`)
      .set("Cookie", cookies);

    expect(response.status).toBe(403);
  });
  it("should allow recruiter to change status", async () => {
    // Login as recruiter
    const loginResponse = await request(app).post("/api/auth/login").send({
      email: process.env.TEST_RECRUITER_EMAIL,
      password: process.env.TEST_RECRUITER_PASSWORD,
    });

    expect(loginResponse.status).toBe(200);

    const recruiterCookies = loginResponse.headers["set-cookie"];

    // Find recruiter
    const recruiter = await prisma.user.findUnique({
      where: {
        email: process.env.TEST_RECRUITER_EMAIL,
      },
    });

    expect(recruiter).not.toBeNull();

    // Find candidate
    const candidate = await prisma.user.findUnique({
      where: {
        email: process.env.TEST_CANDIDATE_EMAIL,
      },
    });

    expect(candidate).not.toBeNull();

    // Find an OPEN test job that the candidate has NOT already applied to
    const job = await prisma.job.findFirst({
      where: {
        recruiterId: recruiter!.id,
        status: "OPEN",
        title: {
          startsWith: "Test Job",
        },
        applications: {
          none: {
            userId: candidate!.id,
          },
        },
      },
    });

    expect(job).not.toBeNull();

    // Login as candidate
    const candidateLogin = await request(app).post("/api/auth/login").send({
      email: process.env.TEST_CANDIDATE_EMAIL,
      password: process.env.TEST_CANDIDATE_PASSWORD,
    });

    expect(candidateLogin.status).toBe(200);

    const candidateCookies = candidateLogin.headers["set-cookie"];

    // Candidate applies
    const applicationResponse = await request(app)
      .post("/api/applications")
      .set("Cookie", candidateCookies)
      .field("jobId", job!.id)
      .field("coverLetter", "Test application")
      .attach("resume", Buffer.from("test resume"), "test-resume.pdf");

    expect(applicationResponse.status).toBe(201);

    const application = applicationResponse.body.data;

    expect(application).toBeDefined();

    // Recruiter changes status
    const response = await request(app)
      .patch(`/api/applications/${application.id}/status`)
      .set("Cookie", recruiterCookies)
      .send({
        status: "REVIEWING",
      });

    expect(response.status).toBe(200);
  });
});
