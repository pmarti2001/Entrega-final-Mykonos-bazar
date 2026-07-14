import { useEffect, useState } from 'react';
import { Alert, Spinner, Container, Row, Col, Card, Form, Button, ListGroup } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';
import { FiSettings, FiTrash2 } from 'react-icons/fi';
import { addDoc, collection, deleteDoc, doc, getDocs, updateDoc } from 'firebase/firestore';
import Navbar from '../components/Navbar';
import { db, isFirebaseConfigured } from '../firebase/config';

const initialState = { nombre: '', descripcion: '', precio: '', imagen: '' };

export default function AdminCatalog() {
  const [productos, setProductos] = useState([]);
  const [form, setForm] = useState(initialState);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const cargarProductos = async (showSpinner = true) => {
    if (!isFirebaseConfigured) {
      setLoading(false);
      return;
    }

    if (showSpinner) {
      setLoading(true);
    }

    try {
      const snapshot = await getDocs(collection(db, 'products'));
      setProductos(snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() })));
      setError('');
    } catch (err) {
      console.error('Error al cargar productos:', err);
      setError('No se pudieron cargar los productos.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarProductos();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!isFirebaseConfigured) {
      setError('Configura Firebase para crear productos.');
      return;
    }

    if (form.nombre.trim() === '') {
      setError('El nombre es obligatorio');
      return;
    }

    if (Number(form.precio) <= 0) {
      setError('El precio debe ser mayor a 0');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        nombre: form.nombre.trim(),
        descripcion: form.descripcion.trim(),
        precio: Number(form.precio),
        imagen: form.imagen.trim(),
      };

      if (editingId) {
        await updateDoc(doc(db, 'products', editingId), payload);
      } else {
        await addDoc(collection(db, 'products'), payload);
      }

      setForm(initialState);
      setEditingId(null);
      await cargarProductos(false);
    } catch (err) {
      console.error('Error al guardar producto:', err);
      setError('No se pudo guardar el producto.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (producto) => {
    setForm({
      nombre: producto.nombre || '',
      descripcion: producto.descripcion || '',
      precio: producto.precio ?? '',
      imagen: producto.imagen || '',
    });
    setEditingId(producto.id);
    setError('');
  };

  const handleDelete = async (id) => {
    setLoading(true);
    setError('');

    try {
      await deleteDoc(doc(db, 'products', id));
      await cargarProductos(false);
    } catch (err) {
      console.error('Error al eliminar producto:', err);
      setError('No se pudo eliminar el producto.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Helmet>
        <title>Mykonos Bazar - Administración</title>
        <meta name="description" content="Gestiona los productos del catálogo de Mykonos Bazar desde el panel de administración." />
      </Helmet>
      <Navbar />
      <Container className="py-4">
        <h1 className="mb-4">
          <FiSettings style={{ marginRight: '0.5rem' }} /> Panel de administración
        </h1>
        {!isFirebaseConfigured && <Alert variant="info">Configura tus credenciales de Firebase para usar el CRUD real.</Alert>}
        {error ? <Alert variant="danger">{error}</Alert> : null}

        <Row className="g-4">
          <Col lg={4}>
            <Card className="shadow-sm">
              <Card.Body>
                <h2 className="h5">{editingId ? 'Editar producto' : 'Crear producto'}</h2>
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Nombre</Form.Label>
                    <Form.Control value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} placeholder="Nombre" />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Descripción</Form.Label>
                    <Form.Control as="textarea" rows={3} value={form.descripcion} onChange={(e) => setForm({ ...form, descripcion: e.target.value })} placeholder="Descripción" />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Precio</Form.Label>
                    <Form.Control type="number" value={form.precio} onChange={(e) => setForm({ ...form, precio: e.target.value })} placeholder="Precio" />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>URL de imagen</Form.Label>
                    <Form.Control value={form.imagen} onChange={(e) => setForm({ ...form, imagen: e.target.value })} placeholder="URL de imagen" />
                  </Form.Group>
                  <Button type="submit" disabled={loading} className="w-100">
                    {editingId ? 'Actualizar producto' : 'Crear producto'}
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={8}>
            {loading ? (
              <div className="d-flex align-items-center gap-2 mt-3 mt-lg-0">
                <Spinner animation="border" />
                <span>Cargando...</span>
              </div>
            ) : null}

            {productos.length === 0 && !loading ? <Alert variant="secondary">No hay productos para mostrar.</Alert> : null}
            <ListGroup className="mt-3">
              {productos.map((producto) => (
                <ListGroup.Item key={producto.id} className="d-flex justify-content-between align-items-start">
                  <div>
                    <h3 className="h6 mb-1">{producto.nombre}</h3>
                    {producto.imagen ? <img src={producto.imagen} alt={producto.nombre} style={{ maxWidth: '120px', display: 'block', marginBottom: '0.5rem' }} /> : null}
                    <p className="mb-1">{producto.descripcion}</p>
                    <p className="mb-0">${producto.precio}</p>
                  </div>
                  <div className="d-flex gap-2">
                    <Button variant="outline-primary" size="sm" onClick={() => handleEdit(producto)} disabled={loading}>Editar</Button>
                    <Button variant="outline-danger" size="sm" onClick={() => handleDelete(producto.id)} disabled={loading}>
                      <FiTrash2 />
                    </Button>
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
