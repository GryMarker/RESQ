import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <Container className="py-5">
      <Row className="justify-content-center text-center">
        <Col md={6}>
          <div className="mb-4">
            <i className="fas fa-exclamation-triangle text-warning" style={{ fontSize: '4rem' }}></i>
          </div>
          <h1 className="display-4 mb-3">404</h1>
          <h2 className="mb-3">Page Not Found</h2>
          <p className="lead mb-4">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <div className="d-flex gap-3 justify-content-center">
            <Link to="/incidents">
              <Button variant="success" size="lg">
                <i className="fas fa-home me-2"></i>
                Go to Dashboard
              </Button>
            </Link>
            <Button 
              variant="outline-secondary" 
              size="lg" 
              onClick={() => window.history.back()}
            >
              <i className="fas fa-arrow-left me-2"></i>
              Go Back
            </Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default NotFound;