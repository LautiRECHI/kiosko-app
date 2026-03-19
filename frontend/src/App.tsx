import { BrowserRouter, Routes, Route } from "react-router-dom";
import Catalogo from "./pages/kiosco/Catalogo";
import Carrito from "./pages/kiosco/Carrito";
import Checkout from "./pages/kiosco/Checkout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Catalogo />} />
        <Route path="/carrito" element={<Carrito />} />
        <Route path="/checkout" element={<Checkout />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;