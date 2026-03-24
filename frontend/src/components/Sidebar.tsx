import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

const navItems = [
  { label: "Dashboard", path: "/admin" },
  { label: "Productos", path: "/admin/productos" },
  { label: "Importar", path: "/admin/importar" },
  { label: "Clientes", path: "/admin/clientes" },
  { label: "Ventas", path: "/admin/ventas" },
  { label: "Stock", path: "/admin/stock" },
  { label: "Configuracion", path: "/admin/config" },
];

interface Props {
  active: string;
}

export default function Sidebar({ active }: Props) {
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside className="w-56 bg-white border-r border-gray-100 flex flex-col">
      <div className="px-6 py-5 border-b border-gray-100">
        <span className="text-primary-dark font-medium text-sm tracking-wide">ScriptSolutions</span>
        <div className="text-xs text-gray-400 mt-0.5">{user?.nombre || "Panel admin"}</div>
      </div>
      <nav className="flex-1 py-4">
        {navItems.map((item) => (
          <a
            key={item.label}
            href={item.path}
            className={`px-6 py-2.5 text-sm flex items-center gap-3 border-l-2 no-underline ${
              item.label === active
                ? "border-primary text-primary-dark font-medium bg-blue-50"
                : "border-transparent text-gray-400 hover:text-gray-600"
            }`}
          >
            <div className="w-1.5 h-1.5 rounded-full bg-current opacity-60"></div>
            {item.label}
          </a>
        ))}
      </nav>
      <div className="px-6 py-4 border-t border-gray-100">
        <button
          onClick={handleLogout}
          className="w-full text-left text-xs text-gray-400 hover:text-red-400 transition-colors flex items-center gap-2"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-current"></div>
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}