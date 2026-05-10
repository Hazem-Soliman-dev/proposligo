import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const DEMO_CLERK_ID = "demo_user";

export async function GET() {
  try {
    const user = await prisma.user.findFirst({
      where: { clerkId: DEMO_CLERK_ID },
      include: { profile: true },
    });

    if (!user?.profile) {
      return NextResponse.json({ profile: null });
    }

    return NextResponse.json({
      profile: {
        jobTitle: user.profile.jobTitle,
        bio: user.profile.bio,
        techStack: user.profile.techStack,
        portfolioUrl: user.profile.portfolioUrl,
      },
    });
  } catch (error: unknown) {
    console.error("Profile API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch profile." },
      { status: 500 }
    );
  }
}
