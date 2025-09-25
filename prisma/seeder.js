await prisma.user.create({
  data: {
    email: "admin@example.com",
    name: "Super Admin",
    password: await bcrypt.hash("admin123", 8),
    role: "ADMIN"
  }
});
