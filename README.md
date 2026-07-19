# Pedro Luis Imóveis — Dashboard

> Admin panel for a real estate broker in Cascavel/PR. Listing CRUD with a live
> card preview, image and video uploads, and portfolio analytics.

One of five repositories that make up the product:

| Repository | Role |
|---|---|
| frontend | Public site — map + listings |
| **dashboard** (this one) | Admin panel — listing CRUD, uploads, auth |
| backend | REST API |
| images | Upload, resize and serve photos/video |
| database | MongoDB container + backup scripts |

---

## Features

- **Portfolio dashboard** — listing count, portfolio value, growth over time,
  breakdown by type and by district, recently added listings. Everything except
  the two traffic tiles comes from real API data, and the sample tiles are
  labelled `exemplo` in the UI so they can't be mistaken for real numbers.
- **Listing form** — four steps (cover → details → location → gallery) with a
  **live preview** of the public card as you type, rendered by the same component
  the public site ships.
- **Uploads** — drag-and-drop for cover and gallery. On edit, the images already
  saved are shown rather than an empty box.
- **Map picker** — click to set a listing's coordinates.
- **Search, filter and sort** the catalogue, with pagination.
- **JWT auth** with a route guard.
- **Dark / light mode**, system-aware with a manual toggle.

---

## Tech stack

Next.js 16 (App Router, Turbopack) · React 19 · TypeScript · Tailwind CSS 4 ·
shadcn/ui · react-hook-form + Zod · Zustand · SWR · Recharts ·
`@react-google-maps/api`

---

## Getting started

Requires Node 20+, the backend on `:4000` and the images service on `:3200`.

```bash
npm install
cp .env.example .env     # then fill it in
npm run dev              # use a port other than 3000 if the public site is running
```

### Environment

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_API_URL` | Backend base url |
| `NEXT_PUBLIC_GOOGLE_MAPS_API` | Google Maps JS API key, for the location picker |

---

## Project structure

```
src/
  app/
    (auth)/login
    (content)/
      layout.tsx          app shell — sidebar + page header
      dashboard/          portfolio overview
      real_estate/
        page.tsx          catalogue grid
        add/  edit/[id]/
        _components/      real_estate_form, real_estate_card
      analytics/  notifications/  settings/
  components/     shared — nav_bar, page_header, form fields, ui/
  hooks/          useApiFetch (SWR), useDebounce, useIsMounted
  lib/            real_estate_options, utils
  services/       axios, auth guard, google maps, theme
  store/          useAuthStore, useRealEstateStore, useSearchStore
```

Route-local code lives beside its route in `_components/`. `src/components` is
reserved for what more than one route uses.

---

## Notes for anyone reading the code

**The listing card is shared with the public site.** `real_estate_card` here
mirrors the frontend's component of the same name, and its `preview` variant is
what the form renders as a live preview — fed form values instead of a saved
record. Restyle one, restyle the other.

**Multipart writes send the record as a JSON string under `metadata`**, with
`thumbnail` and `images` as file fields. That is what the API expects. Update is
`PUT /real_estate/:_id`, with the id in the path, not the body.

**Form controls must live inside `<Form>`.** `InputField`, `SelectField` and the
rest read from `useFormContext`, so they break outside it.

**Sizing goes on `FieldWrapper`, not on the control it wraps.** The wrapper is
what a flex parent measures; a width left on the inner control is ignored. This
was a real bug — two selects squeezed the search box to 111px.

**The app shell is fixed.** `html, body { overflow: hidden }`; only inner panes
scroll. Without it the whole page scrolled, and opening a Radix select shifted
the layout sideways.

**Step from the live form value, not the render closure.** `StepperField` and
`TagsField` both read via `getValues`, because reading `field.value` in the
render closure meant several rapid clicks all saw the same stale number.

---

## Known limitations

- Existing gallery images can't be deleted individually — the API replaces the
  whole gallery on write, so a per-image delete would be a promise the backend
  can't keep. Needs a partial-gallery endpoint.
- `AuthGuard` is client-side only. There is no middleware, so protected pages are
  served and then hidden.
- `SearchModal` renders an empty box; Notificações, Análises and Configurações
  are stubs.
- The growth chart shows an empty state because every listing shares one import
  date. It populates as listings are added over time.
- No automated tests. Verification is manual, against the running backend.

---

## Project status and contributions

This is a commissioned project built for a specific business. It is **not** an
open source project and is not accepting contributions, feature requests or
pull requests.

## Copyright and licence

**Copyright © 2026 Lucca Gabriel. All rights reserved.**

This repository is published so the source can be **read**, as a portfolio piece
and for reference. It is deliberately published **without a licence**, which
under default copyright law means all rights are reserved.

Viewing and forking within GitHub are permitted by GitHub's Terms of Service.
That does **not** grant permission to use, copy, modify, deploy or redistribute
this code. Third-party dependencies keep their own licences, and Pedro Luis
Imóveis brand assets are the property of their owner.

See [`COPYRIGHT.md`](COPYRIGHT.md) for the full terms.
