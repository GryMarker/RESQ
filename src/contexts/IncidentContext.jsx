import React, { createContext, useContext, useState, useEffect } from 'react';
const IncidentContext = createContext(undefined);

export const useIncidents = () => {
  const context = useContext(IncidentContext);
  if (context === undefined) {
    throw new Error('useIncidents must be used within an IncidentProvider');
  }
  return context;
};

// Mock data for Tuguegarao City barangays
const tuguegaraoBarangays = [
  'Atulayan Norte', 'Atulayan Sur', 'Bagay', 'Buntun', 'Caggay',
  'Caritan Centro', 'Centro 1', 'Centro 2', 'Centro 3', 'Centro 4',
  'Centro 5', 'Centro 6', 'Centro 7', 'Centro 8', 'Centro 9',
  'Centro 10', 'Dadda', 'Gosi Norte', 'Gosi Sur', 'Larion Alto',
  'Larion Bajo', 'Leonarda', 'Libag Norte', 'Libag Sur', 'Pallua Norte',
  'Pallua Sur', 'Pengue-Ruyu', 'Reyes', 'San Gabriel', 'Tagga'
];

const incidentTypes = ['fire', 'medical', 'police', 'rescue', 'traffic', 'other'];
const priorities = ['low', 'medium', 'high', 'critical'];

// Generate mock incidents
const generateMockIncidents = () => {
  const incidents = [];
  
  for (let i = 1; i <= 12; i++) {
    const barangay = tuguegaraoBarangays[Math.floor(Math.random() * tuguegaraoBarangays.length)];
    const type = incidentTypes[Math.floor(Math.random() * incidentTypes.length)];
    const priority = priorities[Math.floor(Math.random() * priorities.length)];
    const status = i <= 3 ? 'new' : i <= 6 ? 'assigned' : i <= 9 ? 'en-route' : 'resolved';
    
    const createdAt = new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000); // Last 7 days
    
    const incident = {
      id: `INC-${String(i).padStart(4, '0')}`,
      title: getIncidentTitle(type),
      description: getIncidentDescription(type),
      type,
      status,
      priority,
      location: {
        address: `${Math.floor(Math.random() * 999) + 1} ${getStreetName()}, ${barangay}`,
        barangay,
        coordinates: {
          lat: 17.6132 + (Math.random() - 0.5) * 0.1, // Tuguegarao City coordinates with variance
          lng: 121.7270 + (Math.random() - 0.5) * 0.1
        }
      },
      reporter: {
        name: getRandomName(),
        phone: `+63${Math.floor(Math.random() * 900000000) + 100000000}`,
        email: Math.random() > 0.5 ? `reporter${i}@email.com` : undefined
      },
      assignedResponder: status !== 'new' ? {
        id: `RESP-${String(Math.floor(Math.random() * 20) + 1).padStart(3, '0')}`,
        name: getRandomName(),
        unit: getRandomUnit(type)
      } : undefined,
      createdAt,
      updatedAt: new Date(createdAt.getTime() + Math.random() * 60 * 60 * 1000),
      timeline: generateTimeline(status, createdAt)
    };
    
    incidents.push(incident);
  }
  
  return incidents.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
};

const getIncidentTitle = (type) => {
  const titles = {
    fire: ['House Fire', 'Grass Fire', 'Vehicle Fire', 'Commercial Fire'],
    medical: ['Medical Emergency', 'Cardiac Arrest', 'Accident Victim', 'Respiratory Distress'],
    police: ['Theft Report', 'Domestic Disturbance', 'Traffic Violation', 'Public Disturbance'],
    rescue: ['Water Rescue', 'Building Collapse', 'Animal Rescue', 'High Angle Rescue'],
    traffic: ['Vehicle Accident', 'Road Obstruction', 'Traffic Jam', 'Hit and Run'],
    other: ['Power Outage', 'Gas Leak', 'Noise Complaint', 'Welfare Check']
  };
  
  const typeOptions = titles[type];
  return typeOptions[Math.floor(Math.random() * typeOptions.length)];
};

const getIncidentDescription = (type) => {
  const descriptions = {
    fire: 'Fire reported with visible smoke and flames. Multiple units dispatched.',
    medical: 'Medical emergency requiring immediate attention. Ambulance en route.',
    police: 'Police assistance requested. Officers responding to scene.',
    rescue: 'Rescue operation required. Specialized equipment may be needed.',
    traffic: 'Traffic incident reported. Emergency responders dispatched.',
    other: 'General emergency requiring immediate attention and response.'
  };
  
  return descriptions[type];
};

const getRandomName = () => {
  const firstNames = ['Juan', 'Maria', 'Jose', 'Ana', 'Pedro', 'Carmen', 'Luis', 'Rosa', 'Carlos', 'Elena'];
  const lastNames = ['Santos', 'Reyes', 'Cruz', 'Bautista', 'Gonzales', 'Garcia', 'Martinez', 'Lopez', 'Hernandez', 'Perez'];
  
  return `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`;
};

const getStreetName = () => {
  const streets = ['Rizal St', 'Luna St', 'Bonifacio Ave', 'Mabini St', 'Del Pilar St', 'Quezon Ave', 'Burgos St', 'Aguinaldo St'];
  return streets[Math.floor(Math.random() * streets.length)];
};

const getRandomUnit = (type) => {
  const units = {
    fire: ['Fire Truck 1', 'Fire Truck 2', 'Ladder 1', 'Rescue 1'],
    medical: ['Ambulance 1', 'Ambulance 2', 'Paramedic Unit 1'],
    police: ['Patrol Car 1', 'Patrol Car 2', 'Mobile Unit 1'],
    rescue: ['Rescue Unit 1', 'Heavy Rescue 1', 'Water Rescue 1'],
    traffic: ['Traffic Unit 1', 'Patrol Car 3', 'Motorcycle Unit 1'],
    other: ['Utility Unit 1', 'Support Vehicle 1', 'Command Unit 1']
  };
  
  const typeUnits = units[type];
  return typeUnits[Math.floor(Math.random() * typeUnits.length)];
};

const generateTimeline = (status, createdAt) => {
  const timeline = [
    {
      id: '1',
      timestamp: createdAt,
      event: 'Incident Reported',
      description: 'Emergency call received and incident created',
      user: 'System'
    }
  ];
  
  if (status === 'new') return timeline;
  
  timeline.push({
    id: '2',
    timestamp: new Date(createdAt.getTime() + 5 * 60 * 1000),
    event: 'Responder Assigned',
    description: 'Emergency responder assigned to incident',
    user: 'Dispatcher'
  });
  
  if (status === 'assigned') return timeline;
  
  timeline.push({
    id: '3',
    timestamp: new Date(createdAt.getTime() + 10 * 60 * 1000),
    event: 'En Route',
    description: 'Responder is en route to the scene',
    user: 'Responder'
  });
  
  if (status === 'en-route') return timeline;
  
  timeline.push({
    id: '4',
    timestamp: new Date(createdAt.getTime() + 20 * 60 * 1000),
    event: 'On Scene',
    description: 'Responder has arrived at the scene',
    user: 'Responder'
  });
  
  if (status === 'on-scene') return timeline;
  
  timeline.push({
    id: '5',
    timestamp: new Date(createdAt.getTime() + 45 * 60 * 1000),
    event: 'Resolved',
    description: 'Incident has been resolved successfully',
    user: 'Responder'
  });
  
  return timeline;
};

export const IncidentProvider = ({ children }) => {
  const [incidents, setIncidents] = useState([]);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize with mock data
  useEffect(() => {
    const mockIncidents = generateMockIncidents();
    setIncidents(mockIncidents);
    setLoading(false);
  }, []);

  const getIncidentById = (id) => {
    return incidents.find(incident => incident.id === id);
  };

  const addIncident = (newIncidentData) => {
    const now = new "Date"();
    const newIncident = {
      id: `INC-${Date.now()}`,
      title: getIncidentTitle(newIncidentData.type),
      description: getIncidentDescription(newIncidentData.type),
      type: newIncidentData.type,
      status: 'new',
      priority: newIncidentData.priority,
      location: {
        address: `${newIncidentData.street}, ${newIncidentData.location.barangay}`,
        barangay: newIncidentData.location.barangay,
        coordinates: { // dummy coordinates
          lat: 17.6132 + (Math.random() - 0.5) * 0.1,
          lng: 121.7270 + (Math.random() - 0.5) * 0.1
        }
      },
      reporter: {
        name: newIncidentData.callerName,
        phone: newIncidentData.callerPhone,
      },
      createdAt: now,
      updatedAt: now,
      timeline: [
        {
          id: '1',
          timestamp: now,
          event: 'Incident Reported',
          description: newIncidentData.notes || 'Emergency call received and incident created',
          user: newIncidentData.callerName,
        }
      ]
    };

    setIncidents(prevIncidents => [newIncident, ...prevIncidents]);
  };

  const updateIncidentStatus = (id, status) => {
    setIncidents(prev => prev.map(incident => {
      if (incident.id === id) {
        const updatedIncident = {
          ...incident,
          status,
          updatedAt: new Date(),
          timeline: [
            ...incident.timeline,
            {
              id: `${incident.timeline.length + 1}`,
              timestamp: new Date(),
              event: `Status Changed to ${status.charAt(0).toUpperCase() + status.slice(1)}`,
              description: `Incident status updated to ${status}`,
              user: 'Current User'
            }
          ]
        };
        
        // Update selected incident if it's the same one
        if (selectedIncident?.id === id) {
          setSelectedIncident(updatedIncident);
        }
        
        return updatedIncident;
      }
      return incident;
    }));
  };

  const assignResponder = (incidentId, responderId, responderName, unit) => {
    setIncidents(prev => prev.map(incident => {
      if (incident.id === incidentId) {
        const updatedIncident = {
          ...incident,
          assignedResponder: {
            id: responderId,
            name: responderName,
            unit
          },
          status: 'assigned',
          updatedAt: new Date(),
          timeline: [
            ...incident.timeline,
            {
              id: `${incident.timeline.length + 1}`,
              timestamp: new Date(),
              event: 'Responder Assigned',
              description: `${responderName} (${unit}) assigned to incident`,
              user: 'Dispatcher'
            }
          ]
        };
        
        if (selectedIncident?.id === incidentId) {
          setSelectedIncident(updatedIncident);
        }
        
        return updatedIncident;
      }
      return incident;
    }));
  };

  const addTimelineEvent = (incidentId, event, description) => {
    setIncidents(prev => prev.map(incident => {
      if (incident.id === incidentId) {
        const updatedIncident = {
          ...incident,
          updatedAt: new Date(),
          timeline: [
            ...incident.timeline,
            {
              id: `${incident.timeline.length + 1}`,
              timestamp: new Date(),
              event,
              description,
              user: 'Current User'
            }
          ]
        };
        
        if (selectedIncident?.id === incidentId) {
          setSelectedIncident(updatedIncident);
        }
        
        return updatedIncident;
      }
      return incident;
    }));
  };

  const subscribeToRealtime = () => {
    // This will be implemented in the realtime service
    console.log('Subscribing to realtime updates...');
  };

  const unsubscribeFromRealtime = () => {
    // This will be implemented in the realtime service
    console.log('Unsubscribing from realtime updates...');
  };

  const value = {
    incidents,
    selectedIncident,
    loading,
    getIncidentById,
    addIncident,
    updateIncidentStatus,
    assignResponder,
    addTimelineEvent,
    setSelectedIncident,
    subscribeToRealtime,
    unsubscribeFromRealtime
  };

  return (
    <IncidentContext.Provider value={value}>
      {children}
    </IncidentContext.Provider>
  );
};