import request from "supertest";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { app } from "../../app.js";
import {
  clearTestDB,
  connectTestDB,
  disconnectTestDB,
} from "../setup/testDb.js";

beforeAll(connectTestDB, 120_000);
beforeEach(clearTestDB);
afterAll(disconnectTestDB);

describe("GET /api/nannies/me", () => {
  it("rejects a request without a JWT token", async () => {
    const response = await request(app).get("/api/nannies/me");

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Authorization header missing");
  });

  it("rejects a parent token", async () => {
    const token = await registerAndLogin({
      name: "Test Parent",
      email: "parent@test.com",
      password: "StrongPass123!",
      role: "parent",
    });

    const response = await request(app)
      .get("/api/nannies/me")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(403);
    expect(response.body.message).toBe("Access denied");
  });

  it("returns the current nanny profile for a nanny token", async () => {
    const token = await registerAndLogin({
      name: "Test Nanny",
      email: "nanny@test.com",
      password: "StrongPass123!",
      role: "nanny",
    });

    const response = await request(app)
      .get("/api/nannies/me")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.data.nanny.name).toBe("Test Nanny");
    expect(response.body.data.nanny.isProfileComplete).toBe(false);
    expect(response.body.data.reviews).toEqual([]);
  });
});

describe("PATCH /api/nannies/me", () => {
  it("updates a draft nanny profile", async () => {
    const token = await registerAndLogin({
      name: "Test Nanny",
      email: "nanny@test.com",
      password: "StrongPass123!",
      role: "nanny",
    });

    const response = await request(app)
      .patch("/api/nannies/me")
      .set("Authorization", `Bearer ${token}`)
      .send({
        experience: "5 years",
      });

    expect(response.status).toBe(200);
    expect(response.body.data.experience).toBe("5 years");
    expect(response.body.data.isProfileComplete).toBe(false);
  });

  it("marks a fully completed nanny profile as complete", async () => {
    const token = await registerAndLogin({
      name: "Test Nanny",
      email: "nanny@test.com",
      password: "StrongPass123!",
      role: "nanny",
    });

    const response = await request(app)
      .patch("/api/nannies/me")
      .set("Authorization", `Bearer ${token}`)
      .send({
        avatar_url: "https://example.com/nanny.jpg",
        birthday: "1994-04-10",
        experience: "6 years",
        education: "Master's in Early Childhood Development",
        kids_age: "2 to 9 years old",
        price_per_hour: 20,
        location: {
          country: "UKRAINE",
          region: "KYIV OBLAST",
          settlement: "BROVARY",
        },
        about: "I provide attentive and reliable childcare.",
        characters: ["attentive", "patient", "creative"],
      });

    expect(response.status).toBe(200);
    expect(response.body.data.isProfileComplete).toBe(true);
    expect(response.body.data.location.region).toBe("kyiv oblast");
    expect(response.body.data.location.settlement).toBe("brovary");
  });
});

const registerAndLogin = async (userData) => {
  await request(app).post("/api/auth/register").send(userData);

  const response = await request(app).post("/api/auth/login").send({
    email: userData.email,
    password: userData.password,
  });

  return response.body.data.token;
};
