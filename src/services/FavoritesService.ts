/**
 * Favorites Service
 * Manages favorite locations
 */

import { Location } from '../models/Location';

export class FavoritesService {
  private favorites: Map<string, Location>;
  private storageKey: string = 'weatherapp_favorites';

  constructor() {
    this.favorites = new Map();
    this.loadFromStorage();
  }

  /**
   * Add location to favorites
   */
  public addFavorite(location: Location): boolean {
    if (!location.isValid()) {
      return false;
    }

    if (this.favorites.has(location.id)) {
      return false;
    }

    this.favorites.set(location.id, location);
    this.saveToStorage();
    return true;
  }

  /**
   * Remove location from favorites
   */
  public removeFavorite(locationId: string): boolean {
    const removed = this.favorites.delete(locationId);
    if (removed) {
      this.saveToStorage();
    }
    return removed;
  }

  /**
   * Get all favorites
   */
  public getAllFavorites(): Location[] {
    return Array.from(this.favorites.values());
  }

  /**
   * Get favorite by ID
   */
  public getFavorite(locationId: string): Location | undefined {
    return this.favorites.get(locationId);
  }

  /**
   * Check if location is favorite
   */
  public isFavorite(locationId: string): boolean {
    return this.favorites.has(locationId);
  }

  /**
   * Get number of favorites
   */
  public getFavoriteCount(): number {
    return this.favorites.size;
  }

  /**
   * Clear all favorites
   */
  public clearAll(): void {
    this.favorites.clear();
    this.saveToStorage();
  }

  /**
   * Save favorites to local storage
   */
  private saveToStorage(): void {
    try {
      const data = Array.from(this.favorites.values()).map((location) => ({
        id: location.id,
        name: location.name,
        country: location.country,
        latitude: location.latitude,
        longitude: location.longitude,
        state: location.state
      }));
      localStorage.setItem(this.storageKey, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save favorites to storage:', error);
    }
  }

  /**
   * Load favorites from local storage
   */
  private loadFromStorage(): void {
    try {
      const data = localStorage.getItem(this.storageKey);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed)) {
          parsed.forEach((item) => {
            const location = new Location(item);
            this.favorites.set(location.id, location);
          });
        }
      }
    } catch (error) {
      console.error('Failed to load favorites from storage:', error);
    }
  }
}
