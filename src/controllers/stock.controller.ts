import { Request, Response } from "express";
import prisma from "../lib/prisma";

export const getStock = async (req: Request, res: Response) => {
  try {
    const { tenantId } = req.query;

    const stock = await prisma.stock.findMany({
      where: {
        variante: {
          producto: { tenantId: tenantId as string },
        },
      },
      include: {
        variante: {
          include: {
            producto: true,
          },
        },
      },
      orderBy: { cantidad: "asc" },
    });

    res.json(stock);
  } catch {
    res.status(500).json({ error: "Error al obtener stock" });
  }
};