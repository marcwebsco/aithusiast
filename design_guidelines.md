{
  "brand": {
    "name": "AIthusiast",
    "attributes": [
      "premium",
      "cinematic",
      "futuristic-glass",
      "minimal",
      "editorial",
      "intelligent",
      "fast"
    ],
    "north_star": "A luxury futuristic AI operating system for discovering the best AI tools."
  },
  "critical_rules": {
    "theme": "dark-only",
    "no_generic_saas": true,
    "most_important_element": "futuristic-ai-search-bar",
    "data_testid_required": "All interactive and key informational elements MUST include data-testid (kebab-case, role-based).",
    "gradient_restriction": {
      "never": [
        "dark/saturated gradient combos (e.g., purple/pink)",
        "gradients covering >20% viewport",
        "gradients on text-heavy reading areas",
        "gradients on small UI elements (<100px width)",
        "stack multiple gradient layers in same viewport"
      ],
      "enforcement": "IF gradient area exceeds 20% of viewport OR impacts readability THEN fallback to solid colors or simple, two-color mild gradients.",
      "allowed_usage": [
        "hero/landing section backgrounds only",
        "decorative overlays/orbs",
        "large section backdrops behind glass panels"
      ]
    }
  },
  "inspiration_refs": {
    "visual": [
      {
        "source": "Dribbble search",
        "url": "https://dribbble.com/search/purple-glow",
        "takeaways": [
          "ambient purple edge glow",
          "thin hairline borders",
          "floating cards with soft reflections"
        ]
      },
      {
        "source": "Glassmorphism 2026 article",
        "url": "https://invernessdesignstudio.com/glassmorphism-what-it-is-and-how-to-use-it-in-2026",
        "takeaways": [
          "glass layering needs contrast + borders",
          "blur should be subtle and performance-aware",
          "use semantic tokens for accessibility"
        ]
      },
      {
        "source": "Apple Vision Pro appearance guidance",
        "url": "https://support.apple.com/guide/apple-vision-pro/change-the-appearance-of-text-and-windows-tan4fa040b9f/visionos",
        "takeaways": [
          "translucent materials",
          "focus on legibility on glass",
          "soft shadows + depth cues"
        ]
      }
    ]
  },
  "fonts": {
    "heading": {
      "family": "Panchang",
      "usage": [
        "hero titles",
        "section titles",
        "tool names (large)",
        "article titles"
      ],
      "notes": "Use cinematic sizing, slightly tighter leading, avoid heavy weights; prefer 500/600 if available."
    },
    "body": {
      "family": "Montserrat",
      "weights": {
        "light": 300,
        "regular": 400,
        "medium": 500
      },
      "usage": [
        "body copy (prefer 300/400)",
        "UI labels (uppercase + tracking)",
        "metadata"
      ]
    },
    "loading": {
      "google_fonts": [
        "Montserrat:300,400,500,600"
      ],
      "fontshare": [
        {
          "name": "Panchang",
          "url": "https://www.fontshare.com/fonts/panchang",
          "implementation": "Download + host in /public/fonts and load via @font-face in index.css (no external CDN except fonts)."
        }
      ]
    }
  },
  "typography_scale_tailwind": {
    "h1": "text-4xl sm:text-5xl lg:text-6xl",
    "h2": "text-base md:text-lg",
    "body": "text-sm md:text-base",
    "small": "text-xs md:text-sm",
    "labels": "text-[11px] uppercase tracking-[0.22em]"
  },
  "color_system": {
    "hard_requirements": {
      "background_hex": "#05010A",
      "primary_accent_hex": ["#7C3AED", "#A855F7"]
    },
    "design_tokens_css": {
      "where": "/app/frontend/src/index.css (replace :root + .dark tokens to match dark-only)",
      "css": ":root {\n  /* Core */\n  --bg: 5 90% 3%; /* #05010A */\n  --fg: 0 0% 98%;\n\n  /* Surfaces (glass) */\n  --surface-1: 260 35% 10%;\n  --surface-2: 260 30% 12%;\n  --surface-3: 260 28% 14%;\n\n  /* Glass alpha layers (use with hsla()) */\n  --glass-a: 0.06;\n  --glass-b: 0.10;\n  --glass-c: 0.14;\n\n  /* Accent */\n  --accent-1: 262 83% 58%; /* #7C3AED */\n  --accent-2: 270 92% 65%; /* #A855F7 */\n  --accent-3: 280 85% 72%; /* softer highlight */\n\n  /* Semantic */\n  --muted: 260 18% 70%;\n  --muted-2: 260 12% 55%;\n  --border: 0 0% 100%;\n  --border-a: 0.10;\n  --ring: 270 92% 65%;\n\n  /* Shadcn mapping (dark-only) */\n  --background: var(--bg);\n  --foreground: var(--fg);\n  --card: 260 35% 10%;\n  --card-foreground: var(--fg);\n  --popover: 260 35% 10%;\n  --popover-foreground: var(--fg);\n  --primary: var(--accent-1);\n  --primary-foreground: 0 0% 100%;\n  --secondary: 260 30% 12%;\n  --secondary-foreground: var(--fg);\n  --muted: 260 30% 12%;\n  --muted-foreground: 260 12% 70%;\n  --accent: 260 30% 12%;\n  --accent-foreground: var(--fg);\n  --destructive: 0 62% 45%;\n  --destructive-foreground: 0 0% 98%;\n  --input: 0 0% 100%;\n  --input-a: 0.10;\n  --border: 0 0% 100%;\n  --ring: var(--accent-2);\n\n  /* Radius */\n  --radius: 1.25rem;\n  --radius-xl: 2.75rem; /* 44px */\n  --radius-2xl: 3.25rem; /* 52px */\n\n  /* Shadows / glows */\n  --shadow-elev: 0 18px 60px rgba(0,0,0,0.55);\n  --shadow-glow-sm: 0 0 0 1px rgba(168,85,247,0.18), 0 0 24px rgba(124,58,237,0.18);\n  --shadow-glow-md: 0 0 0 1px rgba(168,85,247,0.22), 0 0 44px rgba(124,58,237,0.22);\n\n  /* Blur */\n  --blur-glass: 14px;\n  --blur-glass-strong: 22px;\n\n  /* Motion */\n  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);\n  --ease-soft: cubic-bezier(0.2, 0.8, 0.2, 1);\n  --dur-1: 120ms;\n  --dur-2: 220ms;\n  --dur-3: 420ms;\n}\n"
    },
    "gradient_recipes": {
      "hero_orbs_only": [
        {
          "name": "orb-purple-soft",
          "css": "radial-gradient(closest-side, rgba(168,85,247,0.22), rgba(124,58,237,0.10), rgba(5,1,10,0) 70%)",
          "usage": "Absolute-positioned decorative orb behind hero/search. Keep total gradient area <20% viewport."
        },
        {
          "name": "orb-white-reflection",
          "css": "radial-gradient(closest-side, rgba(255,255,255,0.10), rgba(255,255,255,0.00) 65%)",
          "usage": "Small reflection highlight on glass edges (large elements only)."
        }
      ]
    }
  },
  "layout_grid": {
    "container": "max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8",
    "homepage_hero": {
      "pattern": "Z-pattern with centered command surface + left-aligned editorial headline",
      "columns": "lg:grid lg:grid-cols-12 lg:gap-8",
      "hero_copy": "lg:col-span-5",
      "hero_search": "lg:col-span-7"
    },
    "cards_grid": {
      "tools": "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6",
      "articles": "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6",
      "stacks": "grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6"
    }
  },
  "glassmorphism_recipe": {
    "base_class": "bg-white/[0.06] border border-white/[0.10] backdrop-blur-[14px] shadow-[var(--shadow-elev)]",
    "edge_reflection": "before:absolute before:inset-0 before:rounded-[inherit] before:bg-[radial-gradient(1200px_400px_at_20%_0%,rgba(255,255,255,0.10),transparent_55%)] before:pointer-events-none",
    "inner_stroke": "after:absolute after:inset-0 after:rounded-[inherit] after:ring-1 after:ring-white/[0.06] after:pointer-events-none",
    "notes": [
      "Prefer bg-white/[0.04-0.10] on #05010A for readable glass.",
      "Always include a border; blur alone looks muddy.",
      "Avoid heavy blur on mobile; use --blur-glass (14px) default."
    ]
  },
  "components": {
    "component_path": {
      "button": "/app/frontend/src/components/ui/button.jsx",
      "input": "/app/frontend/src/components/ui/input.jsx",
      "command": "/app/frontend/src/components/ui/command.jsx",
      "card": "/app/frontend/src/components/ui/card.jsx",
      "badge": "/app/frontend/src/components/ui/badge.jsx",
      "tabs": "/app/frontend/src/components/ui/tabs.jsx",
      "dialog": "/app/frontend/src/components/ui/dialog.jsx",
      "sheet": "/app/frontend/src/components/ui/sheet.jsx",
      "scroll_area": "/app/frontend/src/components/ui/scroll-area.jsx",
      "separator": "/app/frontend/src/components/ui/separator.jsx",
      "tooltip": "/app/frontend/src/components/ui/tooltip.jsx",
      "sonner_toast": "/app/frontend/src/components/ui/sonner.jsx"
    },
    "buttons": {
      "shape": "rounded-[999px] for pills; rounded-[18px] for compact; rounded-[28px] for primary CTA",
      "variants": {
        "primary": {
          "tailwind": "bg-white/[0.10] hover:bg-white/[0.14] text-white border border-white/[0.14] shadow-[var(--shadow-glow-sm)]",
          "focus": "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))] focus-visible:ring-offset-0",
          "micro_interaction": "hover:translate-y-[-1px] active:translate-y-[0px] active:scale-[0.99] transition-[background-color,box-shadow,opacity] duration-[var(--dur-2)] ease-[var(--ease-out)]"
        },
        "secondary": {
          "tailwind": "bg-transparent hover:bg-white/[0.06] text-white/90 border border-white/[0.10]",
          "micro_interaction": "hover:shadow-[var(--shadow-glow-sm)] transition-[background-color,box-shadow] duration-[var(--dur-2)]"
        },
        "ghost": {
          "tailwind": "bg-transparent hover:bg-white/[0.06] text-white/80",
          "micro_interaction": "transition-[background-color] duration-[var(--dur-1)]"
        }
      },
      "data_testid_examples": [
        "data-testid=\"hero-search-submit-button\"",
        "data-testid=\"tool-card-explore-button\""
      ]
    },
    "futuristic_ai_search_bar": {
      "purpose": "Centerpiece command surface: query + suggestions + categories + instant ranked preview.",
      "use_shadcn": ["command", "input", "badge", "scroll-area", "separator"],
      "structure": [
        "Glass shell (rounded-[52px])",
        "Top row: icon + input + shortcut hint",
        "Below: suggestion chips (use cases) + category pills",
        "Right/Below: live preview cards (top 3 tools) with reasoning"
      ],
      "shell_classes": "relative rounded-[52px] p-4 sm:p-5 lg:p-6 bg-white/[0.06] border border-white/[0.12] backdrop-blur-[22px] shadow-[var(--shadow-glow-md)]",
      "input_classes": "h-14 sm:h-16 rounded-[999px] bg-black/20 border border-white/[0.10] text-white placeholder:text-white/40 focus-visible:ring-2 focus-visible:ring-[rgba(168,85,247,0.55)] focus-visible:ring-offset-0",
      "animated_reflection": {
        "css": "Add a pseudo-element sweep: linear-gradient(110deg, transparent 0%, rgba(255,255,255,0.10) 45%, transparent 60%) moving on hover/focus.",
        "implementation_hint": "Use group-hover translate-x with transition-[transform,opacity] (NOT transition-all)."
      },
      "micro_interactions": [
        "On focus: increase border alpha + glow shadow",
        "On typing: show Command list with smooth height animation (Framer Motion optional)",
        "On submit: subtle press scale 0.99 + glow pulse (single keyframe)"
      ],
      "data_testids": {
        "wrapper": "hero-ai-search",
        "input": "hero-ai-search-input",
        "suggestion_chip": "hero-ai-search-suggestion-chip",
        "category_pill": "hero-ai-search-category-pill",
        "result_item": "hero-ai-search-result-item"
      }
    },
    "ai_tool_card": {
      "use_shadcn": ["card", "badge", "button", "tooltip"],
      "radius": "rounded-[44px] (desktop), rounded-[34px] (mobile)",
      "classes": "group relative overflow-hidden rounded-[44px] bg-white/[0.06] border border-white/[0.10] backdrop-blur-[14px] p-5 shadow-[var(--shadow-elev)]",
      "hover": "hover:shadow-[var(--shadow-glow-md)] hover:-translate-y-1 transition-[transform,box-shadow,background-color] duration-[var(--dur-3)] ease-[var(--ease-out)]",
      "content": [
        "Top: logo (Avatar) + name (Panchang) + category label",
        "Body: 2-line description (Montserrat 300)",
        "Strengths: 3 bullets or 3 badges",
        "Tags: glass pills",
        "CTA: Explore button (right aligned)"
      ],
      "reflection_overlay": "after:absolute after:inset-0 after:bg-[radial-gradient(900px_260px_at_20%_0%,rgba(255,255,255,0.10),transparent_55%)] after:opacity-70 after:pointer-events-none",
      "data_testids": {
        "card": "tool-card",
        "title": "tool-card-title",
        "explore": "tool-card-explore-button",
        "tags": "tool-card-tags"
      }
    },
    "category_pills": {
      "use_shadcn": ["toggle-group", "badge"],
      "classes": "inline-flex items-center gap-2 rounded-[999px] bg-white/[0.06] border border-white/[0.10] px-3 py-2 text-white/80",
      "active": "data-[state=on]:bg-white/[0.10] data-[state=on]:border-white/[0.16] data-[state=on]:shadow-[var(--shadow-glow-sm)] data-[state=on]:text-white",
      "motion": "transition-[background-color,box-shadow,border-color,color] duration-[var(--dur-2)]",
      "data_testid": "category-pill"
    },
    "featured_article_card": {
      "use_shadcn": ["card", "badge", "aspect-ratio"],
      "layout": "Image/abstract cover + editorial typography + thin divider + read time",
      "classes": "group relative overflow-hidden rounded-[36px] bg-white/[0.05] border border-white/[0.10] backdrop-blur-[14px]",
      "cover": "aspect-[16/10] bg-black/30",
      "hover": "hover:shadow-[var(--shadow-glow-sm)] hover:-translate-y-1 transition-[transform,box-shadow] duration-[var(--dur-3)]",
      "data_testids": {
        "card": "article-card",
        "title": "article-card-title",
        "open": "article-card-open-link"
      }
    }
  },
  "pages": {
    "homepage": {
      "sections": [
        {
          "name": "Hero + AI Search Command Center",
          "composition": [
            "Left: cinematic headline + subheading + trust microcopy",
            "Right: Futuristic AI Search Bar (centerpiece)",
            "Background: 1-2 subtle orbs + noise overlay"
          ]
        },
        {
          "name": "Trending AI Tools",
          "composition": [
            "Section label (uppercase)",
            "3-col glass card grid",
            "Optional: horizontal scroll on mobile (ScrollArea)"
          ]
        },
        {
          "name": "Categories Pills",
          "composition": [
            "ToggleGroup pills",
            "Active glow",
            "Filter tools grid"
          ]
        },
        {
          "name": "Recommended AI Stacks",
          "composition": [
            "2-up stack cards with mini tool avatars",
            "CTA: View stack"
          ]
        },
        {
          "name": "Featured Articles",
          "composition": [
            "Editorial cards (short, premium)",
            "No endless scroll; show 6 max + View all"
          ]
        },
        {
          "name": "Footer",
          "composition": [
            "Minimal links",
            "Tiny glow divider",
            "No heavy gradients"
          ]
        }
      ]
    },
    "tools_listing": {
      "layout": [
        "Top: compact search bar (same component, smaller)",
        "Left (desktop): filters in Sheet/Collapsible",
        "Main: results grid",
        "Sort: Select"
      ],
      "data_testids": {
        "filters_open": "tools-filters-open-button",
        "sort_select": "tools-sort-select",
        "results_grid": "tools-results-grid"
      }
    },
    "tool_detail": {
      "layout": [
        "Hero: tool logo + name + one-line positioning",
        "Right: primary CTA (Visit / Save)",
        "Below: strengths, pricing, use cases, screenshots",
        "Sidebar: similar tools"
      ],
      "components": ["tabs", "card", "badge", "separator"],
      "data_testids": {
        "visit": "tool-detail-visit-button",
        "save": "tool-detail-save-button"
      }
    },
    "articles_listing": {
      "layout": [
        "Editorial header",
        "Category pills",
        "Article cards grid"
      ]
    },
    "article_detail": {
      "editorial_recipe": {
        "max_width": "max-w-[760px]",
        "title": "Panchang, large, tight leading",
        "body": "Montserrat 300/400, increased line-height (leading-7)",
        "elements": [
          "Drop cap optional (CSS)",
          "Pull quote card (glass)",
          "Inline tool callouts (mini tool cards)"
        ]
      },
      "data_testids": {
        "title": "article-detail-title",
        "content": "article-detail-content"
      }
    },
    "search_results": {
      "layout": [
        "Top: query recap + reasoning summary card",
        "Results: ranked tool cards",
        "Each result includes: 'Why this fits' (2-3 bullets)"
      ],
      "components": ["card", "badge", "accordion"],
      "data_testids": {
        "reasoning": "search-results-reasoning",
        "result": "search-results-item"
      }
    }
  },
  "motion": {
    "principles": [
      "Cinematic, soft, restrained",
      "Prefer transform + opacity for performance",
      "No exaggerated bounces"
    ],
    "tokens": {
      "durations": {
        "fast": "var(--dur-1)",
        "base": "var(--dur-2)",
        "slow": "var(--dur-3)"
      },
      "easing": {
        "out": "var(--ease-out)",
        "soft": "var(--ease-soft)"
      }
    },
    "micro_interactions": [
      "Cards: hover lift -4px to -6px + glow",
      "Pills: active glow + border brighten",
      "Search: focus glow + reflection sweep",
      "Scroll: subtle parallax on hero orbs (optional)"
    ],
    "optional_library": {
      "name": "framer-motion",
      "install": "npm i framer-motion",
      "use_cases": [
        "Search suggestions expand/collapse",
        "Staggered entrance for tool cards",
        "Shared layout transitions between listing -> detail"
      ]
    }
  },
  "textures": {
    "noise_overlay": {
      "css_hint": "Use a tiny repeating noise PNG or CSS noise via background-image; keep opacity 0.06-0.10.",
      "tailwind": "bg-[url('/noise.png')] bg-repeat opacity-[0.08] mix-blend-overlay pointer-events-none"
    }
  },
  "accessibility": {
    "contrast": [
      "On glass surfaces, use text-white/90 for primary and text-white/60 for secondary.",
      "Avoid pure purple text on black for paragraphs; reserve purple for accents, borders, icons, focus rings."
    ],
    "focus": "Always visible focus ring: ring-2 ring-[rgba(168,85,247,0.55)] on interactive elements.",
    "reduced_motion": "Respect prefers-reduced-motion: disable orb parallax and reflection sweeps."
  },
  "image_urls": {
    "hero_background_abstract": [
      {
        "url": "https://images.unsplash.com/photo-1647025640409-5bebc1b672c6?crop=entropy&cs=srgb&fm=jpg&ixlib=rb-4.1.0&q=85",
        "description": "Soft purple/black blur texture for hero backdrop (use as subtle overlay, low opacity)."
      },
      {
        "url": "https://images.unsplash.com/photo-1572414451217-ed2e028748e2?crop=entropy&cs=srgb&fm=jpg&ixlib=rb-4.1.0&q=85",
        "description": "Geometric purple pyramid for editorial cover images (crop tight, add glass overlay)."
      }
    ],
    "section_background_minimal": [
      {
        "url": "https://images.unsplash.com/photo-1633607092297-95cd35aecba9?crop=entropy&cs=srgb&fm=jpg&ixlib=rb-4.1.0&q=85",
        "description": "Minimal dark abstract circle; good for subtle section separators behind glass."
      }
    ],
    "tech_editorial": [
      {
        "url": "https://images.pexels.com/photos/27141316/pexels-photo-27141316.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
        "description": "Futuristic analytics interface photo for article covers (use heavy dark overlay)."
      }
    ]
  },
  "instructions_to_main_agent": {
    "global": [
      "Remove default CRA App.css centering patterns; do NOT center the whole app container.",
      "Update /app/frontend/src/index.css tokens to dark-only using the provided :root CSS; avoid relying on shadcn defaults.",
      "Implement glassmorphism via reusable utility classes (e.g., 'glass-panel', 'glass-card') in a global CSS layer.",
      "Use shadcn components from /src/components/ui (JS files). Avoid raw HTML dropdowns/calendars/toasts.",
      "Every interactive element must include data-testid (kebab-case)."
    ],
    "hero_search": [
      "Build the AI search as a Command-based component (Command + Input + ScrollArea).",
      "Make it the visual centerpiece: rounded-[52px], strong blur, glow shadow, reflection sweep.",
      "Keep gradients limited to 1-2 orbs behind the search only (<20% viewport)."
    ]
  },
  "General UI UX Design Guidelines": [
    "- You must **not** apply universal transition. Eg: `transition: all`. This results in breaking transforms. Always add transitions for specific interactive elements like button, input excluding transforms",
    "- You must **not** center align the app container, ie do not add `.App { text-align: center; }` in the css file. This disrupts the human natural reading flow of text",
    "- NEVER: use AI assistant Emoji characters like`🤖🧠💭💡🔮🎯📚🎭🎬🎪🎉🎊🎁🎀🎂🍰🎈🎨🎰💰💵💳🏦💎🪙💸🤑📊📈📉💹🔢🏆🥇 etc for icons. Always use **FontAwesome cdn** or **lucid-react** library already installed in the package.json",
    "\n **GRADIENT RESTRICTION RULE**\nNEVER use dark/saturated gradient combos (e.g., purple/pink) on any UI element.  Prohibited gradients: blue-500 to purple 600, purple 500 to pink-500, green-500 to blue-500, red to pink etc\nNEVER use dark gradients for logo, testimonial, footer etc\nNEVER let gradients cover more than 20% of the viewport.\nNEVER apply gradients to text-heavy content or reading areas.\nNEVER use gradients on small UI elements (<100px width).\nNEVER stack multiple gradient layers in the same viewport.\n\n**ENFORCEMENT RULE:**\n    • Id gradient area exceeds 20% of viewport OR affects readability, **THEN** use solid colors\n\n**How and where to use:**\n   • Section backgrounds (not content backgrounds)\n   • Hero section header content. Eg: dark to light to dark color\n   • Decorative overlays and accent elements only\n   • Hero section with 2-3 mild color\n   • Gradients creation can be done for any angle say horizontal, vertical or diagonal\n\n- For AI chat, voice application, **do not use purple color. Use color like light green, ocean blue, peach orange etc\n\n</Font Guidelines>\n\n- Every interaction needs micro-animations - hover states, transitions, parallax effects, and entrance animations. Static = dead.\n   \n- Use 2-3x more spacing than feels comfortable. Cramped designs look cheap.\n\n- Subtle grain textures, noise overlays, custom cursors, selection states, and loading animations: separates good from extraordinary.\n   \n- Before generating UI, infer the visual style from the problem statement (palette, contrast, mood, motion) and immediately instantiate it by setting global design tokens (primary, secondary/accent, background, foreground, ring, state colors), rather than relying on any library defaults. Don't make the background dark as a default step, always understand problem first and define colors accordingly\n    Eg: - if it implies playful/energetic, choose a colorful scheme\n           - if it implies monochrome/minimal, choose a black–white/neutral scheme\n\n**Component Reuse:**\n\t- Prioritize using pre-existing components from src/components/ui when applicable\n\t- Create new components that match the style and conventions of existing components when needed\n\t- Examine existing components to understand the project's component patterns before creating new ones\n\n**IMPORTANT**: Do not use HTML based component like dropdown, calendar, toast etc. You **MUST** always use `/app/frontend/src/components/ui/ ` only as a primary components as these are modern and stylish component\n\n**Best Practices:**\n\t- Use Shadcn/UI as the primary component library for consistency and accessibility\n\t- Import path: ./components/[component-name]\n\n**Export Conventions:**\n\t- Components MUST use named exports (export const ComponentName = ...)\n\t- Pages MUST use default exports (export default function PageName() {...})\n\n**Toasts:**\n  - Use `sonner` for toasts\"\n  - Sonner component are located in `/app/src/components/ui/sonner.tsx`\n\nUse 2–4 color gradients, subtle textures/noise overlays, or CSS-based noise to avoid flat visuals."
  ]
}
