import { useEffect, useState } from "react";
import api from "../../api/client";

interface VentaItem {
  cantidad: number;
  precioUnitario: number;
  variante: {
    sabor_tipo: string;
    producto: { nombre: string };
  };
}

interface Pago {
  metodo: string;
  monto: number;
}

interface Venta {
  id: string;
  total: number;
  estado: string;
  createdAt: string;
  items: VentaItem[];
  pagos: Pago[];
}

const TENANT_ID = "5ac9239b-27df-46e8-8bcb-317fd34825f2";

const navItems = [
  { label: "Dashboard", path: "/admin" },
  { label: "Productos", path: "/admin/productos" },
  { label: "Importar", path: "/admin/importar" },
  { label: "Clientes", path: "/admin/clientes" },
  { label: "Ventas", path: "/admin/ventas" },
  { label: "Stock", path: "/admin/stock" },
  { label: "Configuracion", path: "/admin/config" },
];

const metodoPagoLabel: Record<string, string> = {
  efectivo: "Efectivo",
  mercadopago_qr: "MP — QR",
  mercadopago_transferencia: "MP — Transferencia",
  mercadopago_tarjeta: "MP — Tarjeta",
  cuenta_corriente: "Cuenta corriente",
};

export default function Ventas() {
  const [ventas, setVentas] = useState<Venta[]>([]);
  const [cargando, setCargando] = useState(true);
  const [ventaAbierta, setVentaAbierta] = useState<string | null>(null);

  useEffect(() => {
    api.get(`/sales?tenantId=${TENANT_ID}`)
      .then((res) => setVentas(res.data))
      .catch(() => setVentas([]))
      .finally(() => setCargando(false));
  }, []);

  const totalDia = ventas.reduce((acc, v) => acc + v.total, 0);
  const ticketPromedio = ventas.length > 0 ? totalDia / ventas.length : 0;

  const metodoMasUsado = () => {
    const conteo: Record<string, number> = {};
    ventas.forEach((v) => v.pagos.forEach((p) => {
      conteo[p.metodo] = (conteo[p.metodo] || 0) + 1;
    }));
    const top = Object.entries(conteo).sort((a, b) => b[1] - a[1])[0];
    return top ? metodoPagoLabel[top[0]] || top[0] : "—";
  };
return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className="w-56 bg-white border-r border-gray-100 flex flex-col">
        <div className="px-6 py-5 border-b border-gray-100">
          <span className="text-primary-dark font-medium text-sm tracking-wide">ScriptSolutions</span>
          <div className="text-xs text-gray-400 mt-0.5">Panel admin</div>
        </div>
        <nav className="flex-1 py-4">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.path}
              className={`px-6 py-2.5 text-sm flex items-center gap-3 border-l-2 no-underline ${
                item.label === "Ventas"
                  ? "border-primary text-primary-dark font-medium bg-blue-50"
                  : "border-transparent text-gray-400 hover:text-gray-600"
              }`}
            >
              <div className="w-1.5 h-1.5 rounded-full bg-current opacity-60"></div>
              {item.label}
            </a>
          ))}
        </nav>
      </aside>

      <main className="flex-1 px-8 py-6">
        <div className="mb-6">
          <h1 className="text-xl font-medium text-gray-800">Ventas</h1>
          <p className="text-sm text-gray-400 mt-1">Resumen y detalle de todas las ventas</p>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="bg-white border border-gray-100 rounded-xl p-5">
            <div className="text-xs text-gray-400 mb-2">Total vendido</div>
            <div className="text-2xl font-medium text-gray-800">
              ${totalDia.toLocaleString("es-AR", { maximumFractionDigits: 0 })}
            </div>
          </div>
          <div className="bg-white border border-gray-100 rounded-xl p-5">
            <div className="text-xs text-gray-400 mb-2">Transacciones</div>
            <div className="text-2xl font-medium text-gray-800">{ventas.length}</div>
          </div>
          <div className="bg-white border border-gray-100 rounded-xl p-5">
            <div className="text-xs text-gray-400 mb-2">Ticket promedio</div>
            <div className="text-2xl font-medium text-gray-800">
              ${ticketPromedio.toLocaleString("es-AR", { maximumFractionDigits: 0 })}
            </div>
          </div>
          <div className="bg-white border border-gray-100 rounded-xl p-5">
            <div className="text-xs text-gray-400 mb-2">Método más usado</div>
            <div className="text-lg font-medium text-gray-800">{metodoMasUsado()}</div>
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <div className="text-sm font-medium text-gray-700">Detalle de ventas</div>
          </div>
          {cargando ? (
            <div className="px-5 py-8 text-center text-sm text-gray-400">Cargando...</div>
          ) : ventas.length === 0 ? (
            <div className="px-5 py-8 text-center text-sm text-gray-400">No hay ventas registradas</div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left px-5 py-3 text-xs text-gray-400 font-medium">Hora</th>
                  <th className="text-left px-5 py-3 text-xs text-gray-400 font-medium">Productos</th>
                  <th className="text-left px-5 py-3 text-xs text-gray-400 font-medium">Pago</th>
                  <th className="text-right px-5 py-3 text-xs text-gray-400 font-medium">Total</th>
                  <th className="text-center px-5 py-3 text-xs text-gray-400 font-medium">Detalle</th>
                </tr>
              </thead>
              <tbody>
                {ventas.map((venta) => (
                  <>
                    <tr key={venta.id} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="px-5 py-3 text-gray-500">
                        {new Date(venta.createdAt).toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" })}
                      </td>
                      <td className="px-5 py-3 text-gray-700">
                        {venta.items.map((i) => `${i.variante.producto.nombre} x${i.cantidad}`).join(", ")}
                      </td>
                      <td className="px-5 py-3">
                        <span className="bg-blue-50 text-primary text-xs px-2 py-1 rounded-md">
                          {metodoPagoLabel[venta.pagos[0]?.metodo] || venta.pagos[0]?.metodo}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-right font-medium text-gray-800">
                        ${venta.total.toLocaleString("es-AR", { maximumFractionDigits: 0 })}
                      </td>
                      <td className="px-5 py-3 text-center">
                        <button
                          onClick={() => setVentaAbierta(ventaAbierta === venta.id ? null : venta.id)}
                          className="text-primary text-xs hover:underline"
                        >
                          {ventaAbierta === venta.id ? "Cerrar" : "Ver"}
                        </button>
                      </td>
                    </tr>
                    {ventaAbierta === venta.id && (
                      <tr key={`${venta.id}-detalle`} className="bg-blue-50">
                        <td colSpan={5} className="px-5 py-3">
                          <div className="flex flex-col gap-1">
                            {venta.items.map((item, i) => (
                              <div key={i} className="flex justify-between text-xs text-gray-600">
                                <span>{item.variante.producto.nombre} — {item.variante.sabor_tipo} x{item.cantidad}</span>
                                <span>${(item.precioUnitario * item.cantidad).toLocaleString("es-AR", { maximumFractionDigits: 0 })}</span>
                              </div>
                            ))}
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
}