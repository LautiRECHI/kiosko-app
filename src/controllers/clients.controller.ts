import { Request, Response } from "express";
import prisma from "../lib/prisma";

export const getClients = async (req: Request, res: Response) => {
  try {
    const { tenantId } = req.query;
    const clientes = await prisma.cliente.findMany({
      where: { tenantId: tenantId as string },
      orderBy: { nombre: "asc" },
    });
    res.json(clientes);
  } catch {
    res.status(500).json({ error: "Error al obtener clientes" });
  }
};

export const postClient = async (req: Request, res: Response) => {
  try {
    const { tenantId, nombre, telefono } = req.body;
    const cliente = await prisma.cliente.create({
      data: { tenantId, nombre, telefono },
    });
    res.json(cliente);
  } catch {
    res.status(500).json({ error: "Error al crear cliente" });
  }
};