import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Catalogo from "./pages/kiosco/Catalogo";
import Carrito from "./pages/kiosco/Carrito";
import Checkout from "./pages/kiosco/Checkout";
import Dashboard from "./pages/admin/Dashboard";
import Importar from "./pages/admin/Importar";
import Ventas from "./pages/admin/Ventas";
import Clientes from "./pages/admin/Clientes";
import Stock from "./pages/admin/Stock";
import Configuracion from "./pages/admin/Configuracion";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Catalogo />} />
        <Route path="/carrito" element={<Carrito />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/admin" element={<Dashboard />} />
        <Route path="/admin/importar" element={<Importar />} />
        <Route path="/admin/ventas" element={<Ventas />} />
        <Route path="/admin/clientes" element={<Clientes />} />
        <Route path="/admin/stock" element={<Stock />} />
        <Route path="/admin/config" element={<Configuracion />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;