import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { resolveDemoBookingCta, DEMO_PHONE_TEL, DEMO_BOOKING_URL } from "./demoPage";

describe("/demo booking CTA", () => {
  it("uses the booking page when an https link is set", () => {
    const cta = resolveDemoBookingCta("https://calendar.app.google/abc123");
    expect(cta).toEqual({
      href: "https://calendar.app.google/abc123",
      label: "Pick a Time for Your Demo",
      external: true,
    });
  });

  it("falls back to the support line when no link is set", () => {
    const cta = resolveDemoBookingCta("");
    expect(cta.href).toBe(DEMO_PHONE_TEL);
    expect(cta.external).toBe(false);
  });

  it("ships with the live booking page", () => {
    expect(resolveDemoBookingCta(DEMO_BOOKING_URL).external).toBe(true);
  });

  it("rejects non-https links", () => {
    expect(resolveDemoBookingCta("javascript:alert(1)").href).toBe(DEMO_PHONE_TEL);
    expect(resolveDemoBookingCta("http://example.com").href).toBe(DEMO_PHONE_TEL);
  });
});

describe("/demo copy rules", () => {
  const src = readFileSync(resolve(__dirname, "../pages/Demo.tsx"), "utf8");

  it("is routed at /demo", () => {
    const app = readFileSync(resolve(__dirname, "../App.tsx"), "utf8");
    expect(app).toMatch(/path=\{"\/demo"\}\s+component=\{Demo\}/);
  });

  it("always says 'up to 30%' and never a bare 30% savings claim", () => {
    expect(src).toContain("up to 30%");
    expect(src).not.toMatch(/save 30%/i);
  });

  it("gives USA-based support its own section", () => {
    expect(src).toContain('id="support"');
    expect(src).toContain("100% USA-based support");
  });

  it("never claims SOC 2 or a money-back guarantee", () => {
    expect(src).not.toMatch(/SOC ?2/i);
    expect(src).not.toMatch(/money-back/i);
  });

  it("carries the timing disclaimer", () => {
    expect(src).toContain(
      "Timing varies by service, jurisdiction, court access, source availability, and third-party response.",
    );
  });
});
