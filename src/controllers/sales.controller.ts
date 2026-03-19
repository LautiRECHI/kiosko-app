import { Request, Response } from "express";
import { crearVenta } from "../services/sales.service";
import prisma from "../lib/prisma";

export const postSale = async (req: Request, res: Response) => {
  try {
    const { tenantId, items, pago, clienteId } = req.body;

    const kiosco = await prisma.kiosco.findFirst({
      where: { tenantId },
    });

    if (!kiosco) {
      res.status(404).json({ error: "Kiosco no encontrado" });
      return;
    }

    const venta = await crearVenta(kiosco.id, items, pago, clienteId);
    res.json(venta);
  } catch (error) {
    res.status(500).json({ error: "Error al crear la venta" });
  }
};