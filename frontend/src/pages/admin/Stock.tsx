import { useEffect, useState } from "react";
import api from "../../api/client";
import Sidebar from "../../components/Sidebar";

const TENANT_ID = "05b12305-6d76-4e8d-a0e3-394737427413";

interface StockItem {
  id: string;
  cantidad: number;
  stockMinimo: number;
  variante: {
    sabor_tipo: string;
    precio: number;
    producto: { nombre: string; categoria: string };
  };
}

 [
  { label: "Dashboard", path: "/admin" },
  { label: "Productos", path: "/admin/productos" },
  { label: "Importar", path: "/admin/importar" },
  { label: "Clientes", path: "/admin/clientes" },
  { label: "Ventas", path: "/admin/ventas" },
  { label: "Stock", path: "/admin/stock" },
  { label: "Configuracion", path: "/admin/config" },
];

export default function Stock() {
  const [stock, setStock] = useState<StockItem[]>([]);
  const [cargando, setCargando] = useState(true);
  const [filtro, setFiltro] = useState<"todos" | "bajo" | "ok">("todos");

  const cargar = () => {
    api.get(`/stock?tenantId=${TENANT_ID}`)
      .then((res) => setStock(res.data))
      .catch(() => setStock([]))
      .finally(() => setCargando(false));
  };

  useEffect(() => { cargar(); }, []);

  const bajosMinimo = stock.filter((s) => s.cantidad <= s.stockMinimo);
  const enOrden = stock.filter((s) => s.cantidad > s.stockMinimo);

  const filtrados = filtro === "bajo" ? bajosMinimo : filtro === "ok" ? enOrden : stock;

  return (
    <div className="min-h-screen bg-gray-50 flex">
     <Sidebar active="Stock" />

      <main className="flex-1 px-8 py-6">
        <div className="mb-6">
          <h1 className="text-xl font-medium text-gray-800">Stock</h1>
          <p className="text-sm text-gray-400 mt-1">Control de inventario</p>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white border border-gray-100 rounded-xl p-5">
            <div className="text-xs text-gray-400 mb-2">Total productos</div>
            <div className="text-2xl font-medium text-gray-800">{stock.length}</div>
          </div>
          <div className="bg-white border border-gray-100 rounded-xl p-5">
            <div className="text-xs text-gray-400 mb-2">Bajo mínimo</div>
            <div className={`text-2xl font-medium ${bajosMinimo.length > 0 ? "text-red-500" : "text-gray-800"}`}>
              {bajosMinimo.length}
            </div>
          </div>
          <div className="bg-white border border-gray-100 rounded-xl p-5">
            <div className="text-xs text-gray-400 mb-2">En orden</div>
            <div className="text-2xl font-medium text-green-600">{enOrden.length}</div>
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-3">
            {["todos", "bajo", "ok"].map((f) => (
              <button
                key={f}
                onClick={() => setFiltro(f as "todos" | "bajo" | "ok")}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  filtro === f
                    ? "bg-primary text-white"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                {f === "todos" ? "Todos" : f === "bajo" ? "Bajo mínimo" : "En orden"}
              </button>
            ))}
          </div>
          {cargando ? (
            <div className="px-5 py-8 text-center text-sm text-gray-400">Cargando...</div>
          ) : filtrados.length === 0 ? (
            <div className="px-5 py-8 text-center text-sm text-gray-400">No hay productos</div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left px-5 py-3 text-xs text-gray-400 font-medium">Producto</th>
                  <th className="text-left px-5 py-3 text-xs text-gray-400 font-medium">Categoría</th>
                  <th className="text-left px-5 py-3 text-xs text-gray-400 font-medium">Variante</th>
                  <th className="text-right px-5 py-3 text-xs text-gray-400 font-medium">Stock actual</th>
                  <th className="text-right px-5 py-3 text-xs text-gray-400 font-medium">Mínimo</th>
                  <th className="text-left px-5 py-3 text-xs text-gray-400 font-medium">Estado</th>
                </tr>
              </thead>
              <tbody>
                {filtrados.map((item) => (
                  <tr key={item.id} className={`border-b border-gray-50 ${item.cantidad <= item.stockMinimo ? "bg-red-50" : ""}`}>
                    <td className="px-5 py-3 font-medium text-gray-700">{item.variante.producto.nombre}</td>
                    <td className="px-5 py-3 text-gray-500">{item.variante.producto.categoria}</td>
                    <td className="px-5 py-3 text-gray-500">{item.variante.sabor_tipo}</td>
                    <td className={`px-5 py-3 text-right font-medium ${item.cantidad <= item.stockMinimo ? "text-red-500" : "text-gray-800"}`}>
                      {item.cantidad}
                    </td>
                    <td className="px-5 py-3 text-right text-gray-400">{item.stockMinimo}</td>
                    <td className="px-5 py-3">
                      {item.cantidad <= item.stockMinimo ? (
                        <span className="bg-red-50 text-red-500 text-xs px-2 py-1 rounded-md">Reponer</span>
                      ) : (
                        <span className="bg-green-50 text-green-600 text-xs px-2 py-1 rounded-md">OK</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
}