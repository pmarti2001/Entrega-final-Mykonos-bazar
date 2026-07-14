import { useEffect, useMemo, useState } from 'react';
import { Container, Row, Col, Alert, Spinner, Form, Button } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';
import { collection, getDocs } from 'firebase/firestore';
import Navbar from '../components/Navbar';
import ProductCard from '../components/ProductCard';
import { db, isFirebaseConfigured } from '../firebase/config';

export default function Home() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const productosPorPagina = 8;

  const productosFiltrados = useMemo(() => {
    return productos.filter((prod) =>
      prod.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [productos, searchTerm]);

  const totalPages = Math.max(1, Math.ceil(productosFiltrados.length / productosPorPagina));

  const indexOfLastItem = currentPage * productosPorPagina;
  const indexOfFirstItem = indexOfLastItem - productosPorPagina;
  const productosPagina = productosFiltrados.slice(indexOfFirstItem, indexOfLastItem);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  useEffect(() => {
    const cargarProductos = async () => {
      if (!isFirebaseConfigured) {
        setLoading(false);
        return;
      }

      try {
        const snapshot = await getDocs(collection(db, 'products'));
        const lista = snapshot.docs.map((doc) => ({
          id: doc.id,
          nombre: doc.data().nombre || doc.data().name || 'Producto',
          descripcion: doc.data().descripcion || doc.data().description || 'Sin descripción',
          precio: Number(doc.data().precio ?? doc.data().price ?? 0),
          imagen: doc.data().imagen || '',
        }));
        setProductos(lista);
        setError('');
      } catch (err) {
        console.error('No se pudieron cargar los productos:', err);
        setError('No se pudieron cargar los productos.');
      } finally {
        setLoading(false);
      }
    };

    cargarProductos();
  }, []);

  return (
    <div>
      <Helmet>
        <title>Mykonos Bazar - Home</title>
        <meta name="description" content="Encuentra los mejores productos de bazar y decoración en Mykonos Bazar." />
      </Helmet>
      <Navbar />
      <Container className="py-4">
        <h1 className="mb-3">Bienvenido a la tienda</h1>
        {!isFirebaseConfigured && <Alert variant="info">Configura tus credenciales de Firebase en el archivo .env para cargar productos reales.</Alert>}
        {error ? <Alert variant="danger">{error}</Alert> : null}
        <Form className="mb-4">
          <Form.Control
            type="text"
            placeholder="Buscar producto..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Form>
        {loading ? (
          <div className="d-flex align-items-center gap-2">
            <Spinner animation="border" />
            <span>Cargando productos...</span>
          </div>
        ) : null}
        <Row className="g-4 mt-2">
          {productosPagina.map((producto) => (
            <Col key={producto.id} md={4} lg={3}>
              <ProductCard producto={producto} />
            </Col>
          ))}
        </Row>
        {!loading && productosFiltrados.length > 0 ? (
          <div className="d-flex justify-content-center gap-2 mt-4 flex-wrap">
            <Button variant="outline-secondary" size="sm" onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
              Anterior
            </Button>
            {Array.from({ length: totalPages }, (_, index) => (
              <Button
                key={index + 1}
                variant={currentPage === index + 1 ? 'primary' : 'outline-secondary'}
                size="sm"
                onClick={() => setCurrentPage(index + 1)}
              >
                {index + 1}
              </Button>
            ))}
            <Button variant="outline-secondary" size="sm" onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}>
              Siguiente
            </Button>
          </div>
        ) : null}
      </Container>
    </div>
  );
}
