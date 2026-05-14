/*
  Spec for the candidate-contact payload validator. We import the dev-side
  copy from vite.config.ts (the production server in server/index.ts uses
  the same logic). The endpoint handles candidates writing in about a report,
  so the validator is the only line of defense between user input and the
  flat-file store — worth pinning behavior in a test.
*/
import { describe, it, expect } from "vitest";
import { validateCandidateContactPayload } from "../../../vite.config";

describe("validateCandidateContactPayload", () => {
  const base = {
    fullName: "Sam Candidate",
    email: "sam@example.com",
    reportId: "24A-08821",
    message: "I'd like a copy of my report file.",
  };

  it("accepts a well-formed payload", () => {
    const r = validateCandidateContactPayload(base);
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.value.fullName).toBe("Sam Candidate");
      expect(r.value.email).toBe("sam@example.com");
      expect(r.value.reportId).toBe("24A-08821");
    }
  });

  it("treats reportId as optional", () => {
    const r = validateCandidateContactPayload({ ...base, reportId: "" });
    expect(r.ok).toBe(true);
  });

  it("rejects a missing full name", () => {
    const r = validateCandidateContactPayload({ ...base, fullName: "  " });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toMatch(/full name/i);
  });

  it("rejects an obviously invalid email", () => {
    const r = validateCandidateContactPayload({ ...base, email: "not-an-email" });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toMatch(/valid email/i);
  });

  it("rejects an empty message", () => {
    const r = validateCandidateContactPayload({ ...base, message: " " });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toMatch(/short message|inquiry/i);
  });

  it("rejects oversized fields", () => {
    const r = validateCandidateContactPayload({
      ...base,
      message: "x".repeat(5001),
    });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toMatch(/too long/i);
  });

  it("rejects non-object payloads", () => {
    expect(validateCandidateContactPayload(null).ok).toBe(false);
    expect(validateCandidateContactPayload("nope").ok).toBe(false);
    expect(validateCandidateContactPayload(42).ok).toBe(false);
  });
});
