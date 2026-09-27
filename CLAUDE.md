# pedro_luis_imoveis_dashboard

Admin panel for Pedro Luis Imóveis — listing CRUD, uploads, auth. Next.js 16
(App Router, Turbopack), React 19, Tailwind 4, react-hook-form + zod, Zustand,
SWR, Google Maps, recharts.

Talks to `pedro_luis_imoveis_backend` on `:4000`. General code style,
architecture and the design system live in `../../code_style/` (`next.md`,
`design.md`); this file is only what is specific to this app.

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
    layout.tsx  providers.tsx      server layout (metadata, noindex, Inter); ThemeProvider inside <body>
    page.tsx                       redirects to /dashboard; AuthGuard sends a stranger to /login
    (auth)/login/
    (content)/
      layout.tsx                   the fixed shell
      _components/                 auth_guard, nav_bar, page_header, header_actions, search_modal
      dashboard/  analytics/  notifications/  settings/
      real_estate/
        page.tsx  add/  edit/[id]/
        _components/               real_estate_card, real_estate_form/{index, schema, components/}, delete_real_estate
        _utils/                    options (districts, feature suggestions), property_glyphs (copied from the frontend)
  core/
    controllers/                   auth_controller (session), search_controller (Ctrl K modal)
    models/                        real_estate (same file as the frontend's), user
  components/                      the field kit (input_field, select_field, stepper_field, tags_field, …),
                                   form, select, switch, chart, dropzone, google_maps, pagination, empty_state
  hooks/                           use_api_fetch, use_debounce, use_is_mounted
  services/                        api (axios + auth cookie)
  utils/                           cn, format, map_colors
  styles/                          index.css → tokens, theme, base, utilities (same as the frontend)
public/logo/                       logo, full_logo, icon.png
```

## Rules that matter here

- **Never hardcode the API url.** Use `api` from `@/services` with relative
  paths. Base url is `NEXT_PUBLIC_API_URL`.
- **Property types are `apartment | house | land | shop | sobrado`**, matching
  the backend enum. `core/models/real_estate.ts` is the frontend's file — change
  both.
- Controllers hold state only. `/login` posts from the login page and `/session`
  is read by `AuthGuard`; neither lives in a store.
- Multipart writes send the record as a JSON string under `metadata`, with
  `thumbnail` and `images` as file fields — that is what the API expects.
- Update is `PUT /real_estate/:_id` (id in the path, not the body).
- Form controls belong inside `<Form>`; `InputField` / `SelectField` read from
  `useFormContext`, so they break outside it. Outside a form use `SelectPlain`.
- Colours only from the roles in `styles/tokens.css`; Tailwind's own palette is
  off. Charts take `var(--chart-1…5)`.
- Sizes use `rem` arbitrary values; root font-size is 62.5%, so `1rem = 10px`.

## Known gaps

- Existing gallery images cannot be deleted individually — the API replaces the
  whole gallery on write. Needs a partial-gallery endpoint.
- `AuthGuard` is client-side only; there is no middleware, so protected pages are
  served and then hidden.
- Análises, Notificações and Configurações are empty states.
- The "Visualizações" and "Contatos WhatsApp" tiles and the activity feed are
  sample data, badged `exemplo`. The growth chart shows an empty state because
  every listing shares one import date.
- No test suite.

## Extra rules learned the hard way

- **Sizing goes on `FieldWrapper`, not the control it wraps.** The wrapper is the
  flex item a parent measures; a width on the inner control is ignored.
- **Read form values with `getValues`, not the render closure.** Several rapid
  clicks on `StepperField` or `TagsField` otherwise all see the same stale value.
- **`html, body { overflow: hidden }` is deliberate** (styles/base.css). The shell
  is fixed and only inner panes scroll; without it opening a Radix select shifted
  the layout sideways.
- `real_estate_card` is the frontend's `preview` card and backs the form's live
  preview. Restyle one, restyle the other.
