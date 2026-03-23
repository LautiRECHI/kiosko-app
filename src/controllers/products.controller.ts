import { Request, Response } from "express";
import { getAllProducts } from "../services/products.service";
import prisma from "../lib/prisma";

export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await getAllProducts();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener productos" });
  }
};
export const updateVariante = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const { precio } = req.body;
    const variante = await prisma.variante.update({
      where: { id },
      data: { precio },
    });
    res.json(variante);
  } catch {
    res.status(500).json({ error: "Error al actualizar variante" });
  }
};