/**
 * Location Model
 * Represents a geographic location
 */

export interface LocationData {
  id: string;
  name: string;
  country: string;
  latitude: number;
  longitude: number;
  state?: string;
}

export class Location {
  public id: string;
  public name: string;
  public country: string;
  public latitude: number;
  public longitude: number;
  public state?: string;

  constructor(data: LocationData) {
    this.id = data.id;
    this.name = data.name;
    this.country = data.country;
    this.latitude = data.latitude;
    this.longitude = data.longitude;
    this.state = data.state;
  }

  /**
   * Get full location name
   */
  public getFullName(): string {
    let fullName = this.name;
    if (this.state) {
      fullName += `, ${this.state}`;
    }
    fullName += `, ${this.country}`;
    return fullName;
  }

  /**
   * Get coordinates as string
   */
  public getCoordinates(): string {
    return `${this.latitude.toFixed(4)}, ${this.longitude.toFixed(4)}`;
  }

  /**
   * Check if location is valid
   */
  public isValid(): boolean {
    return (
      this.name.length > 0 &&
      this.country.length > 0 &&
      this.latitude >= -90 &&
      this.latitude <= 90 &&
      this.longitude >= -180 &&
      this.longitude <= 180
    );
  }

  /**
   * Calculate distance between two locations in kilometers
   */
  public calculateDistance(other: Location): number {
    const R = 6371; // Earth's radius in km
    const dLat = ((other.latitude - this.latitude) * Math.PI) / 180;
    const dLon = ((other.longitude - this.longitude) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((this.latitude * Math.PI) / 180) *
        Math.cos((other.latitude * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }
}
