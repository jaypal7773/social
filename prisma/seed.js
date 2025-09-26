const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  console.log("Seeding started...");

  const users = [
    {
      name: "Alice",
      email: "alice@example.com",
      role: "ADMIN",
      password: await bcrypt.hash("admin123", 10)
    },
    {
      name: "Bob",
      email: "bob@example.com",
      role: "USER",
      password: await bcrypt.hash("user123", 10)
    }
  ];

  // Users
  await prisma.user.createMany({
    data: users,
    skipDuplicates: true
  });

  console.log("Seeding finished!");
}

main()
  .catch(e => {
    console.error("Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
