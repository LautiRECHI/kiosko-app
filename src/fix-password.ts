import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const hash = await bcrypt.hash("admin123", 10);
  const tenant = await prisma.tenant.update({
    where: { email: "admin@kioscodemo.com" },
    data: { password: hash, pin_kiosco: "1234" },
  });
  console.log("Actualizado:", tenant.email, "PIN:", tenant.pin_kiosco);
}

main().finally(() => prisma.$disconnect());