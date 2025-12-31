# Next.js Design Decisions

## Context
- Project: AboShop newspaper subscription flow built on Next.js 16.1.1 (App Router) with client-side wizard state.
- Goal: Document architectural choices, rendering strategy, routing, and SEO/performance approach for a Next-first implementation (no SPA migration needed).

## Architectural Decisions
- Framework: Next.js App Router for built-in routing, layouts, and metadata handling; avoids manual SPA routing complexity.
- State Management: `SubscriptionContext` (client) holds wizard state, customer data, pricing, and order status. Wrapped by a top-level `Providers` component in `app/layout.jsx`.
- UI Structure: Reused React components under `src/ui` and `src/components`, styled via CSS modules imported in `app/layout.jsx` for global availability.
- Data Layer: Mock services in `src/services/api.js` and `src/services/database.js`; login is permissive (accept any email/password) and creates user records client-side.
- Build/Tooling: Next.js + Turbopack dev server; ESLint 9 with `eslint-config-next`; no custom webpack.

## Rendering Strategy
- Client Components: Wizard pages and shared UI (`LandingPage`, checkout steps, thank-you`) are marked "use client" because they depend on context state and imperative navigation.
- Server Components: Reserved for future data fetching; current tree is client-heavy by design for interactive flow.
- Navigation: `next/navigation` for pushes between steps; no legacy React Router.
- State Persistence: In-memory only (no cookies/localStorage) to keep flows deterministic between SSR and hydration.

## Route Structure (App Router)
- `/` → Landing page
- `/abokauf/zeitung/druckausgabe` → Delivery address step
- `/abokauf/zeitung/druckausgabe/konfigurator` → Product configuration
- `/abokauf/zeitung/druckausgabe/checkout/login` → Login/register (permissive auth)
- `/abokauf/zeitung/druckausgabe/checkout/billing` → Billing address
- `/abokauf/zeitung/druckausgabe/checkout/payment` → Payment method
- `/abokauf/zeitung/druckausgabe/checkout/review` → Order review/submit
- `/abokauf/zeitung/druckausgabe/thankyou` → Confirmation page

## SEO & Performance Plan
- Metadata: Use Next metadata in `app/layout.jsx` and per-page exports (`title`, `description`). Add Open Graph/Twitter tags in the future via the metadata API.
- Routing for SEO: Descriptive, nested URLs preserved from SPA plan; avoid query-param steps.
- Rendering Choice: Client components where interactivity is required; keep deterministic renders (no random per-render output) to avoid hydration drift and layout shifts.
- Assets & Styling: Global CSS imported once in layout to minimize duplicate payload; consider CSS pruning when moving to production.
- Images/Static: No large media; if added, use `next/image` for optimization and responsive sizing.
- Performance Guardrails:
  - Avoid blocking data fetches on the critical path; mock services already resolve quickly.
  - Keep bundle lean by reusing components and avoiding third-party UI libraries.
  - Use `useMemo`/`useCallback` where needed to prevent re-computation in hot paths.
- Accessibility (a11y): Use semantic headings, label form inputs, provide focusable controls; keep color contrast in CSS.
- Internationalization: Not enabled; future plan is to add `app/[locale]` segments if needed.
- Caching/ISR: Not applied because pages are highly dynamic; future: add ISR for marketing pages only.

## Known Trade-offs
- Heavy client-side flow means larger JS bundle; acceptable for multi-step wizard. Future work: extract non-interactive sections to server components.
- Mock services run client-side; replace with server actions/route handlers when backend is available.

## Next Steps (optional)
- Add per-route metadata files for richer SEO (OG/Twitter).
- Introduce `next/image` for any hero/illustration assets.
- Consider lightweight persistence (e.g., session storage) to restore wizard progress safely.
