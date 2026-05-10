import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const email = "demo@proposalgo.com";

  // Upsert the demo user to avoid unique constraint errors if run multiple times
  const user = await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      clerkId: "demo_user",
      email,
      credits: 10,
      profile: {
        create: {
          jobTitle: "Full-Stack Developer",
          bio: "5+ years building production web applications for high-growth startups. I specialize in Next.js, Node.js, and scaling databases.",
          techStack: "React, Next.js, Node.js, TypeScript, PostgreSQL, AWS",
          portfolioUrl: "https://portfolio.example.com",
        },
      },
    },
  });

  console.log("Database seeded successfully!");
  console.log({ user });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
