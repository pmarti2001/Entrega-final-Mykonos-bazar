import { Container, Card } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const { user } = useAuth();

  return (
    <div>
      <Helmet>
        <title>Mykonos Bazar - Perfil</title>
        <meta name="description" content="Consulta tu perfil y datos de cuenta en Mykonos Bazar." />
      </Helmet>
      <Navbar />
      <Container className="py-4">
        <Card className="shadow-sm">
          <Card.Body>
            <h1 className="h4">Perfil</h1>
            <p className="mb-0">Correo: {user?.email}</p>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
}
