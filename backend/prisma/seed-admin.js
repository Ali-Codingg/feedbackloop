import "dotenv/config";
import bcrypt from "bcrypt";
import { prisma } from "../src/config/prisma.js";

async function main() {
  const name = process.env.ADMIN_NAME;
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!name || !email || !password) {
    console.error("Missing ADMIN_NAME / ADMIN_EMAIL / ADMIN_PASSWORD in backend/.env");
    process.exit(1);
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    console.log(`Admin already exists: ${email} (role=${existing.role})`);
    return;
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const admin = await prisma.user.create({
    data: { name, email, passwordHash, role: "ADMIN" },
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  });

  console.log("✅ Admin created:", admin);
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });