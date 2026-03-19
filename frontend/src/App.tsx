import { BrowserRouter, Routes, Route } from "react-router-dom";
import Catalogo from "./pages/kiosco/Catalogo";
import Carrito from "./pages/kiosco/Carrito";
import Checkout from "./pages/kiosco/Checkout";
import Dashboard from "./pages/admin/Dashboard";
import Importar from "./pages/admin/Importar";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Catalogo />} />
        <Route path="/carrito" element={<Carrito />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/admin" element={<Dashboard />} />
        <Route path="/admin/importar" element={<Importar />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;