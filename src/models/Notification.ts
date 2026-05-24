/**
 * Notification Model
 * Handles weather change notifications
 */

export type NotificationType =
  | 'temperature'
  | 'humidity'
  | 'windSpeed'
  | 'weatherCondition'
  | 'general';

export interface NotificationCondition {
  type: NotificationType;
  threshold?: number;
  operator?: 'greater' | 'less' | 'equal' | 'changed';
  value?: string;
}

export interface NotificationData {
  id: string;
  locationId: string;
  locationName: string;
  conditions: NotificationCondition[];
  enabled: boolean;
  createdAt: number;
}

export class Notification {
  public id: string;
  public locationId: string;
  public locationName: string;
  public conditions: NotificationCondition[];
  public enabled: boolean;
  public createdAt: number;

  constructor(data: NotificationData) {
    this.id = data.id;
    this.locationId = data.locationId;
    this.locationName = data.locationName;
    this.conditions = data.conditions;
    this.enabled = data.enabled;
    this.createdAt = data.createdAt;
  }

  /**
   * Add a condition to the notification
   */
  public addCondition(condition: NotificationCondition): void {
    this.conditions.push(condition);
  }

  /**
   * Remove a condition from the notification
   */
  public removeCondition(index: number): void {
    if (index >= 0 && index < this.conditions.length) {
      this.conditions.splice(index, 1);
    }
  }

  /**
   * Enable the notification
   */
  public enable(): void {
    this.enabled = true;
  }

  /**
   * Disable the notification
   */
  public disable(): void {
    this.enabled = false;
  }

  /**
   * Toggle notification state
   */
  public toggle(): void {
    this.enabled = !this.enabled;
  }

  /**
   * Check if notification should trigger based on conditions
   */
  public shouldTrigger(
    type: NotificationType,
    currentValue: number | string,
    previousValue?: number | string
  ): boolean {
    if (!this.enabled) {
      return false;
    }

    const matchingConditions = this.conditions.filter((c) => c.type === type);

    if (matchingConditions.length === 0) {
      return false;
    }

    return matchingConditions.some((condition) => {
      if (condition.type === 'weatherCondition' && condition.value) {
        return condition.value === currentValue;
      }

      if (
        condition.type === 'temperature' ||
        condition.type === 'humidity' ||
        condition.type === 'windSpeed'
      ) {
        const current = Number(currentValue);
        const threshold = condition.threshold || 0;

        switch (condition.operator) {
          case 'greater':
            return current > threshold;
          case 'less':
            return current < threshold;
          case 'equal':
            return current === threshold;
          case 'changed':
            return previousValue !== undefined && previousValue !== currentValue;
          default:
            return false;
        }
      }

      return false;
    });
  }

  /**
   * Get notification summary
   */
  public getSummary(): string {
    const conditionCount = this.conditions.length;
    const status = this.enabled ? 'enabled' : 'disabled';
    return `${this.locationName}: ${conditionCount} condition(s) - ${status}`;
  }
}
