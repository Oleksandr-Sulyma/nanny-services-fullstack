import mongoose from "mongoose";
import request from "supertest";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { app } from "../../app.js";
import { Nanny } from "../../models/Nanny.js";
import {
  clearTestDB,
  connectTestDB,
  disconnectTestDB,
} from "../setup/testDb.js";

beforeAll(connectTestDB, 120_000);
beforeEach(clearTestDB);
afterAll(disconnectTestDB);

describe("GET /api/nannies", () => {
  it("returns only completed nanny profiles", async () => {
    await Nanny.create([
      {
        userId: new mongoose.Types.ObjectId(),
        name: "Visible Nanny",
        isProfileComplete: true,
      },
      {
        userId: new mongoose.Types.ObjectId(),
        name: "Draft Nanny",
        isProfileComplete: false,
      },
    ]);

    const response = await request(app).get("/api/nannies");

    expect(response.status).toBe(200);
    expect(response.body.totalItems).toBe(1);
    expect(response.body.data).toHaveLength(1);
    expect(response.body.data[0].name).toBe("Visible Nanny");
  });

  it("returns only nannies from the requested region", async () => {
    await Nanny.create([
      {
        userId: new mongoose.Types.ObjectId(),
        name: "Kyiv Nanny",
        location: { region: "kyiv oblast" },
        isProfileComplete: true,
      },
      {
        userId: new mongoose.Types.ObjectId(),
        name: "Lviv Nanny",
        location: { region: "lviv oblast" },
        isProfileComplete: true,
      },
    ]);

    const response = await request(app).get("/api/nannies?region=KYIV%20OBLAST");

    expect(response.status).toBe(200);
    expect(response.body.totalItems).toBe(1);
    expect(response.body.data).toHaveLength(1);
    expect(response.body.data[0].name).toBe("Kyiv Nanny");
  });

  it("sorts nanny profiles by ascending price", async () => {
    await createCompletedNanniesWithPrices();

    const response = await request(app).get("/api/nannies?sort=price_asc");

    expect(response.status).toBe(200);
    expect(response.body.data.map((nanny) => nanny.name)).toEqual([
      "Anna Nanny",
      "Zoya Nanny",
      "Maria Nanny",
    ]);
  });

  it("sorts nanny profiles by descending price", async () => {
    await createCompletedNanniesWithPrices();

    const response = await request(app).get("/api/nannies?sort=price_desc");

    expect(response.status).toBe(200);
    expect(response.body.data.map((nanny) => nanny.name)).toEqual([
      "Maria Nanny",
      "Anna Nanny",
      "Zoya Nanny",
    ]);
  });
});

describe("GET /api/nannies/:nannyId", () => {
  it("returns a completed nanny profile with reviews", async () => {
    const nanny = await Nanny.create({
      userId: new mongoose.Types.ObjectId(),
      name: "Visible Nanny",
      isProfileComplete: true,
    });

    const response = await request(app).get(`/api/nannies/${nanny.id}`);

    expect(response.status).toBe(200);
    expect(response.body.data.nanny.name).toBe("Visible Nanny");
    expect(response.body.data.reviews).toEqual([]);
  });

  it("does not return a draft nanny profile", async () => {
    const nanny = await Nanny.create({
      userId: new mongoose.Types.ObjectId(),
      name: "Draft Nanny",
      isProfileComplete: false,
    });

    const response = await request(app).get(`/api/nannies/${nanny.id}`);

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Nanny not found");
  });
});

const createCompletedNanniesWithPrices = () =>
  Nanny.create([
    {
      userId: new mongoose.Types.ObjectId(),
      name: "Zoya Nanny",
      price_per_hour: 15,
      isProfileComplete: true,
    },
    {
      userId: new mongoose.Types.ObjectId(),
      name: "Maria Nanny",
      price_per_hour: 25,
      isProfileComplete: true,
    },
    {
      userId: new mongoose.Types.ObjectId(),
      name: "Anna Nanny",
      price_per_hour: 15,
      isProfileComplete: true,
    },
  ]);
