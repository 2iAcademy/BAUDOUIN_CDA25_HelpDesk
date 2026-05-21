import { PrismaPg } from "@prisma/adapter-pg";
import { Prisma, PrismaClient } from "@prisma/client";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});
const options: Prisma.PrismaClientOptions = {
  adapter,
  log: ["query", "error"],
};
export const prisma = new PrismaClient(options);
