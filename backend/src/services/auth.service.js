import "dotenv/config";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../config/prisma.js";

function signToken(user) {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET missing in .env");

  return jwt.sign(
    { sub: user.id, role: user.role, email: user.email },
    secret,
    { expiresIn: "7d" }
  );
}

export async function register({ name, email, password }) {
  if (!name || !email || !password) throw new Error("name, email, password are required");

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw new Error("Email already registered");

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: { name, email, passwordHash, role: "USER" },
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  });

  const token = signToken(user);
  return { user, token };
}

export async function login({ email, password }) {
  if (!email || !password) throw new Error("email and password are required");

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error("Invalid credentials");

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) throw new Error("Invalid credentials");

  const token = signToken(user);

  const safeUser = { id: user.id, name: user.name, email: user.email, role: user.role, createdAt: user.createdAt };
  return { user: safeUser, token };
}
