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

Real, currently broken, worth fixing before anything else:

- `real_estate/edit/[id]/page.tsx` is a stub that renders the id.
- On the add page the "Salvar" button is a `div` with no handler; the only
  working submit is a leftover `<button>Teste</button>`.
- `SelectWithLabel` still offers shadcn demo options (Banana, Blueberry, Grapes)
  instead of property types.
- `Pagination` accepts `setCurrentPage`/`totalPages` but ignores both — the page
  numbers are hardcoded and no button has a handler.
- The list page search field is validated with `z.string().email()`, so it can
  never submit.
- The navbar hardcodes "Lucca G." and a GitHub avatar instead of reading
  `useAuthStore().user`; the logout icon has no handler though `logout()` exists.
- `SearchModal` renders an empty box.
- Dropzone uses placeholder anime images from `public/test/` as drag feedback.
- `AuthGuard` is client-side only; there is no middleware, so protected pages
  are served and then hidden.
