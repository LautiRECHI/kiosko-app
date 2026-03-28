import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/client";

interface Tenant {
  id: string;
  nombre: string;
  email: string;
  plan: string;
  activo: boolean;
  pin_kiosco: string;
  suscripcion_vence: string | null;
  createdAt: string;
  kioscos: { id: string }[];
  _count: { productos: number };
}

export default function Superadmin() {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [cargando, setCargando] = useState(true);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [editando, setEditando] = useState<Tenant | null>(null);
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pin, setPin] = useState("1234");
  const [plan, setPlan] = useState("basic");
  const [vencimiento, setVencimiento] = useState("");
  const [guardando, setGuardando] = useState(false);
  const navigate = useNavigate();

  const token = localStorage.getItem("superadmin_token");

  useEffect(() => {
    if (!token) { navigate("/superadmin/login"); return; }
    cargar();
  }, []);

  const cargar = () => {
    api.get("/superadmin/tenants", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setTenants(res.data))
      .catch(() => navigate("/superadmin/login"))
      .finally(() => setCargando(false));
  };

  const abrirEditar = (t: Tenant) => {
    setEditando(t);
    setNombre(t.nombre);
    setEmail(t.email);
    setPassword("");
    setPin(t.pin_kiosco);
    setPlan(t.plan);
    setVencimiento(t.suscripcion_vence ? t.suscripcion_vence.split("T")[0] : "");
    setMostrarForm(true);
  };

  const cerrarForm = () => {
    setMostrarForm(false);
    setEditando(null);
    setNombre(""); setEmail(""); setPassword(""); setPin("1234"); setPlan("basic"); setVencimiento("");
  };

  const guardar = async () => {
    if (!nombre || !email) return;
    setGuardando(true);
    try {
      if (editando) {
        await api.put(`/superadmin/tenants/${editando.id}`, {
          nombre, email, password: password || undefined, pin_kiosco: pin, plan,
          suscripcion_vence: vencimiento || null,
        }, { headers: { Authorization: `Bearer ${token}` } });
      } else {
        if (!password) return;
        await api.post("/superadmin/tenants", {
          nombre, email, password, pin_kiosco: pin, plan,
          suscripcion_vence: vencimiento || null,
        }, { headers: { Authorization: `Bearer ${token}` } });
      }
      cerrarForm();
      cargar();
    } catch {
      alert("Error al guardar cliente");
    } finally {
      setGuardando(false);
    }
  };

  const toggleCliente = async (id: string) => {
    try {
      await api.put(`/superadmin/tenants/${id}/toggle`, {}, { headers: { Authorization: `Bearer ${token}` } });
      cargar();
    } catch {
      alert("Error al actualizar cliente");
    }
  };

  const eliminarCliente = async (id: string, nombre: string) => {
    if (!confirm(`¿Eliminar a ${nombre}? Esta acción no se puede deshacer.`)) return;
    try {
      await api.delete(`/superadmin/tenants/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      cargar();
    } catch {
      alert("Error al eliminar cliente");
    }
  };

  const logout = () => {
    localStorage.removeItem("superadmin_token");
    navigate("/superadmin/login");
  };

  const activos = tenants.filter((t) => t.activo).length;
  const inactivos = tenants.filter((t) => !t.activo).length;

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="bg-gray-900 border-b border-white/5 px-8 py-4 flex items-center justify-between">
        <div>
          <span className="text-purple-400 font-medium text-sm tracking-wide">ScriptSolutions</span>
          <span className="text-white/40 text-sm ml-2">— Panel SuperAdmin</span>
        </div>
        <button onClick={logout} className="text-xs text-white/40 hover:text-white/60 transition-colors">
          Cerrar sesión
        </button>
      </div>

      <div className="px-8 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-medium text-white">Clientes</h1>
            <p className="text-sm text-white/40 mt-1">Gestión de suscripciones</p>
          </div>
          <button onClick={() => { cerrarForm(); setMostrarForm(true); }} className="bg-purple-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
            + Nuevo cliente
          </button>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-900 border border-white/5 rounded-xl p-5">
            <div className="text-xs text-white/40 mb-2">Total clientes</div>
            <div className="text-2xl font-medium">{tenants.length}</div>
          </div>
          <div className="bg-gray-900 border border-white/5 rounded-xl p-5">
            <div className="text-xs text-white/40 mb-2">Activos</div>
            <div className="text-2xl font-medium text-green-400">{activos}</div>
          </div>
          <div className="bg-gray-900 border border-white/5 rounded-xl p-5">
            <div className="text-xs text-white/40 mb-2">Suspendidos</div>
            <div className="text-2xl font-medium text-red-400">{inactivos}</div>
          </div>
        </div>

        {mostrarForm && (
          <div className="bg-gray-900 border border-white/5 rounded-xl p-6 mb-6">
            <div className="text-sm font-medium text-white mb-4">
              {editando ? `Editando: ${editando.nombre}` : "Nuevo cliente"}
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <div className="text-xs text-white/40 mb-1">Nombre del negocio</div>
                <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Kiosco El Sol" className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500" />
              </div>
              <div>
                <div className="text-xs text-white/40 mb-1">Email</div>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@kioscoelsol.com" className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500" />
              </div>
              <div>
                <div className="text-xs text-white/40 mb-1">{editando ? "Nueva contraseña (dejar vacío para no cambiar)" : "Contraseña"}</div>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500" />
              </div>
              <div>
                <div className="text-xs text-white/40 mb-1">PIN del kiosco</div>
                <input type="text" value={pin} onChange={(e) => setPin(e.target.value)} placeholder="1234" maxLength={4} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500" />
              </div>
              <div>
                <div className="text-xs text-white/40 mb-1">Plan</div>
                <select value={plan} onChange={(e) => setPlan(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500">
                  <option value="basic">Basic</option>
                  <option value="pro">Pro</option>
                </select>
              </div>
              <div>
                <div className="text-xs text-white/40 mb-1">Vencimiento de suscripción</div>
                <input type="date" value={vencimiento} onChange={(e) => setVencimiento(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500" />
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={guardar} disabled={guardando} className="bg-purple-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-40 transition-colors">
                {guardando ? "Guardando..." : editando ? "Guardar cambios" : "Crear cliente"}
              </button>
              <button onClick={cerrarForm} className="text-sm text-white/40 hover:text-white/60">Cancelar</button>
            </div>
          </div>
        )}

        <div className="bg-gray-900 border border-white/5 rounded-xl overflow-hidden">
          {cargando ? (
            <div className="px-5 py-8 text-center text-sm text-white/40">Cargando...</div>
          ) : tenants.length === 0 ? (
            <div className="px-5 py-8 text-center text-sm text-white/40">No hay clientes registrados</div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left px-5 py-3 text-xs text-white/40 font-medium">Negocio</th>
                  <th className="text-left px-5 py-3 text-xs text-white/40 font-medium">Email</th>
                  <th className="text-left px-5 py-3 text-xs text-white/40 font-medium">Plan</th>
                  <th className="text-left px-5 py-3 text-xs text-white/40 font-medium">Vencimiento</th>
                  <th className="text-right px-5 py-3 text-xs text-white/40 font-medium">Productos</th>
                  <th className="text-center px-5 py-3 text-xs text-white/40 font-medium">Estado</th>
                  <th className="text-center px-5 py-3 text-xs text-white/40 font-medium">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {tenants.map((t) => (
                  <tr key={t.id} className="border-b border-white/5 hover:bg-white/5">
                    <td className="px-5 py-3 font-medium text-white">{t.nombre}</td>
                    <td className="px-5 py-3 text-white/60">{t.email}</td>
                    <td className="px-5 py-3">
                      <span className="bg-purple-900/40 text-purple-300 text-xs px-2 py-1 rounded-md">{t.plan}</span>
                    </td>
                    <td className="px-5 py-3 text-white/60">
                      {t.suscripcion_vence ? new Date(t.suscripcion_vence).toLocaleDateString("es-AR") : "Sin vencimiento"}
                    </td>
                    <td className="px-5 py-3 text-right text-white/60">{t._count.productos}</td>
                    <td className="px-5 py-3 text-center">
                      <button
                        onClick={() => toggleCliente(t.id)}
                        className={`text-xs px-3 py-1 rounded-md transition-colors ${t.activo ? "bg-green-900/40 text-green-400 hover:bg-red-900/40 hover:text-red-400" : "bg-red-900/40 text-red-400 hover:bg-green-900/40 hover:text-green-400"}`}
                      >
                        {t.activo ? "Activo" : "Suspendido"}
                      </button>
                    </td>
                    <td className="px-5 py-3 text-center">
                      <div className="flex gap-2 justify-center">
                        <button onClick={() => abrirEditar(t)} className="text-xs text-purple-400 hover:underline">Editar</button>
                        <button onClick={() => eliminarCliente(t.id, t.nombre)} className="text-xs text-red-400 hover:underline">Eliminar</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}