import { useCartStore } from "../../store/cartStore";
import { useNavigate } from "react-router-dom";

export default function Carrito() {
  const { items, quitar, limpiar, total } = useCartStore();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-dark text-white flex flex-col">
      <div className="bg-dark-card border-b border-white/5 px-6 py-4 flex items-center justify-between">
        <button
          onClick={() => navigate("/")}
          className="text-primary text-sm font-medium flex items-center gap-2"
        >
          ← Volver al catálogo
        </button>
        <span className="text-white font-medium">Carrito</span>
        <button
          onClick={limpiar}
          className="text-muted text-sm hover:text-white transition-colors"
        >
          Vaciar
        </button>
      </div>

      <div className="flex-1 px-6 py-6">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 gap-4">
            <span className="text-5xl">🛒</span>
            <p className="text-muted text-sm">El carrito está vacío</p>
            <button
              onClick={() => navigate("/")}
              className="bg-primary text-white text-sm px-6 py-2 rounded-lg"
            >
              Ver productos
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-3 max-w-lg mx-auto">
            {items.map((item) => (
              <div
                key={item.varianteId}
                className="bg-dark-card border border-white/5 rounded-xl px-4 py-3 flex items-center justify-between"
              >
                <div>
                  <div className="text-sm font-medium text-white">{item.nombre}</div>
                  <div className="text-xs text-muted">{item.sabor_tipo}</div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-sm text-primary font-medium">
                      ${(item.precio * item.cantidad).toLocaleString("es-AR", { maximumFractionDigits: 0 })}
                    </div>
                    <div className="text-xs text-muted">x{item.cantidad}</div>
                  </div>
                  <button
                    onClick={() => quitar(item.varianteId)}
                    className="text-muted hover:text-white transition-colors text-lg"
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}

            <div className="bg-dark-card border border-white/5 rounded-xl px-4 py-4 mt-2">
              <div className="flex justify-between items-center mb-4">
                <span className="text-muted text-sm">Total</span>
                <span className="text-white text-xl font-medium">
                  ${total().toLocaleString("es-AR", { maximumFractionDigits: 0 })}
                </span>
              </div>
              <button
                onClick={() => navigate("/checkout")}
                className="w-full bg-primary text-white font-medium py-3 rounded-lg hover:bg-primary-dark transition-colors"
              >
                Ir al checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}