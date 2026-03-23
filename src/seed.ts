import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("admin123", 10);

  const tenant = await prisma.tenant.create({
    data: {
      nombre: "Kiosco Demo",
      plan: "basic",
      email: "admin@kioscodemo.com",
      password: passwordHash,
      pin_kiosco: "1234",
    },
  });
  console.log("Tenant creado:", tenant);

  const kiosco = await prisma.kiosco.create({
    data: {
      nombre: "Kiosco Principal",
      tenantId: tenant.id,
    },
  });
  console.log("Kiosco creado:", kiosco);
}

main().finally(() => prisma.$disconnect());