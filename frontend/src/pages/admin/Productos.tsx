import { useEffect, useState } from "react";
import api from "../../api/client";
import Sidebar from "../../components/Sidebar";

const TENANT_ID = "5ac9239b-27df-46e8-8bcb-317fd34825f2";

interface Variante {
  id: string;
  sabor_tipo: string;
  precio: number;
  precioCosto: number;
  codigoBarras: string | null;
  stock: { cantidad: number } | null;
}

interface Producto {
  id: string;
  nombre: string;
  categoria: string;
  activo: boolean;
  variantes: Variante[];
}

export default function Productos() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [expandido, setExpandido] = useState<string | null>(null);
  const [editando, setEditando] = useState<string | null>(null);
  const [nuevoPrecio, setNuevoPrecio] = useState("");

  const cargar = () => {
    api.get("/products")
      .then((res) => setProductos(res.data))
      .catch(() => setProductos([]))
      .finally(() => setCargando(false));
  };

  useEffect(() => { cargar(); }, []);

  const guardarPrecio = async (varianteId: string) => {
    try {
      await api.put(`/products/variante/${varianteId}`, { precio: parseFloat(nuevoPrecio) });
      setEditando(null);
      setNuevoPrecio("");
      cargar();
    } catch {
      alert("Error al actualizar precio");
    }
  };

  const filtrados = productos.filter((p) =>
    p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    p.categoria.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar active="Productos" />

      <main className="flex-1 px-8 py-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-medium text-gray-800">Productos</h1>
            <p className="text-sm text-gray-400 mt-1">{productos.length} productos en catálogo</p>
          </div>
          <a href="/admin/importar" className="bg-primary text-white text-sm px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors no-underline">
            + Importar productos
          </a>
        </div>

        <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar por nombre o categoría..."
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-primary w-72"
            />
          </div>

          {cargando ? (
            <div className="px-5 py-8 text-center text-sm text-gray-400">Cargando...</div>
          ) : filtrados.length === 0 ? (
            <div className="px-5 py-8 text-center text-sm text-gray-400">No hay productos</div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left px-5 py-3 text-xs text-gray-400 font-medium">Nombre</th>
                  <th className="text-left px-5 py-3 text-xs text-gray-400 font-medium">Categoría</th>
                  <th className="text-right px-5 py-3 text-xs text-gray-400 font-medium">Variantes</th>
                  <th className="text-center px-5 py-3 text-xs text-gray-400 font-medium">Ver</th>
                </tr>
              </thead>
              <tbody>
                {filtrados.map((producto) => (
                  <>
                    <tr key={producto.id} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="px-5 py-3 font-medium text-gray-700">{producto.nombre}</td>
                      <td className="px-5 py-3">
                        <span className="bg-blue-50 text-primary text-xs px-2 py-1 rounded-md">{producto.categoria}</span>
                      </td>
                      <td className="px-5 py-3 text-right text-gray-500">{producto.variantes.length}</td>
                      <td className="px-5 py-3 text-center">
                        <button
                          onClick={() => setExpandido(expandido === producto.id ? null : producto.id)}
                          className="text-primary text-xs hover:underline"
                        >
                          {expandido === producto.id ? "Cerrar" : "Ver variantes"}
                        </button>
                      </td>
                    </tr>
                    {expandido === producto.id && (
                      <tr key={`${producto.id}-variantes`}>
                        <td colSpan={4} className="px-5 py-3 bg-gray-50">
                          <table className="w-full text-xs">
                            <thead>
                              <tr className="text-gray-400">
                                <th className="text-left py-1">Variante</th>
                                <th className="text-right py-1">Costo</th>
                                <th className="text-right py-1">Precio venta</th>
                                <th className="text-right py-1">Stock</th>
                                <th className="text-center py-1">Editar precio</th>
                              </tr>
                            </thead>
                            <tbody>
                              {producto.variantes.map((v) => (
                                <tr key={v.id} className="border-t border-gray-100">
                                  <td className="py-2 text-gray-600">{v.sabor_tipo}</td>
                                  <td className="py-2 text-right text-gray-400">${v.precioCosto.toLocaleString("es-AR", { maximumFractionDigits: 0 })}</td>
                                  <td className="py-2 text-right font-medium text-gray-700">
                                    {editando === v.id ? (
                                      <input
                                        type="number"
                                        value={nuevoPrecio}
                                        onChange={(e) => setNuevoPrecio(e.target.value)}
                                        className="border border-primary rounded px-2 py-1 w-24 text-right"
                                        autoFocus
                                      />
                                    ) : (
                                      `$${v.precio.toLocaleString("es-AR", { maximumFractionDigits: 0 })}`
                                    )}
                                  </td>
                                  <td className="py-2 text-right text-gray-500">{v.stock?.cantidad ?? 0}</td>
                                  <td className="py-2 text-center">
                                    {editando === v.id ? (
                                      <div className="flex gap-2 justify-center">
                                        <button onClick={() => guardarPrecio(v.id)} className="text-primary hover:underline">Guardar</button>
                                        <button onClick={() => setEditando(null)} className="text-gray-400 hover:underline">Cancelar</button>
                                      </div>
                                    ) : (
                                      <button
                                        onClick={() => { setEditando(v.id); setNuevoPrecio(v.precio.toString()); }}
                                        className="text-primary hover:underline"
                                      >
                                        Editar
                                      </button>
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
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