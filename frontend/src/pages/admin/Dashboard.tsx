import { useEffect, useState } from "react";
import api from "../../api/client";

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

export default function Dashboard() {
  const [productos, setProductos] = useState<number>(0);

  useEffect(() => {
    api.get("/products").then((res) => setProductos(res.data.length));
  }, []);

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
                item.label === "Dashboard"
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
          <h1 className="text-xl font-medium text-gray-800">Dashboard</h1>
          <p className="text-sm text-gray-400 mt-1">Resumen del negocio</p>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white border border-gray-100 rounded-xl p-5">
            <div className="text-xs text-gray-400 mb-2">Ventas hoy</div>
            <div className="text-2xl font-medium text-gray-800">$0</div>
            <div className="text-xs text-primary mt-1">Sin ventas aún hoy</div>
          </div>
          <div className="bg-white border border-gray-100 rounded-xl p-5">
            <div className="text-xs text-gray-400 mb-2">Productos activos</div>
            <div className="text-2xl font-medium text-gray-800">{productos}</div>
            <div className="text-xs text-primary mt-1">En catálogo</div>
          </div>
          <div className="bg-white border border-gray-100 rounded-xl p-5">
            <div className="text-xs text-gray-400 mb-2">Stock bajo mínimo</div>
            <div className="text-2xl font-medium text-gray-800">0</div>
            <div className="text-xs text-green-500 mt-1">Todo en orden</div>
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-xl p-5">
          <div className="text-xs text-gray-400 uppercase tracking-wider mb-4">Accesos rápidos</div>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => window.location.href = "/"}
              className="flex items-center gap-3 px-4 py-3 border border-gray-100 rounded-lg hover:border-primary hover:bg-blue-50 transition-all text-left"
            >
              <span className="text-xl">🖥️</span>
              <div>
                <div className="text-sm font-medium text-gray-700">Ir al kiosco</div>
                <div className="text-xs text-gray-400">Vista del cliente</div>
              </div>
            </button>
            <button
              onClick={() => window.location.href = "/admin/importar"}
              className="flex items-center gap-3 px-4 py-3 border border-gray-100 rounded-lg hover:border-primary hover:bg-blue-50 transition-all text-left"
            >
              <span className="text-xl">📦</span>
              <div>
                <div className="text-sm font-medium text-gray-700">Importar productos</div>
                <div className="text-xs text-gray-400">Subir Excel</div>
              </div>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}