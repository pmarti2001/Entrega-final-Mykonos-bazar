import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Registro from './pages/Registro';
import AdminCatalog from './pages/AdminCatalog';
import Cart from './pages/Cart';
import Profile from './pages/Profile';
import PrivateRoute from './routes/PrivateRoute';
import { AuthProvider } from './context/AuthContext';
import { CarritoProvider } from './context/CarritoContext';

function App() {
  return (
    <AuthProvider>
      <CarritoProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/registro" element={<Registro />} />
            <Route path="/admin" element={<AdminCatalog />} />
            <Route path="/cart" element={<Cart />} />
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </CarritoProvider>
    </AuthProvider>
  );
}

export default App;
