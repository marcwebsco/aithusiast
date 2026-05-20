"""
AIthusiast Backend — FastAPI + MongoDB + Gemini 2.5 Flash (Emergent LLM)
"""
import asyncio
import json
import logging
import os
import re
import uuid
from datetime import datetime, timezone
from pathlib import Path
from typing import List, Optional

from dotenv import load_dotenv
from fastapi import APIRouter, FastAPI, HTTPException, Query
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, ConfigDict, Field
from starlette.middleware.cors import CORSMiddleware

from seed_data import ARTICLES_SEED, STACKS_SEED, TOOLS_SEED

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

# ── Logging ──
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger("aithusiast")

# ── LLM ──
EMERGENT_LLM_KEY = os.environ.get("EMERGENT_LLM_KEY")
if not EMERGENT_LLM_KEY:
    logger.warning("EMERGENT_LLM_KEY missing — LLM search will fallback to keyword.")

try:
    from emergentintegrations.llm.chat import LlmChat, UserMessage  # type: ignore
except Exception as e:  # pragma: no cover
    LlmChat = None
    UserMessage = None
    logger.warning(f"emergentintegrations not available: {e}")


# ── App ──
app = FastAPI(title="AIthusiast API", version="1.0.0")
api = APIRouter(prefix="/api")


# ── Models ──
class Tool(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    name: str
    tagline: str
    description: str
    category: str
    strengths: List[str] = []
    tags: List[str] = []
    pricing: str = "freemium"
    url: str = ""
    logo: str = ""
    cover: str = ""
    accent: str = "#A855F7"
    trending: bool = False
    featured: bool = False
    rank: Optional[int] = None
    weekly_growth: str = ""
    popularity: int = 0


class Article(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    slug: str
    title: str
    deck: str
    cover: str
    category: str
    reading_time: int = 3
    tags: List[str] = []
    sections: List[dict] = []
    related_tool_ids: List[str] = []
    featured: bool = False
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())


class Stack(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    slug: str
    title: str
    persona: str
    use_case: str
    cover: str
    tool_ids: List[str] = []
    rationale: str = ""


class SearchRequest(BaseModel):
    query: str
    category: Optional[str] = None


class SearchRecommendation(BaseModel):
    tool_id: str
    score: float
    why: str
    best_for: str = ""
    caveats: str = ""


class SearchResponse(BaseModel):
    query: str
    intent: str = ""
    filters: List[str] = []
    recommendations: List[SearchRecommendation] = []
    tools: List[Tool] = []
    source: str = "llm"


# ── DB seeding ──
async def seed_if_empty():
    tools_count = await db.tools.count_documents({})
    if tools_count == 0:
        logger.info("Seeding tools…")
        await db.tools.insert_many([{"_id": t["id"], **t} for t in TOOLS_SEED])
    else:
        # Upsert refreshable fields (rank, weekly_growth, popularity, trending, featured)
        # so existing installs pick up phase-3 ranking data.
        for t in TOOLS_SEED:
            update = {
                "rank": t.get("rank"),
                "weekly_growth": t.get("weekly_growth", ""),
                "popularity": t.get("popularity", 0),
                "trending": t.get("trending", False),
                "featured": t.get("featured", False),
                "accent": t.get("accent", "#A855F7"),
            }
            await db.tools.update_one({"id": t["id"]}, {"$set": update})
    articles_count = await db.articles.count_documents({})
    if articles_count == 0:
        logger.info("Seeding articles…")
        await db.articles.insert_many([{"_id": a["id"], **a} for a in ARTICLES_SEED])
    stacks_count = await db.stacks.count_documents({})
    if stacks_count == 0:
        logger.info("Seeding stacks…")
        await db.stacks.insert_many([{"_id": s["id"], **s} for s in STACKS_SEED])
    logger.info(
        "DB ready: %d tools, %d articles, %d stacks",
        await db.tools.count_documents({}),
        await db.articles.count_documents({}),
        await db.stacks.count_documents({}),
    )


@app.on_event("startup")
async def on_startup():
    await seed_if_empty()


@app.on_event("shutdown")
async def on_shutdown():
    client.close()


# ── Helpers ──
def strip_mongo_id(doc: dict) -> dict:
    if not doc:
        return doc
    doc.pop("_id", None)
    return doc


async def fetch_tools_dict() -> dict:
    docs = await db.tools.find({}, {"_id": 0}).to_list(1000)
    return {d["id"]: d for d in docs}


def build_catalog_for_prompt(tools: list) -> list:
    return [
        {
            "id": t["id"],
            "name": t["name"],
            "category": t["category"],
            "description": t.get("description") or t.get("tagline", ""),
            "strengths": t.get("strengths", []),
            "tags": t.get("tags", []),
            "pricing": t.get("pricing", "freemium"),
        }
        for t in tools
    ]


def extract_json(text: str):
    if not text:
        return None
    cleaned = text.strip()
    cleaned = re.sub(r"^```(?:json)?\s*", "", cleaned)
    cleaned = re.sub(r"\s*```$", "", cleaned)
    try:
        return json.loads(cleaned)
    except Exception:
        pass
    start = cleaned.find("{")
    end = cleaned.rfind("}")
    if start >= 0 and end > start:
        try:
            return json.loads(cleaned[start : end + 1])
        except Exception:
            return None
    return None


def validate_llm_response(parsed: dict, tool_ids: set) -> bool:
    if not isinstance(parsed, dict):
        return False
    recs = parsed.get("recommendations")
    if not isinstance(recs, list) or not recs:
        return False
    for r in recs:
        if not isinstance(r, dict) or "tool_id" not in r:
            return False
        if r["tool_id"] not in tool_ids:
            return False
    return True


def fallback_search(query: str, tools: list, category: Optional[str] = None) -> dict:
    q = query.lower()
    pool = [t for t in tools if (not category or t["category"] == category)]
    if not pool:
        pool = tools
    scored = []
    tokens = [tok for tok in re.findall(r"[a-z0-9]+", q) if len(tok) >= 3]
    for t in pool:
        hay = " ".join(
            [
                t["name"].lower(),
                t["category"].lower(),
                (t.get("description") or "").lower(),
                (t.get("tagline") or "").lower(),
                " ".join(t.get("strengths", [])).lower(),
                " ".join(t.get("tags", [])).lower(),
            ]
        )
        score = sum(1 for tok in tokens if tok in hay)
        if t.get("trending"):
            score += 0.5
        if score > 0:
            scored.append((score, t))
    scored.sort(key=lambda x: -x[0])
    top = scored[:6] if scored else [(1, t) for t in pool[:6]]
    max_score = max((s for s, _ in top), default=1.0)
    return {
        "query": query,
        "intent": f"Keyword match for: {query}",
        "filters": [category] if category else [],
        "recommendations": [
            {
                "tool_id": t["id"],
                "score": round(s / max_score, 3),
                "why": f"Matches your need based on {t['category'].replace('-', ' ')} expertise.",
                "best_for": t.get("tagline", ""),
                "caveats": "",
            }
            for s, t in top
        ],
    }


SYSTEM_MESSAGE = """You are AIthusiast's recommendation engine. You help users discover the BEST AI tools for their specific needs from a curated catalog.

CRITICAL RULES:
1. Recommend ONLY from the provided catalog. NEVER invent tool IDs or names.
2. Return STRICT JSON ONLY \u2014 no prose, no markdown fences, no commentary.
3. Rank recommendations by relevance to the user's query (most relevant first).
4. Provide concise, premium-editorial reasoning (1 short sentence per tool).
5. If the query is broad, return 4-6 picks. If specific, return 2-4.
6. Detect intent and respect constraints (e.g., \"free\", \"open-source\", \"for beginners\").

Output schema (return EXACTLY this JSON shape):
{
  "query": "<original user query>",
  "intent": "<short interpretation of what user actually needs>",
  "filters": ["<applied filter labels e.g. free, beginner>"],
  "recommendations": [
    {
      "tool_id": "<must be one of the provided ids>",
      "score": <float 0..1>,
      "why": "<one-sentence cinematic reason>",
      "best_for": "<who benefits most>",
      "caveats": "<short caveat or empty string>"
    }
  ]
}
"""


async def llm_recommend(query: str, tools: list, category: Optional[str] = None) -> Optional[dict]:
    if not (EMERGENT_LLM_KEY and LlmChat and UserMessage):
        return None
    pool = [t for t in tools if (not category or t["category"] == category)] or tools
    catalog_json = json.dumps(build_catalog_for_prompt(pool), separators=(",", ":"))
    user_text = (
        f"USER QUERY: {query}\n\n"
        f"CATALOG (choose tool_ids ONLY from this list):\n{catalog_json}\n\n"
        f"Return JSON only."
    )
    last_error = None
    for attempt in range(2):
        try:
            chat = LlmChat(
                api_key=EMERGENT_LLM_KEY,
                session_id=f"aithusiast-{abs(hash(query)) % 100000}-{attempt}",
                system_message=SYSTEM_MESSAGE,
            ).with_model("gemini", "gemini-2.5-flash")
            resp = await chat.send_message(UserMessage(text=user_text))
            parsed = extract_json(resp)
            tool_ids = {t["id"] for t in pool}
            if parsed and validate_llm_response(parsed, tool_ids):
                return parsed
            last_error = "validation failed"
            user_text += "\n\nREMINDER: Output VALID JSON only, no markdown."
        except Exception as e:
            last_error = f"LLM error: {e}"
    logger.warning(f"LLM failed, falling back. reason={last_error}")
    return None


# ── Routes ──
@api.get("/")
async def root():
    return {"app": "AIthusiast", "status": "online"}


@api.get("/health")
async def health():
    tools = await db.tools.count_documents({})
    return {"ok": True, "tools": tools, "llm_ready": bool(EMERGENT_LLM_KEY and LlmChat)}


@api.get("/categories")
async def categories():
    pipeline = [{"$group": {"_id": "$category", "count": {"$sum": 1}}}, {"$sort": {"_id": 1}}]
    out = await db.tools.aggregate(pipeline).to_list(100)
    return [{"slug": c["_id"], "count": c["count"]} for c in out]


@api.get("/tools", response_model=List[Tool])
async def list_tools(
    category: Optional[str] = None,
    trending: Optional[bool] = None,
    featured: Optional[bool] = None,
    q: Optional[str] = None,
    limit: int = Query(60, ge=1, le=200),
):
    query: dict = {}
    if category:
        query["category"] = category
    if trending is not None:
        query["trending"] = trending
    if featured is not None:
        query["featured"] = featured
    if q:
        regex = {"$regex": q, "$options": "i"}
        query["$or"] = [
            {"name": regex},
            {"tagline": regex},
            {"description": regex},
            {"tags": regex},
        ]
    docs = await db.tools.find(query, {"_id": 0}).limit(limit).to_list(limit)
    return docs


@api.get("/tools/ranking", response_model=List[Tool])
async def tools_ranking(limit: int = Query(10, ge=1, le=30)):
    """Top trending AI tools ordered by rank."""
    docs = await db.tools.find(
        {"rank": {"$ne": None}}, {"_id": 0}
    ).sort("rank", 1).limit(limit).to_list(limit)
    return docs


@api.get("/tools/{tool_id}", response_model=Tool)
async def get_tool(tool_id: str):
    doc = await db.tools.find_one({"id": tool_id}, {"_id": 0})
    if not doc:
        raise HTTPException(404, "Tool not found")
    return doc


@api.get("/tools/{tool_id}/similar", response_model=List[Tool])
async def similar_tools(tool_id: str, limit: int = 6):
    tool = await db.tools.find_one({"id": tool_id}, {"_id": 0})
    if not tool:
        raise HTTPException(404, "Tool not found")
    docs = await db.tools.find(
        {"category": tool["category"], "id": {"$ne": tool_id}}, {"_id": 0}
    ).limit(limit).to_list(limit)
    return docs


@api.get("/articles", response_model=List[Article])
async def list_articles(featured: Optional[bool] = None, limit: int = 24):
    query: dict = {}
    if featured is not None:
        query["featured"] = featured
    docs = await db.articles.find(query, {"_id": 0}).limit(limit).to_list(limit)
    return docs


@api.get("/articles/{slug}", response_model=Article)
async def get_article(slug: str):
    doc = await db.articles.find_one({"slug": slug}, {"_id": 0})
    if not doc:
        raise HTTPException(404, "Article not found")
    return doc


@api.get("/stacks", response_model=List[Stack])
async def list_stacks():
    docs = await db.stacks.find({}, {"_id": 0}).to_list(50)
    return docs


@api.get("/stacks/{slug}", response_model=Stack)
async def get_stack(slug: str):
    doc = await db.stacks.find_one({"slug": slug}, {"_id": 0})
    if not doc:
        raise HTTPException(404, "Stack not found")
    return doc


@api.post("/search", response_model=SearchResponse)
async def search(payload: SearchRequest):
    query = (payload.query or "").strip()
    if not query:
        raise HTTPException(400, "Query required")
    tools_docs = await db.tools.find({}, {"_id": 0}).to_list(1000)
    parsed = await llm_recommend(query, tools_docs, payload.category)
    source = "llm"
    if not parsed:
        parsed = fallback_search(query, tools_docs, payload.category)
        source = "fallback"

    tools_by_id = {t["id"]: t for t in tools_docs}
    tool_objs = []
    for r in parsed.get("recommendations", []):
        t = tools_by_id.get(r["tool_id"])
        if t:
            tool_objs.append(t)

    return SearchResponse(
        query=query,
        intent=parsed.get("intent", ""),
        filters=parsed.get("filters", []),
        recommendations=[SearchRecommendation(**r) for r in parsed.get("recommendations", [])],
        tools=tool_objs,
        source=source,
    )


@api.get("/suggestions")
async def suggestions():
    """Static premium suggestion prompts."""
    return {
        "prompts": [
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
    }


app.include_router(api)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get("CORS_ORIGINS", "*").split(","),
    allow_methods=["*"],
    allow_headers=["*"],
)
