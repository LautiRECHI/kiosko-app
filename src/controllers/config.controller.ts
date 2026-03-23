import { Request, Response } from "express";
import prisma from "../lib/prisma";

export const getConfig = async (req: Request, res: Response) => {
  try {
    const { tenantId } = req.query;
    const tenant = await prisma.tenant.findUnique({
      where: { id: tenantId as string },
    });
    res.json(tenant);
  } catch {
    res.status(500).json({ error: "Error al obtener configuracion" });
  }
};

export const updateConfig = async (req: Request, res: Response) => {
  try {
    const { tenantId, iva_porcentaje, margen_porcentaje, cbu, alias, nombre } = req.body;
    const tenant = await prisma.tenant.update({
      where: { id: tenantId },
      data: { iva_porcentaje, margen_porcentaje, nombre },
    });
    res.json(tenant);
  } catch {
    res.status(500).json({ error: "Error al actualizar configuracion" });
  }
};