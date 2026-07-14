import { useState } from 'react';
import { Container, Form, Button, Card } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import { FiLogIn } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/profile');
    } catch (error) {
      console.error(error);
      alert('Error al iniciar sesión');
    }
  };

  return (
    <Container className="py-5">
      <Helmet>
        <title>Mykonos Bazar - Iniciar sesión</title>
        <meta name="description" content="Accede a tu cuenta para gestionar tu carrito y perfil en Mykonos Bazar." />
      </Helmet>
      <Card className="mx-auto shadow-sm" style={{ maxWidth: '420px' }}>
        <Card.Body>
          <h2 className="mb-4">Iniciar sesión</h2>
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
              <FiLogIn style={{ marginRight: '0.5rem' }} /> Entrar
            </Button>
          </Form>
          <p className="mt-3 mb-0">
            ¿No tienes cuenta? <Link to="/registro">Regístrate</Link>
          </p>
        </Card.Body>
      </Card>
    </Container>
  );
}
