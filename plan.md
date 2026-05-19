# AIthusiast — plan.md

## 1) Objectives
- Deliver a premium, futuristic AI discovery platform that recommends the *best AI tool for a specific use case*.
- Prove the core workflow works end-to-end: **query → LLM reasoning over curated tools DB → ranked JSON recommendations**.
- Build a V1 app around the proven core: cinematic homepage + search + tools + articles + categories.
- Add optional user accounts + favorites after V1 is stable.

---

## 2) Implementation Steps (Phased)

### Phase 1 — Core AI Search/Recommendation POC (Isolation)
**Goal:** Validate emergentintegrations + **Gemini 2.5 Flash** can reliably output **strict JSON** recommendations grounded in a curated tools list.

**Steps**
1. Add backend env: `EMERGENT_LLM_KEY=...` and load via dotenv.
2. Websearch (best practice): LLM structured JSON output + schema validation + retry/repair patterns.
3. Create minimal Python POC script:
   - Load a small representative tools subset (10–15) with `id,name,category,description,strengths,tags,url`.
   - Prompt Gemini to return JSON: `{query, intent, filters, recommendations:[{tool_id, score, why, best_for, caveats}]}`.
   - Enforce JSON parsing + validation (pydantic/jsonschema) + 1 retry with “return valid JSON only”.
4. Add hybrid fallback logic in the script:
   - If JSON invalid/empty, run local similarity (simple keyword/TF-IDF) and return deterministic results.
5. Run test matrix (at least 12 queries): students, cinematic images, industrial design, coding, presentations, productivity, UI design, research, voice gen, “like Midjourney but cheaper”, “open-source local”, “best for beginners”.
6. Iterate prompts until outputs are stable, fast, and parseable.

**User stories (Phase 1)**
1. As a user, I want to type “Best AI for students” and get a ranked list of tools with clear reasons.
2. As a user, I want recommendations to be grounded in the curated tools database (no hallucinated tools).
3. As a user, I want the system to handle vague queries (“AI for productivity”) and still return useful results.
4. As a user, I want the system to handle constraints (“free”, “no-code”, “open-source”) when present.
5. As a user, I want results even if the LLM fails (fallback search).

**Deliverables**
- `poc_ai_search.py` (or equivalent) proving: LLM call works + JSON schema + fallback + sample outputs logged.

---

### Phase 2 — V1 App Development (No Auth)
**Goal:** Build the full discovery experience around the proven search endpoint with premium UI.

**Backend (FastAPI + MongoDB)**
1. Data models/collections:
   - `tools` (50–80 curated)
   - `articles` (8–12 editorial)
   - `categories` (derived or explicit)
2. Seed scripts:
   - Seed tools with normalized categories + tags + strengths + logo url.
   - Seed articles with `slug,title,deck,sections,cover,reading_time,tags`.
3. API endpoints:
   - `GET /api/tools` (search/filter/sort/trending)
   - `GET /api/tools/{id}`
   - `GET /api/articles`, `GET /api/articles/{slug}`
   - `GET /api/categories`
   - `POST /api/search` (hybrid: LLM → validate → fallback)
4. Hardening:
   - Response caching (short TTL) for repeat queries.
   - Guardrails: LLM must choose only from provided tool IDs.

**Frontend (React + Tailwind + shadcn/ui)**
1. Global design system:
   - Dark base `#05010A`, purple glow accents `#7C3AED/#A855F7`, glass layers, blur, subtle borders.
   - Fonts: Panchang headings, Montserrat Light body.
2. Homepage sections:
   - Hero (cinematic gradients)
   - Giant AI search interface (centerpiece)
   - Trending AI tools (glass cards)
   - Featured articles
   - Categories (glass pills)
   - Recommended stacks teaser
   - Footer
3. Core screens:
   - Tools listing + filters
   - Tool detail page (strengths/tags/why-use)
   - Articles listing + article detail (premium editorial layout)
   - Search results view with ranked recommendations + reasoning
4. Motion/UX polish:
   - Hover glows, subtle floating, blur transitions, smooth loading states.

**User stories (Phase 2)**
1. As a user, I want to land on a cinematic homepage that immediately signals premium AI discovery.
2. As a user, I want the search to feel like a futuristic OS: smooth input, animated results, and clear ranking.
3. As a user, I want to browse trending tools as beautiful glass cards and quickly open details.
4. As a user, I want to filter by category pills (Image, Coding, Voice, etc.) without leaving the flow.
5. As a user, I want short, visual articles that help me pick tools quickly (not long blogs).

**End-of-phase testing**
- One full E2E pass: homepage → search → tool detail → article detail → category filter → fallback behavior.

---

### Phase 3 — Recommendation “Stacks” + Editorial Curation + Perf
**Goal:** Make recommendations feel curated/personal without needing accounts.

**Steps**
1. Add “Stacks” concept (curated collections) in DB:
   - `stacks`: `{slug,title,persona,use_case,tools[],short_rationale}`.
2. Add UI module: “Best AI stack for students/startups/creators/researchers”.
3. Improve ranking:
   - Blend LLM score with lightweight local signals (category match, tag overlap).
4. Perf/quality:
   - Caching, request debouncing, skeleton loaders, error states.

**User stories (Phase 3)**
1. As a user, I want curated stacks so I can adopt a full workflow, not just a single tool.
2. As a user, I want each stack to explain *why these tools work together*.
3. As a user, I want to compare tools quickly (strengths + best-for + caveats).
4. As a user, I want fast responses and smooth transitions even on slow connections.
5. As a user, I want recommendations to stay consistent and not change wildly between identical searches.

**End-of-phase testing**
- E2E pass: stacks → tool pages → search integration; validate caching + performance.

---

### Phase 4 — Optional User Accounts + Favorites (Ask-before-auth checkpoint)
**Goal:** Add accounts only after V1 is stable; enable cross-device favorites.

**Steps**
1. Confirm with user before implementing auth (auth increases testing complexity).
2. Implement email/password auth (JWT) + users collection.
3. Favorites:
   - `POST/DELETE /api/favorites/{tool_id}`, `GET /api/favorites`.
   - For non-auth users: keep localStorage favorites.
4. UI:
   - “Save” button on tool cards + tool detail.
   - Favorites page.

**User stories (Phase 4)**
1. As a user, I want to browse the site without logging in.
2. As a user, I want to create an account to save favorites across devices.
3. As a user, I want one-click saving/removing favorites from tool cards.
4. As a user, I want a clean favorites page that feels like a curated shelf.
5. As a user, I want my favorites to influence future recommendations (optional toggle).

**End-of-phase testing**
- E2E pass: signup/login/logout + favorites sync + anonymous local favorites.

---

## 3) Next Actions (Immediate)
1. Create Phase 1 POC script using emergentintegrations + Gemini 2.5 Flash with strict JSON schema.
2. Run the POC test matrix; iterate prompt/validation until stable.
3. Lock the tool schema + seed format for the 50–80 curated tools.
4. Once POC passes, implement `/api/search` in FastAPI using the same proven logic.

---

## 4) Success Criteria
**POC success (must pass before Phase 2):**
- Gemini 2.5 Flash returns parseable JSON ≥ 90% of runs across the query matrix.
- Recommendations reference only provided tool IDs; no hallucinated tools.
- Fallback returns sensible results when LLM output is invalid/empty.

**V1 app success:**
- Homepage renders premium aesthetic (dark + purple glow + glass) with smooth animations.
- Search: query → ranked results with reasoning in < ~2–3s typical.
- Tools/articles browsing works with correct routing, loading states, and error handling.

**Overall quality:**
- No broken core flow; incremental E2E tests pass at end of each phase.
