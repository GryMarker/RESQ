// Real-time service for RESQ-LINK
// Mock implementation that simulates WebSocket connections

class RealtimeService {
  constructor() {
    this.subscribers = new Map();
    this.intervalId = null;
    this.isConnected = false;
    this.initializeEventTypes();
  }

  initializeEventTypes() {
    const eventTypes = [
      'incident:created',
      'incident:updated',
      'incident:status_changed',
      'responder:location_updated',
      'responder:status_changed'
    ];

    eventTypes.forEach(type => {
      this.subscribers.set(type, new Set());
    });
  }

  // Connect to real-time service
  connect() {
    return new Promise((resolve) => {
      console.log('🔌 Connecting to real-time service...');
      
      // Simulate connection delay
      setTimeout(() => {
        this.isConnected = true;
        this.startMockUpdates();
        console.log('✅ Connected to real-time service');
        resolve();
      }, 1000);
    });
  }

  // Disconnect from real-time service
  disconnect() {
    console.log('🔌 Disconnecting from real-time service...');
    this.isConnected = false;
    
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    
    console.log('❌ Disconnected from real-time service');
  }

  // Subscribe to specific event types
  subscribe(eventType, callback) {
    const subscribers = this.subscribers.get(eventType);
    if (subscribers) {
      subscribers.add(callback);
      console.log(`📡 Subscribed to ${eventType}`);
    }

    // Return unsubscribe function
    return () => {
      const subscribers = this.subscribers.get(eventType);
      if (subscribers) {
        subscribers.delete(callback);
        console.log(`📡 Unsubscribed from ${eventType}`);
      }
    };
  }

  // Subscribe to all events
  subscribeToAll(callback) {
    const unsubscribeFunctions = [];
    
    this.subscribers.forEach((_, eventType) => {
      const unsubscribe = this.subscribe(eventType, callback);
      unsubscribeFunctions.push(unsubscribe);
    });

    // Return function to unsubscribe from all
    return () => {
      unsubscribeFunctions.forEach(unsubscribe => unsubscribe());
    };
  }

  // Emit event to subscribers
  emit(eventType, data) {
    const subscribers = this.subscribers.get(eventType);
    if (subscribers && subscribers.size > 0) {
      const event = {
        type: eventType,
        data,
        timestamp: new Date()
      };

      subscribers.forEach(callback => {
        try {
          callback(event);
        } catch (error) {
          console.error(`Error in realtime callback for ${eventType}:`, error);
        }
      });
    }
  }

  // Start mock real-time updates
  startMockUpdates() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }

    // Simulate real-time updates every 10-30 seconds
    this.intervalId = window.setInterval(() => {
      this.generateMockEvent();
    }, Math.random() * 20000 + 10000); // 10-30 seconds
  }

  // Generate mock real-time events
  generateMockEvent() {
    if (!this.isConnected) return;

    const eventTypes = [
      'incident:status_changed',
      'responder:location_updated',
      'responder:status_changed'
    ];

    const randomEventType = eventTypes[Math.floor(Math.random() * eventTypes.length)];
    
    switch (randomEventType) {
      case 'incident:status_changed':
        this.emit('incident:status_changed', {
          incidentId: `INC-${String(Math.floor(Math.random() * 12) + 1).padStart(4, '0')}`,
          oldStatus: 'assigned',
          newStatus: 'en-route',
          updatedBy: 'Responder',
          timestamp: new Date()
        });
        break;

      case 'responder:location_updated':
        this.emit('responder:location_updated', {
          responderId: `RESP-${String(Math.floor(Math.random() * 20) + 1).padStart(3, '0')}`,
          location: {
            lat: 17.6132 + (Math.random() - 0.5) * 0.1,
            lng: 121.7270 + (Math.random() - 0.5) * 0.1
          },
          timestamp: new Date()
        });
        break;

      case 'responder:status_changed':
        const statuses = ['available', 'busy', 'offline'];
        this.emit('responder:status_changed', {
          responderId: `RESP-${String(Math.floor(Math.random() * 20) + 1).padStart(3, '0')}`,
          oldStatus: 'available',
          newStatus: statuses[Math.floor(Math.random() * statuses.length)],
          timestamp: new Date()
        });
        break;
    }
  }

  // Send message (for future chat functionality)
  sendMessage(channel, message) {
    return new Promise((resolve) => {
      console.log(`💬 Sending message to ${channel}:`, message);
      
      // Simulate network delay
      setTimeout(() => {
        // In real implementation, this would send via WebSocket
        resolve();
      }, 200);
    });
  }

  // Get connection status
  isConnectedToRealtime() {
    return this.isConnected;
  }

  // Get subscriber count for debugging
  getSubscriberCount(eventType) {
    if (eventType) {
      return this.subscribers.get(eventType)?.size || 0;
    }
    
    let total = 0;
    this.subscribers.forEach(subscribers => {
      total += subscribers.size;
    });
    return total;
  }
}

// Export singleton instance
export const realtimeService = new RealtimeService();
export default realtimeService;

// Auto-connect when service is imported
if (typeof window !== 'undefined') {
  // Only auto-connect in browser environment
  realtimeService.connect().catch(console.error);
}