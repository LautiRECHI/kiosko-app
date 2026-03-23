import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const tenant = await prisma.tenant.create({
    data: {
      nombre: "Kiosco Demo",
      plan: "basic",
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