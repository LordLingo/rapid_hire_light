import type { BlogPost } from "@/lib/blog";

export const post: BlogPost = {
  slug: "fmcsa-psp-pre-employment-screening-program",
  title: "FMCSA PSP: The Pre-Employment Screening Program Explained for Carriers",
  metaTitle: "FMCSA PSP Pre-Employment Screening Program Guide",
  metaDescription:
    "FMCSA's PSP gives carriers access to a driver's roadside-inspection and crash history. What PSP shows, what it does not, and how to use it under FCRA.",
  excerpt:
    "FMCSA's Pre-Employment Screening Program gives motor carriers access to a driver's last five years of roadside-inspection and crash history. Here is what PSP shows, what it omits, and how to integrate it into a compliant carrier hiring program.",
  publishedAt: "2026-04-21",
  readingMinutes: 5,
  author: "Rapid Hire Compliance Team",
  tags: ["transportation", "dot", "compliance"],
  body: `Motor carriers running CDL drivers in the United States have access to a federal database that nearly every other employer would envy: a five-year, pre-employment-only window into the driver's roadside-inspection and crash history, drawn directly from FMCSA's Motor Carrier Management Information System (MCMIS). The program is called the **Pre-Employment Screening Program (PSP)**, it has been operational since 2010, and as of 2026 it is the single most important non-MVR driver screening tool available to carriers. This guide walks through what PSP shows, what it deliberately omits, and how to integrate PSP into a hiring program that complies with both [49 CFR Part 391](/blog/dot-driver-background-checks-mvr) and the Fair Credit Reporting Act.

## What PSP actually contains

A PSP report covers two distinct data sets, both pulled from MCMIS. The first is **roadside inspection data** for the prior five years: every roadside inspection the driver has been part of, the violations cited (broken out by category and severity), and the inspection level (Level I full inspection through Level VI radioactive). The second is **crash data** for the prior five years: every crash the driver was involved in that met FMCSA's reportability threshold (a fatality, an injury requiring medical attention away from the scene, or a vehicle towed from the scene).

Each crash entry includes the date, the role of the driver's vehicle (e.g., struck-by, sideswipe), and whether the crash was preventable. PSP does **not** report fault or assess preventability — it reports the underlying data the carrier or motor carrier safety auditor uses to make that judgment.

## What PSP deliberately does not contain

PSP is narrow on purpose. It does **not** include MVR data — driver license status, traffic citations not arising from a roadside inspection, license suspensions, or out-of-state convictions live in state DMV records, not in MCMIS. A carrier hiring a driver still needs to pull an MVR for every state of licensure. PSP also does not include **drug and alcohol testing history** — that data lives in the [FMCSA Drug & Alcohol Clearinghouse](/blog/fmcsa-drug-alcohol-clearinghouse), a separate federal database with its own query process. And PSP does not include **prior employment information** — for that, carriers run a [49 CFR §391.23 prior-employment investigation](/blog/dot-driver-background-checks-mvr) that pulls drug/alcohol test history and accident reports from the driver's prior carriers.

A defensible carrier hiring program runs **all four**: PSP for roadside-and-crash, MVR for license-and-citation, Clearinghouse for drug-alcohol, and §391.23 for prior employment.

## The FCRA framework around PSP

PSP reports are **consumer reports under the FCRA**. That means a carrier ordering PSP must meet the same disclosure-and-authorization requirements as for any other consumer report: a [standalone written disclosure](/blog/fcra-604b-disclosure-authorization), separate written authorization, and the two-step adverse-action sequence if the report drives a hiring withdrawal. Drivers also have the right under [FCRA §609](/blog/fcra-609-consumer-file-disclosure) to obtain a copy of their PSP report directly from FMCSA's contractor and to dispute inaccurate data through the standard reinvestigation process.

A common carrier mistake is to treat PSP as "DOT data" exempt from FCRA paperwork. It is not. The disclosure-and-authorization workflow is identical to a non-DOT employment background check. Our [adverse-action letter template](/blog/adverse-action-letter-fcra-template) is the right starting point for any PSP-driven adverse decision.

## How to read a PSP report

Two questions matter most. First: is there a **pattern** in the violation data? A single Level III out-of-service violation three years ago is not the same risk profile as eight roadside inspections in the prior twelve months with multiple OOS citations. Carriers should read PSP for trends, not isolated incidents. Second: do the **crash entries** indicate a preventability concern? PSP does not assess preventability, but the role-of-vehicle and crash-type fields give the carrier enough information to ask the right follow-up question — and a thoughtful PSP-driven interview is a more defensible hiring practice than a hard cutoff on any specific violation count.

## Cost and ordering mechanics

A PSP report costs **\\$10** for individual driver-purchase access and **\\$10** per query for carriers ordering through the FMCSA-authorized contractor (NIC Federal). Carriers running CDL hiring at any volume integrate PSP through their CRA, who consolidates the order with MVR, Clearinghouse, and §391.23 verifications. Most CRA-bundled hiring packages for CDL drivers include PSP as standard; if your CRA does not, ask why. Our [transportation industry brief](/industries/transportation) covers the full CDL hiring stack.

## Where PSP falls short, and what fills the gap

PSP is excellent at one thing — surfacing federal roadside-and-crash data for the prior five years — and unhelpful for everything else. It does not answer questions about non-DOT driving history, off-duty conduct, or any pre-2009 history. The right way to think about PSP is as one of four required CDL data sources, not the whole picture. A carrier hiring program built on PSP alone will pass the easy FMCSA audits and fail the hard ones; a hiring program that runs PSP, MVR, Clearinghouse, and §391.23 prior-employment together produces a defensible record under both DOT and FCRA scrutiny.`,
};
