// Geolocation service for RESQ-LINK
// Handles location-related functionality with fallback to mock data

class GeoService {
  constructor() {
    this.watchId = null;
    this.lastKnownLocation = null;
    this.TUGUEGARAO_CENTER = {
      lat: 17.6132,
      lng: 121.7270
    };
    this.mockUpdateInterval = null;
  }

  // Get current position
  async getCurrentPosition() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        console.warn('Geolocation not supported, using mock location');
        resolve(this.getMockLocation());
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const result = {
            coordinates: {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            },
            accuracy: position.coords.accuracy,
            timestamp: new Date(position.timestamp)
          };
          
          this.lastKnownLocation = result;
          resolve(result);
        },
        (error) => {
          console.warn('Geolocation error, using mock location:', error.message);
          resolve(this.getMockLocation());
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        }
      );
    });
  }

  // Watch position changes
  watchPosition(
    onSuccess,
    onError
  ) {
    if (!navigator.geolocation) {
      console.warn('Geolocation not supported, using mock location updates');
      this.startMockLocationUpdates(onSuccess);
      return () => this.stopMockLocationUpdates();
    }

    this.watchId = navigator.geolocation.watchPosition(
      (position) => {
        const result = {
          coordinates: {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          },
          accuracy: position.coords.accuracy,
          timestamp: new Date(position.timestamp)
        };
        
        this.lastKnownLocation = result;
        onSuccess(result);
      },
      (error) => {
        console.warn('Geolocation watch error:', error.message);
        if (onError) {
          onError({
            code: error.code,
            message: error.message
          });
        }
        // Fallback to mock location
        onSuccess(this.getMockLocation());
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 60000 // 1 minute
      }
    );

    // Return stop function
    return () => {
      if (this.watchId !== null) {
        navigator.geolocation.clearWatch(this.watchId);
        this.watchId = null;
      }
    };
  }

  // Stop watching position
  stopWatching() {
    if (this.watchId !== null) {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
    }
    this.stopMockLocationUpdates();
  }

  // Calculate distance between two points (Haversine formula)
  calculateDistance(point1, point2) {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.toRadians(point2.lat - point1.lat);
    const dLng = this.toRadians(point2.lng - point1.lng);
    
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(point1.lat)) * Math.cos(this.toRadians(point2.lat)) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in kilometers
  }

  // Convert degrees to radians
  toRadians(degrees) {
    return degrees * (Math.PI / 180);
  }

  // Get mock location (Tuguegarao City with some variance)
  getMockLocation() {
    const variance = 0.01; // ~1km variance
    return {
      coordinates: {
        lat: this.TUGUEGARAO_CENTER.lat + (Math.random() - 0.5) * variance,
        lng: this.TUGUEGARAO_CENTER.lng + (Math.random() - 0.5) * variance
      },
      address: 'Tuguegarao City, Cagayan, Philippines',
      accuracy: 50,
      timestamp: new Date()
    };
  }

  // Mock location updates for testing
  startMockLocationUpdates(callback) {
    this.mockUpdateInterval = window.setInterval(() => {
      callback(this.getMockLocation());
    }, 30000); // Update every 30 seconds
  }

  startMockLocationUpdates(callback) {
    this.mockUpdateInterval = window.setInterval(() => {
      callback(this.getMockLocation());
    }, 30000); // Update every 30 seconds
  }

  stopMockLocationUpdates() {
    if (this.mockUpdateInterval) {
      clearInterval(this.mockUpdateInterval);
      this.mockUpdateInterval = null;
    }
  }

  // Get last known location
  getLastKnownLocation() {
    return this.lastKnownLocation;
  }

  // Check if coordinates are within Tuguegarao City bounds
  isWithinTuguegarao(coordinates) {
    const distance = this.calculateDistance(coordinates, this.TUGUEGARAO_CENTER);
    return distance <= 20; // 20km radius
  }

  // Get city center coordinates
  getCityCenter() {
    return { ...this.TUGUEGARAO_CENTER };
  }

  // Reverse geocoding (mock implementation)
  async reverseGeocode(coordinates) {
    // In real implementation, this would call a geocoding API
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
    
    const barangays = [
      'Atulayan Norte', 'Atulayan Sur', 'Bagay', 'Buntun', 'Caggay',
      'Caritan Centro', 'Centro 1', 'Centro 2', 'Centro 3', 'Centro 4',
      'Centro 5', 'Centro 6', 'Centro 7', 'Centro 8', 'Centro 9',
      'Centro 10', 'Dadda', 'Gosi Norte', 'Gosi Sur', 'Larion Alto'
    ];
    
    const randomBarangay = barangays[Math.floor(Math.random() * barangays.length)];
    return `${randomBarangay}, Tuguegarao City, Cagayan, Philippines`;
  }

  // Forward geocoding (mock implementation)
  async geocode(address) {
    // In real implementation, this would call a geocoding API
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
    
    if (address.toLowerCase().includes('tuguegarao')) {
      return this.getMockLocation().coordinates;
    }
    
    return null;
  }
}

// Export singleton instance
export const geoService = new GeoService();
export default geoService;