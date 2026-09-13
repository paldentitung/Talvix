import request from "supertest";
import { describe, expect, it } from "vitest";
import app from "../../app.js";

describe("GET /api/jobs", () => {
  it("should return jobs with pagination data", async () => {
    const response = await request(app).get("/api/jobs");

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("data");
    expect(response.body.data).toHaveProperty("jobs");
    expect(Array.isArray(response.body.data.jobs)).toBe(true);
  });

  it("should support pagination", async () => {
    const response = await request(app)
      .get("/api/jobs")
      .query({ page: 1, pageSize: 2 });

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveProperty("jobs");
    expect(response.body.data.jobs.length).toBeLessThanOrEqual(2);
  });
  it("should return different jobs for different pages", async () => {
    const page1 = await request(app)
      .get("/api/jobs")
      .query({ page: 1, pageSize: 2 });

    const page2 = await request(app)
      .get("/api/jobs")
      .query({ page: 2, pageSize: 2 });

    expect(page1.status).toBe(200);
    expect(page2.status).toBe(200);

    const jobs1 = page1.body.data.jobs;
    const jobs2 = page2.body.data.jobs;

    expect(jobs1.length).toBe(2);
    expect(jobs2.length).toBe(2);

    expect(jobs1[0].id).not.toBe(jobs2[0].id);
  });
  it("should return only the remote jobs when the filtering by work mode", async () => {
    const response = await request(app)
      .get("/api/jobs")
      .query({ workMode: "REMOTE" });

    expect(response.status).toBe(200);
    const jobs = response.body.data.jobs;

    expect(
      jobs.every((job: { workMode: string }) => job.workMode === "REMOTE"),
    ).toBe(true);
  });
  it("should apply multiple filters together", async () => {
    const respone = await request(app)
      .get("/api/jobs")
      .query({ workMode: "REMOTE", employmentType: "FULL_TIME" });

    expect(respone.status).toBe(200);
    const jobs = respone.body.data.jobs;
    expect(
      jobs.every((job: { workMode: string; employmentType: string }) => {
        job.workMode === "REMOTE" && job.employmentType === "FULL_TYPE";
      }),
    );
  });
  it("should return error for invalid filter", async () => {
    const response = await request(app)
      .get("/api/jobs")
      .query({ workMode: "INVALID" });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("Invalid filter parameters");
    expect(response.body.errors).toHaveProperty("workMode");
  });
});
describe("POST /api/jobs", () => {
  it("should return unauthenticated user", async () => {
    const response = await request(app).post("/api/jobs").send({});
    expect(response.status).toBe(401);
  });
  it("should reject candidates from creating jobs", async () => {
    const loginResponse = await request(app).post("/api/auth/login").send({
      email: process.env.TEST_CANDIDATE_EMAIL,
      password: process.env.TEST_CANDIDATE_PASSWORD,
    });

    expect(loginResponse.status).toBe(200);

    const cookies = loginResponse.headers["set-cookie"];

    const response = await request(app)
      .post("/api/jobs")
      .set("Cookie", cookies)
      .send({});

    expect(response.status).toBe(403);
  });
  it("should allow recruiters to create jobs", async () => {
    const loginResponse = await request(app).post("/api/auth/login").send({
      email: process.env.TEST_RECRUITER_EMAIL,
      password: process.env.TEST_RECRUITER_PASSWORD,
    });

    expect(loginResponse.status).toBe(200);

    const cookies = loginResponse.headers["set-cookie"];

    const response = await request(app)
      .post("/api/jobs")
      .set("Cookie", cookies)
      .send({
        title: "Full Stack Developer",
        description:
          "We are looking for a full stack developer to build and maintain modern web applications.",
        salaryMin: 60000,
        salaryMax: 100000,
        currency: "NPR",
        location: "Kathmandu, Nepal",
        workMode: "REMOTE",
        employmentType: "FULL_TIME",
        experienceLevel: "MID",
        skills: ["React", "Node.js", "TypeScript", "PostgreSQL"],
        openings: 2,
        deadline: "2026-12-31",
        featured: false,
        status: "OPEN",
      });

    expect(response.status).toBe(201);
  });
});
