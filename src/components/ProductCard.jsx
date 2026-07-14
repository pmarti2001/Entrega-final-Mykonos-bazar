import { useCarrito } from '../context/CarritoContext';

export default function ProductCard({ producto }) {
  const { agregarAlCarrito } = useCarrito();

  return (
    <div style={{ border: '1px solid #ccc', padding: '1rem', borderRadius: '8px' }}>
      <h3>{producto.nombre}</h3>
      {producto.imagen ? <img src={producto.imagen} alt={producto.nombre} style={{ maxWidth: '100%', marginBottom: '0.75rem' }} /> : null}
      <p>{producto.descripcion}</p>
      <p>${producto.precio}</p>
      <button onClick={() => agregarAlCarrito(producto)}>Agregar al carrito</button>
    </div>
  );
}
