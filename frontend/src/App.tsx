import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import LoginKiosco from "./pages/LoginKiosco";
import Catalogo from "./pages/kiosco/Catalogo";
import Carrito from "./pages/kiosco/Carrito";
import Checkout from "./pages/kiosco/Checkout";
import Dashboard from "./pages/admin/Dashboard";
import Productos from "./pages/admin/Productos";
import Importar from "./pages/admin/Importar";
import Ventas from "./pages/admin/Ventas";
import Clientes from "./pages/admin/Clientes";
import Stock from "./pages/admin/Stock";
import Configuracion from "./pages/admin/Configuracion";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/login-kiosco" element={<LoginKiosco />} />
        <Route path="/" element={
          <ProtectedRoute role="kiosco">
            <Catalogo />
          </ProtectedRoute>
        } />
        <Route path="/carrito" element={
          <ProtectedRoute role="kiosco">
            <Carrito />
          </ProtectedRoute>
        } />
        <Route path="/checkout" element={
          <ProtectedRoute role="kiosco">
            <Checkout />
          </ProtectedRoute>
        } />
        <Route path="/admin" element={
          <ProtectedRoute role="admin">
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/admin/productos" element={
          <ProtectedRoute role="admin">
            <Productos />
          </ProtectedRoute>
        } />
        <Route path="/admin/importar" element={
          <ProtectedRoute role="admin">
            <Importar />
          </ProtectedRoute>
        } />
        <Route path="/admin/ventas" element={
          <ProtectedRoute role="admin">
            <Ventas />
          </ProtectedRoute>
        } />
        <Route path="/admin/clientes" element={
          <ProtectedRoute role="admin">
            <Clientes />
          </ProtectedRoute>
        } />
        <Route path="/admin/stock" element={
          <ProtectedRoute role="admin">
            <Stock />
          </ProtectedRoute>
        } />
        <Route path="/admin/config" element={
          <ProtectedRoute role="admin">
            <Configuracion />
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;