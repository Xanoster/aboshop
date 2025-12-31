Next.js Design Decisions (Phase 1 Documentation)

Scope:
This document captures the architectural, rendering, routing, and SEO/performance decisions for implementing the AboShop project directly in Next.js.

Architectural Decisions:
- Framework: Next.js (App Router) used for routing and data fetching.
- Language: JavaScript with React 18 features.
- Styling: Standard CSS files (global and component-specific) to keep things simple.
- State Management: React Context API used for the subscription wizard state (delivery, configuration, billing, payment). No Redux needed.
- Data Layer: Local mock services used for price calculation and simulation.
- Form Handling: Standard React controlled components with inline validation.

Rendering Strategy:
- Client Components: Used for all wizard steps (delivery, configurator, billing, payment, review, thank-you) because they require user interaction and client-side state.
- Shared Layout: The root layout wraps pages with the global styles and the context provider.
- Data Fetching: Synchronous local calls on the client side since we are using mock data.
- Caching: Standard Next.js caching for static assets.

Route Structure:
- / -> Landing page
- /abokauf/zeitung/druckausgabe -> Delivery address (Step 1)
- /abokauf/zeitung/druckausgabe/konfigurator -> Configurator (Step 2)
- /abokauf/zeitung/druckausgabe/checkout/billing -> Billing address (Step 3)
- /abokauf/zeitung/druckausgabe/checkout/payment -> Payment method (Step 4)
- /abokauf/zeitung/druckausgabe/checkout/review -> Review order (Step 5)
- /abokauf/zeitung/druckausgabe/thankyou -> Confirmation (Step 6)

SEO Strategy:
- Metadata: Each route exports metadata for title and description.
- Indexing: The landing page is indexable. Wizard steps can be excluded via robots.txt if needed.
- Structured Data: JSON-LD can be added to the configurator to describe the subscription product.
- Linking: The final page links back to the external homepage (tagesschau.de).
- Accessibility: Semantic HTML tags and proper labels used for forms to help search engines understand the content.

Performance Plan:
- Bundling: Next.js automatically splits code by route.
- Assets: Minimal use of images; icons are text-based or SVG to keep the bundle small.
- CSS: CSS is scoped or shared efficiently to avoid large files.
- Runtime: Price calculation happens locally on the client, avoiding network delays.

Justification:
This design matches the MVP requirements. It uses a simple URL structure and client-side rendering for the interactive wizard parts, which provides a smooth user experience similar to a Single Page Application.

Risks and Follow-ups:
- If a real backend is added later, we would move data fetching to server components.
- We can add more structured data for SEO if the shop becomes public.
