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
describe("POST /api/application", () => {
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
    expect(response.status).toBe(200);
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

    expect(firstResponse.status).toBe(200);

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
