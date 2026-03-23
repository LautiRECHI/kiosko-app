import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const hash = await bcrypt.hash("admin123", 10);
  const tenant = await prisma.tenant.update({
    where: { email: "admin@kioscodemo.com" },
    data: { password: hash },
  });
  console.log("Contraseña actualizada:", tenant.email);
}

main().finally(() => prisma.$disconnect());