/*
  §83 — internationalCountries.ts
  --------------------------------
  Dataset for the /services/international country selector. 12 countries
  selected by inbound demand from US-headquartered clients with global
  workforces (UK + EU 8 + Canada + Mexico + India). Each country has:
    - iso2 code (used as URL hash + testid suffix)
    - turnaround (verbal range, business days)
    - 3–5 standard checks we run in-country
    - candidate consent posture (GDPR / state equivalent)
    - one regulatory note that matters operationally
  This is a first-edition; new countries are appended without schema
  changes.
*/
export type Country = {
  iso2: string;
  name: string;
  region: "Americas" | "EMEA" | "APAC";
  /** Median turnaround verbiage, e.g. "3–7 business days". */
  turnaround: string;
  /** Standard checks we run in-country. */
  checks: ReadonlyArray<string>;
  /** Consent / privacy posture summary. */
  consent: string;
  /** One operational regulatory note (cited where relevant). */
  note: string;
};

export const COUNTRIES: ReadonlyArray<Country> = [
  {
    iso2: "us",
    name: "United States",
    region: "Americas",
    turnaround: "Most reports same-day to 24 hours",
    checks: [
      "Criminal records (county, statewide, federal)",
      "MVR + DOT consortium",
      "Education + employment verification",
      "Drug screening (5- or 10-panel)",
      "Sex-offender registry (50-state)",
    ],
    consent:
      "FCRA disclosure-and-authorization, ESIGN-compliant electronic consent.",
    note: "ICRAA + 35+ state-and-local overlays applied automatically by candidate address.",
  },
  {
    iso2: "ca",
    name: "Canada",
    region: "Americas",
    turnaround: "1–3 business days",
    checks: [
      "Criminal records (RCMP CPIC)",
      "Education + employment verification",
      "Credit (consent-based)",
      "Driver abstract (provincial)",
    ],
    consent:
      "PIPEDA-compliant disclosure-and-authorization; Quebec Law 25 layer where applicable.",
    note: "Vulnerable Sector Check requires the candidate to attend a local police service in person — we can coordinate the timing.",
  },
  {
    iso2: "mx",
    name: "Mexico",
    region: "Americas",
    turnaround: "5–10 business days",
    checks: [
      "Criminal records (state-level Carta de Antecedentes No Penales)",
      "Education + employment verification",
      "Identity (CURP / INE)",
      "Tax / IMSS history (consent-based)",
    ],
    consent:
      "LFPDPPP-compliant consent including a separate Aviso de Privacidad for the candidate.",
    note: "Criminal records are issued by state attorneys general — no national database; we run the candidate's residence states by default.",
  },
  {
    iso2: "gb",
    name: "United Kingdom",
    region: "EMEA",
    turnaround: "2–5 business days (Basic DBS); up to 4 weeks (Enhanced)",
    checks: [
      "Basic, Standard, or Enhanced DBS",
      "Right-to-Work (Home Office share code)",
      "Education + employment verification",
      "Credit (CIFAS / Experian)",
      "FCA register check for regulated roles",
    ],
    consent:
      "UK GDPR (Data Protection Act 2018) consent + DBS-specific declaration.",
    note: "Standard and Enhanced DBS require a registered umbrella body — we are one.",
  },
  {
    iso2: "ie",
    name: "Ireland",
    region: "EMEA",
    turnaround: "5–10 business days",
    checks: [
      "Garda Vetting (children / vulnerable persons roles)",
      "Education + employment verification",
      "Identity verification",
      "Director / qualifications check (CRO)",
    ],
    consent: "GDPR + Irish Data Protection Act 2018 consent.",
    note: "Garda Vetting cannot be delegated to non-relevant organisations under the National Vetting Bureau Act 2012; we run as the relevant organisation on behalf of the employer.",
  },
  {
    iso2: "de",
    name: "Germany",
    region: "EMEA",
    turnaround: "5–10 business days",
    checks: [
      "Polizeiliches Führungszeugnis (criminal record)",
      "Education + employment verification",
      "SCHUFA credit (consent-based)",
      "Trade register director check (Handelsregister)",
    ],
    consent: "GDPR + BDSG; Works Council consultation may apply for monitoring features.",
    note: "Polizeiliches Führungszeugnis is candidate-collected at the local Bürgeramt — we coordinate timing and confirm receipt.",
  },
  {
    iso2: "fr",
    name: "France",
    region: "EMEA",
    turnaround: "5–10 business days",
    checks: [
      "Bulletin n°3 du casier judiciaire",
      "Education + employment verification",
      "Identity verification",
      "Banque de France FICP (regulated roles)",
    ],
    consent: "GDPR + Loi Informatique et Libertés; CNIL guidance respected.",
    note: "Criminal-record reach is limited under French law; only Bulletin n°3 is open to private employers, not n°2.",
  },
  {
    iso2: "es",
    name: "Spain",
    region: "EMEA",
    turnaround: "5–10 business days",
    checks: [
      "Certificado de Antecedentes Penales",
      "Education + employment verification",
      "Identity (DNI / NIE)",
      "Sex-offender registry (Registro Central)",
    ],
    consent: "GDPR + LOPDGDD consent; AEPD guidance respected.",
    note: "Sex-offender registry check (Registro Central de Delincuentes Sexuales) is mandatory for any role with regular contact with minors.",
  },
  {
    iso2: "nl",
    name: "Netherlands",
    region: "EMEA",
    turnaround: "5–14 business days",
    checks: [
      "Verklaring Omtrent het Gedrag (VOG)",
      "Education + employment verification",
      "Identity verification",
      "Trade register (KvK) director check",
    ],
    consent: "GDPR + UAVG consent; Autoriteit Persoonsgegevens guidance respected.",
    note: "VOG is candidate-issued by Justis; turnaround depends on how quickly the candidate completes the application.",
  },
  {
    iso2: "pl",
    name: "Poland",
    region: "EMEA",
    turnaround: "3–7 business days",
    checks: [
      "Krajowy Rejestr Karny (KRK) criminal record",
      "Education + employment verification",
      "PESEL identity verification",
      "Driving licence verification",
    ],
    consent: "GDPR + Polish Personal Data Protection Act consent.",
    note: "KRK certificates are typically issued within 2 business days; the slow tail is the apostille step where required by the destination country.",
  },
  {
    iso2: "it",
    name: "Italy",
    region: "EMEA",
    turnaround: "7–14 business days",
    checks: [
      "Certificato del Casellario Giudiziale",
      "Education + employment verification",
      "Codice Fiscale identity",
      "Albo professionale (regulated roles)",
    ],
    consent: "GDPR + Codice della Privacy; Garante guidance respected.",
    note: "Casellario Giudiziale is issued by the Procura della Repubblica; the slow tail is in-person retrieval.",
  },
  {
    iso2: "in",
    name: "India",
    region: "APAC",
    turnaround: "7–14 business days",
    checks: [
      "Court records (district + high court)",
      "Police verification (state-issued)",
      "Education + employment verification",
      "Identity (Aadhaar masked) + address",
      "Database screening (CIBIL / global sanctions)",
    ],
    consent:
      "Digital Personal Data Protection Act 2023 (DPDPA) consent; sector-specific RBI / SEBI overlays.",
    note: "Police verification turnaround varies by state; Maharashtra and Karnataka are typically faster than Bihar or West Bengal.",
  },
];

export function getCountryByIso2(iso2: string): Country | undefined {
  return COUNTRIES.find((c) => c.iso2 === iso2.toLowerCase());
}
