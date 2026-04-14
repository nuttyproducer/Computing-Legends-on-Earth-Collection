# BitLore — Product Requirements Document
### Computing Legends on Earth: Main Knowledge Base Website

---

## 1. Product Concept & Vision

### Elevator Pitch
BitLore transforms the `Computing Legends on Earth Collection` repository into its primary public experience: an interactive, museum-style knowledge base for exploring the people who shaped computing. It should feel rich, curious, and welcoming — a place where someone can browse for two minutes or stay for an hour.

### The Core Idea
The repository already provides the curation: the people, the domains, the core facts, and the written material. BitLore's job is to turn that foundation into a living experience.

This is not a portfolio site, a generic blog, or a Wikipedia clone. It is the main knowledge base for the project — a digital museum where biographies, milestones, and influence across eras are presented with clarity, narrative flow, and meaningful interaction.

Six domains. Thirty-four legends. One cohesive museum experience.

### Product Principles
- **Museum First:** The experience should invite wandering, discovery, and curiosity — not just lookup.
- **Knowledge Base Always:** Content accuracy, structure, and maintainability are core product requirements, not afterthoughts.
- **Editorial, Not Academic:** The writing and presentation should feel polished and narrative-driven without becoming dry.
- **Accessible by Default:** It must work well for students, educators, engineers, and casual enthusiasts on mobile and desktop.
- **Built to Grow:** Adding a new legend should be straightforward and safe for contributors.

---

## 2. Problem Statement

**Computing history is important, but the experience of learning it is fragmented.**
To understand why Ada Lovelace, Claude Shannon, Donald Knuth, or Geoffrey Hinton matter, readers often have to stitch together biographies, technical explainers, interviews, and scattered historical references. The material exists, but the experience does not.

**The current repository is valuable, but static repository presentation is not enough.**
The repo is already a strong source of curated knowledge. However, README-driven browsing does not fully communicate the human story, historical connections, and sense of progression across domains.

**Most historical and educational resources do not feel engaging on modern devices.**
Dense text walls, weak navigation, and poor mobile reading experiences reduce curiosity instead of rewarding it. This project should make computing history feel approachable and worth exploring.

---

## 3. Target Audience

**Sam — Computer Science Student**
Researches for assignments and personal interest. Wants fast orientation, understandable context, and an experience that makes history feel less intimidating.

**Maya — Senior Software Engineer**
Values technical heritage and wants a trustworthy, visually polished resource she can reference, share, and use while mentoring.

**Prof. Chen — University Educator**
Needs a structured, engaging teaching resource that helps students connect people, ideas, and eras rather than memorising isolated facts.

**Leo — Tech Enthusiast**
Likes exploring timelines, stories, and historical connections. Wants to wander, click, and follow threads across the collection for fun.

**Sarah — Technical Writer / Blogger**
Needs reliable facts, references, and quotable material, but also benefits from a strong information architecture that makes cross-referencing easy.

### Experience Goal Across Personas
Every persona should feel two things at once:
1. **This is trustworthy and useful.**
2. **This is enjoyable to explore.**

---

## 4. Unique Value Proposition

BitLore is a curated, museum-style knowledge base for computing history: organised by domain and era, written with editorial care, and designed to encourage exploration rather than passive reading.

It does not aim to be the largest archive on the internet. Its value comes from curation, narrative structure, visual quality, and the connective tissue between legends.

The goal is not just to answer “Who was this person?” but also:
- Why do they matter?
- What changed because of them?
- Who influenced them, and who did they influence?
- Where do they fit in the broader story of computing?

---

## 5. Core Features (MVP)

### Feature 1 — Museum Lobby Homepage
The homepage acts as the entry hall to the collection: a clear introduction, a live search bar, domain filters, and a visually inviting gallery of legend cards.

**User Story:** As Sam, I land on the homepage and immediately understand what the collection is, how it is organised, and where to start.

**Acceptance Criteria:**
- Intro section explains the purpose of the collection in one screen without overwhelming the user
- Cards load with staggered entrance animation rather than abrupt pop-in
- Typing in the search bar filters the grid in real time, client-side
- Selecting a category pill filters the grid to one domain only
- Skeleton loading state shows briefly before content appears
- Mobile layout is clean, single-column, and touch-friendly
- Homepage includes at least one curated `Start Here` or `Featured Journey` entry point to reinforce the museum feel

**Priority:** Essential

---

### Feature 2 — Domain Gallery Pages
Dedicated pages for each of the six domains: Pioneers, Foundational CS, Systems & Languages, AI Pioneers, Modern AI/ML, and Web & Internet.

**User Story:** As Prof. Chen, I send students directly to a domain page and they quickly understand why that group matters as a cohort.

**Acceptance Criteria:**
- Each category has its own route such as `/category/ai-pioneers`
- Each page includes a concise domain introduction with historical framing
- The grid shows only legends from that domain
- Domain metadata includes era context and a short `why this domain matters` explanation
- The page offers a clear path back to the full collection

**Priority:** Essential

---

### Feature 3 — Editorial Legend Profile Pages
The centrepiece experience: a rich profile page for each legend with hero section, editorial biography, key facts, milestone timeline, pull-quotes, and references.

**User Story:** As Maya, I open Alan Turing's page and get both a high-quality reading experience and a clear sense of his place in computing history.

**Acceptance Criteria:**
- Dynamic routing via slug such as `/legend/alan-turing`
- Hero section includes portrait, full name, lifespan, and domain tag
- A short `Why this person matters` summary appears near the top
- Biography uses long-form prose with responsive editorial typography
- Vertical timeline highlights milestones as they enter the viewport
- Pull-quotes are visually distinct and support one-click copy with toast feedback
- References section appears at the bottom
- Invalid slugs render a friendly `Legend Not Found` page with a return path
- Route transitions use a subtle fade and slide treatment

**Priority:** Essential

---

### Feature 4 — Global Search & Quick Jump
A keyboard-accessible, real-time search across all legends by name, contribution, and domain, available from the homepage and global UI.

**User Story:** As Sarah, I search for `compiler` or `information theory` and immediately get relevant legends without guessing exact names.

**Acceptance Criteria:**
- Search can be focused from the UI and via `Cmd+K` on desktop
- Results update as the user types with a short debounce
- Matching includes name, contribution keywords, and domain metadata
- Results are keyboard navigable
- Empty state includes clear guidance and a reset action
- Search remains useful on mobile without relying on keyboard shortcuts

**Priority:** Essential

---

### Feature 5 — Guided Exploration & Connected Navigation
The site should feel like a museum journey, not a dead-end article stack. Every profile needs onward paths through chronology, domain, and related figures.

**User Story:** As Leo, I finish reading about Grace Hopper and immediately know where to go next — whether by chronology, related figures, or a curated journey.

**Acceptance Criteria:**
- Every profile includes Previous and Next navigation within the overall collection order
- Every profile includes a Related Figures section with at least 3 relevant cards where possible
- Breadcrumbs show `Index > Domain > Legend Name`
- The homepage or profile pages expose at least one curated journey such as `Origins of Computing` or `Birth of AI`
- On mobile, swipe navigation is supported if it can be implemented without harming usability; otherwise buttons remain the primary interaction
- Boundary states are handled gracefully at the first and last legend

**Priority:** Essential

---

### Feature 6 — Motion, Delight, and Museum Feel
Motion should support orientation, reward exploration, and make the site feel alive without becoming distracting.

**Acceptance Criteria:**
- Page transitions use fade + slide up timing around 300ms
- Card grids animate in with stagger on load and filter change
- Timeline items animate into active state on scroll
- Hero portraits may use subtle parallax or depth effects
- All motion respects `prefers-reduced-motion`
- Motion should never block reading, input, or navigation

**Priority:** Important

---

### Feature 7 — Responsive Reading Experience & Accessibility
The reading experience must be strong on phones, tablets, and large screens, with accessibility treated as a core requirement.

**Acceptance Criteria:**
- Body text uses comfortable reading sizes and spacing on mobile and desktop
- All text/background combinations meet WCAG 2.1 AA contrast standards at minimum
- Interactive controls meet minimum touch target sizing on mobile
- Keyboard focus states are visible and consistent
- Content width remains readable and editorial rather than overly wide
- Important information is not conveyed by motion alone

**Priority:** Important

---

### Feature 8 — Static Content Pipeline
The content system should be simple, explicit, and safe for contributors. The site should build from structured local files with no runtime database requirement.

**Acceptance Criteria:**
- Each legend is represented by a structured content file conforming to a strict TypeScript schema
- Adding a new legend should require adding one content file and related image assets only
- Build-time validation catches malformed entries before deployment
- Image assets are stored locally and served efficiently in the static site build
- Content structure supports biography, metadata, milestones, quotes, and references without ad hoc exceptions
- Implementation is compatible with `Vite + React + TypeScript`

**Priority:** Supporting

---

## 6. Out of Scope for MVP

- User accounts, favourites, or saved collections
- Community editing UI or submission forms
- Comments, annotations, or discussion threads
- External APIs or live data integrations
- Gamification systems such as badges or quizzes
- Dark mode toggle in MVP, unless it becomes necessary for accessibility or polish later

---

## 7. Content Architecture

The existing repository defines the six-domain structure. BitLore mirrors that structure exactly while presenting it in a more navigable and expressive form.

| Domain | Era | Count |
|:---|:---|:---|
| Pioneers | Pre-1950 | 5 |
| Foundational CS | 1950s–1970s | 7 |
| Systems & Languages | Mixed | 9 |
| AI Pioneers | 1950s–1980s | 4 |
| Modern AI/ML | Contemporary | 5 |
| Web & Internet | Modern Internet Era | 4 |

Each legend profile should support:
- Full name
- Slug
- Lifespan
- Domain
- Short summary
- Long-form biography
- Key contributions
- Portrait image
- Milestone timeline (`year`, `title`, `description`)
- Pull-quotes
- References
- Optional related figures metadata

The repository's `PERSON_README_TEMPLATE.md` should inform the content schema, but the website should define its own formal TypeScript interface and validation rules for build-time safety.

---

## 8. Design System Summary

**Aesthetic:** Modern editorial with museum sensibility. It should feel curated, premium, and calm — driven by typography, spacing, rhythm, and thoughtful motion rather than visual clutter.

### Colour Palette

| Token | Hex | Use |
|:---|:---|:---|
| Primary Ink | `#0F172A` | Headings, primary UI, strong contrast surfaces |
| Logic Blue | `#2563EB` | Links, active states, focus rings, accent moments |
| Surface Primary | `#FFFFFF` | Main page background |
| Surface Secondary | `#F8FAFC` | Cards, panels, skeleton surfaces |
| Text Secondary | `#475569` | Metadata, body support text, captions |

### Typography

- **Display:** Playfair Display — legend names and major headings
- **UI / Body:** Inter — interface, body copy, metadata
- **Mono:** JetBrains Mono — years, dates, and technical accents

**Scale:** H1 48px · H2 32px · Body Large 18px · Body Small 14px · Mono 14px

### Layout

- 12-column grid on desktop, simplified responsive grid on smaller screens
- Max width: 1280px
- Base unit: 8px
- Generous spacing and clear vertical rhythm

### Motion

- Page transitions: Fade + Slide Up, ~300ms ease-out
- Card entrance: staggered appearance with slight `y` movement and opacity fade
- Timeline activation: visible state change as items enter the viewport
- Portrait depth: subtle parallax or layered motion where appropriate
- All motion respects `prefers-reduced-motion`

---

## 9. Screen States & User Flows

### Screen 1 — Home / Museum Lobby

**State 1.1 — Initial Load**

The page should render immediately with meaningful structure visible: skeletons or placeholder layout are acceptable, but a blank page is not.

- Prominent intro or hero establishes the collection's purpose
- Search bar is visible and inviting
- Domain pills provide immediate orientation
- Card placeholders appear in the grid before hydrated content arrives

---

**State 1.2 — Browsing**

This is the default exploration mode.

- Users see a gallery of legends ordered consistently
- Each card includes portrait, name, domain, and a short descriptor
- Hover and focus states make cards feel interactive without becoming flashy
- A featured path or `Start Here` block encourages exploration beyond raw search

---

**State 1.3 — Active Search / Filter**

- Search and domain filtering can work together
- Matching cards reflow smoothly and remain understandable on mobile
- Search focus state is visually clear and accessible
- Empty states are informative rather than sterile

---

**State 1.4 — No Results**

- Replace the gallery with a calm, centred empty state
- Explain that no legends match the current criteria
- Offer a one-click reset action

---

### Screen 2 — Individual Legend Profile

**State 2.1 — Entry & Hero**

- Route transition or entry motion gives a sense of arrival
- Hero includes portrait, name, lifespan, domain, and a concise significance summary
- Breadcrumbs provide orientation and fast return paths

---

**State 2.2 — Biography & Timeline**

- Long-form biography is the core reading experience
- Timeline sits alongside or below the biography depending on viewport
- Pull-quotes break up reading rhythm and add memorable artifacts
- References anchor the page in source credibility

---

**State 2.3 — Legend Not Found**

- Invalid routes show a clean 404 state
- Users get a clear explanation and a direct return to the homepage or category browsing

---

### Screen 3 — Discovery Continuation

**State 3.1 — Related Figures**

- Related Figures appears below the biography
- Domain relevance is preferred; curated fallbacks are acceptable
- The section should encourage continued exploration rather than feel algorithmic

---

**State 3.2 — Previous / Next Navigation**

- Chronological navigation exists at the bottom of profiles
- Start and end boundaries are handled gracefully
- The transition should feel directional and easy to follow

---

**State 3.3 — Guided Journey Paths**

- The experience should expose at least one thematic route through the content
- A user should be able to follow a story path, not just click randomly
- Guided journeys can begin with a lightweight implementation in MVP and expand later

---

## 10. Success Criteria

The MVP is successful when:

- A first-time visitor understands the purpose of the site within a few seconds of landing
- A user can search for any legend and reach a complete profile in under 3 clicks
- Every live profile page has a complete narrative structure with zero broken internal navigation
- The site feels exploratory, not static, through search, related links, chronology, or guided paths
- The mobile experience is comfortable for both browsing and long-form reading
- The site achieves strong Lighthouse performance on mobile, targeting at least 90 where feasible
- Core content and interactions meet WCAG 2.1 AA accessibility standards
- A contributor can add a new legend through the structured content pipeline without editing app logic

---

## 11. Implementation Phasing

**Phase 1 — Core Museum Experience (MVP)**
Static content pipeline → homepage museum lobby with search + filters → domain pages → legend profile pages → related figures + previous/next navigation → responsive reading layout → foundational motion transitions.

**Phase 2 — Enrichment**
Guided journey paths → stronger timeline animation → pull-quote interactions → richer breadcrumbs and wayfinding → improved category intros and contextual framing.

**Phase 3 — Polish**
Optional swipe interactions → expanded `Cmd+K` quick jump experience → performance tuning → accessibility audit pass → visual refinement.

### Technical Direction
- Frontend: `Vite + React + TypeScript`
- Routing: `React Router`
- Motion: `Framer Motion`
- Styling: `Tailwind CSS`
- Content: local structured files validated at build time
- Deployment: static build via GitHub Pages on the `website` branch

---

*BitLore — the interactive museum and main knowledge base for exploring computing history.*