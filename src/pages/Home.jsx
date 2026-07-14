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
    <div style={{ background: 'linear-gradient(180deg, #f7fcff 0%, #eef8ff 100%)', minHeight: '100vh' }}>
      <Helmet>
        <title>Mykonos Bazar - Home</title>
        <meta name="description" content="Encuentra los mejores productos de bazar y decoración en Mykonos Bazar." />
      </Helmet>
      <Navbar />
      <Container className="py-4">
        <div style={{ background: 'linear-gradient(135deg, rgba(15,76,129,0.95) 0%, rgba(78,168,222,0.92) 100%)', borderRadius: '24px', padding: '2rem', color: 'white', boxShadow: '0 12px 30px rgba(15,76,129,0.18)', marginBottom: '2rem' }}>
          <Row className="align-items-center">
            <Col md={8}>
              <h1 className="mb-3" style={{ fontSize: '2rem', fontWeight: 700 }}>Descubrí el encanto de Mykonos en cada compra</h1>
              <p style={{ fontSize: '1.05rem', opacity: 0.95, maxWidth: '700px' }}>
                Una selección de objetos de bazar, decoración y detalles únicos para transformar tu hogar con estilo mediterráneo.
              </p>
            </Col>
            <Col md={4}>
              <img src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=80" alt="Mykonos playa" style={{ width: '100%', borderRadius: '20px', boxShadow: '0 10px 25px rgba(0,0,0,0.18)' }} />
            </Col>
          </Row>
        </div>
        {!isFirebaseConfigured && <Alert variant="info">Configura tus credenciales de Firebase en el archivo .env para cargar productos reales.</Alert>}
        {error ? <Alert variant="danger">{error}</Alert> : null}
        <Form className="mb-4" style={{ maxWidth: '600px' }}>
          <Form.Control
            type="text"
            placeholder="Buscar producto..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ borderRadius: '999px', border: '1px solid #bfe4ff', padding: '0.8rem 1rem' }}
          />
        </Form>
        {loading ? (
          <div className="d-flex align-items-center gap-2" style={{ color: '#0f4c81' }}>
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
