import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ensureUser } from "@/lib/auth";
import { Groq } from "groq-sdk";
import type { GenerateRequest } from "@/types";
import { buildSystemPrompt } from "@/lib/prompts";
import { MODEL_ID, MIN_JOB_DESC_LENGTH, MAX_JOB_DESC_LENGTH, VALID_TONES, VALID_TEMPLATES } from "@/lib/constants";

export const runtime = "nodejs";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as GenerateRequest;
    const { jobDescription, tone, template, language = "en" } = body;

    // 1. Validation
    if (!jobDescription || jobDescription.length < MIN_JOB_DESC_LENGTH || jobDescription.length > MAX_JOB_DESC_LENGTH) {
      return NextResponse.json(
        { error: `Job description must be between ${MIN_JOB_DESC_LENGTH} and ${MAX_JOB_DESC_LENGTH} characters.` },
        { status: 400 }
      );
    }
    if (!VALID_TONES.includes(tone)) {
      return NextResponse.json({ error: "Invalid tone selected." }, { status: 400 });
    }
    if (!VALID_TEMPLATES.includes(template)) {
      return NextResponse.json({ error: "Invalid template selected." }, { status: 400 });
    }
    if (language !== "en" && language !== "ar") {
      return NextResponse.json({ error: "Invalid language selected." }, { status: 400 });
    }

    // 2. Authenticate & ensure DB user exists
    let dbUser;
    try {
      dbUser = await ensureUser();
    } catch {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 3. Fetch profile
    const user = await prisma.user.findUnique({
      where: { id: dbUser.id },
      include: { profile: true },
    });

    if (!user || !user.profile) {
      return NextResponse.json(
        { error: "Profile not found. Please set up your profile using the 'Edit Profile' button before generating proposals." },
        { status: 400 }
      );
    }

    // 3. Credit Check (Enforcement)
    if (user.credits <= 0) {
      return NextResponse.json({ error: "Out of credits. Please upgrade your plan." }, { status: 403 });
    }

    // 4. Build Prompt
    const systemPrompt = buildSystemPrompt(user.profile, tone, template, language);

    // 5. Call Groq LLM
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Job Description:\n\n${jobDescription}` },
      ],
      model: MODEL_ID,
      temperature: 0.75,
      max_tokens: 1500,
    });

    const generatedText = chatCompletion.choices[0]?.message?.content;

    if (!generatedText) {
      throw new Error("Groq API returned an empty response.");
    }

    // 6. Save Proposal & Deduct Credit (Transaction)
    const [proposal] = await prisma.$transaction([
      prisma.proposal.create({
        data: {
          userId: user.id,
          jobDescription,
          tone,
          generatedText,
        },
      }),
      prisma.user.update({
        where: { id: user.id },
        data: { credits: { decrement: 1 } },
      }),
    ]);

    // 7. Return Result
    return NextResponse.json({ proposal: proposal.generatedText, id: proposal.id });
  } catch (error: unknown) {
    console.error("Generate API Error:", error);
    return NextResponse.json(
      { error: "An error occurred while generating the proposal." },
      { status: 500 }
    );
  }
}
