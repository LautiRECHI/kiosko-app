import { useEffect, useState } from "react";
import api from "../../api/client";

const TENANT_ID = "f11f645a-0c64-4873-9c0a-b11f330fbb2c";

const navItems = [
  { label: "Dashboard", path: "/admin" },
  { label: "Productos", path: "/admin/productos" },
  { label: "Importar", path: "/admin/importar" },
  { label: "Clientes", path: "/admin/clientes" },
  { label: "Ventas", path: "/admin/ventas" },
  { label: "Stock", path: "/admin/stock" },
  { label: "Configuracion", path: "/admin/config" },
];

export default function Configuracion() {
  const [iva, setIva] = useState(21);
  const [margen, setMargen] = useState(35);
  const [cbu, setCbu] = useState("");
  const [alias, setAlias] = useState("");
  const [nombreNegocio, setNombreNegocio] = useState("");
  const [guardando, setGuardando] = useState(false);
  const [guardado, setGuardado] = useState(false);

  useEffect(() => {
    api.get(`/config?tenantId=${TENANT_ID}`).then((res) => {
      const d = res.data;
      setIva(d.iva_porcentaje ?? 21);
      setMargen(d.margen_porcentaje ?? 35);
      setCbu(d.cbu ?? "");
      setAlias(d.alias ?? "");
      setNombreNegocio(d.nombre ?? "");
    });
  }, []);

  const guardar = async () => {
    setGuardando(true);
    try {
      await api.put(`/config`, {
        tenantId: TENANT_ID,
        iva_porcentaje: iva,
        margen_porcentaje: margen,
        cbu,
        alias,
        nombre: nombreNegocio,
      });
      setGuardado(true);
      setTimeout(() => setGuardado(false), 3000);
    } catch {
      alert("Error al guardar");
    } finally {
      setGuardando(false);
    }
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
                item.label === "Configuracion"
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

      <main className="flex-1 px-8 py-6 max-w-2xl">
        <div className="mb-6">
          <h1 className="text-xl font-medium text-gray-800">Configuración</h1>
          <p className="text-sm text-gray-400 mt-1">Ajustes del negocio</p>
        </div>

        {guardado && (
          <div className="bg-green-50 border border-green-100 rounded-xl px-4 py-3 mb-6 flex items-center gap-3">
            <span className="text-green-500 text-sm">Configuración guardada correctamente</span>
          </div>
        )}

        <div className="bg-white border border-gray-100 rounded-xl p-6 mb-4">
          <div className="text-sm font-medium text-gray-700 mb-4">Datos del negocio</div>
          <div>
            <div className="text-xs text-gray-400 mb-1">Nombre del negocio</div>
            <input
              type="text"
              value={nombreNegocio}
              onChange={(e) => setNombreNegocio(e.target.value)}
              placeholder="Ej: Kiosco El Sol"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-primary"
            />
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-xl p-6 mb-4">
          <div className="text-sm font-medium text-gray-700 mb-4">Precios</div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-xs text-gray-400 mb-1">IVA (%)</div>
              <input
                type="number"
                value={iva}
                onChange={(e) => setIva(Number(e.target.value))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <div className="text-xs text-gray-400 mb-1">Margen de ganancia (%)</div>
              <input
                type="number"
                value={margen}
                onChange={(e) => setMargen(Number(e.target.value))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-primary"
              />
            </div>
          </div>
          <div className="mt-3 bg-blue-50 rounded-lg px-4 py-3">
            <span className="text-xs text-gray-400">Precio ejemplo con $1.000 de costo: </span>
            <span className="text-sm font-medium text-primary">
              ${Math.round(1000 * (1 + iva / 100) * (1 + margen / 100)).toLocaleString("es-AR")}
            </span>
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-xl p-6 mb-6">
          <div className="text-sm font-medium text-gray-700 mb-4">Datos bancarios para transferencias</div>
          <div className="flex flex-col gap-4">
            <div>
              <div className="text-xs text-gray-400 mb-1">CBU</div>
              <input
                type="text"
                value={cbu}
                onChange={(e) => setCbu(e.target.value)}
                placeholder="Ej: 0000003100012345678901"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-primary font-mono"
              />
            </div>
            <div>
              <div className="text-xs text-gray-400 mb-1">Alias</div>
              <input
                type="text"
                value={alias}
                onChange={(e) => setAlias(e.target.value)}
                placeholder="Ej: KIOSCO.EL.SOL"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-primary font-mono"
              />
            </div>
          </div>
        </div>

        <button
          onClick={guardar}
          disabled={guardando}
          className="bg-primary text-white text-sm font-medium px-6 py-3 rounded-lg hover:bg-primary-dark disabled:opacity-40 transition-colors"
        >
          {guardando ? "Guardando..." : "Guardar cambios"}
        </button>
      </main>
    </div>
  );
}