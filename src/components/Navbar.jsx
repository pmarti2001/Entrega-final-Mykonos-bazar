import { Link } from 'react-router-dom';
import { FiShoppingCart, FiLogOut, FiUser, FiSettings } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useCarrito } from '../context/CarritoContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { carrito } = useCarrito();

  return (
    <nav style={{ background: 'linear-gradient(90deg, #0f4c81 0%, #4ea8de 100%)', color: 'white', padding: '1rem 1.5rem', boxShadow: '0 4px 20px rgba(15,76,129,0.2)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem' }}>
        <Link to="/" style={{ color: 'white', textDecoration: 'none', fontWeight: 700, fontSize: '1.15rem' }}>
          Mykonos Bazar
        </Link>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
          <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>Inicio</Link>
          <Link to="/cart" style={{ color: 'white', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <FiShoppingCart /> Carrito ({carrito.length})
          </Link>
          <Link to="/admin" style={{ color: 'white', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <FiSettings /> Admin
          </Link>
          {user ? (
            <>
              <Link to="/profile" style={{ color: 'white', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <FiUser /> Perfil
              </Link>
              <button onClick={() => logout()} style={{ background: 'transparent', border: '1px solid white', color: 'white', borderRadius: '999px', padding: '0.35rem 0.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <FiLogOut /> Salir
              </button>
            </>
          ) : (
            <Link to="/login" style={{ color: 'white', textDecoration: 'none' }}>Iniciar sesión</Link>
          )}
        </div>
      </div>
    </nav>
  );
}
