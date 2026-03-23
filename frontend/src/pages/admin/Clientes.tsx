import { useEffect, useState } from "react";
import api from "../../api/client";

const TENANT_ID = "5ac9239b-27df-46e8-8bcb-317fd34825f2";

interface Cliente {
  id: string;
  nombre: string;
  telefono: string | null;
  saldoCuenta: number;
  createdAt: string;
}

const navItems = [
  { label: "Dashboard", path: "/admin" },
  { label: "Productos", path: "/admin/productos" },
  { label: "Importar", path: "/admin/importar" },
  { label: "Clientes", path: "/admin/clientes" },
  { label: "Ventas", path: "/admin/ventas" },
  { label: "Stock", path: "/admin/stock" },
  { label: "Configuracion", path: "/admin/config" },
];

export default function Clientes() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [mostrarForm, setMostrarForm] = useState(false);
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [guardando, setGuardando] = useState(false);

  const cargarClientes = () => {
    api.get(`/clients?tenantId=${TENANT_ID}`)
      .then((res) => setClientes(res.data))
      .catch(() => setClientes([]))
      .finally(() => setCargando(false));
  };

  useEffect(() => {
    cargarClientes();
  }, []);

  const guardarCliente = async () => {
    if (!nombre.trim()) return;
    setGuardando(true);
    try {
      await api.post("/clients", { tenantId: TENANT_ID, nombre, telefono });
      setNombre("");
      setTelefono("");
      setMostrarForm(false);
      cargarClientes();
    } catch {
      alert("Error al guardar cliente");
    } finally {
      setGuardando(false);
    }
  };

  const filtrados = clientes.filter((c) =>
    c.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    (c.telefono || "").includes(busqueda)
  );

  const totalDeuda = clientes.reduce((acc, c) => acc + (c.saldoCuenta < 0 ? c.saldoCuenta : 0), 0);
  const clientesConDeuda = clientes.filter((c) => c.saldoCuenta < 0).length;

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
                item.label === "Clientes"
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
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-medium text-gray-800">Clientes</h1>
            <p className="text-sm text-gray-400 mt-1">Gestión de clientes y cuenta corriente</p>
          </div>
          <button
            onClick={() => setMostrarForm(!mostrarForm)}
            className="bg-primary text-white text-sm px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors"
          >
            + Nuevo cliente
          </button>
        </div>

        {mostrarForm && (
          <div className="bg-white border border-gray-100 rounded-xl p-5 mb-6">
            <div className="text-sm font-medium text-gray-700 mb-4">Nuevo cliente</div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <div className="text-xs text-gray-400 mb-1">Nombre</div>
                <input
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Nombre del cliente"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-primary"
                />
              </div>
              <div>
                <div className="text-xs text-gray-400 mb-1">Teléfono (opcional)</div>
                <input
                  type="text"
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                  placeholder="Ej: 3624 123456"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-primary"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={guardarCliente}
                disabled={guardando || !nombre.trim()}
                className="bg-primary text-white text-sm px-4 py-2 rounded-lg hover:bg-primary-dark disabled:opacity-40 transition-colors"
              >
                {guardando ? "Guardando..." : "Guardar"}
              </button>
              <button
                onClick={() => setMostrarForm(false)}
                className="text-sm text-gray-400 hover:text-gray-600"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white border border-gray-100 rounded-xl p-5">
            <div className="text-xs text-gray-400 mb-2">Total clientes</div>
            <div className="text-2xl font-medium text-gray-800">{clientes.length}</div>
          </div>
          <div className="bg-white border border-gray-100 rounded-xl p-5">
            <div className="text-xs text-gray-400 mb-2">Con deuda</div>
            <div className="text-2xl font-medium text-gray-800">{clientesConDeuda}</div>
          </div>
          <div className="bg-white border border-gray-100 rounded-xl p-5">
            <div className="text-xs text-gray-400 mb-2">Deuda total</div>
            <div className="text-2xl font-medium text-red-500">
              ${Math.abs(totalDeuda).toLocaleString("es-AR", { maximumFractionDigits: 0 })}
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-4">
            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar por nombre o teléfono..."
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-primary w-72"
            />
          </div>
          {cargando ? (
            <div className="px-5 py-8 text-center text-sm text-gray-400">Cargando...</div>
          ) : filtrados.length === 0 ? (
            <div className="px-5 py-8 text-center text-sm text-gray-400">No hay clientes registrados</div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left px-5 py-3 text-xs text-gray-400 font-medium">Nombre</th>
                  <th className="text-left px-5 py-3 text-xs text-gray-400 font-medium">Teléfono</th>
                  <th className="text-right px-5 py-3 text-xs text-gray-400 font-medium">Saldo cuenta</th>
                  <th className="text-left px-5 py-3 text-xs text-gray-400 font-medium">Estado</th>
                </tr>
              </thead>
              <tbody>
                {filtrados.map((cliente) => (
                  <tr key={cliente.id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="px-5 py-3 font-medium text-gray-700">{cliente.nombre}</td>
                    <td className="px-5 py-3 text-gray-500">{cliente.telefono || "—"}</td>
                    <td className={`px-5 py-3 text-right font-medium ${
                      cliente.saldoCuenta < 0 ? "text-red-500" : "text-green-600"
                    }`}>
                      ${cliente.saldoCuenta.toLocaleString("es-AR", { maximumFractionDigits: 0 })}
                    </td>
                    <td className="px-5 py-3">
                      {cliente.saldoCuenta < 0 ? (
                        <span className="bg-red-50 text-red-500 text-xs px-2 py-1 rounded-md">Con deuda</span>
                      ) : (
                        <span className="bg-green-50 text-green-600 text-xs px-2 py-1 rounded-md">Al dia</span>
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