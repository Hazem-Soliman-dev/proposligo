import type { Template, Tone } from "@/types";

export const BANNED_WORDS = [
  "delve", "leverage", "innovative", "testament", "tapestry", "synergy",
  "robust", "seamless", "cutting-edge", "pivotal", "paradigm", "holistic",
  "bespoke", "game-changer", "dive deeper", "embark", "landscape", "dynamic",
  "unlock", "supercharge", "transformative", "revolutionary", "state-of-the-art",
  "unleash", "orchestrate", "foster", "catalyst", "tailored", "comprehensive",
  "scalable", "navigating", "beacon", "testament to", "elevate", "demystify",
  "future-proof", "streamline", "optimize", "agile", "disrupt", "empower",
  "spearhead", "harness", "unparalleled", "keen", "adept", "honed",
  "realm", "facet", "multifaceted", "cornerstone", "underscores"
];

export const TONE_DESCRIPTIONS: Record<Tone, string> = {
  aggressive: "Confident, highly persuasive, direct, and slightly assertive. Use urgency. Focus strongly on ROI, outperforming competitors, and the cost of NOT hiring you.",
  professional: "Polite, respectful, clear, and business-focused. Emphasize reliability, experience, and structured process. Use measured language.",
  concise: "Extremely brief, no fluff at all. 150 words max. Gets straight to the value proposition and next steps. Every sentence earns its spot.",
  friendly: "Warm, approachable, like a colleague you already trust. Use casual contractions (I'm, you'll, let's). Show genuine curiosity about their project. Light humor is welcome if it fits.",
  bold: "Strong opening statement. Opinionated. You have a clear point of view on how to solve their problem and you're not afraid to say it. Skip pleasantries, lead with insight."
};

export const TEMPLATE_CONFIGS: Record<Template, { name: string; description: string; structure: string }> = {
  upwork_cover: {
    name: "Upwork Cover Letter",
    description: "Classic freelance platform proposal. Short, scannable, answers the posting directly.",
    structure: `FORMAT: Upwork-style cover letter (250-400 words)
1. Opening hook: Reference something specific from their job post to prove you read it.
2. Relevant experience: 2-3 sentences max. Mention a similar project you shipped.
3. Your approach: How you'd tackle THIS specific project (not generic methodology).
4. Quick timeline estimate and availability.
5. Soft CTA: Suggest a quick call or ask a clarifying question about their project.`
  },
  cold_email: {
    name: "Cold Email Pitch",
    description: "Outbound pitch to a potential client you found outside a job board.",
    structure: `FORMAT: Cold email (150-250 words, subject line included)
1. Start with: "Subject: [write a compelling subject line]" on its own line.
2. Opening: Reference something specific about THEIR company/product (shows research).
3. The problem you noticed they might have (be specific, not generic).
4. One concrete example of how you solved the same problem for someone else.
5. One-sentence CTA: Suggest a 15-minute call, link to your portfolio, or ask one question.
NOTE: Cold emails must be SHORT. If it scrolls on a phone, it's too long.`
  },
  follow_up: {
    name: "Follow-Up Message",
    description: "Re-engage a client who went silent after your initial proposal.",
    structure: `FORMAT: Follow-up message (100-180 words)
1. Acknowledge the gap ("I know things get busy...") without being passive-aggressive.
2. Add NEW value: Share a quick idea, a relevant article, or a small suggestion for their project.
3. Restate your availability briefly.
4. Low-pressure CTA: "No rush — just wanted to keep this on your radar."
NOTE: Never guilt-trip. Never say "just checking in" or "circling back." Add value or don't send it.`
  },
  rfp_response: {
    name: "Formal RFP Response",
    description: "Structured response to a Request for Proposal with clear deliverables.",
    structure: `FORMAT: Formal proposal (500-700 words, section headers included)
Use these exact section headers:
## Understanding Your Needs
(Restate their requirements in your own words to prove comprehension)
## Proposed Approach
(Technical approach with specific tools/frameworks, broken into phases)
## Deliverables & Timeline
(Bullet list of concrete deliverables with estimated timeframes)
## Why Me
(2-3 differentiators — be specific, not "I'm passionate and hardworking")
## Next Steps
(Clear CTA with your availability)`
  },
  quick_intro: {
    name: "Quick Intro",
    description: "Ultra-short introduction for DMs, Slack messages, or networking.",
    structure: `FORMAT: Quick intro (50-100 words MAX)
1. One sentence: Who you are and what you do.
2. One sentence: Why you're reaching out (what caught your eye about them/their project).
3. One sentence: What you can help with specifically.
4. CTA: Link or question.
NOTE: This is a DM, not an essay. Keep it to 3-4 sentences total. No paragraphs.`
  },
  case_study_pitch: {
    name: "Case Study Pitch",
    description: "Lead with a past success story that mirrors their current problem.",
    structure: `FORMAT: Story-driven pitch (300-450 words)
1. Open with the RESULT: "I helped [type of client] achieve [specific metric]."
2. The situation: What problem that client had (mirror the current prospect's problem).
3. What you did: Specific actions, tools used, decisions made.
4. The outcome: Numbers, speed, or qualitative impact.
5. Bridge to them: "Your project reminds me of this because..." — connect the dots.
6. CTA: Offer to share more details or discuss their project.`
  }
};

export const VALID_TONES: Tone[] = ["aggressive", "professional", "concise", "friendly", "bold"];
export const VALID_TEMPLATES: Template[] = ["upwork_cover", "cold_email", "follow_up", "rfp_response", "quick_intro", "case_study_pitch"];

export const MODEL_ID = "llama-3.3-70b-versatile";
export const MAX_JOB_DESC_LENGTH = 5000;
export const MIN_JOB_DESC_LENGTH = 50;
