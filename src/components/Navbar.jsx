import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCarrito } from '../context/CarritoContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { carrito } = useCarrito();

  return (
    <nav style={{ display: 'flex', gap: '1rem', padding: '1rem', background: '#111', color: 'white' }}>
      <Link to="/" style={{ color: 'white' }}>Inicio</Link>
      <Link to="/cart" style={{ color: 'white' }}>Carrito ({carrito.length})</Link>
      <Link to="/admin" style={{ color: 'white' }}>Admin</Link>
      {user ? (
        <>
          <Link to="/profile" style={{ color: 'white' }}>Perfil</Link>
          <button onClick={() => logout()}>Cerrar sesión</button>
        </>
      ) : (
        <Link to="/login" style={{ color: 'white' }}>Iniciar sesión</Link>
      )}
    </nav>
  );
}
