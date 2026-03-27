import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const hash = await bcrypt.hash("super123", 10);
  const superadmin = await prisma.superadmin.create({
    data: {
      email: "super@scriptsolutions.com",
      password: hash,
    },
  });
  console.log("Superadmin creado:", superadmin.email);
}

main().finally(() => prisma.$disconnect());