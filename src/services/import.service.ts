import * as XLSX from "xlsx";
import prisma from "../lib/prisma";

export const parseExcel = (buffer: Buffer) => {
  const workbook = XLSX.read(buffer, { type: "buffer" });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json(sheet) as any[];

  return rows.map((row, index) => {
    const errors: string[] = [];

    if (!row["nombre"]) errors.push("nombre vacío");
    if (!row["categoria"]) errors.push("categoría vacía");
    if (!row["sabor_tipo"]) errors.push("sabor/tipo vacío");
    if (!row["precio"] && row["precio"] !== 0) errors.push("precio vacío");

    return {
      fila: index + 2,
      nombre: row["nombre"],
      categoria: row["categoria"],
      sabor_tipo: row["sabor_tipo"],
      precioCosto: parseFloat(row["precio"]) || 0,
      codigoBarras: row["codigo_barras"] || null,
      stockInicial: parseInt(row["stock_inicial"]) || 0,
      errors,
    };
  });
};

export const importProducts = async (
  rows: any[],
  tenantId: string,
  ivaPorc: number,
  margenPorc: number
) => {
  for (const row of rows) {
    if (row.errors.length > 0) continue;

    const precioFinal = row.precioCosto * (1 + ivaPorc / 100) * (1 + margenPorc / 100);

    let producto = await prisma.producto.findFirst({
      where: { nombre: row.nombre, tenantId },
    });

    if (!producto) {
      producto = await prisma.producto.create({
        data: {
          nombre: row.nombre,
          categoria: row.categoria,
          tenantId,
        },
      });
    }

    const variante = await prisma.variante.create({
      data: {
        productoId: producto.id,
        sabor_tipo: row.sabor_tipo,
        precio: precioFinal,
        precioCosto: row.precioCosto,
        codigoBarras: row.codigoBarras,
      },
    });

    await prisma.stock.create({
      data: {
        varianteId: variante.id,
        cantidad: row.stockInicial,
      },
    });
  }
};