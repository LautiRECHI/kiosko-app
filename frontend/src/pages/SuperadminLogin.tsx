import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/client";

export default function SuperadminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const stars: { x: number; y: number; size: number; opacity: number; speed: number; twinkle: number }[] = [];

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

    let animId: number;

    const draw = () => {
      ctx.fillStyle = "#000008";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const grad = ctx.createRadialGradient(canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, 300);
      grad.addColorStop(0, "#6B3FA018");
      grad.addColorStop(1, "transparent");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      stars.forEach((s) => {
        s.twinkle += 0.02;
        const tw = Math.sin(s.twinkle) * 0.3 + 0.7;
        s.y -= s.speed;
        if (s.y < 0) { s.y = canvas.height; s.x = Math.random() * canvas.width; }
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${s.opacity * tw})`;
        ctx.fill();
      });

      animId = requestAnimationFrame(draw);
    };

    draw();
    const onResize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    window.addEventListener("resize", onResize);
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", onResize); };
  }, []);

  const handleLogin = async () => {
    if (!email || !password) return;
    setCargando(true);
    setError("");
    try {
      const res = await api.post("/superadmin/login", { email, password });
      localStorage.setItem("superadmin_token", res.data.token);
      navigate("/superadmin");
    } catch {
      setError("Credenciales incorrectas");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div style={{ position: "relative", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
      <canvas ref={canvasRef} style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", zIndex: 0 }} />
      <div style={{ position: "relative", zIndex: 10, width: "100%", maxWidth: "400px", padding: "0 20px" }}>
        <div style={{ background: "rgba(107,63,160,0.08)", backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)", border: "1px solid rgba(107,63,160,0.2)", borderRadius: "20px", padding: "40px" }}>
          <div style={{ textAlign: "center", marginBottom: "32px" }}>
            <div style={{ fontSize: "13px", fontWeight: 500, color: "#9F7AEA", letterSpacing: "0.1em", marginBottom: "8px" }}>ScriptSolutions</div>
            <div style={{ fontSize: "22px", fontWeight: 500, color: "#fff", marginBottom: "6px" }}>Panel SuperAdmin</div>
            <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)" }}>Acceso restringido</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div>
              <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)", marginBottom: "6px" }}>Email</div>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleLogin()} placeholder="super@scriptsolutions.com" style={{ width: "100%", background: "rgba(107,63,160,0.1)", border: "1px solid rgba(107,63,160,0.3)", borderRadius: "10px", padding: "12px 16px", fontSize: "14px", color: "#fff", outline: "none", boxSizing: "border-box" }} />
            </div>
            <div>
              <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)", marginBottom: "6px" }}>Contraseña</div>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleLogin()} placeholder="••••••••" style={{ width: "100%", background: "rgba(107,63,160,0.1)", border: "1px solid rgba(107,63,160,0.3)", borderRadius: "10px", padding: "12px 16px", fontSize: "14px", color: "#fff", outline: "none", boxSizing: "border-box" }} />
            </div>
            {error && <div style={{ background: "rgba(226,75,74,0.15)", border: "1px solid rgba(226,75,74,0.3)", borderRadius: "8px", padding: "10px 14px", fontSize: "13px", color: "#f09595" }}>{error}</div>}
            <button onClick={handleLogin} disabled={cargando} style={{ width: "100%", background: "linear-gradient(135deg, #9F7AEA, #6B3FA0)", color: "#fff", border: "none", borderRadius: "10px", padding: "14px", fontSize: "14px", fontWeight: 500, cursor: cargando ? "not-allowed" : "pointer", opacity: cargando ? 0.6 : 1, marginTop: "8px" }}>
              {cargando ? "Ingresando..." : "Ingresar"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}