import { useState } from 'react';
import { Container, Form, Button, Card } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import { FiUserPlus } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

export default function Registro() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(email, password);
      navigate('/login');
    } catch (error) {
      console.error(error);
      alert('Error al registrar usuario');
    }
  };

  return (
    <Container className="py-5">
      <Helmet>
        <title>Mykonos Bazar - Registro</title>
        <meta name="description" content="Crea tu cuenta en Mykonos Bazar para comprar y administrar tu experiencia." />
      </Helmet>
      <Card className="mx-auto shadow-sm" style={{ maxWidth: '420px' }}>
        <Card.Body>
          <h2 className="mb-4">Registro</h2>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Correo</Form.Label>
              <Form.Control value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Correo" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Contraseña</Form.Label>
              <Form.Control type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Contraseña" />
            </Form.Group>
            <Button type="submit" className="w-100">
              <FiUserPlus style={{ marginRight: '0.5rem' }} /> Crear cuenta
            </Button>
          </Form>
          <p className="mt-3 mb-0">
            ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
          </p>
        </Card.Body>
      </Card>
    </Container>
  );
}
