import { Notification, NotificationData, NotificationCondition } from '../src/models/Notification';

describe('Notification Model', () => {
  let notificationData: NotificationData;

  beforeEach(() => {
    notificationData = {
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

  test('should create a Notification instance with correct properties', () => {
    const notification = new Notification(notificationData);

    expect(notification.id).toBe('notif_1');
    expect(notification.locationId).toBe('loc_1');
    expect(notification.locationName).toBe('London');
    expect(notification.enabled).toBe(true);
    expect(notification.conditions.length).toBe(1);
  });

  test('should add a condition', () => {
    const notification = new Notification(notificationData);
    const newCondition: NotificationCondition = {
      type: 'humidity',
      operator: 'less',
      threshold: 50
    };

    notification.addCondition(newCondition);

    expect(notification.conditions.length).toBe(2);
    expect(notification.conditions[1]).toEqual(newCondition);
  });

  test('should remove a condition by index', () => {
    const notification = new Notification(notificationData);
    notification.addCondition({
      type: 'humidity',
      operator: 'less',
      threshold: 50
    });

    notification.removeCondition(0);

    expect(notification.conditions.length).toBe(1);
    expect(notification.conditions[0].type).toBe('humidity');
  });

  test('should not remove condition with invalid index', () => {
    const notification = new Notification(notificationData);
    const initialLength = notification.conditions.length;

    notification.removeCondition(999);

    expect(notification.conditions.length).toBe(initialLength);
  });

  test('should enable notification', () => {
    const disabledData: NotificationData = { ...notificationData, enabled: false };
    const notification = new Notification(disabledData);

    notification.enable();

    expect(notification.enabled).toBe(true);
  });

  test('should disable notification', () => {
    const notification = new Notification(notificationData);

    notification.disable();

    expect(notification.enabled).toBe(false);
  });

  test('should toggle notification state', () => {
    const notification = new Notification(notificationData);
    const initialState = notification.enabled;

    notification.toggle();

    expect(notification.enabled).toBe(!initialState);

    notification.toggle();

    expect(notification.enabled).toBe(initialState);
  });

  test('should trigger for temperature greater than threshold', () => {
    const notification = new Notification(notificationData);

    const shouldTrigger = notification.shouldTrigger('temperature', '30');

    expect(shouldTrigger).toBe(true);
  });

  test('should not trigger for temperature less than threshold', () => {
    const notification = new Notification(notificationData);

    const shouldTrigger = notification.shouldTrigger('temperature', '20');

    expect(shouldTrigger).toBe(false);
  });

  test('should trigger for weather condition match', () => {
    const weatherConditionData: NotificationData = {
      ...notificationData,
      conditions: [
        {
          type: 'weatherCondition',
          value: 'Rainy'
        }
      ]
    };
    const notification = new Notification(weatherConditionData);

    const shouldTrigger = notification.shouldTrigger('weatherCondition', 'Rainy');

    expect(shouldTrigger).toBe(true);
  });

  test('should not trigger for disabled notification', () => {
    const disabledData: NotificationData = { ...notificationData, enabled: false };
    const notification = new Notification(disabledData);

    const shouldTrigger = notification.shouldTrigger('temperature', '30');

    expect(shouldTrigger).toBe(false);
  });

  test('should not trigger when condition type does not match', () => {
    const notification = new Notification(notificationData);

    const shouldTrigger = notification.shouldTrigger('humidity', '60');

    expect(shouldTrigger).toBe(false);
  });

  test('should return correct summary', () => {
    const notification = new Notification(notificationData);

    const summary = notification.getSummary();

    expect(summary).toContain('London');
    expect(summary).toContain('1 condition(s)');
    expect(summary).toContain('enabled');
  });

  test('should show disabled status in summary', () => {
    const disabledData: NotificationData = { ...notificationData, enabled: false };
    const notification = new Notification(disabledData);

    const summary = notification.getSummary();

    expect(summary).toContain('disabled');
  });

  test('should trigger for humidity less than threshold', () => {
    const humidityData: NotificationData = {
      ...notificationData,
      conditions: [
        {
          type: 'humidity',
          operator: 'less',
          threshold: 50
        }
      ]
    };
    const notification = new Notification(humidityData);

    const shouldTrigger = notification.shouldTrigger('humidity', '40');

    expect(shouldTrigger).toBe(true);
  });

  test('should trigger for equal value', () => {
    const equalData: NotificationData = {
      ...notificationData,
      conditions: [
        {
          type: 'temperature',
          operator: 'equal',
          threshold: 25
        }
      ]
    };
    const notification = new Notification(equalData);

    const shouldTrigger = notification.shouldTrigger('temperature', '25');

    expect(shouldTrigger).toBe(true);
  });
});
