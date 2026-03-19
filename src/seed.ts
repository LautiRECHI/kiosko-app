import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const kiosco = await prisma.kiosco.create({
    data: {
      nombre: "Kiosco Principal",
      tenantId: "7904fad8-27b4-43c6-a82c-25b93fa7bfd3",
    },
  });
  console.log(kiosco);
}

main().finally(() => prisma.$disconnect());