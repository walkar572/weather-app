import { Weather, WeatherData, WeatherCondition } from '../src/models/Weather';

describe('Weather Model', () => {
  let weatherData: WeatherData;

  beforeEach(() => {
    weatherData = {
      temperature: 25,
      feelsLike: 26,
      tempMin: 20,
      tempMax: 30,
      pressure: 1013,
      humidity: 65,
      visibility: 10000,
      windSpeed: 5,
      windDegree: 180,
      cloudiness: 50,
      weatherCondition: {
        id: 800,
        main: 'Clear',
        description: 'clear sky',
        icon: '01d'
      },
      description: 'Clear',
      timestamp: Math.floor(Date.now() / 1000)
    };
  });

  test('should create a Weather instance with correct properties', () => {
    const weather = new Weather(weatherData);

    expect(weather.temperature).toBe(25);
    expect(weather.humidity).toBe(65);
    expect(weather.windSpeed).toBe(5);
    expect(weather.description).toBe('Clear');
  });

  test('should calculate Celsius temperature correctly', () => {
    const weather = new Weather(weatherData);
    expect(weather.getTemperatureCelsius()).toBe(25);
  });

  test('should calculate Fahrenheit temperature correctly', () => {
    const weather = new Weather(weatherData);
    const fahrenheit = weather.getTemperatureFahrenheit();
    expect(fahrenheit).toBeCloseTo(77, 0);
  });

  test('should return correct temperature summary', () => {
    const weather = new Weather(weatherData);
    const summary = weather.getSummary();

    expect(summary).toContain('25°C');
    expect(summary).toContain('65%');
    expect(summary).toContain('clear sky');
  });

  test('should identify extreme weather conditions', () => {
    const extremeColdData: WeatherData = { ...weatherData, temperature: -15 };
    const coldWeather = new Weather(extremeColdData);
    expect(coldWeather.isExtreme()).toBe(true);

    const extremeHotData: WeatherData = { ...weatherData, temperature: 45 };
    const hotWeather = new Weather(extremeHotData);
    expect(hotWeather.isExtreme()).toBe(true);

    const strongWindData: WeatherData = { ...weatherData, windSpeed: 25 };
    const windyWeather = new Weather(strongWindData);
    expect(windyWeather.isExtreme()).toBe(true);

    const normalWeather = new Weather(weatherData);
    expect(normalWeather.isExtreme()).toBe(false);
  });

  test('should handle zero temperature', () => {
    const zeroTempData: WeatherData = { ...weatherData, temperature: 0 };
    const weather = new Weather(zeroTempData);

    expect(weather.getTemperatureCelsius()).toBe(0);
    expect(weather.getTemperatureFahrenheit()).toBe(32);
  });

  test('should handle negative temperature', () => {
    const negativeTempData: WeatherData = { ...weatherData, temperature: -10 };
    const weather = new Weather(negativeTempData);

    expect(weather.getTemperatureCelsius()).toBe(-10);
    expect(weather.getTemperatureFahrenheit()).toBeCloseTo(14, 0);
  });

  test('should round temperature values correctly', () => {
    const preciseData: WeatherData = { ...weatherData, temperature: 25.567 };
    const weather = new Weather(preciseData);

    expect(weather.getTemperatureCelsius()).toBe(25.6);
  });

  test('should handle extreme weather with storm condition', () => {
    const stormData: WeatherData = {
      ...weatherData,
      weatherCondition: {
        id: 211,
        main: 'Storm',
        description: 'thunderstorm',
        icon: '11d'
      }
    };
    const stormWeather = new Weather(stormData);
    expect(stormWeather.isExtreme()).toBe(true);
  });
});
