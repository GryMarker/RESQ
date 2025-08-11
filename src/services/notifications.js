// Notifications service for RESQ-LINK
// Handles browser notifications and in-app notifications

class NotificationService {
  constructor() {
    this.notifications = [];
    this.subscribers = new Set();
    this.permission = 'default';
    this.checkPermission();
    this.loadStoredNotifications();
  }

  // Initialize and request permission
  async initialize() {
    if ('Notification' in window) {
      this.permission = await Notification.requestPermission();
      console.log('Notification permission:', this.permission);
    } else {
      console.warn('Browser notifications not supported');
    }
  }

  // Check current permission status
  checkPermission() {
    if ('Notification' in window) {
      this.permission = Notification.permission;
    }
  }

  // Show notification
  show(
    type,
    title,
    message,
    options
  ) {
    const notification = {
      id: this.generateId(),
      type,
      title,
      message,
      timestamp: new Date(),
      read: false,
      actions: options?.actions
    };

    // Add to in-app notifications
    this.notifications.unshift(notification);
    
    // Keep only last 50 notifications
    if (this.notifications.length > 50) {
      this.notifications = this.notifications.slice(0, 50);
    }

    // Save to localStorage if persistent
    if (options?.persistent !== false) {
      this.saveNotifications();
    }

    // Notify subscribers
    this.notifySubscribers(notification);

    // Show browser notification if requested and permitted
    if (options?.showBrowser !== false && this.permission === 'granted') {
      this.showBrowserNotification(notification);
    }

    return notification.id;
  }

  // Show browser notification
  showBrowserNotification(notification) {
    if (!('Notification' in window) || this.permission !== 'granted') {
      return;
    }

    const browserNotification = new Notification(notification.title, {
      body: notification.message,
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      tag: notification.id,
      requireInteraction: notification.type === 'error',
      silent: notification.type === 'info'
    });

    // Auto-close after 5 seconds for non-error notifications
    if (notification.type !== 'error') {
      setTimeout(() => {
        browserNotification.close();
      }, 5000);
    }

    // Handle click
    browserNotification.onclick = () => {
      window.focus();
      this.markAsRead(notification.id);
      browserNotification.close();
    };
  }

  // Convenience methods for different notification types
  info(title, message, options) {
    return this.show('info', title, message, options);
  }

  success(title, message, options) {
    return this.show('success', title, message, options);
  }

  warning(title, message, options) {
    return this.show('warning', title, message, options);
  }

  error(title, message, options) {
    return this.show('error', title, message, { ...options, showBrowser: true });
  }

  // Subscribe to notifications
  subscribe(callback) {
    this.subscribers.add(callback);
    
    // Return unsubscribe function
    return () => {
      this.subscribers.delete(callback);
    };
  }

  // Notify all subscribers
  notifySubscribers(notification) {
    this.subscribers.forEach(callback => {
      try {
        callback(notification);
      } catch (error) {
        console.error('Error in notification callback:', error);
      }
    });
  }

  // Get all notifications
  getAll() {
    return [...this.notifications];
  }

  // Get unread notifications
  getUnread() {
    return this.notifications.filter(n => !n.read);
  }

  // Get unread count
  getUnreadCount() {
    return this.notifications.filter(n => !n.read).length;
  }

  // Mark notification as read
  markAsRead(id) {
    const notification = this.notifications.find(n => n.id === id);
    if (notification && !notification.read) {
      notification.read = true;
      this.saveNotifications();
      this.notifySubscribers(notification);
    }
  }

  // Mark all as read
  markAllAsRead() {
    let hasChanges = false;
    this.notifications.forEach(notification => {
      if (!notification.read) {
        notification.read = true;
        hasChanges = true;
      }
    });

    if (hasChanges) {
      this.saveNotifications();
      // Notify subscribers about the change
      this.subscribers.forEach(callback => {
        this.notifications.forEach(n => callback(n));
      });
    }
  }

  // Remove notification
  remove(id) {
    const index = this.notifications.findIndex(n => n.id === id);
    if (index !== -1) {
      this.notifications.splice(index, 1);
      this.saveNotifications();
    }
  }

  // Clear all notifications
  clear() {
    this.notifications = [];
    this.saveNotifications();
  }

  // Generate unique ID
  generateId() {
    return `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Save notifications to localStorage
  saveNotifications() {
    try {
      const data = this.notifications.map(n => ({
        ...n,
        timestamp: n.timestamp.toISOString(),
        // Don't save actions as they contain functions
        actions: undefined
      }));
      localStorage.setItem('resq_notifications', JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save notifications:', error);
    }
  }

  // Load notifications from localStorage
  loadStoredNotifications() {
    try {
      const stored = localStorage.getItem('resq_notifications');
      if (stored) {
        const data = JSON.parse(stored);
        this.notifications = data.map((n) => ({
          ...n,
          timestamp: new Date(n.timestamp)
        }));
      }
    } catch (error) {
      console.error('Failed to load stored notifications:', error);
      this.notifications = [];
    }
  }

  // Get permission status
  getPermission() {
    return this.permission;
  }

  // Check if browser notifications are supported
  isSupported() {
    return 'Notification' in window;
  }

  // Show incident-specific notifications
  showIncidentNotification(incidentId, status, message) {
    const title = `Incident ${incidentId}`;
    const type = status === 'resolved' ? 'success' : 'info';
    
    this.show(type, title, message, {
      actions: [
        {
          label: 'View Details',
          action: () => {
            // Navigate to incident detail
            window.location.href = `/incidents/${incidentId}`;
          },
          variant: 'primary'
        }
      ]
    });
  }

  // Show responder notifications
  showResponderNotification(responderName, status) {
    const title = 'Responder Update';
    const message = `${responderName} is now ${status}`;
    const type = status === 'available' ? 'success' : 'warning';
    
    this.show(type, title, message);
  }
}

// Export singleton instance
export const notificationService = new NotificationService();
export default notificationService;

// Auto-initialize when service is imported
if (typeof window !== 'undefined') {
  notificationService.initialize().catch(console.error);
}