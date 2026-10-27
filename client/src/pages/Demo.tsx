/*
  /demo — demo-booking landing page for Rapid Hire outreach (cold email +
  LinkedIn DMs link here). Self-contained chrome like the /lp/* pages: slim
  header + navy footer, unlinked from the main nav.

  Copy rules (pinned in lib/demoPage.test.ts):
   - Savings always "up to 30%".
   - Speed: "most searches return instantly", "under 8 hours on average",
     always with the timing disclaimer.
   - 100% USA-based support gets its own section (#support).
   - Every figure comes from the approved-claims list (Oct 2026).

  Booking link lives in lib/demoPage.ts (DEMO_BOOKING_URL).
*/
import {
  ArrowRight,
  Check,
  CircleDollarSign,
  Clock,
  Headphones,
  ShieldCheck,
} from "lucide-react";
import { useSeo } from "@/hooks/useSeo";
import { HEADER_LOGO_URL, FOOTER_LOGO_URL, BRAND_NAME } from "@shared/brand";
import { DEMO_PHONE_DISPLAY, resolveDemoBookingCta } from "@/lib/demoPage";
import "@/components/demo/demo-page.css";

const TIMING_NOTE =
  "Timing varies by service, jurisdiction, court access, source availability, and third-party response.";

const ORDER_LOG: { t: string; label: string; status: string; neutral?: boolean }[] = [
  { t: "9:02 AM", label: "Order placed, candidate authorized", status: "Done" },
  { t: "9:02 AM", label: "SSN trace and address history", status: "Instant" },
  { t: "9:03 AM", label: "National criminal database", status: "Instant" },
  { t: "9:03 AM", label: "Sex offender registry", status: "Instant" },
  { t: "1:47 PM", label: "County criminal search", status: "Same day" },
  { t: "Pending", label: "Employment verification", status: "Depends on employer", neutral: true },
];

const PILLARS = [
  {
    key: "Speed",
    Icon: Clock,
    stat: "<8 hrs",
    title: "Average turnaround across all services",
    points: [
      "Most searches return instantly",
      "85%+ of checks clear in under 24 hours",
      "99.4% on-time SLA rate",
    ],
  },
  {
    key: "Price",
    Icon: CircleDollarSign,
    stat: "Up to 30%",
    title: "Saved compared to your current provider",
    points: [
      "31% average savings compared to Big-4 providers",
      "Court fees passed through at cost",
      "No setup fees and no long-term contracts",
    ],
  },
  {
    key: "Accuracy",
    Icon: ShieldCheck,
    stat: "99.9%",
    title: "Verified data accuracy",
    points: [
      "A clean, audit-ready report, not a wall of legalese",
      "FCRA Certified, HIPAA Compliant, PBSA Accredited",
      "10,000+ teams served",
    ],
  },
];

const COMPARE = [
  ["Turnaround", "3–5 business days", "Most searches instant. Under 8 hours on average.*"],
  ["Support", "Offshore ticket queues and chatbot loops", "U.S.-based screening specialists"],
  ["Pricing", "Per-search surcharges", "Clear line-item pricing. Court fees at cost."],
  ["Contract", "Rigid 1–2 year commitments", "No long-term contracts"],
  ["Reports", "Walls of legalese", "Clean, audit-ready reports"],
];

const STEPS = [
  ["Book 15 minutes", "Pick a time that works for you. Bring what you pay per check today if you have it handy."],
  ["Run one real check", "We run the same search your current provider runs, on the same candidate, at no cost to you."],
  ["Compare the results", "Put the price, the turnaround and the support experience next to each other and decide."],
];

const LOGOS = ["H&R Block", "Frito-Lay", "Kraft", "TaylorMade", "Meadow Gold", "Pepsi"];

function CheckList({ items }: { items: string[] }) {
  return (
    <ul className="checks">
      {items.map((p) => (
        <li key={p}>
          <Check className="icon" aria-hidden="true" />
          {p}
        </li>
      ))}
    </ul>
  );
}

export default function Demo() {
  useSeo({
    title: "Book a 15-Minute Demo",
    description:
      "See how much you'd save. Save up to 30% vs your current background check provider, get most searches back instantly, and talk to U.S.-based support. Run a free side-by-side test.",
    canonical: "https://rapidhiresolutions.com/demo",
  });

  const booking = resolveDemoBookingCta();
  const bookingProps = booking.external
    ? { href: booking.href, target: "_blank", rel: "noopener" }
    : { href: booking.href };

  return (
    <div className="rhs-demo" data-testid="demo-page">
      <header className="top">
        <div className="wrap">
          <a href="/" aria-label={`${BRAND_NAME} home`}>
            <img className="logo" src={HEADER_LOGO_URL} alt={BRAND_NAME} width={1100} height={750} />
          </a>
          <div className="top-right">
            <span className="top-phone">{DEMO_PHONE_DISPLAY}</span>
            <a className="btn btn-nav" href="#book">Book a Demo</a>
          </div>
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="wrap">
            <div className="hero-copy">
              <span className="eyebrow">Background screening built for faster hiring</span>
              <h1>Stop Losing Great Candidates While Waiting on Background Checks.</h1>
              <p className="lede">
                Save <strong>up to 30%</strong> compared to your current provider. Most searches come back{" "}
                <strong>instantly</strong>, and the average across all our services is <strong>under 8 hours</strong>.*
              </p>
              <div className="cta-row">
                <a className="btn btn-primary" href="#book">
                  Book a 15-Minute Demo <ArrowRight className="icon" aria-hidden="true" />
                </a>
                <a className="btn btn-secondary" href="#test">See the Free Side-by-Side Test</a>
              </div>
              <p className="usa-note">
                <Headphones className="icon" aria-hidden="true" />
                Every call answered by a U.S.-based screening specialist.
              </p>
            </div>

            <aside className="panel" aria-label="Example order timeline">
              <div className="panel-head">
                <span className="panel-title">One clear path from offer to first day.</span>
                <span className="eyebrow-quiet">Example order</span>
              </div>
              <ol>
                {ORDER_LOG.map((row) => (
                  <li key={row.label}>
                    <span className="t">{row.t}</span>
                    <span>{row.label}</span>
                    <span className={row.neutral ? "pill pill-neutral" : "pill"}>{row.status}</span>
                  </li>
                ))}
              </ol>
              <p className="fine">Illustration only. {TIMING_NOTE}</p>
            </aside>
          </div>
        </section>

        <section className="sec sec-white" id="spa">
          <div className="wrap">
            <div className="sec-head">
              <span className="eyebrow">The SPA Standard</span>
              <h2>Speed. Price. Accuracy.</h2>
              <p className="intro">The three things that decide whether a screening provider helps your hiring or slows it down.</p>
            </div>
            <div className="spa">
              {PILLARS.map(({ key, Icon, stat, title, points }) => (
                <article className="card" key={key}>
                  <div className="card-top">
                    <span className="eyebrow">{key}</span>
                    <Icon className="icon" aria-hidden="true" />
                  </div>
                  <div className="stat">{stat}</div>
                  <h3>{title}</h3>
                  <CheckList items={points} />
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="sec usa" id="support">
          <div className="wrap">
            <div className="usa-copy">
              <span className="eyebrow">
                <Headphones className="icon" aria-hidden="true" />
                100% USA-based support
              </span>
              <h2>Every call answered by a U.S.-based screening specialist.</h2>
              <p>
                When a candidate is waiting and a start date is close, you need a person who knows your account. Our
                support team is entirely in the United States. We never route your calls overseas.
              </p>
              <span className="usa-phone">{DEMO_PHONE_DISPLAY}</span>
            </div>
            <div className="usa-lines" aria-label="What you won't get from us">
              <span>No offshore queues.</span>
              <span>No chatbots.</span>
              <span>No scripts.</span>
            </div>
          </div>
        </section>

        <section className="sec" id="compare">
          <div className="wrap">
            <div className="sec-head">
              <span className="eyebrow">Side by side</span>
              <h2>What changes when you switch</h2>
            </div>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th scope="col">&nbsp;</th>
                    <th scope="col">Typical provider</th>
                    <th scope="col" className="us">Rapid Hire</th>
                  </tr>
                </thead>
                <tbody>
                  {COMPARE.map(([row, old, ours]) => (
                    <tr key={row}>
                      <td className="row">{row}</td>
                      <td className="old">{old}</td>
                      <td className="new">{ours}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className="sec sec-white" id="test">
          <div className="wrap">
            <div className="sec-head">
              <span className="eyebrow">Free side-by-side test</span>
              <h2>Run the same check with both providers</h2>
              <p className="intro">Don't take our word for it. Compare the results yourself.</p>
            </div>
            <ol className="steps">
              {STEPS.map(([title, body], i) => (
                <li className="step" key={title}>
                  <span className="n">{String(i + 1).padStart(2, "0")}</span>
                  <h3>{title}</h3>
                  <p>{body}</p>
                </li>
              ))}
            </ol>
            <div className="pull">
              <p>Send us your current pricing, and we'll show you the difference in writing.</p>
              <a className="btn btn-primary" href="#book">
                Book a 15-Minute Demo <ArrowRight className="icon" aria-hidden="true" />
              </a>
            </div>
          </div>
        </section>

        <div className="trust">
          <div className="wrap">
            <div className="badges">
              {["FCRA Certified", "HIPAA Compliant", "PBSA Accredited"].map((b) => (
                <span className="badge" key={b}>
                  <ShieldCheck className="icon" aria-hidden="true" />
                  {b}
                </span>
              ))}
            </div>
            <div className="logos-row">
              <span className="eyebrow-quiet">Trusted by high-volume hiring teams</span>
              <div className="logos">
                {LOGOS.map((l) => (
                  <span key={l}>{l}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <section className="sec book" id="book">
          <div className="wrap">
            <div className="book-copy">
              <span className="eyebrow">Book your demo</span>
              <h2>See how much you'd save in 15 minutes.</h2>
              <p className="intro">
                You'll meet with Mark Lingo and Constanta from our sales team. They'll walk you through the
                platform and set up your free side-by-side test.
              </p>
              <dl className="contact">
                <div><dt>Phone</dt><dd>{DEMO_PHONE_DISPLAY}</dd></div>
                <div><dt>Pricing and new business</dt><dd>constanta@rapidhiresolutions.com</dd></div>
              </dl>
            </div>
            <div className="book-card">
              <div className="team">
                {[
                  { photo: "/static/demo/mark-lingo.jpg", name: "Mark Lingo", role: "Sales" },
                  { photo: "/static/demo/constanta.jpg", name: "Constanta", role: "Sales" },
                ].map((p) => (
                  <div className="who" key={p.name}>
                    <img className="avatar" src={p.photo} alt={`Photo of ${p.name}`} width={80} height={80} loading="lazy" />
                    <div>
                      <strong>{p.name}</strong>
                      <small>
                        {p.role}, {BRAND_NAME}
                      </small>
                    </div>
                  </div>
                ))}
              </div>
              <CheckList
                items={[
                  "15 minutes, by video or phone",
                  "A walkthrough of ordering and reports",
                  "Your free side-by-side test, set up on the call",
                ]}
              />
              <a className="btn btn-primary" data-testid="demo-booking-cta" {...bookingProps}>
                {booking.label} <ArrowRight className="icon" aria-hidden="true" />
              </a>
              <p className="fine">Custom pricing built around your hiring volume. You'll have your written quote within 48 hours.</p>
            </div>
          </div>
        </section>
      </main>

      <footer>
        <div className="wrap">
          <img className="logo-white" src={FOOTER_LOGO_URL} alt={BRAND_NAME} width={1100} height={750} />
          <span className="signoff">Relax. We've got it handled.</span>
          <span className="foot-line">
            {BRAND_NAME} · 4261 E. University Dr., Suite 30-352, Prosper, TX 75078 · {DEMO_PHONE_DISPLAY} ·
            rapidhiresolutions.com
          </span>
          <p className="fine">
            *{TIMING_NOTE} Employment and education verifications and some county criminal searches take longer.
          </p>
        </div>
      </footer>
    </div>
  );
}
