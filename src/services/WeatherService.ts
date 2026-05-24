/**
 * Weather Service
 * Handles weather data fetching from OpenWeatherMap API
 */

import { Weather, WeatherData, ForecastItem } from '../models/Weather';
import { Location, LocationData } from '../models/Location';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export class WeatherService {
  private apiKey: string;
  private baseUrl: string = 'https://api.openweathermap.org';
  private static readonly REQUEST_TIMEOUT = 5000;

  constructor(apiKey: string) {
    if (!apiKey || apiKey.trim().length === 0) {
      throw new Error('API key is required');
    }
    this.apiKey = apiKey;
  }

  /**
   * Search locations by city name
   */
  public async searchLocations(
    cityName: string
  ): Promise<ApiResponse<Location[]>> {
    if (!cityName || cityName.trim().length === 0) {
      return { success: false, error: 'City name cannot be empty' };
    }

    try {
      const url = `${this.baseUrl}/geo/1.0/direct?q=${encodeURIComponent(
        cityName
      )}&limit=5&appid=${this.apiKey}`;

      const response = await this.fetchWithTimeout(url);
      const data = await response.json();

      if (!Array.isArray(data)) {
        return { success: false, error: 'Invalid response format' };
      }

      const locations = data.map(
        (item: {
          name: string;
          country: string;
          lat: number;
          lon: number;
          state?: string;
        }): Location => {
          const locationData: LocationData = {
            id: `${item.lat}-${item.lon}`,
            name: item.name,
            country: item.country,
            latitude: item.lat,
            longitude: item.lon,
            state: item.state
          };
          return new Location(locationData);
        }
      );

      return { success: true, data: locations };
    } catch (error) {
      return {
        success: false,
        error: `Failed to search locations: ${this.getErrorMessage(error)}`
      };
    }
  }

  /**
   * Get current weather by location
   */
  public async getCurrentWeather(
    location: Location
  ): Promise<ApiResponse<Weather>> {
    try {
      const url = `${this.baseUrl}/data/2.5/weather?lat=${location.latitude}&lon=${location.longitude}&units=metric&appid=${this.apiKey}`;

      const response = await this.fetchWithTimeout(url);
      const data = await response.json();

      if (data.cod && data.cod !== 200) {
        return { success: false, error: data.message || 'Weather data not found' };
      }

      const weatherData: WeatherData = {
        temperature: data.main.temp,
        feelsLike: data.main.feels_like,
        tempMin: data.main.temp_min,
        tempMax: data.main.temp_max,
        pressure: data.main.pressure,
        humidity: data.main.humidity,
        visibility: data.visibility,
        windSpeed: data.wind.speed,
        windDegree: data.wind.deg || 0,
        cloudiness: data.clouds.all,
        weatherCondition: {
          id: data.weather[0].id,
          main: data.weather[0].main,
          description: data.weather[0].description,
          icon: data.weather[0].icon
        },
        description: data.weather[0].main,
        timestamp: data.dt
      };

      const weather = new Weather(weatherData);
      return { success: true, data: weather };
    } catch (error) {
      return {
        success: false,
        error: `Failed to fetch weather: ${this.getErrorMessage(error)}`
      };
    }
  }

  /**
   * Get weather forecast for a location
   */
  public async getForecast(
    location: Location
  ): Promise<ApiResponse<ForecastItem[]>> {
    try {
      const url = `${this.baseUrl}/data/2.5/forecast?lat=${location.latitude}&lon=${location.longitude}&units=metric&appid=${this.apiKey}`;

      const response = await this.fetchWithTimeout(url);
      const data = await response.json();

      if (data.cod && data.cod !== 200) {
        return { success: false, error: data.message || 'Forecast not found' };
      }

      const forecast: ForecastItem[] = data.list
        .slice(0, 8)
        .map(
          (item: {
            dt: number;
            main: { temp: number; humidity: number };
            weather: Array<{
              id: number;
              main: string;
              description: string;
              icon: string;
            }>;
          }): ForecastItem => ({
            timestamp: item.dt,
            temperature: item.main.temp,
            humidity: item.main.humidity,
            weatherCondition: {
              id: item.weather[0].id,
              main: item.weather[0].main,
              description: item.weather[0].description,
              icon: item.weather[0].icon
            },
            description: item.weather[0].main
          })
        );

      return { success: true, data: forecast };
    } catch (error) {
      return {
        success: false,
        error: `Failed to fetch forecast: ${this.getErrorMessage(error)}`
      };
    }
  }

  /**
   * Validate API key
   */
  public async validateApiKey(): Promise<boolean> {
    try {
      const url = `${this.baseUrl}/data/2.5/weather?q=London&appid=${this.apiKey}`;
      const response = await this.fetchWithTimeout(url);
      return response.ok;
    } catch {
      return false;
    }
  }

  /**
   * Fetch with timeout
   */
  private async fetchWithTimeout(url: string): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(
      () => controller.abort(),
      WeatherService.REQUEST_TIMEOUT
    );

    try {
      const response = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  /**
   * Get error message from various error types
   */
  private getErrorMessage(error: unknown): string {
    if (error instanceof Error) {
      return error.message;
    }
    return String(error);
  }
}
