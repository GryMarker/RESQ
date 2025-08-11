import React from 'react';
import { Card } from 'react-bootstrap';

const MapView = ({ center, markers }) => {
  const mapStyles = {
    border: '2px solid #6c757d',
    borderRadius: '0.25rem',
    padding: '1rem',
    minHeight: '400px',
    backgroundColor: '#f8f9fa',
    overflowY: 'auto',
  };

  const legendStyles = {
    fontSize: '0.9rem',
  };

  return (
    <Card>
      <Card.Header as="h5">Map View</Card.Header>
      <Card.Body>
        <div style={mapStyles}>
          <div style={legendStyles}>
            <p className="mb-1">
              <strong>Center:</strong>{' '}
              {center ? `${center.lat.toFixed(4)}, ${center.lng.toFixed(4)}` : 'N/A'}
            </p>
            <hr />
            <p className="mb-1">
              <strong>Markers ({markers.length}):</strong>
            </p>
            <ul className="list-unstyled">
              {markers.map((marker) => (
                <li key={marker.id}>
                  {marker.id}: {marker.type} @ {marker.barangay}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default MapView;