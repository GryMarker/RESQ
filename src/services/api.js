// API service for RESQ-LINK
// This is a mock implementation that will be replaced with real API calls

class ApiService {
  constructor() {
    this.baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';
  }

  // Authentication endpoints
  async login(email, password) {
    // Mock implementation - replace with real API call
    await this.delay(1000);
    
    return {
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: `user_${Date.now()}`,
          email,
          name: email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
          role: 'dispatcher',
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(email.split('@')[0])}&background=8bc34a&color=fff`
        },
        token: `mock_token_${Date.now()}`
      }
    };
  }

  async logout() {
    await this.delay(500);
    return {
      success: true,
      message: 'Logout successful',
      data: null
    };
  }

  // Incident endpoints
  async getIncidents(filters) {
    await this.delay(800);
    // Return mock data - in real implementation, this would fetch from backend
    return {
      success: true,
      message: 'Incidents retrieved successfully',
      data: [] // Mock incidents would be returned here
    };
  }

  async getIncidentById(id) {
    await this.delay(600);
    return {
      success: true,
      message: 'Incident retrieved successfully',
      data: {} // Mock incident data
    };
  }

  async updateIncidentStatus(id, status) {
    await this.delay(500);
    return {
      success: true,
      message: 'Incident status updated successfully',
      data: { id, status }
    };
  }

  // Responder endpoints
  async getResponders() {
    await this.delay(700);
    
    // Mock responders data
    const mockResponders = [
      {
        id: 'RESP-001',
        name: 'Juan Santos',
        unit: 'Fire Truck 1',
        status: 'available',
        location: { lat: 17.6132, lng: 121.7270 },
        lastPing: new Date(Date.now() - 2 * 60 * 1000), // 2 minutes ago
        distance: 1.2
      },
      {
        id: 'RESP-002',
        name: 'Maria Cruz',
        unit: 'Ambulance 1',
        status: 'busy',
        location: { lat: 17.6200, lng: 121.7300 },
        lastPing: new Date(Date.now() - 1 * 60 * 1000), // 1 minute ago
        distance: 2.5
      },
      {
        id: 'RESP-003',
        name: 'Pedro Reyes',
        unit: 'Patrol Car 1',
        status: 'available',
        location: { lat: 17.6100, lng: 121.7250 },
        lastPing: new Date(Date.now() - 30 * 1000), // 30 seconds ago
        distance: 0.8
      }
    ];

    return {
      success: true,
      message: 'Responders retrieved successfully',
      data: mockResponders
    };
  }

  async assignResponder(incidentId, responderId) {
    await this.delay(600);
    return {
      success: true,
      message: 'Responder assigned successfully',
      data: { incidentId, responderId }
    };
  }

  // Reports endpoints
  async getReports(dateRange) {
    await this.delay(1000);
    
    const mockReports = {
      totalIncidents: 156,
      resolvedIncidents: 142,
      averageResponseTime: 8.5, // minutes
      incidentsByType: {
        fire: 23,
        medical: 45,
        police: 38,
        rescue: 12,
        traffic: 28,
        other: 10
      },
      responseTimesByHour: Array.from({ length: 24 }, (_, i) => ({
        hour: i,
        avgTime: Math.random() * 15 + 5 // 5-20 minutes
      }))
    };

    return {
      success: true,
      message: 'Reports retrieved successfully',
      data: mockReports
    };
  }

  // Utility method to simulate network delay
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // HTTP methods for real API integration
  async request(
    endpoint,
    options = {}
  ) {
    const url = `${this.baseUrl}${endpoint}`;
    const token = localStorage.getItem('resq_token');

    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'API request failed');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // HTTP method helpers
  async get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  }

  async post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }
}

// Export singleton instance
export const apiService = new ApiService();
export default apiService;