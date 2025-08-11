import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Button, Modal, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useIncidents } from '../../contexts/IncidentContext';
import IncidentFilters from '../../components/IncidentFilters/IncidentFilters';
import IncidentTable from '../../components/IncidentTable/IncidentTable';
import './Incidents.css';

const Incidents = () => {
  const navigate = useNavigate();
  const { incidents, loading, addIncident } = useIncidents();
  const [filteredIncidents, setFilteredIncidents] = useState(incidents);
  const [showModal, setShowModal] = useState(false);
  const [newIncident, setNewIncident] = useState({});
  const [errors, setErrors] = useState({});

  const handleShow = () => setShowModal(true);
  const handleClose = () => {
    setShowModal(false);
    setNewIncident({});
    setErrors({});
  };

  const validateField = (name, value) => {
    if (name === 'callerPhone') {
      const phoneRegex = /^\+?\d{10,13}$/;
      if (!phoneRegex.test(value)) {
        return 'Invalid phone number format.';
      }
    } else if (!value) {
      return 'This field is required.';
    }
    return '';
  }

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setNewIncident(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: validateField(name, value) }))
    }
  };

  const isFormValid = () => {
    const newErrors = {};
    const requiredFields = ['type', 'priority', 'location', 'street', 'callerName', 'callerPhone'];

    requiredFields.forEach(field => {
      let value;
      if (field === 'location') {
        value = newIncident.location?.barangay;
      } else {
        value = newIncident[field]
      }
      
      const error = validateField(field, value);
      if (error) {
        newErrors[field] = error;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  const handleSave = () => {
    if (!isFormValid()) {
      return;
    }
    addIncident(newIncident);
    handleClose();
    window.alert('Incident created successfully!');
  };

  useEffect(() => {
    setFilteredIncidents(incidents);
  }, [incidents]);

  const handleIncidentClick = (incidentId) => {
    navigate(`/incidents/${incidentId}`);
  };

  const handleFiltersChange = (filters) => {
    let filtered = [...incidents];

    // Filter by status
    if (filters.status && filters.status !== 'all') {
      filtered = filtered.filter(incident => incident.status === filters.status);
    }

    // Filter by type
    if (filters.type && filters.type !== 'all') {
      filtered = filtered.filter(incident => incident.type === filters.type);
    }

    // Filter by barangay
    if (filters.barangay && filters.barangay !== 'all') {
      filtered = filtered.filter(incident => incident.location.barangay === filters.barangay);
    }

    // Filter by date range
    if (filters.dateFrom) {
      const fromDate = new Date(filters.dateFrom);
      filtered = filtered.filter(incident => new Date(incident.createdAt) >= fromDate);
    }

    if (filters.dateTo) {
      const toDate = new Date(filters.dateTo);
      toDate.setHours(23, 59, 59, 999); // End of day
      filtered = filtered.filter(incident => new Date(incident.createdAt) <= toDate);
    }

    // Filter by search term
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(incident =>
        incident.title.toLowerCase().includes(searchTerm) ||
        incident.description.toLowerCase().includes(searchTerm) ||
        incident.location.address.toLowerCase().includes(searchTerm) ||
        incident.location.barangay.toLowerCase().includes(searchTerm) ||
        incident.reporter.name.toLowerCase().includes(searchTerm)
      );
    }

    setFilteredIncidents(filtered);
  };

  return (
    <div className="incidents-page d-flex flex-column flex-grow-1">
      <div className="page-header mb-4">
        <Row className="align-items-center">
          <Col>
            <h1 className="page-title">
              <i className="fas fa-exclamation-triangle me-2"></i>
              Incidents
            </h1>
            <p className="page-subtitle text-muted">
              Manage and track emergency incidents
            </p>
          </Col>
          <Col xs="auto">
            <Button variant="success" className="btn-resq-primary" onClick={handleShow}>
              <i className="fas fa-plus me-2"></i>
              New Incident
            </Button>
          </Col>
        </Row>
      </div>

      <Row className="flex-grow-1">
        <Col lg={3} className="mb-4">
          <Card className="filters-card">
            <Card.Header>
              <h5 className="mb-0">
                <i className="fas fa-filter me-2"></i>
                Filters
              </h5>
            </Card.Header>
            <Card.Body>
              <IncidentFilters
                incidents={incidents}
                onFiltersChange={handleFiltersChange}
              />
            </Card.Body>
          </Card>
        </Col>

        <Col lg={9} className="d-flex flex-column">
          <Card className="incidents-card flex-grow-1">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">
                Incidents ({filteredIncidents.length})
              </h5>
              <div className="incidents-stats">
                <span className="badge bg-danger me-2">
                  {filteredIncidents.filter(i => i.status === 'new').length} New
                </span>
                <span className="badge bg-warning me-2">
                  {filteredIncidents.filter(i => i.status === 'assigned').length} Assigned
                </span>
                <span className="badge bg-primary me-2">
                  {filteredIncidents.filter(i => i.status === 'en-route').length} En Route
                </span>
                <span className="badge bg-success">
                  {filteredIncidents.filter(i => i.status === 'on-scene').length} On Scene
                </span>
              </div>
            </Card.Header>
            <Card.Body className="p-0 flex-grow-1">
              <IncidentTable
                incidents={filteredIncidents}
                loading={loading}
                onIncidentClick={handleIncidentClick}
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Modal show={showModal} onHide={handleClose} backdrop="static" keyboard={false}>
        <Modal.Header closeButton>
          <Modal.Title>New Incident</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form noValidate>
            <Form.Group className="mb-3" controlId="formIncidentType">
              <Form.Label>Type</Form.Label>
              <Form.Select name="type" onChange={handleFormChange} isInvalid={!!errors.type}>
                <option>Select Type</option>
                <option value="Medical">Medical</option>
                <option value="Fire">Fire</option>
                <option value="Rescue">Rescue</option>
                <option value="Police">Police</option>
              </Form.Select>
              <Form.Control.Feedback type="invalid">{errors.type}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formIncidentPriority">
              <Form.Label>Priority</Form.Label>
              <Form.Select name="priority" onChange={handleFormChange} isInvalid={!!errors.priority}>
                <option>Select Priority</option>
                <option value="Critical">Critical</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </Form.Select>
              <Form.Control.Feedback type="invalid">{errors.priority}</Form.Control.Feedback>
            </Form.Group>
            
            <Form.Group className="mb-3" controlId="formIncidentBarangay">
              <Form.Label>Barangay</Form.Label>
              <Form.Select name="location.barangay" onChange={handleFormChange} isInvalid={!!errors.location}>
                  <option>Select Barangay</option>
                  <option value="Centro 1">Centro 1</option>
                  <option value="Centro 2">Centro 2</option>
                  <option value="Carig">Carig</option>
                  <option value="Libag">Libag</option>
                  <option value="Pengue-Ruyu">Pengue-Ruyu</option>
                  <option value="Ugac">Ugac</option>
                  <option value="Annafunan">Annafunan</option>
                  <option value="Linao">Linao</option>
              </Form.Select>
              <Form.Control.Feedback type="invalid">{errors.location}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formStreet">
              <Form.Label>Street / Landmark</Form.Label>
              <Form.Control type="text" name="street" onChange={handleFormChange} isInvalid={!!errors.street} />
              <Form.Control.Feedback type="invalid">{errors.street}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formCallerName">
              <Form.Label>Caller Name</Form.Label>
              <Form.Control type="text" name="callerName" onChange={handleFormChange} isInvalid={!!errors.callerName}/>
              <Form.Control.Feedback type="invalid">{errors.callerName}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formCallerPhone">
              <Form.Label>Caller Phone</Form.Label>
              <Form.Control type="text" name="callerPhone" onChange={handleFormChange} isInvalid={!!errors.callerPhone}/>
              <Form.Control.Feedback type="invalid">{errors.callerPhone}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formNotes">
              <Form.Label>Notes</Form.Label>
              <Form.Control as="textarea" rows={3} name="notes" onChange={handleFormChange} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Incidents;