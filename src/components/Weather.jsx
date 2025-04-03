import React, { useState, useEffect, useCallback } from 'react';
import './Weather.css';
import search from '../assets/search.png';
import drizzle from '../assets/drizzle.png';
import humidityIcon from '../assets/humidity.png';
import clear from '../assets/clear.png';
import rain from '../assets/rain.png';
import snow from '../assets/snow.png';
import windIcon from '../assets/wind.png';

const Weather = () => {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState({
    temp: null,
    humidity: null,
    wind: null,
    icon: clear,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [placeholder, setPlaceholder] = useState("Type City...");

  const fetchWeather = useCallback(async (cityName) => {
    if (!cityName) return;
    setLoading(true);
    setError(null);

    try {
      const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${cityName}&count=1`);
      const geoData = await geoRes.json();
      if (!geoData.results) {
        setError('City not found');
        setLoading(false);
        return;
      }

      const { latitude, longitude } = geoData.results[0];

      const [weatherRes] = await Promise.all([
        fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m`),
      ]);

      const weatherData = await weatherRes.json();
      setWeather({
        temp: weatherData.current.temperature_2m,
        humidity: weatherData.current.relative_humidity_2m,
        wind: weatherData.current.wind_speed_10m,
        icon: getWeatherIcon(weatherData.current.temperature_2m),
      });

    } catch (err) {
      setError('Failed to fetch weather');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const delay = setTimeout(() => {
      if (city) fetchWeather(city);
    }, 500);
    
    return () => clearTimeout(delay); 
  }, [city, fetchWeather]);

  useEffect(() => {
    const placeholders = ["Type City...", "Search City...", "Enter City..."];
    let i = 0;
    const interval = setInterval(() => {
      setPlaceholder(placeholders[i]);
      i = (i + 1) % placeholders.length;
    }, 2000);
    
    return () => clearInterval(interval);
  }, []);

  const getWeatherIcon = (temp) => {
    if (temp < 0) return snow;
    if (temp < 15) return drizzle;
    if (temp < 25) return clear;
    return rain;
  };

  return (
    <div className='weather'>
      <div className='search-bar'>
        <input
          type="text"
          placeholder={placeholder}
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <img src={search} alt="Search" onClick={() => fetchWeather(city)} />
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="loader"></div>
          <p className="loading-text">Fetching Weather...</p>
        </div>
      ) : error ? (
        <p className="error">{error}</p>
      ) : (
        <>
          <img src={weather.icon} className='weather-icon' alt="Weather Icon" />
          <p className='temp'>{weather.temp ? `${weather.temp}°C` : '--'}</p>
          <p className='loc'>{city || "City"}</p>

          <div className="weather-data">
            <div className="col">
              <img src={humidityIcon} alt="Humidity" />
              <div>
                <p>{weather.humidity ? `${weather.humidity}%` : '--'}</p>
                <span>Humidity</span>
              </div>
            </div>

            <div className="col">
              <img src={windIcon} alt="Wind Speed" />
              <div>
                <p>{weather.wind ? `${weather.wind} km/h` : '--'}</p>
                <span>Wind Speed</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Weather;
