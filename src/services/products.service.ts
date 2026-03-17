import prisma from "../lib/prisma";

export const getAllProducts = async () => {
  return await prisma.producto.findMany({
    where: { activo: true },
    include: {
      variantes: {
        include: {
          stock: true,
        },
      },
    },
  });
};