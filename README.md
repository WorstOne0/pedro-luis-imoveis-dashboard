# Pedro Luis Imóveis — Dashboard

> Admin dashboard for managing real estate listings, built with Next.js 15 and React 19.

---

## Features

- **JWT Authentication** — Secure login with token stored in cookies; automatic session validation and redirect on expiry
- **Role-based Route Guards** — `withAuth` HOC enforces `public` / `protected` route access
- **Real Estate CRUD** — List, add, and edit property listings with images, address, and attributes
- **Google Maps Integration** — Interactive map with district polygon overlays for geographic browsing
- **Search & Filter** — Filter listings by price range, type, rooms, and area
- **Paginated Listing View** — Grid/list layout toggle with pagination controls
- **Analytics Page** — Chart-based analytics powered by Recharts
- **Dark/Light Theme** — System-aware theme switching via `next-themes`
- **Drag & Drop Uploads** — Image upload via `react-dropzone`

---

## Preview

The app ships with the following main sections:

| Route | Description |
|---|---|
| `/login` | Authentication screen |
| `/dashboard` | Overview / summary cards |
| `/real_estate` | Paginated listing of all properties |
| `/real_estate/add` | Form to create a new listing |
| `/real_estate/edit/[id]` | Edit an existing listing |
| `/analytics` | Charts and statistics |
| `/notifications` | Notification center |
| `/settings` | App settings |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router, Turbopack) |
| UI Library | React 19 |
| Styling | Tailwind CSS 4 |
| Component Primitives | Radix UI |
| State Management | Zustand |
| Data Fetching | SWR + Axios |
| Forms & Validation | React Hook Form + Zod |
| Maps | @react-google-maps/api |
| Charts | Recharts |
| Animations | Framer Motion |
| Auth | JWT via js-cookie + react-jwt |
| Language | TypeScript 5 |

---

## Project Structure

```
src/
├── app/
│   ├── layout.tsx               # Root layout (theme, font)
│   ├── page.tsx                 # Root redirect
│   ├── (auth)/
│   │   └── login/page.tsx       # Login page
│   └── (content)/
│       ├── layout.tsx           # Authenticated shell layout (navbar, sidebar)
│       ├── dashboard/page.tsx   # Dashboard overview
│       ├── real_estate/         # Listing, add, edit pages
│       ├── analytics/page.tsx
│       ├── notifications/page.tsx
│       └── settings/page.tsx
├── components/                  # Shared UI components (cards, modals, nav, pagination, etc.)
├── services/
│   ├── api_service.ts           # Axios instance with Bearer token interceptor
│   ├── google_maps.tsx          # Google Maps provider wrapper
│   ├── theme_provider.tsx       # next-themes wrapper
│   └── high_order_components/
│       ├── withAuth.tsx         # Route-level auth guard HOC
│       └── withHydration.tsx    # SSR hydration guard HOC
├── store/
│   ├── useAuthStore.tsx         # Auth state (login, logout, session)
│   ├── useRealEstateStore.tsx   # Real estate list & selection state
│   └── useSearchStore.tsx       # Search/filter state
├── hooks/
│   └── useApiFetch.ts           # Generic SWR-based data fetching hook
└── utils/
    └── districts_geo.js         # GeoJSON data for district polygon overlays
```

---

## Installation

**Prerequisites:** Node.js 18+, a running backend at `http://localhost:4000`

```bash
# 1. Clone the repository
git clone <repo-url>
cd pedro_luis_imoveis_dashboard

# 2. Install dependencies
npm install

# 3. Configure environment variables
# Create a .env file and add your Google Maps API key:
echo 'NEXT_PUBLIC_GOOGLE_MAPS_API=your_key_here' > .env

# 4. Start the development server
npm run dev
```

---

## Usage

```bash
# Development (Turbopack)
npm run dev

# Production build
npm run build
npm start

# Lint
npm run lint
```

Open [http://localhost:3000](http://localhost:3000) and log in with your credentials.

---

## API / Integrations

The dashboard communicates with a REST API running at `http://localhost:4000`.

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/login` | Authenticate and receive `accessToken` |
| `GET` | `/session` | Validate current session |
| `GET` | `/real_estate` | Fetch all listings |
| `POST` | `/real_estate` | Create a listing |
| `PUT` | `/real_estate/:id` | Update a listing |

All requests include `Authorization: Bearer <token>` automatically via the Axios interceptor. A `401` response clears the cookie and redirects to `/login`.

**Google Maps** — requires `NEXT_PUBLIC_GOOGLE_MAPS_API` set in `.env`.

---

## Testing

Not configured from code — no test suite is present in the repository.

---

## Roadmap

- [ ] Role-based permissions (admin vs. agent)
- [ ] Real-time notifications
- [ ] Complete analytics charts with live data
- [ ] Dashboard summary cards connected to backend
- [ ] Mobile-responsive layout
- [ ] End-to-end test suite

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feat/your-feature`
3. Commit your changes: `git commit -m "feat: add your feature"`
4. Push and open a pull request

---

## License

Private project — © 2025 Pedro Luis Imóveis. All rights reserved.

---

**Short description (160 chars):** Admin dashboard for Pedro Luis Imóveis — manage property listings, Google Maps, analytics and auth. Next.js 15 + React 19 + Zustand.

**Suggested GitHub tags:** `nextjs`, `react`, `tailwindcss`, `real-estate`, `dashboard`, `typescript`, `zustand`, `google-maps`, `admin-panel`, `radix-ui`
