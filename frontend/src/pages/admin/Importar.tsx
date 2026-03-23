import { useState } from "react";
import api from "../../api/client";

const TENANT_ID = "f11f645a-0c64-4873-9c0a-b11f330fbb2c";

interface FilaPreview {
  fila: number;
  nombre: string;
  categoria: string;
  sabor_tipo: string;
  precioCosto: number;
  codigoBarras: string | null;
  stockInicial: number;
  errors: string[];
}

export default function Importar() {
  const [preview, setPreview] = useState<FilaPreview[]>([]);
  const [iva, setIva] = useState(21);
  const [margen, setMargen] = useState(35);
  const [cargando, setCargando] = useState(false);
  const [importado, setImportado] = useState(false);
  const [, setArchivo] = useState<File | null>(null);

  const precioFinal = (costo: number) =>
    Math.round(costo * (1 + iva / 100) * (1 + margen / 100));

  const handleFile = async (file: File) => {
    setArchivo(file);
    setCargando(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await api.post("/import/preview", formData);
      setPreview(res.data);
    } catch {
      alert("Error al procesar el archivo");
    } finally {
      setCargando(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const confirmar = async () => {
    setCargando(true);
    try {
      await api.post("/import/confirm", {
        tenantId: TENANT_ID,
        iva,
        margen,
        rows: preview.filter((r) => r.errors.length === 0),
      });
      setImportado(true);
      setPreview([]);
      setArchivo(null);
    } catch {
      alert("Error al importar");
    } finally {
      setCargando(false);
    }
  };

  const filasSinError = preview.filter((r) => r.errors.length === 0);
  const filasConError = preview.filter((r) => r.errors.length > 0);

  const navItems = [
    { label: "Dashboard", path: "/admin" },
    { label: "Productos", path: "/admin/productos" },
    { label: "Importar", path: "/admin/importar" },
    { label: "Clientes", path: "/admin/clientes" },
    { label: "Ventas", path: "/admin/ventas" },
    { label: "Stock", path: "/admin/stock" },
    { label: "Configuracion", path: "/admin/config" },
  ];

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
                item.label === "Importar"
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
          <h1 className="text-xl font-medium text-gray-800">Importar productos</h1>
          <p className="text-sm text-gray-400 mt-1">Subi tu lista de precios del proveedor</p>
        </div>

        {importado && (
          <div className="bg-green-50 border border-green-100 rounded-xl px-4 py-3 mb-6 flex items-center gap-3">
            <span className="text-green-500">Ok</span>
            <span className="text-sm text-green-700">Productos importados correctamente</span>
            <button
              onClick={() => setImportado(false)}
              className="ml-auto text-green-400 text-xs hover:text-green-600"
            >
              Cerrar
            </button>
          </div>
        )}

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white border border-gray-100 rounded-xl p-4">
            <div className="text-xs text-gray-400 mb-2">IVA (%)</div>
            <input
              type="number"
              value={iva}
              onChange={(e) => setIva(Number(e.target.value))}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-primary"
            />
          </div>
          <div className="bg-white border border-gray-100 rounded-xl p-4">
            <div className="text-xs text-gray-400 mb-2">Margen de ganancia (%)</div>
            <input
              type="number"
              value={margen}
              onChange={(e) => setMargen(Number(e.target.value))}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-primary"
            />
          </div>
          <div className="bg-white border border-gray-100 rounded-xl p-4">
            <div className="text-xs text-gray-400 mb-2">Precio ejemplo ($1.000 costo)</div>
            <div className="text-lg font-medium text-primary">
              ${precioFinal(1000).toLocaleString("es-AR")}
            </div>
          </div>
        </div>

        {preview.length === 0 ? (
          <div
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            className="bg-white border-2 border-dashed border-gray-200 rounded-xl p-12 flex flex-col items-center gap-4 hover:border-primary transition-colors"
          >
            <span className="text-5xl">📂</span>
            <div className="text-center">
              <div className="text-sm font-medium text-gray-600">Arrastra tu archivo aca</div>
              <div className="text-xs text-gray-400 mt-1">o hace clic para seleccionar</div>
            </div>
            <input
              type="file"
              accept=".xlsx,.csv"
              onChange={(e) => e.target.files && handleFile(e.target.files[0])}
              className="hidden"
              id="file-input"
            />
            <label
              htmlFor="file-input"
              className="bg-primary text-white text-sm px-6 py-2 rounded-lg cursor-pointer hover:bg-primary-dark transition-colors"
            >
              {cargando ? "Procesando..." : "Seleccionar archivo"}
            </label>
            <div className="text-xs text-gray-300">Acepta .xlsx y .csv</div>
          </div>
        ) : (
          <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <div className="text-sm font-medium text-gray-700">
                Vista previa — {filasSinError.length} productos listos
                {filasConError.length > 0 && (
                  <span className="ml-2 text-red-400">{filasConError.length} con errores</span>
                )}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => { setPreview([]); setArchivo(null); }}
                  className="text-sm text-gray-400 hover:text-gray-600"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmar}
                  disabled={cargando || filasSinError.length === 0}
                  className="bg-primary text-white text-sm px-4 py-2 rounded-lg hover:bg-primary-dark disabled:opacity-40 transition-colors"
                >
                  {cargando ? "Importando..." : `Confirmar ${filasSinError.length} productos`}
                </button>
              </div>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left px-5 py-3 text-xs text-gray-400 font-medium">Nombre</th>
                  <th className="text-left px-5 py-3 text-xs text-gray-400 font-medium">Categoria</th>
                  <th className="text-left px-5 py-3 text-xs text-gray-400 font-medium">Sabor/Tipo</th>
                  <th className="text-right px-5 py-3 text-xs text-gray-400 font-medium">Costo</th>
                  <th className="text-right px-5 py-3 text-xs text-gray-400 font-medium">Precio final</th>
                  <th className="text-right px-5 py-3 text-xs text-gray-400 font-medium">Stock</th>
                  <th className="text-left px-5 py-3 text-xs text-gray-400 font-medium">Estado</th>
                </tr>
              </thead>
              <tbody>
                {preview.map((fila) => (
                  <tr
                    key={fila.fila}
                    className={`border-b border-gray-50 ${fila.errors.length > 0 ? "bg-red-50" : ""}`}
                  >
                    <td className="px-5 py-3 text-gray-700">{fila.nombre}</td>
                    <td className="px-5 py-3 text-gray-500">{fila.categoria}</td>
                    <td className="px-5 py-3 text-gray-500">{fila.sabor_tipo}</td>
                    <td className="px-5 py-3 text-right text-gray-500">
                      ${fila.precioCosto?.toLocaleString("es-AR")}
                    </td>
                    <td className="px-5 py-3 text-right text-primary font-medium">
                      ${precioFinal(fila.precioCosto).toLocaleString("es-AR")}
                    </td>
                    <td className="px-5 py-3 text-right text-gray-500">{fila.stockInicial}</td>
                    <td className="px-5 py-3">
                      {fila.errors.length === 0 ? (
                        <span className="text-green-500 text-xs">OK</span>
                      ) : (
                        <span className="text-red-400 text-xs">{fila.errors.join(", ")}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}