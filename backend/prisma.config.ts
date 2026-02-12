import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // Local PostgreSQL (pgAdmin DB: feedbackloop)
    url: process.env.DATABASE_URL!,
  },
});
