const searchBtn = document.getElementById('searchBtn');
const cityInput = document.getElementById('cityInput');

const coordBtn = document.getElementById('coordBtn');
const latInput = document.getElementById('latInput');
const lonInput = document.getElementById('lonInput');

const cityName = document.getElementById('cityName');
const temperature = document.getElementById('temperature');
const description = document.getElementById('description');
const humidity = document.getElementById('humidity');
const wind = document.getElementById('wind');

// Fetch Weather using Latitude & Longitude directly
async function fetchWeatherByCoords(lat, lon, locationLabel = null) {
  try {
    const weatherResponse = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&relativehumidity_2m=true`);
    const weatherData = await weatherResponse.json();

    const current = weatherData.current_weather;

    // Display location name or coordinates
    cityName.textContent = locationLabel || `Lat: ${lat}, Lon: ${lon}`;
    temperature.textContent = `${Math.round(current.temperature)}°C`;
    description.textContent = getWeatherDescription(current.weathercode);
    wind.textContent = current.windspeed;
    humidity.textContent = weatherData.hourly?.relativehumidity_2m?.[0] ?? '--';

  } catch (error) {
    console.error('Error fetching weather data:', error);
    alert('Failed to fetch weather for these coordinates.');
  }
}

// Fetch Coordinates by City Name first, then get weather
async function fetchWeatherByCity(city) {
  try {
    const geoResponse = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`);
    const geoData = await geoResponse.json();

    if (!geoData.results || geoData.results.length === 0) {
      alert('City not found! Please check the spelling.');
      return;
    }

    const { latitude, longitude, name, country } = geoData.results[0];
    fetchWeatherByCoords(latitude, longitude, `${name}, ${country}`);

  } catch (error) {
    console.error('Error finding city:', error);
    alert('Error connecting to Geocoding service.');
  }
}

// Convert WMO Weather Code to human-readable text
function getWeatherDescription(code) {
  const codes = {
    0: 'Clear sky',
    1: 'Mainly clear',
    2: 'Partly cloudy',
    3: 'Overcast',
    45: 'Foggy',
    61: 'Slight rain',
    63: 'Moderate rain',
    65: 'Heavy rain',
    80: 'Rain showers',
    95: 'Thunderstorm'
  };
  return codes[code] || 'Weather updated';
}

// Option 1: City Search Listener
searchBtn.addEventListener('click', () => {
  const city = cityInput.value.trim();
  if (city) fetchWeatherByCity(city);
});

// Option 2: Latitude & Longitude Search Listener
coordBtn.addEventListener('click', () => {
  const lat = latInput.value.trim();
  const lon = lonInput.value.trim();
  if (lat && lon) {
    fetchWeatherByCoords(lat, lon);
  } else {
    alert('Please enter both Latitude and Longitude!');
  }
});
