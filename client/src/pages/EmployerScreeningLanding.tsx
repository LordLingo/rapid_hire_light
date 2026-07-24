import { useEffect } from "react";
import EmployerScreeningLandingLayout from "@/components/lp/EmployerScreeningLandingLayout";
import {
  EMPLOYER_SCREENING_LANDING_PAGES,
  type EmployerLandingPageKey,
} from "@/content/employerScreeningLandingPages";
import { useSeo } from "@/hooks/useSeo";

function EmployerScreeningLanding({
  pageKey,
}: {
  readonly pageKey: EmployerLandingPageKey;
}) {
  const config = EMPLOYER_SCREENING_LANDING_PAGES[pageKey];

  useSeo({
    title: config.seo.title,
    description: config.seo.description,
    canonical: config.seo.canonical,
    image: config.seo.image,
    ogType: "website",
  });

  useEffect(() => {
    const rawHash = window.location.hash;
    if (rawHash && rawHash !== "#") {
      const frame = requestAnimationFrame(() => {
        const id = rawHash.slice(1);
        let target = document.getElementById(id);
        try {
          target = document.getElementById(decodeURIComponent(id)) ?? target;
        } catch {
          // Keep the raw hash fallback for malformed encodings.
        }
        target?.scrollIntoView({ behavior: "auto", block: "start" });
      });
      return () => cancelAnimationFrame(frame);
    }
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [config.route]);

  return <EmployerScreeningLandingLayout config={config} />;
}

export function StaffingBackgroundChecksLanding() {
  return <EmployerScreeningLanding pageKey="staffing" />;
}

export function HealthcareEmployeeScreeningLanding() {
  return <EmployerScreeningLanding pageKey="healthcare" />;
}

export function EmployerCriminalBackgroundChecksLanding() {
  return <EmployerScreeningLanding pageKey="criminal" />;
}

export function PreEmploymentScreeningLanding() {
  return <EmployerScreeningLanding pageKey="preEmployment" />;
}
