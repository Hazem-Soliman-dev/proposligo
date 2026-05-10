"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export interface ProfileFormState {
  success: boolean;
  error: string | null;
}

interface ProfileInput {
  jobTitle: string;
  bio: string;
  techStack: string;
  portfolioUrl: string;
}

const DEMO_CLERK_ID = "demo_user";

const MAX_JOB_TITLE_LENGTH = 120;
const MAX_BIO_LENGTH = 1000;
const MAX_TECH_STACK_LENGTH = 500;
const MAX_PORTFOLIO_URL_LENGTH = 255;

function validateUrl(url: string): boolean {
  if (!url) return true; // empty is ok
  try {
    const parsed = new URL(url);
    return ["http:", "https:"].includes(parsed.protocol);
  } catch {
    return false;
  }
}

export async function upsertProfile(
  _prevState: ProfileFormState,
  formData: FormData
): Promise<ProfileFormState> {
  try {
    const raw: ProfileInput = {
      jobTitle: (formData.get("jobTitle") as string)?.trim() ?? "",
      bio: (formData.get("bio") as string)?.trim() ?? "",
      techStack: (formData.get("techStack") as string)?.trim() ?? "",
      portfolioUrl: (formData.get("portfolioUrl") as string)?.trim() ?? "",
    };

    // --- Validation ---
    if (!raw.jobTitle || raw.jobTitle.length > MAX_JOB_TITLE_LENGTH) {
      return { success: false, error: `Job title is required (max ${MAX_JOB_TITLE_LENGTH} chars).` };
    }
    if (!raw.bio || raw.bio.length > MAX_BIO_LENGTH) {
      return { success: false, error: `Bio is required (max ${MAX_BIO_LENGTH} chars).` };
    }
    if (!raw.techStack || raw.techStack.length > MAX_TECH_STACK_LENGTH) {
      return { success: false, error: `Tech stack is required (max ${MAX_TECH_STACK_LENGTH} chars).` };
    }
    if (raw.portfolioUrl && raw.portfolioUrl.length > MAX_PORTFOLIO_URL_LENGTH) {
      return { success: false, error: `Portfolio URL is too long (max ${MAX_PORTFOLIO_URL_LENGTH} chars).` };
    }
    if (!validateUrl(raw.portfolioUrl)) {
      return { success: false, error: "Portfolio URL must be a valid http or https URL." };
    }

    // --- Fetch demo user ---
    const user = await prisma.user.findFirst({
      where: { clerkId: DEMO_CLERK_ID },
    });

    if (!user) {
      return { success: false, error: "Demo user not found. Run `npm run db:seed` first." };
    }

    // --- Upsert profile ---
    await prisma.profile.upsert({
      where: { userId: user.id },
      update: {
        jobTitle: raw.jobTitle,
        bio: raw.bio,
        techStack: raw.techStack,
        portfolioUrl: raw.portfolioUrl || null,
      },
      create: {
        userId: user.id,
        jobTitle: raw.jobTitle,
        bio: raw.bio,
        techStack: raw.techStack,
        portfolioUrl: raw.portfolioUrl || null,
      },
    });

    revalidatePath("/dashboard");

    return { success: true, error: null };
  } catch (error: unknown) {
    console.error("upsertProfile error:", error);
    return { success: false, error: "Failed to save profile. Please try again." };
  }
}
