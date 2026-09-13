import request from "supertest";
import { describe, expect, it } from "vitest";
import app from "../../app.js";

describe("POST /api/auth/login", () => {
  it("should login a user and set auth cookie", async () => {
    const response = await request(app).post("/api/auth/login").send({
      email: process.env.TEST_RECRUITER_EMAIL,
      password: process.env.TEST_RECRUITER_PASSWORD,
    });
    console.log(response.body);
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.headers["set-cookie"]).toBeDefined();
  });
});
