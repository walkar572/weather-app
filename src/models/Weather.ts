/**
 * Weather Model
 * Defines the structure of weather data from the API
 */

export interface WeatherCondition {
  id: number;
  main: string;
  description: string;
  icon: string;
}

export interface WeatherData {
  temperature: number;
  feelsLike: number;
  tempMin: number;
  tempMax: number;
  pressure: number;
  humidity: number;
  visibility: number;
  windSpeed: number;
  windDegree: number;
  cloudiness: number;
  weatherCondition: WeatherCondition;
  description: string;
  timestamp: number;
}

export interface ForecastItem {
  timestamp: number;
  temperature: number;
  humidity: number;
  weatherCondition: WeatherCondition;
  description: string;
}

export class Weather {
  public temperature: number;
  public feelsLike: number;
  public tempMin: number;
  public tempMax: number;
  public pressure: number;
  public humidity: number;
  public visibility: number;
  public windSpeed: number;
  public windDegree: number;
  public cloudiness: number;
  public weatherCondition: WeatherCondition;
  public description: string;
  public timestamp: number;

  constructor(data: WeatherData) {
    this.temperature = data.temperature;
    this.feelsLike = data.feelsLike;
    this.tempMin = data.tempMin;
    this.tempMax = data.tempMax;
    this.pressure = data.pressure;
    this.humidity = data.humidity;
    this.visibility = data.visibility;
    this.windSpeed = data.windSpeed;
    this.windDegree = data.windDegree;
    this.cloudiness = data.cloudiness;
    this.weatherCondition = data.weatherCondition;
    this.description = data.description;
    this.timestamp = data.timestamp;
  }

  /**
   * Get temperature in Celsius
   */
  public getTemperatureCelsius(): number {
    return Math.round(this.temperature * 10) / 10;
  }

  /**
   * Get temperature in Fahrenheit
   */
  public getTemperatureFahrenheit(): number {
    const fahrenheit = (this.temperature * 9) / 5 + 32;
    return Math.round(fahrenheit * 10) / 10;
  }

  /**
   * Get formatted weather summary
   */
  public getSummary(): string {
    return `${this.description} - ${this.getTemperatureCelsius()}°C, Humidity: ${this.humidity}%`;
  }

  /**
   * Check if weather is extreme
   */
  public isExtreme(): boolean {
    return (
      this.temperature < -10 ||
      this.temperature > 40 ||
      this.windSpeed > 20 ||
      this.weatherCondition.main === 'Storm'
    );
  }
}
