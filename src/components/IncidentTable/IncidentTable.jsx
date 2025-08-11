import React from 'react';
import { Table, Badge, Spinner } from 'react-bootstrap';
import './IncidentTable.css';

const IncidentTable = ({ incidents, loading, onIncidentClick }) => {
  const getStatusBadge = (status) => {
    const statusConfig = {
      new: { variant: 'danger', label: 'New' },
      assigned: { variant: 'warning', label: 'Assigned' },
      'en-route': { variant: 'primary', label: 'En Route' },
      'on-scene': { variant: 'success', label: 'On Scene' },
      resolved: { variant: 'secondary', label: 'Resolved' }
    };

    const config = statusConfig[status];
    return (
      <Badge bg={config.variant} className={`status-${status}`}>
        {config.label}
      </Badge>
    );
  };

  const getPriorityBadge = (priority) => {
    const priorityConfig = {
      low: { variant: 'light', label: 'Low', textClass: 'text-dark' },
      medium: { variant: 'warning', label: 'Medium', textClass: 'text-dark' },
      high: { variant: 'danger', label: 'High', textClass: 'text-white' },
      critical: { variant: 'dark', label: 'Critical', textClass: 'text-white' }
    };

    const config = priorityConfig[priority];
    return (
      <Badge bg={config.variant} className={config.textClass}>
        {config.label}
      </Badge>
    );
  };

  const getTypeIcon = (type) => {
    const typeIcons = {
      fire: 'fas fa-fire text-danger',
      medical: 'fas fa-heartbeat text-danger',
      police: 'fas fa-shield-alt text-primary',
      rescue: 'fas fa-life-ring text-warning',
      traffic: 'fas fa-car text-info',
      other: 'fas fa-exclamation-circle text-secondary'
    };

    return <i className={typeIcons[type]}></i>;
  };

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date));
  };

  const getTimeSince = (date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - new Date(date).getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  if (loading) {
    return (
      <div className="incidents-loading">
        <Spinner animation="border" variant="success" />
        <span className="ms-2">Loading incidents...</span>
      </div>
    );
  }

  if (incidents.length === 0) {
    return (
      <div className="incidents-empty">
        <i className="fas fa-inbox"></i>
        <h5>No incidents found</h5>
        <p>Try adjusting your filters or check back later.</p>
      </div>
    );
  }

  return (
    <div className="incident-table-container">
      <Table hover responsive className="incident-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Type</th>
            <th>Title</th>
            <th>Location</th>
            <th>Priority</th>
            <th>Status</th>
            <th>Assigned To</th>
            <th>Created</th>
            <th>Updated</th>
          </tr>
        </thead>
        <tbody>
          {incidents.map((incident) => (
            <tr
              key={incident.id}
              onClick={() => onIncidentClick(incident.id)}
              className="incident-row"
            >
              <td>
                <span className="incident-id">{incident.id}</span>
              </td>
              <td>
                <div className="incident-type">
                  {getTypeIcon(incident.type)}
                  <span className="ms-2 text-capitalize">{incident.type}</span>
                </div>
              </td>
              <td>
                <div className="incident-title">
                  <strong>{incident.title}</strong>
                  <div className="incident-description text-muted">
                    {incident.description.length > 50
                      ? `${incident.description.substring(0, 50)}...`
                      : incident.description
                    }
                  </div>
                </div>
              </td>
              <td>
                <div className="incident-location">
                  <div>{incident.location.barangay}</div>
                  <small className="text-muted">
                    {incident.location.address.length > 30
                      ? `${incident.location.address.substring(0, 30)}...`
                      : incident.location.address
                    }
                  </small>
                </div>
              </td>
              <td>
                {getPriorityBadge(incident.priority)}
              </td>
              <td>
                {getStatusBadge(incident.status)}
              </td>
              <td>
                {incident.assignedResponder ? (
                  <div className="assigned-responder">
                    <div>{incident.assignedResponder.name}</div>
                    <small className="text-muted">{incident.assignedResponder.unit}</small>
                  </div>
                ) : (
                  <span className="text-muted">Unassigned</span>
                )}
              </td>
              <td>
                <div className="incident-time">
                  <div>{formatDate(incident.createdAt)}</div>
                  <small className="text-muted">{getTimeSince(incident.createdAt)}</small>
                </div>
              </td>
              <td>
                <div className="incident-time">
                  <div>{formatDate(incident.updatedAt)}</div>
                  <small className="text-muted">{getTimeSince(incident.updatedAt)}</small>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default IncidentTable;