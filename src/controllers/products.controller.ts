import { Request, Response } from "express";
import { getAllProducts } from "../services/products.service";

export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await getAllProducts();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener productos" });
  }
};