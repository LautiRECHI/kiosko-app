import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/client";
import { useAuthStore } from "../store/authStore";

const TENANT_ID = "5ac9239b-27df-46e8-8bcb-317fd34825f2";

export default function LoginKiosco() {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const stars: { x: number; y: number; size: number; opacity: number; speed: number; twinkle: number }[] = [];
    const nebulas: { x: number; y: number; r: number; color: string }[] = [];

    for (let i = 0; i < 200; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 1.8 + 0.2,
        opacity: Math.random() * 0.8 + 0.2,
        speed: Math.random() * 0.15 + 0.02,
        twinkle: Math.random() * Math.PI * 2,
      });
    }

    for (let i = 0; i < 4; i++) {
      nebulas.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 200 + 100,
        color: ["#1F6FB2", "#2EA3F2", "#6B3FA0", "#1a3a5c"][i],
      });
    }

    let frame = 0;
    let animId: number;

    const draw = () => {
      ctx.fillStyle = "#000008";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      nebulas.forEach((n) => {
        const grad = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r);
        grad.addColorStop(0, n.color + "18");
        grad.addColorStop(1, "transparent");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      });

      stars.forEach((s) => {
        s.twinkle += 0.02;
        const tw = Math.sin(s.twinkle) * 0.3 + 0.7;
        s.y -= s.speed;
        if (s.y < 0) {
          s.y = canvas.height;
          s.x = Math.random() * canvas.width;
        }
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${s.opacity * tw})`;
        ctx.fill();

        if (s.size > 1.2) {
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.size * 2.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(180,210,255,${s.opacity * tw * 0.15})`;
          ctx.fill();
        }
      });

      frame++;
      animId = requestAnimationFrame(draw);
    };

    draw();

    const onResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  const handlePin = async (digito: string) => {
    if (pin.length >= 4) return;
    const nuevoPin = pin + digito;
    setPin(nuevoPin);
    setError("");

    if (nuevoPin.length === 4) {
      setCargando(true);
      try {
        const res = await api.post("/auth/login-kiosco", { tenantId: TENANT_ID, pin: nuevoPin });
        login({
          token: res.data.token,
          tenantId: res.data.tenant.id,
          nombre: res.data.tenant.nombre,
          role: "kiosco",
        });
        navigate("/");
      } catch {
        setError("PIN incorrecto");
        setPin("");
      } finally {
        setCargando(false);
      }
    }
  };

  const borrar = () => setPin(pin.slice(0, -1));

  return (
    <div style={{ position: "relative", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
      <canvas ref={canvasRef} style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", zIndex: 0 }} />

      <div style={{ position: "relative", zIndex: 10, width: "100%", maxWidth: "340px", padding: "0 20px" }}>
        <div style={{
          background: "rgba(255,255,255,0.04)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "20px",
          padding: "40px"
        }}>
          <div style={{ textAlign: "center", marginBottom: "32px" }}>
            <div style={{ fontSize: "13px", fontWeight: 500, color: "#2EA3F2", letterSpacing: "0.1em", marginBottom: "8px" }}>
              ScriptSolutions
            </div>
            <div style={{ fontSize: "20px", fontWeight: 500, color: "#fff", marginBottom: "6px" }}>
              Acceso al kiosco
            </div>
            <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)" }}>
              Ingresá tu PIN de 4 dígitos
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "center", gap: "12px", marginBottom: "32px" }}>
            {[0, 1, 2, 3].map((i) => (
              <div key={i} style={{
                width: "14px", height: "14px", borderRadius: "50%",
                background: i < pin.length ? "#2EA3F2" : "rgba(255,255,255,0.15)",
                transition: "background 0.2s",
              }} />
            ))}
          </div>

          {error && (
            <div style={{ background: "rgba(226,75,74,0.15)", border: "1px solid rgba(226,75,74,0.3)", borderRadius: "8px", padding: "10px 14px", fontSize: "13px", color: "#f09595", textAlign: "center", marginBottom: "16px" }}>
              {error}
            </div>
          )}

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px" }}>
            {["1","2","3","4","5","6","7","8","9","","0","⌫"].map((d, i) => (
              <button
                key={i}
                onClick={() => d === "⌫" ? borrar() : d !== "" ? handlePin(d) : null}
                disabled={cargando || d === ""}
                style={{
                  height: "56px", borderRadius: "12px", fontSize: d === "⌫" ? "20px" : "18px", fontWeight: 500,
                  color: d === "" ? "transparent" : "#fff",
                  background: d === "" ? "transparent" : d === "⌫" ? "rgba(226,75,74,0.2)" : "rgba(255,255,255,0.07)",
                  border: d === "" ? "none" : "1px solid rgba(255,255,255,0.08)",
                  cursor: d === "" ? "default" : "pointer",
                  transition: "background 0.15s",
                }}
              >
                {d}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}