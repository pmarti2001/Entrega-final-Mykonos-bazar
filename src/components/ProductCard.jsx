import { useCarrito } from '../context/CarritoContext';

export default function ProductCard({ producto }) {
  const { agregarAlCarrito } = useCarrito();

  return (
    <div style={{ border: '1px solid #d9f1ff', borderRadius: '18px', padding: '1rem', background: 'linear-gradient(180deg, #ffffff 0%, #f4fbff 100%)', boxShadow: '0 8px 24px rgba(15,76,129,0.10)', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <h3 style={{ color: '#0f4c81', fontSize: '1.1rem', marginBottom: '0.75rem' }}>{producto.nombre}</h3>
      {producto.imagen ? <img src={producto.imagen} alt={producto.nombre} style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '12px', marginBottom: '0.75rem' }} /> : null}
      <p style={{ color: '#4a5a6a', flex: 1 }}>{producto.descripcion}</p>
      <p style={{ fontWeight: 700, color: '#0f4c81', fontSize: '1.05rem', marginBottom: '0.75rem' }}>${producto.precio}</p>
      <button onClick={() => agregarAlCarrito(producto)} style={{ background: 'linear-gradient(90deg, #0f4c81 0%, #4ea8de 100%)', border: 'none', color: 'white', borderRadius: '999px', padding: '0.65rem 0.9rem', cursor: 'pointer', fontWeight: 600 }}>
        Agregar al carrito
      </button>
    </div>
  );
}
