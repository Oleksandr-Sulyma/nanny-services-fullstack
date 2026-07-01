import bcrypt from "bcrypt";
import mongoose from "mongoose";
import request from "supertest";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { app } from "../../app.js";
import { Nanny } from "../../models/Nanny.js";
import { User } from "../../models/User.js";
import {
  clearTestDB,
  connectTestDB,
  disconnectTestDB,
} from "../setup/testDb.js";

beforeAll(connectTestDB, 120_000);
beforeEach(clearTestDB);
afterAll(disconnectTestDB);

describe("GET /api/users/me", () => {
  it("returns the current user with completed favorite nannies", async () => {
    const { token, user } = await registerAndLogin({
      name: "Test Parent",
      email: "parent@test.com",
      password: "StrongPass123!",
      role: "parent",
    });
    const completedNanny = await Nanny.create({
      userId: new mongoose.Types.ObjectId(),
      name: "Visible Nanny",
      isProfileComplete: true,
    });
    const draftNanny = await Nanny.create({
      userId: new mongoose.Types.ObjectId(),
      name: "Draft Nanny",
      isProfileComplete: false,
    });

    user.favorites = [completedNanny._id, draftNanny._id];
    await user.save();

    const response = await request(app)
      .get("/api/users/me")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.data.email).toBe("parent@test.com");
    expect(response.body.data.favorites).toHaveLength(1);
    expect(response.body.data.favorites[0].name).toBe("Visible Nanny");
  });
});

describe("PATCH /api/users/profile", () => {
  it("updates parent profile fields", async () => {
    const { token } = await registerAndLogin({
      name: "Test Parent",
      email: "parent@test.com",
      password: "StrongPass123!",
      role: "parent",
    });

    const response = await request(app)
      .patch("/api/users/profile")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Updated Parent",
        email: "updated@test.com",
        avatar: "https://example.com/avatar.jpg",
      });

    expect(response.status).toBe(200);
    expect(response.body.data.name).toBe("Updated Parent");
    expect(response.body.data.email).toBe("updated@test.com");
    expect(response.body.data.avatar).toBe("https://example.com/avatar.jpg");
  });

  it("syncs nanny name and avatar to the nanny profile", async () => {
    const { token, user } = await registerAndLogin({
      name: "Test Nanny",
      email: "nanny@test.com",
      password: "StrongPass123!",
      role: "nanny",
    });

    const response = await request(app)
      .patch("/api/users/profile")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Updated Nanny",
        avatar: "https://example.com/nanny-avatar.jpg",
      });

    const nanny = await Nanny.findOne({ userId: user._id });

    expect(response.status).toBe(200);
    expect(response.body.data.name).toBe("Updated Nanny");
    expect(nanny.name).toBe("Updated Nanny");
    expect(nanny.avatar_url).toBe("https://example.com/nanny-avatar.jpg");
  });
});

describe("PATCH /api/users/avatar", () => {
  it("updates the current user avatar URL", async () => {
    const { token } = await registerAndLogin({
      name: "Test Parent",
      email: "parent@test.com",
      password: "StrongPass123!",
      role: "parent",
    });

    const response = await request(app)
      .patch("/api/users/avatar")
      .set("Authorization", `Bearer ${token}`)
      .send({ avatar: "https://example.com/avatar.jpg" });

    expect(response.status).toBe(200);
    expect(response.body.data.avatar).toBe("https://example.com/avatar.jpg");
  });
});

describe("PATCH /api/users/update-password", () => {
  it("updates the password when the old password is correct", async () => {
    const { token, user } = await registerAndLogin({
      name: "Test Parent",
      email: "parent@test.com",
      password: "StrongPass123!",
      role: "parent",
    });

    const response = await request(app)
      .patch("/api/users/update-password")
      .set("Authorization", `Bearer ${token}`)
      .send({
        oldPassword: "StrongPass123!",
        newPassword: "NewStrongPass123!",
      });

    const updatedUser = await User.findById(user._id);

    expect(response.status).toBe(200);
    expect(response.body.data.email).toBe("parent@test.com");
    expect(
      await bcrypt.compare("NewStrongPass123!", updatedUser.passwordHash),
    ).toBe(true);
  });
});

describe("POST /api/users/favorites", () => {
  it("toggles a completed nanny in favorites", async () => {
    const { token } = await registerAndLogin({
      name: "Test Parent",
      email: "parent@test.com",
      password: "StrongPass123!",
      role: "parent",
    });
    const nanny = await Nanny.create({
      userId: new mongoose.Types.ObjectId(),
      name: "Favorite Nanny",
      isProfileComplete: true,
    });

    const addResponse = await request(app)
      .post("/api/users/favorites")
      .set("Authorization", `Bearer ${token}`)
      .send({ nannyId: nanny.id });

    expect(addResponse.status).toBe(200);
    expect(addResponse.body.message).toBe("Added to favorites");
    expect(addResponse.body.favorites).toContain(nanny.id);

    const removeResponse = await request(app)
      .post("/api/users/favorites")
      .set("Authorization", `Bearer ${token}`)
      .send({ nannyId: nanny.id });

    expect(removeResponse.status).toBe(200);
    expect(removeResponse.body.message).toBe("Removed from favorites");
    expect(removeResponse.body.favorites).toHaveLength(0);
  });
});

describe("POST /api/uploads/avatar", () => {
  it("rejects avatar upload without a JWT token", async () => {
    const response = await request(app).post("/api/uploads/avatar");

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Authorization header missing");
  });

  it("rejects avatar upload without a file", async () => {
    const { token } = await registerAndLogin({
      name: "Test Parent",
      email: "parent@test.com",
      password: "StrongPass123!",
      role: "parent",
    });

    const response = await request(app)
      .post("/api/uploads/avatar")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Image file is required");
  });
});

const registerAndLogin = async (userData) => {
  await request(app).post("/api/auth/register").send(userData);

  const response = await request(app).post("/api/auth/login").send({
    email: userData.email,
    password: userData.password,
  });

  const user = await User.findOne({ email: userData.email });

  return {
    token: response.body.data.token,
    user,
  };
};
