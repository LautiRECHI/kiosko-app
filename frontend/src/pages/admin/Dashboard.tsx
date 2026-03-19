import { useEffect, useState } from "react";
import api from "../../api/client";

const TENANT_ID = "7904fad8-27b4-43c6-a82c-25b93fa7bfd3";

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
          {[
            { label: "Dashboard", active: true },
            { label: "Productos", active: false },
            { label: "Importar", active: false },
            { label: "Clientes", active: false },
            { label: "Ventas", active: false },
            { label: "Stock", active: false },
            { label: "Configuración", active: false },
          ].map((item) => (
            <div
              key={item.label}
              className={`px-6 py-2.5 text-sm cursor-pointer flex items-center gap-3 border-l-2 ${
                item.active
                  ? "border-primary text-primary-dark font-medium bg-blue-50"
                  : "border-transparent text-gray-400 hover:text-gray-600"
              }`}
            >
              <div className="w-1.5 h-1.5 rounded-full bg-current opacity-60"></div>
              {item.label}
            </div>
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