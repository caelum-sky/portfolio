import { describe, it, expect } from "vitest";
import { validateContact, isValid, EMAIL_RE, LIMITS } from "../lib/contactValidation";

const VALID = { name: "Jane Recruiter", email: "jane@company.com", message: "We would love to interview you." };

describe("validateContact", () => {
  it("accepts a valid payload", () => {
    expect(isValid(validateContact(VALID))).toBe(true);
  });

  it("trims whitespace before validating", () => {
    const padded = { name: "  Jane Recruiter  ", email: " jane@company.com ", message: "  We would love to interview you. " };
    expect(isValid(validateContact(padded))).toBe(true);
  });

  it.each([
    ["a@b.co", true],
    ["jane.doe+tag@company.io", true],
    ["not-an-email", false],
    ["missing@tld", false],
    ["spaces in@address.com", false],
    ["", false],
  ])("email regex: %s → %s", (email, expected) => {
    expect(EMAIL_RE.test(email)).toBe(expected);
  });

  it("rejects invalid emails", () => {
    const errors = validateContact({ ...VALID, email: "nope" });
    expect(errors.email).toBeTruthy();
    expect(isValid(errors)).toBe(false);
  });

  it("rejects short names", () => {
    expect(validateContact({ ...VALID, name: "J" }).name).toBeTruthy();
  });

  it("rejects oversized names", () => {
    expect(validateContact({ ...VALID, name: "x".repeat(LIMITS.name.max + 1) }).name).toBeTruthy();
  });

  it("rejects short messages", () => {
    expect(validateContact({ ...VALID, message: "hi" }).message).toBeTruthy();
  });

  it("rejects oversized messages", () => {
    expect(validateContact({ ...VALID, message: "x".repeat(LIMITS.message.max + 1) }).message).toBeTruthy();
  });

  it("handles missing fields without throwing", () => {
    const errors = validateContact({});
    expect(errors.name).toBeTruthy();
    expect(errors.email).toBeTruthy();
    expect(errors.message).toBeTruthy();
  });
});
