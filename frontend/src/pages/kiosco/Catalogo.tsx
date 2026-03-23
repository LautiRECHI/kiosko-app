import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/client";
import { useCartStore } from "../../store/cartStore";

interface Variante {
  id: string;
  sabor_tipo: string;
  precio: number;
  codigoBarras: string | null;
  stock: { cantidad: number } | null;
}

interface Producto {
  id: string;
  nombre: string;
  categoria: string;
  variantes: Variante[];
}

const getCategoriaColor = (categoria: string) => {
  const colores: Record<string, string> = {
    "Bebidas": "bg-blue-900/60 text-blue-300",
    "Jugos": "bg-orange-900/60 text-orange-300",
    "Snacks": "bg-yellow-900/60 text-yellow-300",
    "Chocolates": "bg-amber-900/60 text-amber-300",
    "Alfajores": "bg-amber-800/60 text-amber-200",
    "Galletitas": "bg-orange-800/60 text-orange-200",
    "Panaderia": "bg-yellow-800/60 text-yellow-200",
    "Infusiones": "bg-red-900/60 text-red-300",
    "Lacteos": "bg-sky-900/60 text-sky-300",
    "Golosinas": "bg-pink-900/60 text-pink-300",
    "Cigarrillos": "bg-gray-700/60 text-gray-300",
    "Varios": "bg-purple-900/60 text-purple-300",
  };
  return colores[categoria] || "bg-white/5 text-white/50";
};

export default function Catalogo() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [categoriaActiva, setCategoriaActiva] = useState("Todos");
  const [scanFeedback, setScanFeedback] = useState("");
  const [vista, setVista] = useState<"grilla" | "lista">("grilla");
  const searchRef = useRef<HTMLInputElement>(null);
  const agregar = useCartStore((s) => s.agregar);
  const items = useCartStore((s) => s.items);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/products").then((res) => setProductos(res.data));
    searchRef.current?.focus();
  }, []);

  const buscarPorCodigo = (codigo: string) => {
    for (const producto of productos) {
      for (const variante of producto.variantes) {
        if (variante.codigoBarras === codigo) {
          agregar({
            varianteId: variante.id,
            nombre: producto.nombre,
            sabor_tipo: variante.sabor_tipo,
            precio: variante.precio,
            cantidad: 1,
          });
          setScanFeedback(`✓ ${producto.nombre} ${variante.sabor_tipo} agregado`);
          setTimeout(() => setScanFeedback(""), 2000);
          setBusqueda("");
          return;
        }
      }
    }
    setScanFeedback("Producto no encontrado");
    setTimeout(() => setScanFeedback(""), 2000);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      buscarPorCodigo(busqueda);
    }
  };

  const categorias = ["Todos", ...Array.from(new Set(productos.map((p) => p.categoria)))];

  const filtrados = productos.filter((p) => {
    const matchCat = categoriaActiva === "Todos" || p.categoria === categoriaActiva;
    const matchBusqueda = p.nombre.toLowerCase().includes(busqueda.toLowerCase());
    return matchCat && matchBusqueda;
  });

  const totalItems = items.reduce((acc, i) => acc + i.cantidad, 0);

  return (
    <div className="min-h-screen bg-dark text-white flex flex-col">
      <div className="bg-dark-card border-b border-white/5 px-6 py-4 flex items-center justify-between">
        <span className="text-primary font-medium tracking-wide text-sm">ScriptSolutions</span>
        <input
          ref={searchRef}
          type="text"
          placeholder="Buscar producto o escanear codigo..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          onKeyDown={handleKeyDown}
          className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-white/70 placeholder-white/30 w-72 focus:outline-none focus:border-primary"
        />
        <div className="flex items-center gap-3">
          <div className="flex bg-white/5 rounded-lg p-1 gap-1">
            <button
              onClick={() => setVista("grilla")}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                vista === "grilla" ? "bg-primary text-white" : "text-white/40 hover:text-white/60"
              }`}
            >
              Grilla
            </button>
            <button
              onClick={() => setVista("lista")}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                vista === "lista" ? "bg-primary text-white" : "text-white/40 hover:text-white/60"
              }`}
            >
              Lista
            </button>
          </div>
          <button
            onClick={() => navigate("/carrito")}
            className="bg-primary text-white text-sm font-medium px-4 py-2 rounded-lg"
          >
            Carrito ({totalItems})
          </button>
        </div>
      </div>

      <div className="px-6 py-4 flex gap-2 flex-wrap">
        {categorias.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategoriaActiva(cat)}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
              categoriaActiva === cat
                ? "bg-primary text-white"
                : "bg-white/5 text-white/40 border border-white/8 hover:bg-white/10"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {vista === "grilla" ? (
        <div className="px-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 pb-6">
          {filtrados.map((producto) =>
            producto.variantes.map((variante) => (
              <div key={variante.id} className="bg-dark-card border border-white/5 rounded-xl overflow-hidden">
                <div className={`h-24 flex items-center justify-center text-4xl font-bold ${getCategoriaColor(producto.categoria)}`}>
                  {producto.nombre.charAt(0).toUpperCase()}
                </div>
                <div className="p-3">
                  <div className="text-sm font-medium text-white">{producto.nombre}</div>
                  <div className="text-xs text-muted mb-3">{variante.sabor_tipo}</div>
                  <div className="flex items-center justify-between">
                    <span className="text-primary font-medium text-sm">
                      ${variante.precio.toLocaleString("es-AR", { maximumFractionDigits: 0 })}
                    </span>
                    <button
                      onClick={() => agregar({
                        varianteId: variante.id,
                        nombre: producto.nombre,
                        sabor_tipo: variante.sabor_tipo,
                        precio: variante.precio,
                        cantidad: 1,
                      })}
                      className="w-7 h-7 bg-primary rounded-lg text-white text-lg leading-none flex items-center justify-center hover:bg-primary-dark transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="px-6 flex flex-col gap-2 pb-6">
          {filtrados.map((producto) =>
            producto.variantes.map((variante) => (
              <div key={variante.id} className="bg-dark-card border border-white/5 rounded-xl px-4 py-3 flex items-center gap-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg font-bold flex-shrink-0 ${getCategoriaColor(producto.categoria)}`}>
                  {producto.nombre.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-white truncate">{producto.nombre}</div>
                  <div className="text-xs text-muted">{variante.sabor_tipo}</div>
                </div>
                <span className="text-primary font-medium text-sm flex-shrink-0">
                  ${variante.precio.toLocaleString("es-AR", { maximumFractionDigits: 0 })}
                </span>
                <button
                  onClick={() => agregar({
                    varianteId: variante.id,
                    nombre: producto.nombre,
                    sabor_tipo: variante.sabor_tipo,
                    precio: variante.precio,
                    cantidad: 1,
                  })}
                  className="w-7 h-7 bg-primary rounded-lg text-white text-lg leading-none flex items-center justify-center hover:bg-primary-dark transition-colors flex-shrink-0"
                >
                  +
                </button>
              </div>
            ))
          )}
        </div>
      )}

      <div className="mx-6 mb-6 bg-primary/10 border border-primary/20 rounded-xl px-4 py-3 flex items-center gap-3">
        <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
        <span className="text-xs text-white/40">
          {scanFeedback || "Lector de codigo de barras activo — escaneá para agregar al carrito"}
        </span>
      </div>
    </div>
  );
}