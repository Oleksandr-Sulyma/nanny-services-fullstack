import mongoose from "mongoose";
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

describe("appointment lifecycle", () => {
  it("rejects appointment creation without a JWT token", async () => {
    const response = await request(app)
      .post(`/api/nannies/${new mongoose.Types.ObjectId()}/appointments`)
      .send(createAppointmentBody());

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Authorization header missing");
  });

  it("allows a parent to book, complete, and review a nanny appointment", async () => {
    const parentToken = await registerAndLogin({
      name: "Test Parent",
      email: "parent@test.com",
      password: "StrongPass123!",
      role: "parent",
    });
    const nannyToken = await registerAndLogin({
      name: "Test Nanny",
      email: "nanny@test.com",
      password: "StrongPass123!",
      role: "nanny",
    });
    const nannyId = await completeNannyProfile(nannyToken);

    const createResponse = await request(app)
      .post(`/api/nannies/${nannyId}/appointments`)
      .set("Authorization", `Bearer ${parentToken}`)
      .send(createAppointmentBody());

    expect(createResponse.status).toBe(201);
    expect(createResponse.body.data.status).toBe("pending");

    const appointmentId = createResponse.body.data.id;

    const earlyReviewResponse = await request(app)
      .post(`/api/appointments/${appointmentId}/reviews`)
      .set("Authorization", `Bearer ${parentToken}`)
      .send(createReviewBody());

    expect(earlyReviewResponse.status).toBe(400);
    expect(earlyReviewResponse.body.message).toBe(
      "Only completed appointments can be reviewed",
    );

    const acceptResponse = await request(app)
      .patch(`/api/appointments/${appointmentId}/status`)
      .set("Authorization", `Bearer ${nannyToken}`)
      .send({ status: "accepted" });

    expect(acceptResponse.status).toBe(200);
    expect(acceptResponse.body.data.status).toBe("accepted");

    const completeResponse = await request(app)
      .patch(`/api/appointments/${appointmentId}/complete`)
      .set("Authorization", `Bearer ${parentToken}`);

    expect(completeResponse.status).toBe(200);
    expect(completeResponse.body.data.status).toBe("completed");

    const reviewResponse = await request(app)
      .post(`/api/appointments/${appointmentId}/reviews`)
      .set("Authorization", `Bearer ${parentToken}`)
      .send(createReviewBody());

    expect(reviewResponse.status).toBe(201);
    expect(reviewResponse.body.data.review.rating).toBe(5);
    expect(reviewResponse.body.data.nannyRating).toBe(5);

    const duplicateReviewResponse = await request(app)
      .post(`/api/appointments/${appointmentId}/reviews`)
      .set("Authorization", `Bearer ${parentToken}`)
      .send(createReviewBody());

    expect(duplicateReviewResponse.status).toBe(409);
    expect(duplicateReviewResponse.body.message).toBe(
      "Review for this appointment already exists",
    );
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

const completeNannyProfile = async (token) => {
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
        country: "ukraine",
        region: "kyiv oblast",
        settlement: "brovary",
      },
      about: "I provide attentive and reliable childcare.",
      characters: ["attentive", "patient", "creative"],
    });

  return response.body.data.id;
};

const createAppointmentBody = () => ({
  parentName: "Test Parent",
  email: "parent@test.com",
  address: "Kyiv, Khreshchatyk Street 12",
  phone: "+380671234567",
  childAge: "5 years",
  scheduledAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  comment: "We would like to arrange a meeting.",
});

const createReviewBody = () => ({
  rating: 5,
  comment: "The nanny was attentive, punctual, and kind.",
});
