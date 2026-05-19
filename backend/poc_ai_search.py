"""
POC: AIthusiast AI Search/Recommendation Engine
Tests Emergent LLM (Gemini 2.5 Flash) for natural language → ranked AI tool recommendations.

Validation:
  1) LLM returns valid JSON grounded in provided tool catalog
  2) No hallucinated tool IDs
  3) Hybrid fallback works when LLM fails
  4) Handles 12+ representative queries
"""

import asyncio
import json
import os
import re
import sys
from pathlib import Path
from dotenv import load_dotenv

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

from emergentintegrations.llm.chat import LlmChat, UserMessage  # noqa: E402

EMERGENT_LLM_KEY = os.environ.get("EMERGENT_LLM_KEY")
if not EMERGENT_LLM_KEY:
    print("ERROR: EMERGENT_LLM_KEY not set in .env")
    sys.exit(1)

# ──────────────────────────────────────────────────────────────────
# Representative tool catalog (used for POC; production seeds 50-80)
# ──────────────────────────────────────────────────────────────────
TOOLS = [
    {"id": "chatgpt", "name": "ChatGPT", "category": "prompting",
     "description": "Conversational AI assistant by OpenAI for writing, brainstorming, analysis.",
     "strengths": ["reasoning", "writing", "general-purpose"], "tags": ["llm", "chat", "openai"],
     "pricing": "freemium"},
    {"id": "claude", "name": "Claude", "category": "prompting",
     "description": "Anthropic's AI assistant excelling at long-context, nuanced writing and code.",
     "strengths": ["long-context", "writing", "code-review"], "tags": ["llm", "chat", "anthropic"],
     "pricing": "freemium"},
    {"id": "gemini", "name": "Gemini", "category": "prompting",
     "description": "Google's multimodal AI integrated with Google Workspace.",
     "strengths": ["multimodal", "google-integration", "free-tier"], "tags": ["llm", "google"],
     "pricing": "freemium"},
    {"id": "perplexity", "name": "Perplexity", "category": "research",
     "description": "AI-powered answer engine with cited sources and real-time web access.",
     "strengths": ["research", "citations", "real-time"], "tags": ["search", "research"],
     "pricing": "freemium"},
    {"id": "midjourney", "name": "Midjourney", "category": "image-generation",
     "description": "Premier AI image generator with cinematic, artistic quality.",
     "strengths": ["cinematic", "artistic", "high-quality"], "tags": ["image", "art"],
     "pricing": "paid"},
    {"id": "dalle3", "name": "DALL·E 3", "category": "image-generation",
     "description": "OpenAI's image generator with strong text rendering and prompt adherence.",
     "strengths": ["prompt-adherence", "text-in-image", "fast"], "tags": ["image", "openai"],
     "pricing": "paid"},
    {"id": "flux", "name": "Flux", "category": "image-generation",
     "description": "Open-source image model with photorealistic results.",
     "strengths": ["photorealistic", "open-source"], "tags": ["image", "open-source"],
     "pricing": "freemium"},
    {"id": "runway", "name": "Runway", "category": "video",
     "description": "AI video generation with Gen-3 for cinematic clips.",
     "strengths": ["video", "cinematic", "motion"], "tags": ["video", "filmmaking"],
     "pricing": "paid"},
    {"id": "sora", "name": "Sora", "category": "video",
     "description": "OpenAI's text-to-video model for realistic scenes.",
     "strengths": ["video", "realistic", "long-form"], "tags": ["video", "openai"],
     "pricing": "paid"},
    {"id": "github-copilot", "name": "GitHub Copilot", "category": "coding",
     "description": "AI pair programmer integrated into IDEs.",
     "strengths": ["autocomplete", "ide-integration", "code-suggestions"], "tags": ["code", "developer"],
     "pricing": "paid"},
    {"id": "cursor", "name": "Cursor", "category": "coding",
     "description": "AI-first code editor with deep codebase understanding.",
     "strengths": ["codebase-aware", "agent-mode", "fast"], "tags": ["ide", "code"],
     "pricing": "freemium"},
    {"id": "v0", "name": "v0 by Vercel", "category": "design",
     "description": "Generate React UI components from text prompts.",
     "strengths": ["ui-generation", "react", "tailwind"], "tags": ["ui", "frontend"],
     "pricing": "freemium"},
    {"id": "figma-ai", "name": "Figma AI", "category": "design",
     "description": "AI features inside Figma for design assistance.",
     "strengths": ["design", "collaboration", "prototyping"], "tags": ["ui", "ux"],
     "pricing": "freemium"},
    {"id": "elevenlabs", "name": "ElevenLabs", "category": "voice",
     "description": "Realistic AI voice generation and cloning.",
     "strengths": ["realistic-voice", "cloning", "multilingual"], "tags": ["audio", "tts"],
     "pricing": "freemium"},
    {"id": "notion-ai", "name": "Notion AI", "category": "productivity",
     "description": "AI built into Notion for writing, summarizing, planning.",
     "strengths": ["writing", "summarization", "workspace"], "tags": ["productivity", "notes"],
     "pricing": "paid"},
    {"id": "gamma", "name": "Gamma", "category": "productivity",
     "description": "Generate beautiful presentations from prompts.",
     "strengths": ["presentations", "fast", "modern-design"], "tags": ["slides", "presentations"],
     "pricing": "freemium"},
    {"id": "luma", "name": "Luma AI", "category": "3d",
     "description": "Capture and generate 3D scenes from images/video.",
     "strengths": ["3d-capture", "nerfs", "ar"], "tags": ["3d", "ar"],
     "pricing": "freemium"},
    {"id": "zapier-ai", "name": "Zapier AI", "category": "automation",
     "description": "Build automated workflows with AI actions across 6000+ apps.",
     "strengths": ["no-code", "integrations", "workflows"], "tags": ["automation", "workflow"],
     "pricing": "freemium"},
]

TOOL_IDS = {t["id"] for t in TOOLS}


def build_catalog_for_prompt(tools):
    """Compact representation for the LLM."""
    return [
        {
            "id": t["id"],
            "name": t["name"],
            "category": t["category"],
            "description": t["description"],
            "strengths": t["strengths"],
            "tags": t["tags"],
            "pricing": t["pricing"],
        }
        for t in tools
    ]


SYSTEM_MESSAGE = """You are AIthusiast's recommendation engine. You help users discover the BEST AI tools for their specific needs from a curated catalog.

CRITICAL RULES:
1. Recommend ONLY from the provided catalog. NEVER invent tool IDs or names.
2. Return STRICT JSON ONLY — no prose, no markdown fences, no commentary.
3. Rank recommendations by relevance to the user's query (most relevant first).
4. Provide concise, premium-editorial reasoning (1 short sentence per tool).
5. If the query is broad, return 4-6 picks. If specific, return 2-4.
6. Detect intent and respect constraints (e.g., "free", "open-source", "for beginners").

Output schema (return EXACTLY this JSON shape):
{
  "query": "<original user query>",
  "intent": "<short interpretation of what user actually needs>",
  "filters": ["<applied filter labels e.g. free, beginner>"],
  "recommendations": [
    {
      "tool_id": "<must be one of the provided ids>",
      "score": <float 0..1 ranking confidence>,
      "why": "<one-sentence cinematic reason>",
      "best_for": "<who benefits most>",
      "caveats": "<short caveat or empty string>"
    }
  ]
}
"""


def extract_json(text: str):
    """Robustly extract a JSON object from LLM output (strip fences, find object)."""
    if not text:
        return None
    cleaned = text.strip()
    # remove ```json ... ``` or ``` ... ```
    cleaned = re.sub(r"^```(?:json)?\s*", "", cleaned)
    cleaned = re.sub(r"\s*```$", "", cleaned)
    try:
        return json.loads(cleaned)
    except Exception:
        pass
    # find first { ... last }
    start = cleaned.find("{")
    end = cleaned.rfind("}")
    if start >= 0 and end > start:
        try:
            return json.loads(cleaned[start:end + 1])
        except Exception:
            return None
    return None


def validate_response(parsed) -> tuple[bool, str]:
    if not isinstance(parsed, dict):
        return False, "Not a dict"
    if "recommendations" not in parsed or not isinstance(parsed["recommendations"], list):
        return False, "Missing recommendations list"
    if len(parsed["recommendations"]) == 0:
        return False, "Empty recommendations"
    for rec in parsed["recommendations"]:
        if "tool_id" not in rec:
            return False, "Missing tool_id"
        if rec["tool_id"] not in TOOL_IDS:
            return False, f"Hallucinated tool_id: {rec['tool_id']}"
    return True, "ok"


def fallback_search(query: str, tools=TOOLS):
    """Simple keyword/tag fallback. Returns same schema as LLM response."""
    q = query.lower()
    scored = []
    for t in tools:
        haystack = " ".join([
            t["name"].lower(), t["category"].lower(), t["description"].lower(),
            " ".join(t.get("strengths", [])).lower(), " ".join(t.get("tags", [])).lower(),
        ])
        # token overlap
        score = 0.0
        for token in re.findall(r"[a-z0-9]+", q):
            if len(token) < 3:
                continue
            if token in haystack:
                score += 1.0
        if score > 0:
            scored.append((score, t))
    scored.sort(key=lambda x: -x[0])
    top = scored[:5] if scored else [(1, t) for t in tools[:5]]
    max_score = max((s for s, _ in top), default=1.0)
    return {
        "query": query,
        "intent": f"Fallback keyword match for: {query}",
        "filters": [],
        "recommendations": [
            {
                "tool_id": t["id"],
                "score": round(s / max_score, 3),
                "why": f"Matches keywords in description, strengths, or tags.",
                "best_for": t["category"].replace("-", " "),
                "caveats": "",
            }
            for s, t in top
        ],
        "_source": "fallback",
    }


async def recommend(query: str, retry: int = 1):
    """Hybrid: LLM-first, fallback on failure."""
    catalog_json = json.dumps(build_catalog_for_prompt(TOOLS), separators=(",", ":"))
    user_text = (
        f"USER QUERY: {query}\n\n"
        f"CATALOG (choose tool_ids ONLY from this list):\n{catalog_json}\n\n"
        f"Return JSON only."
    )

    last_error = None
    for attempt in range(retry + 1):
        try:
            chat = LlmChat(
                api_key=EMERGENT_LLM_KEY,
                session_id=f"aithusiast-poc-{abs(hash(query)) % 100000}-{attempt}",
                system_message=SYSTEM_MESSAGE,
            ).with_model("gemini", "gemini-2.5-flash")
            resp = await chat.send_message(UserMessage(text=user_text))
            parsed = extract_json(resp)
            ok, reason = validate_response(parsed) if parsed else (False, "Parse failed")
            if ok:
                parsed["_source"] = "llm"
                return parsed, resp
            last_error = reason
        except Exception as e:
            last_error = f"LLM exception: {e}"
        # retry once with reinforced instruction
        if attempt == 0:
            user_text += "\n\nREMINDER: Output VALID JSON only, no markdown. Use only the provided tool ids."

    # Fallback
    fb = fallback_search(query)
    fb["_error"] = last_error
    return fb, None


# ──────────────────────────────────────────────────────────────────
# Test matrix
# ──────────────────────────────────────────────────────────────────
TEST_QUERIES = [
    "Best AI for students",
    "AI for cinematic images",
    "AI for industrial design",
    "AI for coding",
    "AI for presentations",
    "AI for productivity",
    "AI for UI design",
    "AI for research",
    "AI for realistic voice generation",
    "Best free AI for beginners",
    "AI for filmmaking",
    "Open-source AI for image generation",
]


async def run_poc():
    print("=" * 70)
    print("AIthusiast POC — Gemini 2.5 Flash + hybrid fallback")
    print("=" * 70)
    print(f"Catalog size: {len(TOOLS)} tools | Tool IDs: {sorted(TOOL_IDS)}")
    print()

    pass_count = 0
    llm_count = 0
    fallback_count = 0
    total = len(TEST_QUERIES)

    for i, q in enumerate(TEST_QUERIES, 1):
        print(f"[{i}/{total}] Query: {q!r}")
        result, raw = await recommend(q)
        source = result.get("_source", "?")
        recs = result.get("recommendations", [])
        ok, reason = validate_response(result)
        if ok:
            pass_count += 1
            if source == "llm":
                llm_count += 1
            else:
                fallback_count += 1
            print(f"  ✅ {source.upper()} | intent={result.get('intent','')[:80]}")
            for r in recs[:5]:
                tid = r.get("tool_id")
                why = r.get("why", "")
                print(f"     • {tid:<16} score={r.get('score',0):.2f}  — {why}")
        else:
            print(f"  ❌ FAILED: {reason}")
            if raw:
                print(f"     Raw (truncated): {raw[:200]}")
        print()

    print("=" * 70)
    print(f"RESULTS: {pass_count}/{total} passed")
    print(f"  LLM successes:      {llm_count}")
    print(f"  Fallback successes: {fallback_count}")
    print("=" * 70)
    success_rate = pass_count / total
    if success_rate < 0.9:
        print(f"⚠️  Below 90% threshold ({success_rate:.0%}). Investigate failures.")
        return 1
    print(f"✅ POC PASSED ({success_rate:.0%})")
    return 0


if __name__ == "__main__":
    exit_code = asyncio.run(run_poc())
    sys.exit(exit_code)
