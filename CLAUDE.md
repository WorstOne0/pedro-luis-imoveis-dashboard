# pedro_luis_imoveis_dashboard

Admin panel for Pedro Luis Imóveis — listing CRUD, uploads, auth. Next.js 16
(App Router, Turbopack), React 19, Tailwind 4, shadcn/ui, react-hook-form + zod,
Zustand, SWR, Google Maps.

Talks to `pedro_luis_imoveis_backend` on `:4000`.

## Working agreements

**Do not commit unless I ask.** Leave changes in the working tree so I can
review the diff. Describe what changed and let me decide.

- Portuguese for all UI copy; English for code and comments.
- Do not add dependencies without saying so first.
- Verify in a browser against the running backend, logged in — not just a build.

## Layout

```
src/
  app/
    (auth)/login
    (content)/{dashboard,real_estate,analytics,notifications,settings}
  components/     <name>/index.tsx, re-exported from components/index.ts
  hooks/          useApiFetch, useMount
  services/       api_service (axios), auth_guard, google maps, theme
  store/          useAuthStore, useRealEstateStore, useSearchStore
```

## Rules that matter here

- **Never hardcode the API url.** Use `apiService` from `@/services` with
  relative paths. Base url is `NEXT_PUBLIC_API_URL`.
- **Property types are `apartment | house | land | shop | sobrado`**, matching
  the backend enum.
- Multipart writes send the record as a JSON string under `metadata`, with
  `thumbnail` and `images` as file fields — that is what the API expects.
- Update is `PUT /real_estate/:_id` (id in the path, not the body).
- Form controls belong inside `<Form>`; `InputWithLabel` / `SelectWithLabel`
  read from `useFormContext`, so they break outside it.
- Sizes use `rem` arbitrary values; root font-size is 62.5%, so `1rem = 10px`.

## Known gaps

- Existing gallery images cannot be deleted individually — the API replaces the
  whole gallery on write, so a per-image delete would be a promise the backend
  cannot keep. Needs a partial-gallery endpoint.
- `AuthGuard` is client-side only; there is no middleware, so protected pages are
  served and then hidden.
- `SearchModal` renders an empty box.
- Notificações, Análises and Configurações are stubs.
- The dashboard's "Visualizações" and "Contatos WhatsApp" tiles are sample data,
  badged `exemplo`. The growth chart shows an empty state because every listing
  shares one import date.
- No test suite.

## Extra rules learned the hard way

- **Sizing goes on `FieldWrapper`, not the control it wraps.** The wrapper is the
  flex item a parent measures; a width on the inner control is ignored. Two
  selects once squeezed the listing search box to 111px.
- **Read form values with `getValues`, not the render closure.** `StepperField`
  and `TagsField` both hit this: several rapid clicks all saw the same stale
  value and only advanced once.
- **`html, body { overflow: hidden }` is deliberate.** The shell is fixed and only
  inner panes scroll; without it the page scrolled and opening a Radix select
  shifted the layout sideways.
- **Route-local code lives beside its route** in `_components/`. `src/components`
  is only for what more than one route uses.
- `real_estate_card` mirrors the frontend component of the same name, and its
  `preview` variant backs the form's live preview. Restyle one, restyle the other.
