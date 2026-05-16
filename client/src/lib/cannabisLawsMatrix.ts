/**
 * §81 — State-by-state cannabis testing & employment-protections matrix.
 *
 * Reference dataset, not legal advice. Recreational/medical status as of May 2026;
 * statutes shift quarterly. Re-verify before publishing employment policies.
 *
 * Used by: /resources/marijuana-laws
 */

export type CannabisRecreational = "Legal" | "Decriminalized" | "Medical only" | "Illegal";
export type CannabisMedical = "Legal" | "Limited (CBD/THC-low)" | "Illegal";
export type CannabisEmploymentProtection =
  | "Off-duty use"
  | "Lawful-use protections"
  | "Pre-employment limits"
  | "Medical only"
  | "None";
export type SafetySensitiveCarveout = "Yes" | "Limited" | "No";

export interface CannabisRecord {
  abbr: string;
  name: string;
  recreational: CannabisRecreational;
  medical: CannabisMedical;
  employmentProtection: CannabisEmploymentProtection;
  safetySensitiveCarveout: SafetySensitiveCarveout;
  pre2024Change: boolean;
  notes: string;
}

export const CANNABIS_MATRIX: CannabisRecord[] = [
  { abbr: "AL", name: "Alabama", recreational: "Illegal", medical: "Limited (CBD/THC-low)", employmentProtection: "None", safetySensitiveCarveout: "No", pre2024Change: false, notes: "Compassion Act 2021; no employment protections." },
  { abbr: "AK", name: "Alaska", recreational: "Legal", medical: "Legal", employmentProtection: "None", safetySensitiveCarveout: "Yes", pre2024Change: false, notes: "Recreational since 2014; employer testing remains permitted." },
  { abbr: "AZ", name: "Arizona", recreational: "Legal", medical: "Legal", employmentProtection: "Off-duty use", safetySensitiveCarveout: "Yes", pre2024Change: false, notes: "AMMA bars discrimination against medical cardholders absent impairment." },
  { abbr: "AR", name: "Arkansas", recreational: "Illegal", medical: "Legal", employmentProtection: "Medical only", safetySensitiveCarveout: "Yes", pre2024Change: false, notes: "Medical cardholders protected; SSP carveout for safety-sensitive." },
  { abbr: "CA", name: "California", recreational: "Legal", medical: "Legal", employmentProtection: "Lawful-use protections", safetySensitiveCarveout: "Limited", pre2024Change: true, notes: "AB 2188 (eff. 1/1/2024) bars discrimination based on off-duty use; non-psychoactive metabolite testing prohibited; carveouts for federal-required testing." },
  { abbr: "CO", name: "Colorado", recreational: "Legal", medical: "Legal", employmentProtection: "None", safetySensitiveCarveout: "Yes", pre2024Change: false, notes: "Coats v. Dish Network: lawful-activities statute does not protect federally-illegal use." },
  { abbr: "CT", name: "Connecticut", recreational: "Legal", medical: "Legal", employmentProtection: "Lawful-use protections", safetySensitiveCarveout: "Yes", pre2024Change: false, notes: "RERACA bars adverse action on prior-to-employment use; safety-sensitive carve-outs broad." },
  { abbr: "DE", name: "Delaware", recreational: "Legal", medical: "Legal", employmentProtection: "Medical only", safetySensitiveCarveout: "Yes", pre2024Change: false, notes: "HB 1 (2023) legalized adult use; medical protections only at present." },
  { abbr: "FL", name: "Florida", recreational: "Illegal", medical: "Legal", employmentProtection: "None", safetySensitiveCarveout: "Yes", pre2024Change: false, notes: "No employment-status protections; private employers may test freely." },
  { abbr: "GA", name: "Georgia", recreational: "Illegal", medical: "Limited (CBD/THC-low)", employmentProtection: "None", safetySensitiveCarveout: "Yes", pre2024Change: false, notes: "Low-THC oil only; no employment protections." },
  { abbr: "HI", name: "Hawaii", recreational: "Decriminalized", medical: "Legal", employmentProtection: "Pre-employment limits", safetySensitiveCarveout: "Yes", pre2024Change: false, notes: "Pre-employment limits on cannabis-only testing under DOL rules." },
  { abbr: "ID", name: "Idaho", recreational: "Illegal", medical: "Illegal", employmentProtection: "None", safetySensitiveCarveout: "No", pre2024Change: false, notes: "No legal cannabis program; standard testing applies." },
  { abbr: "IL", name: "Illinois", recreational: "Legal", medical: "Legal", employmentProtection: "Lawful-use protections", safetySensitiveCarveout: "Yes", pre2024Change: true, notes: "RTPA + CRTA: lawful-products protection; impairment must be \"articulable\" with specific symptoms." },
  { abbr: "IN", name: "Indiana", recreational: "Illegal", medical: "Limited (CBD/THC-low)", employmentProtection: "None", safetySensitiveCarveout: "No", pre2024Change: false, notes: "Low-THC CBD only; no protections." },
  { abbr: "IA", name: "Iowa", recreational: "Illegal", medical: "Limited (CBD/THC-low)", employmentProtection: "None", safetySensitiveCarveout: "No", pre2024Change: false, notes: "Medical CBD program only." },
  { abbr: "KS", name: "Kansas", recreational: "Illegal", medical: "Illegal", employmentProtection: "None", safetySensitiveCarveout: "No", pre2024Change: false, notes: "No state cannabis program." },
  { abbr: "KY", name: "Kentucky", recreational: "Illegal", medical: "Legal", employmentProtection: "None", safetySensitiveCarveout: "Yes", pre2024Change: false, notes: "Medical program effective 2025; no employment protections." },
  { abbr: "LA", name: "Louisiana", recreational: "Decriminalized", medical: "Legal", employmentProtection: "Medical only", safetySensitiveCarveout: "Yes", pre2024Change: false, notes: "Medical cardholders protected for many state-employer roles." },
  { abbr: "ME", name: "Maine", recreational: "Legal", medical: "Legal", employmentProtection: "Off-duty use", safetySensitiveCarveout: "Yes", pre2024Change: false, notes: "Adults 21+ may not be subject to discipline solely for off-duty use." },
  { abbr: "MD", name: "Maryland", recreational: "Legal", medical: "Legal", employmentProtection: "Off-duty use", safetySensitiveCarveout: "Yes", pre2024Change: false, notes: "Cannabis Reform Act; safety-sensitive and federal-mandated testing carved out." },
  { abbr: "MA", name: "Massachusetts", recreational: "Legal", medical: "Legal", employmentProtection: "Off-duty use", safetySensitiveCarveout: "Yes", pre2024Change: false, notes: "Barbuto v. Advantage Sales: medical patients have ADA-style accommodation rights." },
  { abbr: "MI", name: "Michigan", recreational: "Legal", medical: "Legal", employmentProtection: "Off-duty use", safetySensitiveCarveout: "Yes", pre2024Change: false, notes: "MRTMA; Eplee v. Lansing: off-duty use generally protected." },
  { abbr: "MN", name: "Minnesota", recreational: "Legal", medical: "Legal", employmentProtection: "Off-duty use", safetySensitiveCarveout: "Yes", pre2024Change: true, notes: "HF 100 (2023): cannabis added to lawful-consumable-products statute; safety-sensitive carve-outs." },
  { abbr: "MS", name: "Mississippi", recreational: "Illegal", medical: "Legal", employmentProtection: "None", safetySensitiveCarveout: "Yes", pre2024Change: false, notes: "Medical Cannabis Act 2022; no employment protections." },
  { abbr: "MO", name: "Missouri", recreational: "Legal", medical: "Legal", employmentProtection: "Lawful-use protections", safetySensitiveCarveout: "Yes", pre2024Change: false, notes: "Mo. Const. art. XIV § 2 protects lawful activities and cardholders absent impairment." },
  { abbr: "MT", name: "Montana", recreational: "Legal", medical: "Legal", employmentProtection: "None", safetySensitiveCarveout: "Yes", pre2024Change: false, notes: "Recreational since 2021; no employment protections." },
  { abbr: "NE", name: "Nebraska", recreational: "Illegal", medical: "Illegal", employmentProtection: "None", safetySensitiveCarveout: "No", pre2024Change: false, notes: "Medical referendums litigated; no enacted program." },
  { abbr: "NV", name: "Nevada", recreational: "Legal", medical: "Legal", employmentProtection: "Pre-employment limits", safetySensitiveCarveout: "Yes", pre2024Change: false, notes: "AB 132 bars pre-employment cannabis-only test results from disqualifying most candidates." },
  { abbr: "NH", name: "New Hampshire", recreational: "Decriminalized", medical: "Legal", employmentProtection: "None", safetySensitiveCarveout: "Yes", pre2024Change: false, notes: "Medical only; no employment-status protections." },
  { abbr: "NJ", name: "New Jersey", recreational: "Legal", medical: "Legal", employmentProtection: "Lawful-use protections", safetySensitiveCarveout: "Yes", pre2024Change: false, notes: "CREAMM Act: cannot take adverse action solely on cannabis presence; \"WIRE\" certification regs pending CRC final rules." },
  { abbr: "NM", name: "New Mexico", recreational: "Legal", medical: "Legal", employmentProtection: "Off-duty use", safetySensitiveCarveout: "Yes", pre2024Change: false, notes: "Cannabis Regulation Act; safety-sensitive carve-outs broad." },
  { abbr: "NY", name: "New York", recreational: "Legal", medical: "Legal", employmentProtection: "Lawful-use protections", safetySensitiveCarveout: "Yes", pre2024Change: false, notes: "Lab. Law § 201-d as amended: off-duty use is protected lawful activity; impairment requires articulable symptoms." },
  { abbr: "NC", name: "North Carolina", recreational: "Illegal", medical: "Illegal", employmentProtection: "Off-duty use", safetySensitiveCarveout: "Yes", pre2024Change: false, notes: "Lawful-products statute § 95-28.2 may cover some off-duty conduct; cannabis still illegal state-wide." },
  { abbr: "ND", name: "North Dakota", recreational: "Illegal", medical: "Legal", employmentProtection: "None", safetySensitiveCarveout: "Yes", pre2024Change: false, notes: "Medical only; no employment protections." },
  { abbr: "OH", name: "Ohio", recreational: "Legal", medical: "Legal", employmentProtection: "None", safetySensitiveCarveout: "Yes", pre2024Change: false, notes: "Issue 2 (2023) preserved employer right to maintain drug-free workplaces." },
  { abbr: "OK", name: "Oklahoma", recreational: "Illegal", medical: "Legal", employmentProtection: "Pre-employment limits", safetySensitiveCarveout: "Yes", pre2024Change: false, notes: "Unity Act: medical cardholders may not be denied solely for status." },
  { abbr: "OR", name: "Oregon", recreational: "Legal", medical: "Legal", employmentProtection: "Pre-employment limits", safetySensitiveCarveout: "Yes", pre2024Change: false, notes: "Pre-employment cannabis screening narrowed under HB 4002 (2024)." },
  { abbr: "PA", name: "Pennsylvania", recreational: "Illegal", medical: "Legal", employmentProtection: "Medical only", safetySensitiveCarveout: "Yes", pre2024Change: false, notes: "Medical Marijuana Act § 2103(b)(1) bars discrimination against cardholders." },
  { abbr: "RI", name: "Rhode Island", recreational: "Legal", medical: "Legal", employmentProtection: "Off-duty use", safetySensitiveCarveout: "Yes", pre2024Change: false, notes: "Cannabis Act 2022; off-duty protections with safety-sensitive carve-outs." },
  { abbr: "SC", name: "South Carolina", recreational: "Illegal", medical: "Illegal", employmentProtection: "None", safetySensitiveCarveout: "No", pre2024Change: false, notes: "No legal cannabis program; standard testing applies." },
  { abbr: "SD", name: "South Dakota", recreational: "Illegal", medical: "Legal", employmentProtection: "None", safetySensitiveCarveout: "Yes", pre2024Change: false, notes: "Medical only; no employment protections." },
  { abbr: "TN", name: "Tennessee", recreational: "Illegal", medical: "Limited (CBD/THC-low)", employmentProtection: "None", safetySensitiveCarveout: "No", pre2024Change: false, notes: "Low-THC CBD only; no employment protections." },
  { abbr: "TX", name: "Texas", recreational: "Illegal", medical: "Limited (CBD/THC-low)", employmentProtection: "None", safetySensitiveCarveout: "No", pre2024Change: false, notes: "Compassionate Use Program (low-THC) only." },
  { abbr: "UT", name: "Utah", recreational: "Illegal", medical: "Legal", employmentProtection: "Medical only", safetySensitiveCarveout: "Yes", pre2024Change: false, notes: "Medical Cannabis Act protects cardholders from public-employer discipline absent impairment." },
  { abbr: "VT", name: "Vermont", recreational: "Legal", medical: "Legal", employmentProtection: "Off-duty use", safetySensitiveCarveout: "Yes", pre2024Change: false, notes: "21 V.S.A. § 495j: testing for cannabis must follow specific rules." },
  { abbr: "VA", name: "Virginia", recreational: "Legal", medical: "Legal", employmentProtection: "Lawful-use protections", safetySensitiveCarveout: "Yes", pre2024Change: false, notes: "Va. Code § 40.1-27.4 (2023) restricts adverse action based on lawful off-duty cannabis use." },
  { abbr: "WA", name: "Washington", recreational: "Legal", medical: "Legal", employmentProtection: "Pre-employment limits", safetySensitiveCarveout: "Yes", pre2024Change: true, notes: "RCW 49.44.240 (eff. 1/1/2024): pre-employment cannabis tests cannot be sole basis for refusal; safety-sensitive carve-outs." },
  { abbr: "WV", name: "West Virginia", recreational: "Illegal", medical: "Legal", employmentProtection: "Medical only", safetySensitiveCarveout: "Yes", pre2024Change: false, notes: "Medical Cannabis Act protects cardholders against discrimination." },
  { abbr: "WI", name: "Wisconsin", recreational: "Illegal", medical: "Illegal", employmentProtection: "None", safetySensitiveCarveout: "No", pre2024Change: false, notes: "No legal cannabis program; standard testing applies." },
  { abbr: "WY", name: "Wyoming", recreational: "Illegal", medical: "Illegal", employmentProtection: "None", safetySensitiveCarveout: "No", pre2024Change: false, notes: "No legal cannabis program; standard testing applies." },
];

export function cannabisCounts() {
  return {
    total: CANNABIS_MATRIX.length,
    recLegal: CANNABIS_MATRIX.filter((s) => s.recreational === "Legal").length,
    medLegal: CANNABIS_MATRIX.filter((s) => s.medical === "Legal").length,
    employmentProtections: CANNABIS_MATRIX.filter((s) => s.employmentProtection !== "None").length,
    pre2024Changes: CANNABIS_MATRIX.filter((s) => s.pre2024Change).length,
  };
}
