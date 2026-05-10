import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ensureUser } from "@/lib/auth";

export async function GET() {
  try {
    let dbUser;
    try {
      dbUser = await ensureUser();
    } catch {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: dbUser.id },
      include: { profile: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      profile: user.profile ? {
        jobTitle: user.profile.jobTitle,
        bio: user.profile.bio,
        techStack: user.profile.techStack,
        portfolioUrl: user.profile.portfolioUrl,
      } : null,
      credits: user.credits,
    });
  } catch (error: unknown) {
    console.error("Profile API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch profile." },
      { status: 500 }
    );
  }
}
