// Select DOM elements
const cityInput = document.querySelector(".city-input");
const searchButton = document.querySelector(".search-btn");
const locationButton = document.querySelector(".location-btn");
const currentWeatherDiv = document.querySelector(".current-weather");
const weatherCardsDiv = document.querySelector(".weather-cards");

const API_KEY = "5d06eb37590d61c048926d8d37b513ac"; // Replace with your OpenWeatherMap API key

let cityDetails = {}; // To store city name and coordinates for the report

// Initialize Leaflet map
const map = L.map('map').setView([11.1271, 78.6569], 13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
}).addTo(map);
let marker;

// Function to create weather card HTML
const createWeatherCard = (cityName, weatherItem, index) => {
  if (index === 0) {
    return `<div class="details" style="display: flex; align-items: center; justify-content: space-between;">
  <div>
    <h2>${cityName} (${weatherItem.dt_txt.split(" ")[0]})</h2>
    <h6>Temperature: ${weatherItem.main.temp}°C</h6>
    <h6>Wind: ${weatherItem.wind.speed} M/S</h6>
    <h6>Humidity: ${weatherItem.main.humidity}%</h6>
  </div>
  <div>
    <img src="http://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@2x.png" style="max-width: 100px; margin-left: 10%;">
  </div>
</div>
`;
  }

  return `<li class="card">
            <h3>${weatherItem.dt_txt.split(" ")[0]}</h3>
            <img src="http://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@2x.png">
            <h4>${weatherItem.main.temp}°C</h4>
            <h4>${weatherItem.wind.speed} M/S</h4>
            <h4>${weatherItem.main.humidity}%</h4>
          </li>`;
};

// Function to create a popup with temperature information
const createPopupContent = (cityName, temp) => {
    return `<b>${cityName}</b><br>Temperature: ${temp}°C`;
  };
  
  // Modify the fetchWeatherDataByCity function
  const fetchWeatherDataByCity = async (city) => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${API_KEY}`
      );
      const data = await response.json();
      if (data.cod !== "200") {
        alert("City not found");
        return;
      }
      const { city: { name, coord }, list } = data;
      const currentTemp = list[0].main.temp; // Get the current temperature
      cityDetails = { name, coord };
      localStorage.setItem('cityDetails', JSON.stringify(cityDetails)); // Store city details in local storage
      map.setView([coord.lat, coord.lon], 13);
      if (marker) map.removeLayer(marker);
      marker = L.marker([coord.lat, coord.lon]).addTo(map);
      marker.bindPopup(createPopupContent(name, currentTemp)).openPopup(); // Bind and display the popup
      displayWeatherData(name, list);
    } catch (error) {
      alert("Failed to fetch weather data");
    }
  };
  
  // Modify the fetchWeatherDataByCoords function similarly
  const fetchWeatherDataByCoords = async (lat, lon) => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
      );
      const data = await response.json();
      if (data.cod !== "200") {
        alert("Location not found");
        return;
      }
      const { city: { name, coord }, list } = data;
      const currentTemp = list[0].main.temp; // Get the current temperature
      cityDetails = { name, coord };
      localStorage.setItem('cityDetails', JSON.stringify(cityDetails)); // Store city details in local storage
      map.setView([coord.lat, coord.lon], 13);
      if (marker) map.removeLayer(marker);
      marker = L.marker([coord.lat, coord.lon]).addTo(map);
      marker.bindPopup(createPopupContent(name, currentTemp)).openPopup(); // Bind and display the popup
      displayWeatherData(name, list);
    } catch (error) {
      alert("Failed to fetch weather data");
    }
  };
  
// Function to display weather data
const displayWeatherData = (city, weatherList) => {
  currentWeatherDiv.innerHTML = "";
  weatherCardsDiv.innerHTML = "";

  // Filter to get weather data for five unique days
  const uniqueForecastDays = [];
  const fiveDaysForecast = weatherList.filter((forecast) => {
    const forecastDate = new Date(forecast.dt_txt).getDate();
    if (!uniqueForecastDays.includes(forecastDate)) {
      uniqueForecastDays.push(forecastDate);
      return true;
    }
    return false;
  }).slice(0, 6); // Ensure we get exactly five days

  fiveDaysForecast.forEach((weatherItem, index) => {
    if (index === 0) {
      currentWeatherDiv.innerHTML = createWeatherCard(city, weatherItem, index);
    } else {
      weatherCardsDiv.innerHTML += createWeatherCard(city, weatherItem, index);
    }
  });
};

// Event listeners
searchButton.addEventListener("click", () => {
  const city = cityInput.value.trim();
  if (city) fetchWeatherDataByCity(city);
});

locationButton.addEventListener("click", () => {
  navigator.geolocation.getCurrentPosition(
    ({ coords }) => fetchWeatherDataByCoords(coords.latitude, coords.longitude),
    () => alert("Unable to retrieve your location")
  );
});

// Function to navigate to the report page
const navigateToReport = () => {
  const { name, coord } = cityDetails;
  if (name && coord) {
    window.location.href = `report?name=${name}&lat=${coord.lat}&lon=${coord.lon}`;
  } else {
    alert("Please fetch weather data before viewing the report.");
  }
};
