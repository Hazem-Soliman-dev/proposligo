import { auth, clerkClient } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

const DEFAULT_CREDITS = 5;

/**
 * Resolves the authenticated Clerk user and ensures a matching
 * record exists in the Prisma `User` table.
 *
 * - If the user doesn't exist, creates one with default credits.
 * - Returns the Prisma User (with id, clerkId, credits, etc.).
 * - Throws if not authenticated (caller should handle 401).
 */
export async function ensureUser() {
  const { userId: clerkId } = await auth();

  if (!clerkId) {
    throw new Error("Unauthorized");
  }

  // Fetch the user from Clerk to get their email
  const clerkUser = await (await clerkClient()).users.getUser(clerkId);
  const email = clerkUser.emailAddresses[0]?.emailAddress ?? "";

  // Try to find the user by clerkId first
  let user = await prisma.user.findUnique({
    where: { clerkId },
  });

  if (!user) {
    // If not found by clerkId, try to find by email
    user = await prisma.user.findUnique({
      where: { email },
    });

    if (user) {
      // If found by email, update the clerkId
      user = await prisma.user.update({
        where: { id: user.id },
        data: { clerkId },
      });
    } else {
      // If not found by either, create a new user
      user = await prisma.user.create({
        data: {
          clerkId,
          email,
          credits: DEFAULT_CREDITS,
        },
      });
    }
  }

  return user;
}
