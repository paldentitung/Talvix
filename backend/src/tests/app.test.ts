import request from "supertest";
import { describe, expect, it } from "vitest";
import app from "../app.js";

describe("App", () => {
  it("should return hello from server", async () => {
    const response = await request(app).get("/");

    expect(response.status).toBe(200);
    expect(response.text).toBe("hello from server");
  });
});
