# Follow-up scope

## 1. Backend + DB (web-db-user upgrade)
- [ ] Run webdev_add_feature web-db-user
- [ ] Create contact_submissions table
- [ ] Add POST /api/contact route persisting submission
- [ ] Wire Contact.tsx submit handler to fetch /api/contact

## 2. About page
- [ ] Create /pages/About.tsx
- [ ] Route /about in App.tsx
- [ ] Header NAV: About → /about (route, not placeholder)
- [ ] Footer Company → About wired

## 3. Pricing page
- [ ] Create /pages/Pricing.tsx (Starter / Volume / Enterprise)
- [ ] Route /pricing in App.tsx
- [ ] Header NAV: Pricing → /pricing (route, not placeholder)
- [ ] Cross-link "Get a quote" CTAs to /contact

## 4. QA + ship
- [ ] Visit each new route in preview
- [ ] Submit a test contact submission, verify DB row
- [ ] Save checkpoint, deliver
