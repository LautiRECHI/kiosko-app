import { useState } from "react";
import { useCartStore } from "../../store/cartStore";
import { useNavigate } from "react-router-dom";
import api from "../../api/client";

const TENANT_ID = "05b12305-6d76-4e8d-a0e3-394737427413";
const CBU = "0000003100012345678901";
const ALIAS = "KIOSCO.DEMO.MP";

interface TicketData {
  items: { nombre: string; sabor_tipo: string; cantidad: number; precio: number }[];
  total: number;
  metodo: string;
  fecha: string;
  numero: string;
}

export default function Checkout() {
  const { items, total, limpiar } = useCartStore();
  const navigate = useNavigate();
  const [metodoPago, setMetodoPago] = useState<string | null>(null);
  const [submetodo, setSubmetodo] = useState<string | null>(null);
  const [procesando, setProcesando] = useState(false);
  const [ticket, setTicket] = useState<TicketData | null>(null);

  const metodos = [
    { id: "efectivo", label: "Efectivo", emoji: "💵" },
    { id: "mercadopago", label: "Mercado Pago", emoji: "📱" },
    { id: "cuenta_corriente", label: "Cuenta corriente", emoji: "📒" },
  ];

  const submetodos = [
    { id: "qr", label: "Código QR", emoji: "📲", desc: "Escaneá con la app de Mercado Pago" },
    { id: "transferencia", label: "Transferencia", emoji: "🏦", desc: "CBU o alias" },
    { id: "tarjeta", label: "Tarjeta", emoji: "💳", desc: "Crédito o débito" },
  ];

  const metodoLabel = () => {
    if (metodoPago === "efectivo") return "Efectivo";
    if (metodoPago === "cuenta_corriente") return "Cuenta corriente";
    if (metodoPago === "mercadopago") {
      if (submetodo === "qr") return "Mercado Pago — QR";
      if (submetodo === "transferencia") return "Mercado Pago — Transferencia";
      if (submetodo === "tarjeta") return "Mercado Pago — Tarjeta";
    }
    return "";
  };

  const confirmar = async () => {
    if (!metodoPago) return;
    if (metodoPago === "mercadopago" && !submetodo) return;
    setProcesando(true);
    try {
      const ventaItems = items.map((i) => ({ ...i }));
      const ventaTotal = total();
      await api.post("/sales", {
        tenantId: TENANT_ID,
        items: items.map((i) => ({
          varianteId: i.varianteId,
          cantidad: i.cantidad,
          precioUnitario: i.precio,
        })),
        pago: {
          metodo: metodoPago === "mercadopago" ? `mercadopago_${submetodo}` : metodoPago,
          monto: ventaTotal,
        },
      });
      limpiar();
      setTicket({
        items: ventaItems.map((i) => ({
          nombre: i.nombre,
          sabor_tipo: i.sabor_tipo,
          cantidad: i.cantidad,
          precio: i.precio,
        })),
        total: ventaTotal,
        metodo: metodoLabel(),
        fecha: new Date().toLocaleString("es-AR"),
        numero: Math.floor(Math.random() * 9000 + 1000).toString(),
      });
    } catch {
      alert("Error al procesar la venta");
    } finally {
      setProcesando(false);
    }
  };

  if (ticket) {
    return (
      <div className="min-h-screen bg-dark text-white flex flex-col items-center justify-center px-4">
        <div className="bg-dark-card border border-white/5 rounded-2xl p-6 w-full max-w-sm">
          <div className="text-center mb-6">
            <div className="text-4xl mb-3">✅</div>
            <div className="text-white font-medium text-lg">Venta confirmada</div>
            <div className="text-muted text-xs mt-1">Ticket #{ticket.numero}</div>
          </div>

          <div className="border-t border-white/5 border-dashed pt-4 mb-4">
            <div className="text-xs text-muted uppercase tracking-wider mb-3">ScriptSolutions — Kiosco</div>
            {ticket.items.map((item, i) => (
              <div key={i} className="flex justify-between text-sm py-1.5">
                <span className="text-white/70">{item.nombre} {item.sabor_tipo} x{item.cantidad}</span>
                <span className="text-white">
                  ${(item.precio * item.cantidad).toLocaleString("es-AR", { maximumFractionDigits: 0 })}
                </span>
              </div>
            ))}
          </div>

          <div className="border-t border-white/5 border-dashed pt-4 mb-4">
            <div className="flex justify-between items-center">
              <span className="text-muted text-sm">Total</span>
              <span className="text-primary font-medium text-xl">
                ${ticket.total.toLocaleString("es-AR", { maximumFractionDigits: 0 })}
              </span>
            </div>
            <div className="flex justify-between items-center mt-2">
              <span className="text-muted text-xs">Método</span>
              <span className="text-white/70 text-xs">{ticket.metodo}</span>
            </div>
            <div className="flex justify-between items-center mt-1">
              <span className="text-muted text-xs">Fecha</span>
              <span className="text-white/70 text-xs">{ticket.fecha}</span>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={() => window.print()}
              className="flex-1 border border-white/10 text-white/60 text-sm py-2.5 rounded-lg hover:border-white/20 transition-colors"
            >
              Imprimir
            </button>
            <button
              onClick={() => navigate("/")}
              className="flex-1 bg-primary text-white text-sm py-2.5 rounded-lg hover:bg-primary-dark transition-colors"
            >
              Nueva venta
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark text-white flex flex-col">
      <div className="bg-dark-card border-b border-white/5 px-6 py-4 flex items-center justify-between">
        <button onClick={() => navigate("/carrito")} className="text-primary text-sm font-medium">
          ← Volver al carrito
        </button>
        <span className="text-white font-medium">Checkout</span>
        <span />
      </div>

      <div className="flex-1 px-6 py-6 max-w-lg mx-auto w-full">
        <div className="bg-dark-card border border-white/5 rounded-xl px-4 py-4 mb-6">
          <div className="text-xs text-muted mb-3 uppercase tracking-wider">Resumen</div>
          {items.map((item) => (
            <div key={item.varianteId} className="flex justify-between text-sm py-1">
              <span className="text-white/70">{item.nombre} x{item.cantidad}</span>
              <span className="text-white">
                ${(item.precio * item.cantidad).toLocaleString("es-AR", { maximumFractionDigits: 0 })}
              </span>
            </div>
          ))}
          <div className="border-t border-white/5 mt-3 pt-3 flex justify-between">
            <span className="text-muted text-sm">Total</span>
            <span className="text-primary font-medium text-lg">
              ${total().toLocaleString("es-AR", { maximumFractionDigits: 0 })}
            </span>
          </div>
        </div>

        <div className="text-xs text-muted uppercase tracking-wider mb-3">Método de pago</div>
        <div className="flex flex-col gap-3 mb-4">
          {metodos.map((m) => (
            <button
              key={m.id}
              onClick={() => { setMetodoPago(m.id); setSubmetodo(null); }}
              className={`flex items-center gap-4 px-4 py-4 rounded-xl border transition-all ${
                metodoPago === m.id
                  ? "border-primary bg-primary/10 text-white"
                  : "border-white/5 bg-dark-card text-white/60 hover:border-white/20"
              }`}
            >
              <span className="text-2xl">{m.emoji}</span>
              <span className="text-sm font-medium">{m.label}</span>
              {metodoPago === m.id && <span className="ml-auto text-primary text-lg">✓</span>}
            </button>
          ))}
        </div>

        {metodoPago === "mercadopago" && (
          <div className="mb-6">
            <div className="text-xs text-muted uppercase tracking-wider mb-3">Tipo de pago</div>
            <div className="flex flex-col gap-3">
              {submetodos.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSubmetodo(s.id)}
                  className={`flex items-center gap-4 px-4 py-3 rounded-xl border transition-all ${
                    submetodo === s.id
                      ? "border-primary bg-primary/10 text-white"
                      : "border-white/5 bg-dark-card text-white/60 hover:border-white/20"
                  }`}
                >
                  <span className="text-xl">{s.emoji}</span>
                  <div className="text-left">
                    <div className="text-sm font-medium">{s.label}</div>
                    <div className="text-xs text-muted">{s.desc}</div>
                  </div>
                  {submetodo === s.id && <span className="ml-auto text-primary">✓</span>}
                </button>
              ))}
            </div>

            {submetodo === "qr" && (
              <div className="mt-4 bg-white rounded-xl p-6 flex flex-col items-center gap-3">
                <div className="w-40 h-40 bg-gray-100 rounded-lg flex items-center justify-center">
                  <span className="text-5xl">📲</span>
                </div>
                <p className="text-dark text-sm font-medium">Escaneá con Mercado Pago</p>
                <p className="text-gray-400 text-xs">
                  ${total().toLocaleString("es-AR", { maximumFractionDigits: 0 })}
                </p>
              </div>
            )}

            {submetodo === "transferencia" && (
              <div className="mt-4 bg-dark-card border border-white/5 rounded-xl p-4 flex flex-col gap-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted">CBU</span>
                  <span className="text-sm text-white font-mono">{CBU}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted">Alias</span>
                  <span className="text-sm text-white font-mono">{ALIAS}</span>
                </div>
                <div className="flex justify-between items-center border-t border-white/5 pt-3">
                  <span className="text-xs text-muted">Monto</span>
                  <span className="text-primary font-medium">
                    ${total().toLocaleString("es-AR", { maximumFractionDigits: 0 })}
                  </span>
                </div>
              </div>
            )}

            {submetodo === "tarjeta" && (
              <div className="mt-4 bg-dark-card border border-white/5 rounded-xl p-4">
                <p className="text-sm text-white/60 text-center">
                  Pasá la tarjeta por el posnet de Mercado Pago
                </p>
                <p className="text-primary text-center font-medium mt-2">
                  ${total().toLocaleString("es-AR", { maximumFractionDigits: 0 })}
                </p>
              </div>
            )}
          </div>
        )}

        <button
          onClick={confirmar}
          disabled={!metodoPago || (metodoPago === "mercadopago" && !submetodo) || procesando}
          className="w-full bg-primary text-white font-medium py-3 rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {procesando ? "Procesando..." : "Confirmar venta"}
        </button>
      </div>
    </div>
  );
}