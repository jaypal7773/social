// const prisma = require("../config/prismaClient");
// const bcrypt = require("bcryptjs");

// async function main() {
//   const adminEmail = "admin@social.com";
//   const adminPassword = "admin123";

//   const existing = await prisma.user.findUnique({
//     where: { email: adminEmail },
//   });

//   if (!existing) {
//     const hashed = await bcrypt.hash(adminPassword, 8);
//     await prisma.user.create({
//       data: {
//         email: adminEmail,
//         password: hashed,
//         name: "Super Admin",
//         role: "ADMIN",
//       },
//     });
//     console.log("Admin user created!");
//   } else {
//     console.log("Admin already exists");
//   }
// }

// main()
//   .then(async () => {
//     await prisma.$disconnect();
//   })
//   .catch(async (e) => {
//     console.error(e);
//     await prisma.$disconnect();
//     process.exit(1);
//   });
