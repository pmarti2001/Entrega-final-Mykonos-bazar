import { Container, Card, Button, ListGroup } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';
import { FiShoppingCart, FiTrash2 } from 'react-icons/fi';
import Navbar from '../components/Navbar';
import { useCarrito } from '../context/CarritoContext';

export default function Cart() {
  const { carrito, eliminarDelCarrito, vaciarCarrito } = useCarrito();

  const total = carrito.reduce((sum, item) => sum + Number(item.precio) * item.cantidad, 0);

  return (
    <div>
      <Helmet>
        <title>Mykonos Bazar - Carrito</title>
        <meta name="description" content="Revisa y gestiona los productos agregados a tu carrito en Mykonos Bazar." />
      </Helmet>
      <Navbar />
      <Container className="py-4">
        <h1 className="mb-4">
          <FiShoppingCart style={{ marginRight: '0.5rem' }} /> Carrito
        </h1>
        {carrito.length === 0 ? (
          <Card className="shadow-sm">
            <Card.Body>
              <p className="mb-0">No hay productos en el carrito.</p>
            </Card.Body>
          </Card>
        ) : (
          <Card className="shadow-sm">
            <ListGroup variant="flush">
              {carrito.map((item) => (
                <ListGroup.Item key={item.id} className="d-flex justify-content-between align-items-start">
                  <div>
                    <h5 className="mb-1">{item.nombre}</h5>
                    <p className="mb-1">Precio unitario: ${item.precio}</p>
                    <p className="mb-1">Cantidad: {item.cantidad}</p>
                    <p className="mb-0">Subtotal: ${Number(item.precio) * item.cantidad}</p>
                  </div>
                  <Button variant="outline-danger" size="sm" onClick={() => eliminarDelCarrito(item.id)}>
                    <FiTrash2 />
                  </Button>
                </ListGroup.Item>
              ))}
            </ListGroup>
            <Card.Body>
              <p className="fw-bold mb-3">Total: ${total.toFixed(2)}</p>
              <Button variant="outline-secondary" onClick={vaciarCarrito}>
                <FiTrash2 style={{ marginRight: '0.5rem' }} /> Vaciar carrito
              </Button>
            </Card.Body>
          </Card>
        )}
      </Container>
    </div>
  );
}
