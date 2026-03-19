import prisma from "../lib/prisma";

export const crearVenta = async (
  kioscoId: string,
  items: { varianteId: string; cantidad: number; precioUnitario: number }[],
  pago: { metodo: string; monto: number },
  clienteId?: string
) => {
  const total = items.reduce((acc, i) => acc + i.precioUnitario * i.cantidad, 0);

  const venta = await prisma.venta.create({
    data: {
      kioscoId,
      clienteId,
      total,
      items: {
        create: items.map((i) => ({
          varianteId: i.varianteId,
          cantidad: i.cantidad,
          precioUnitario: i.precioUnitario,
        })),
      },
      pagos: {
        create: {
          metodo: pago.metodo,
          monto: pago.monto,
        },
      },
    },
  });

  for (const item of items) {
    await prisma.stock.updateMany({
      where: { varianteId: item.varianteId },
      data: { cantidad: { decrement: item.cantidad } },
    });
  }

  return venta;
};