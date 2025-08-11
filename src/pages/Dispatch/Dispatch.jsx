import React, { useState, useEffect, useMemo } from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  ListGroup,
  Badge,
  Form,
  Stack,
} from 'react-bootstrap';
import MapView from '../../components/MapView/MapView';
import ChatPanel from '../../components/ChatPanel/ChatPanel';
import './Dispatch.css';

const mockIncidents = [
  // ... (10-12 mock incidents)
  { id: 'INC001', type: 'Medical', status: 'New', barangay: 'Poblacion', lat: 10.3157, lng: 123.8854, caller: 'Juan Dela Cruz', time: '10:01 AM' },
  { id: 'INC002', type: 'Fire', status: 'New', barangay: 'Guadalupe', lat: 10.3254, lng: 123.8923, caller: 'Maria Santos', time: '10:05 AM' },
  { id: 'INC003', type: 'Accident', status: 'Dispatched', barangay: 'Lahug', lat: 10.3172, lng: 123.9056, caller: 'Peter Jones', time: '10:10 AM' },
  { id: 'INC004', type: 'Medical', status: 'On Scene', barangay: 'Tisa', lat: 10.2983, lng: 123.8612, caller: 'Ana Gomez', time: '10:12 AM' },
  { id: 'INC005', type: 'Fire', status: 'New', barangay: 'Mabolo', lat: 10.3298, lng: 123.9032, caller: 'Luis Manalo', time: '10:15 AM' },
  { id: 'INC006', type: 'Crime', status: 'New', barangay: 'Ermita', lat: 10.2925, lng: 123.9015, caller: 'John Doe', time: '10:18 AM' },
  { id: 'INC007', type: 'Accident', status: 'Dispatched', barangay: 'Talamban', lat: 10.3639, lng: 123.9184, caller: 'Jane Smith', time: '10:20 AM' },
  { id: 'INC008', type: 'Medical', status: 'New', barangay: 'Basak San Nicolas', lat: 10.2871, lng: 123.8767, caller: 'Carlos Garcia', time: '10:22 AM' },
  { id: 'INC009', type: 'Fire', status: 'On Scene', barangay: 'Cogon Ramos', lat: 10.3129, lng: 123.8953, caller: 'Rosa Villa', time: '10:25 AM' },
  { id: 'INC010', type: 'Crime', status: 'Dispatched', barangay: 'Capitol Site', lat: 10.3150, lng: 123.8930, caller: 'Tony Stark', time: '10:30 AM' },
  { id: 'INC011', type: 'Medical', status: 'New', barangay: 'Pardo', lat: 10.2736, lng: 123.8619, caller: 'Bruce Wayne', time: '10:32 AM' },
  { id: 'INC012', type: 'Accident', status: 'New', barangay: 'Bulacao', lat: 10.279, lng: 123.845, caller: 'Clark Kent', time: '10:35 AM' },
];

const STATUS_COLORS = {
  New: 'primary',
  Dispatched: 'warning',
  'On Scene': 'success',
};

const Dispatch = () => {
  const [incidents, setIncidents] = useState(mockIncidents);
  const [selectedId, setSelectedId] = useState(mockIncidents[0].id);
  const [filterStatus, setFilterStatus] = useState('');
  const [filterType, setFilterType] = useState('');

  // Fake realtime update
  useEffect(() => {
    const interval = setInterval(() => {
      setIncidents((prevIncidents) => {
        const randomIndex = Math.floor(Math.random() * prevIncidents.length);
        const randomIncident = { ...prevIncidents[randomIndex] };
        const statuses = ['New', 'Dispatched', 'On Scene'];
        const currentStatusIndex = statuses.indexOf(randomIncident.status);
        const nextStatus = statuses[(currentStatusIndex + 1) % statuses.length];

        randomIncident.status = nextStatus;
        randomIncident.lat += (Math.random() - 0.5) * 0.001;
        randomIncident.lng += (Math.random() - 0.5) * 0.001;

        const newIncidents = [...prevIncidents];
        newIncidents[randomIndex] = randomIncident;
        return newIncidents;
      });
    }, 8000 + Math.random() * 2000); // 8-10 seconds

    return () => clearInterval(interval);
  }, []);

  const filteredIncidents = useMemo(() => {
    return incidents.filter(
      (inc) =>
        (filterStatus === '' || inc.status === filterStatus) &&
        (filterType === '' || inc.type === filterType)
    );
  }, [incidents, filterStatus, filterType]);

  const selectedIncident = useMemo(
    () => incidents.find((inc) => inc.id === selectedId) || filteredIncidents[0],
    [incidents, selectedId, filteredIncidents]
  );
  
  const incidentTypes = useMemo(() => [...new Set(mockIncidents.map(inc => inc.type))], []);
  
  const statusCounts = useMemo(() => {
    return incidents.reduce((acc, inc) => {
        acc[inc.status] = (acc[inc.status] || 0) + 1;
        return acc;
    }, {});
  }, [incidents]);


  return (
    <Container fluid className="p-3">
      <Row className="mb-3 align-items-center">
        <Col>
          <h2 className="mb-0">Dispatch Console</h2>
        </Col>
        <Col xs="auto">
            <Stack direction="horizontal" gap={2}>
                <Badge bg="primary">New: {statusCounts.New || 0}</Badge>
                <Badge bg="warning" text="dark">Dispatched: {statusCounts.Dispatched || 0}</Badge>
                <Badge bg="success">On Scene: {statusCounts['On Scene'] || 0}</Badge>
            </Stack>
        </Col>
      </Row>

      <Row className="h-100">
        <Col md={3} className="mb-3 mb-md-0">
          <Card className="h-100">
            <Card.Header as="h5">Incident Queue</Card.Header>
            <Card.Body>
              <Form className="mb-3">
                <Row>
                  <Col>
                    <Form.Group>
                      <Form.Label>Status</Form.Label>
                      <Form.Select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                      >
                        <option value="">All</option>
                        {Object.keys(STATUS_COLORS).map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group>
                      <Form.Label>Type</Form.Label>
                      <Form.Select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                      >
                        <option value="">All</option>
                         {incidentTypes.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>
              </Form>
              <ListGroup variant="flush" className="incident-list">
                {filteredIncidents.map((incident) => (
                  <ListGroup.Item
                    key={incident.id}
                    action
                    onClick={() => setSelectedId(incident.id)}
                    active={incident.id === selectedId}
                  >
                    <div className="d-flex justify-content-between">
                      <span className="fw-bold">{incident.id} - {incident.type}</span>
                      <Badge bg={STATUS_COLORS[incident.status]} pill>
                        {incident.status}
                      </Badge>
                    </div>
                    <div>{incident.barangay}</div>
                    <div className="small text-muted">
                      {incident.time} - {incident.caller}
                    </div>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} className="mb-3 mb-md-0">
          <MapView center={selectedIncident} markers={incidents} />
        </Col>

        <Col md={3}>
          <ChatPanel />
        </Col>
      </Row>
    </Container>
  );
};

export default Dispatch;