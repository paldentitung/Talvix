import { describe, expect, it } from "vitest";
import app from "../../app.js";
import request from "supertest";

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
