import request from "supertest";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { app } from "../../app.js";
import { User } from "../../models/User.js";
import { Nanny } from "../../models/Nanny.js";
import {
  clearTestDB,
  connectTestDB,
  disconnectTestDB,
} from "../setup/testDb.js";

beforeAll(connectTestDB, 120_000);
beforeEach(clearTestDB);
afterAll(disconnectTestDB);

describe("POST /api/auth/register", () => {
  it("registers a parent and stores a hashed password", async () => {
    const response = await request(app).post("/api/auth/register").send({
      name: "Test Parent",
      email: "parent@test.com",
      password: "StrongPass123!",
      role: "parent",
    });

    expect(response.status).toBe(201);
    expect(response.body.data.user.email).toBe("parent@test.com");
    expect(response.body.data.user).not.toHaveProperty("passwordHash");

    const user = await User.findOne({ email: "parent@test.com" });

    expect(user).not.toBeNull();
    expect(user.passwordHash).not.toBe("StrongPass123!");
    expect(user.passwordHash).toMatch(/^\$2[aby]\$/);
  });

  it("rejects registration with an existing email", async () => {
    const userData = {
      name: "Test Parent",
      email: "parent@test.com",
      password: "StrongPass123!",
      role: "parent",
    };

    await request(app).post("/api/auth/register").send(userData);

    const response = await request(app)
      .post("/api/auth/register")
      .send(userData);

    expect(response.status).toBe(409);
    expect(response.body.message).toBe("A user with this email already exists");
  });

  it("registers a nanny and stores a hashed password", async () => {
    const response = await request(app).post("/api/auth/register").send({
      name: "Test Nanny",
      email: "nanny@test.com",
      password: "StrongPass1234!",
      role: "nanny",
    });

    expect(response.status).toBe(201);
    expect(response.body.data.user.email).toBe("nanny@test.com");
    expect(response.body.data.nanny.isProfileComplete).toBe(false);
    expect(response.body.data.user).not.toHaveProperty("passwordHash");

    const user = await User.findOne({ email: "nanny@test.com" });

    expect(user).not.toBeNull();
    expect(user.passwordHash).not.toBe("StrongPass1234!");
    expect(user.passwordHash).toMatch(/^\$2[aby]\$/);

    const nanny = await Nanny.findOne({ userId: user._id });
    
    expect(nanny).not.toBeNull();
    expect(nanny.userId.equals(user._id)).toBe(true);
    expect(nanny.isProfileComplete).toBe(false);
  });
});

describe("POST /api/auth/login", () => {
  it("returns a JWT token for valid credentials", async () => {
    await registerParent();

    const response = await request(app).post("/api/auth/login").send({
      email: "parent@test.com",
      password: "StrongPass123!",
    });

    expect(response.status).toBe(200);
    expect(response.body.data.token).toEqual(expect.any(String));
    expect(response.body.data.user.email).toBe("parent@test.com");
  });

  it("rejects login with an incorrect password", async () => {
    await registerParent();

    const response = await request(app).post("/api/auth/login").send({
      email: "parent@test.com",
      password: "WrongPass123!",
    });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Invalid credentials");
  });

  it("rejects login with an unknown email", async () => {
    const response = await request(app).post("/api/auth/login").send({
      email: "unknown@test.com",
      password: "StrongPass123!",
    });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Invalid credentials");
  });
});

const registerParent = () =>
  request(app).post("/api/auth/register").send({
    name: "Test Parent",
    email: "parent@test.com",
    password: "StrongPass123!",
    role: "parent",
  });
