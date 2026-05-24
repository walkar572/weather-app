import { NotificationService, NotificationMessage } from '../src/services/NotificationService';
import { Notification, NotificationData } from '../src/models/Notification';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string): string | null => store[key] || null,
    setItem: (key: string, value: string): void => {
      store[key] = value.toString();
    },
    removeItem: (key: string): void => {
      delete store[key];
    },
    clear: (): void => {
      store = {};
    }
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

describe('NotificationService', () => {
  let notificationService: NotificationService;
  let testNotificationData: NotificationData;

  beforeEach(() => {
    localStorage.clear();
    notificationService = new NotificationService();

    testNotificationData = {
      id: 'notif_1',
      locationId: 'loc_1',
      locationName: 'London',
      conditions: [
        {
          type: 'temperature',
          operator: 'greater',
          threshold: 25
        }
      ],
      enabled: true,
      createdAt: Date.now()
    };
  });

  test('should create a notification', () => {
    const notification = notificationService.createNotification(testNotificationData);

    expect(notification.id).toBe('notif_1');
    expect(notification.locationName).toBe('London');
  });

  test('should get notification by ID', () => {
    notificationService.createNotification(testNotificationData);

    const notification = notificationService.getNotification('notif_1');

    expect(notification).toBeDefined();
    expect(notification?.locationName).toBe('London');
  });

  test('should return undefined for non-existent notification', () => {
    const notification = notificationService.getNotification('non_existent');

    expect(notification).toBeUndefined();
  });

  test('should get all notifications', () => {
    notificationService.createNotification(testNotificationData);

    const data2: NotificationData = {
      ...testNotificationData,
      id: 'notif_2',
      locationName: 'Paris'
    };
    notificationService.createNotification(data2);

    const notifications = notificationService.getAllNotifications();

    expect(notifications.length).toBe(2);
  });

  test('should get notifications for specific location', () => {
    notificationService.createNotification(testNotificationData);

    const data2: NotificationData = {
      ...testNotificationData,
      id: 'notif_2',
      locationId: 'loc_2'
    };
    notificationService.createNotification(data2);

    const locationNotifications = notificationService.getNotificationsForLocation('loc_1');

    expect(locationNotifications.length).toBe(1);
    expect(locationNotifications[0].id).toBe('notif_1');
  });

  test('should update notification', () => {
    const notification = notificationService.createNotification(testNotificationData);

    notification.disable();
    const result = notificationService.updateNotification(notification);

    expect(result).toBe(true);
    const updated = notificationService.getNotification('notif_1');
    expect(updated?.enabled).toBe(false);
  });

  test('should not update non-existent notification', () => {
    const fakeNotification = new Notification(testNotificationData);

    const result = notificationService.updateNotification(fakeNotification);

    expect(result).toBe(false);
  });

  test('should remove notification', () => {
    notificationService.createNotification(testNotificationData);

    const result = notificationService.removeNotification('notif_1');

    expect(result).toBe(true);
    expect(notificationService.getNotification('notif_1')).toBeUndefined();
  });

  test('should not remove non-existent notification', () => {
    const result = notificationService.removeNotification('non_existent');

    expect(result).toBe(false);
  });

  test('should subscribe to notifications', (done) => {
    const callback = (message: NotificationMessage): void => {
      expect(message.locationName).toBe('London');
      done();
    };

    notificationService.subscribe(callback);
    notificationService.createNotification(testNotificationData);

    // Manually trigger a notification for testing
    setTimeout((): void => {
      callback({
        id: 'notif_1',
        locationName: 'London',
        message: 'Test',
        timestamp: Date.now()
      });
    }, 0);
  });

  test('should unsubscribe from notifications', () => {
    let callCount = 0;
    const callback = (): void => {
      callCount++;
    };

    notificationService.subscribe(callback);
    notificationService.unsubscribe(callback);

    expect(callCount).toBe(0);
  });

  test('should persist notifications to localStorage', () => {
    notificationService.createNotification(testNotificationData);

    const stored = localStorage.getItem('weatherapp_notifications');

    expect(stored).not.toBeNull();
    expect(stored).toContain('London');
  });

  test('should load notifications from localStorage', () => {
    notificationService.createNotification(testNotificationData);

    const newService = new NotificationService();

    expect(newService.getAllNotifications().length).toBe(1);
    expect(newService.getNotification('notif_1')).toBeDefined();
  });

  test('should handle empty localStorage', () => {
    const newService = new NotificationService();

    expect(newService.getAllNotifications().length).toBe(0);
  });
});