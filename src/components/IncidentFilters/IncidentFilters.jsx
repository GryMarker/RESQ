import React, { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';
import './IncidentFilters.css';

const IncidentFilters = ({ incidents, onFiltersChange }) => {
  const [filters, setFilters] = useState({
    status: 'all',
    type: 'all',
    barangay: 'all',
    dateFrom: '',
    dateTo: '',
    search: ''
  });

  // Get unique barangays from incidents
  const uniqueBarangays = Array.from(
    new Set(incidents.map(incident => incident.location.barangay))
  ).sort();

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'new', label: 'New' },
    { value: 'assigned', label: 'Assigned' },
    { value: 'en-route', label: 'En Route' },
    { value: 'on-scene', label: 'On Scene' },
    { value: 'resolved', label: 'Resolved' }
  ];

  const typeOptions = [
    { value: 'all', label: 'All Types' },
    { value: 'fire', label: 'Fire' },
    { value: 'medical', label: 'Medical' },
    { value: 'police', label: 'Police' },
    { value: 'rescue', label: 'Rescue' },
    { value: 'traffic', label: 'Traffic' },
    { value: 'other', label: 'Other' }
  ];

  useEffect(() => {
    onFiltersChange(filters);
  }, [filters, onFiltersChange]);

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      status: 'all',
      type: 'all',
      barangay: 'all',
      dateFrom: '',
      dateTo: '',
      search: ''
    };
    setFilters(clearedFilters);
  };

  const hasActiveFilters = () => {
    return filters.status !== 'all' ||
           filters.type !== 'all' ||
           filters.barangay !== 'all' ||
           filters.dateFrom !== '' ||
           filters.dateTo !== '' ||
           filters.search !== '';
  };

  return (
    <div className="incident-filters">
      <Form>
        {/* Search */}
        <Form.Group className="mb-3">
          <Form.Label>Search</Form.Label>
          <Form.Control
            type="text"
            placeholder="Search incidents..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
          />
        </Form.Group>

        {/* Status Filter */}
        <Form.Group className="mb-3">
          <Form.Label>Status</Form.Label>
          <Form.Select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
          >
            {statusOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        {/* Type Filter */}
        <Form.Group className="mb-3">
          <Form.Label>Type</Form.Label>
          <Form.Select
            value={filters.type}
            onChange={(e) => handleFilterChange('type', e.target.value)}
          >
            {typeOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        {/* Barangay Filter */}
        <Form.Group className="mb-3">
          <Form.Label>Barangay</Form.Label>
          <Form.Select
            value={filters.barangay}
            onChange={(e) => handleFilterChange('barangay', e.target.value)}
          >
            <option value="all">All Barangays</option>
            {uniqueBarangays.map(barangay => (
              <option key={barangay} value={barangay}>
                {barangay}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        {/* Date Range */}
        <Form.Group className="mb-3">
          <Form.Label>Date From</Form.Label>
          <Form.Control
            type="date"
            value={filters.dateFrom}
            onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Date To</Form.Label>
          <Form.Control
            type="date"
            value={filters.dateTo}
            onChange={(e) => handleFilterChange('dateTo', e.target.value)}
          />
        </Form.Group>

        {/* Clear Filters Button */}
        {hasActiveFilters() && (
          <Button
            variant="outline-secondary"
            size="sm"
            onClick={handleClearFilters}
            className="w-100"
          >
            <i className="fas fa-times me-2"></i>
            Clear Filters
          </Button>
        )}
      </Form>
    </div>
  );
};

export default IncidentFilters;