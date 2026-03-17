import { Request, Response } from "express";
import { parseExcel, importProducts } from "../services/import.service";

export const previewImport = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      res.status(400).json({ error: "No se subió ningún archivo" });
      return;
    }
    const rows = parseExcel(req.file.buffer);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: "Error al procesar el archivo" });
  }
};

export const confirmImport = async (req: Request, res: Response) => {
  try {
    const { rows, tenantId, iva, margen } = req.body;
    await importProducts(rows, tenantId, iva ?? 21, margen ?? 35);
    res.json({ mensaje: "Productos importados correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al importar productos" });
  }
};