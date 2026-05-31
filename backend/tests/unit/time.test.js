import { describe, expect, it, vi } from "vitest";
import { getAllowedBirthDate } from "../../constants/time.js";

describe("getAllowedBirthDate", () => {
  it("returns the birth date allowed for a 16-year-old nanny", () => {
    vi.setSystemTime(new Date("2026-05-30T12:00:00.000Z"));

    const result = getAllowedBirthDate(16);

    expect(result).toEqual(new Date("2010-05-30T12:00:00.000Z"));

    vi.useRealTimers();
  });

  it("returns the birth date allowed for a 70-year-old nanny", () => {
    vi.setSystemTime(new Date("2026-05-30T12:00:00.000Z"));

    const result = getAllowedBirthDate(70);

    expect(result).toEqual(new Date("1956-05-30T12:00:00.000Z"));

    vi.useRealTimers();
  });
});