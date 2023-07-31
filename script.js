// Global variables:
const apiKey = "ff576f6a22b039eee154bb1c12713139";
const form = document.querySelector("#search-form");
const input = document.querySelector("#city-input");
const currentWeatherContainer = document.querySelector(
  "#current-weather-container"
);
const forecastContainer = document.querySelector("#forecast-container");
const searchHistoryContainer = document.querySelector(
  "#search-history-container"
);

form.addEventListener("submit", function (event) {
  event.preventDefault();
  const cityName = input.value.trim();
  input.value = "";
  getWeatherData(cityName);
});

function kelvinToFahrenheit(kelvin) {
  let fahrenheit = (kelvin - 273.15) * (9 / 5) + 32;
  return fahrenheit.toFixed(2);
}

function mpsToMph(mps) {
  let mph = mps * 2.23694;
  return mph.toFixed(2);
}
async function getWeatherData(cityName) {
  try {
    const geoCoordURL = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=ff576f6a22b039eee154bb1c12713139`;
    const geoCoordResponse = await fetch(geoCoordURL);
    const geoCoordData = await geoCoordResponse.json();
    const { lat, lon } = geoCoordData.coord;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=ff576f6a22b039eee154bb1c12713139`;
    const forecastResponse = await fetch(forecastUrl);
    const forecastData = await forecastResponse.json();
    displayCurrentWeather(forecastData.city, forecastData.list[0]);
    displayForecast(forecastData.list);
    saveSearchHistory(cityName);
  } catch (error) {
    console.log("Error fetching weather data:", error);
  }
}

function displayCurrentWeather(city, weatherData) {
  currentWeatherContainer.innerHTML = "";

  const cityName = city.name;
  const date = new Date(weatherData.dt * 1000).toLocaleDateString();
  const icon = `http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`;
  const temperature = weatherData.main.temp;
  const humidity = weatherData.main.humidity;
  const windSpeed = weatherData.wind.speed;
  const windSpeedMph = mpsToMph(windSpeed);

  const cityElement = document.createElement("h2");
  cityElement.textContent = cityName;

  const dateElement = document.createElement("p");
  dateElement.textContent = date;

  const iconElement = document.createElement("img");
  iconElement.src = icon;

  const temperatureFahrenheit = kelvinToFahrenheit(temperature);
  const temperatureElement = document.createElement("p");
  temperatureElement.textContent = `Temperature: ${temperatureFahrenheit} ºF`;

  const humidityElement = document.createElement("p");
  humidityElement.textContent = `Humidity: ${humidity}%`;

  const windSpeedElement = document.createElement("p");
  windSpeedElement.textContent = `Wind Speed: ${windSpeedMph} MPH`;

  currentWeatherContainer.appendChild(cityElement);
  currentWeatherContainer.appendChild(dateElement);
  currentWeatherContainer.appendChild(iconElement);
  currentWeatherContainer.appendChild(temperatureElement);
  currentWeatherContainer.appendChild(humidityElement);
  currentWeatherContainer.appendChild(windSpeedElement);
}

function displayForecast(forecastData) {
  // Clear previous forecast data
  forecastContainer.innerHTML = "";

  for (let i = 0; i < 5; i++) {
    const forecast = forecastData[i];

    // Extract necessary information for each day
    const date = new Date(forecast.dt * 1000).toLocaleDateString();
    const iconURL = `https://openweathermap.org/img/w/${forecast.weather[0].icon}.png`;
    const temperature = forecast.main.temp;
    const humidity = forecast.main.humidity;
    const windSpeed = forecast.wind.speed;
    const windSpeedMph = mpsToMph(windSpeed);

    const forecastElement = document.createElement("div");
    forecastElement.classList.add("forecast-item");

    const dateElement = document.createElement("p");
    dateElement.textContent = date;

    const iconElement = document.createElement("img");
    iconElement.src = iconURL;

    const temperatureFahrenheit = kelvinToFahrenheit(temperature);
    const temperatureElement = document.createElement("p");
    temperatureElement.textContent = `Temperature: ${temperatureFahrenheit} ºF`;

    const humidityElement = document.createElement("p");
    humidityElement.textContent = `Humidity: ${humidity}%`;

    const windSpeedElement = document.createElement("p");
    windSpeedElement.textContent = `Wind Speed: ${windSpeedMph} MPH`;

    // Append elements to the forecast container
    forecastElement.appendChild(dateElement);
    forecastElement.appendChild(iconElement);
    forecastElement.appendChild(temperatureElement);
    forecastElement.appendChild(humidityElement);
    forecastElement.appendChild(windSpeedElement);

    forecastContainer.appendChild(forecastElement);
  }
}

// Function to save the searched city in the search history
function saveSearchHistory(cityName) {
  // Retrieve existing search history from localStorage
  let searchHistory = localStorage.getItem("searchHistory");

  // Parse the search history from JSON to an array
  searchHistory = searchHistory ? JSON.parse(searchHistory) : [];

  // Add the new city to the search history array
  searchHistory.push(cityName);

  // Save the updated search history back to localStorage
  localStorage.setItem("searchHistory", JSON.stringify(searchHistory));

  displaySearchHistory();
}

// Function to display the search history
function displaySearchHistory() {
  // Clear previous search history
  searchHistoryContainer.innerHTML = "";

  // Retrieve the search history from localStorage
  let searchHistory = localStorage.getItem("searchHistory");

  searchHistory = searchHistory ? JSON.parse(searchHistory) : [];

  // Iterate over the search history
  for (let i = 0; i < searchHistory.length; i++) {
    const historyItem = document.createElement("div");
    historyItem.textContent = searchHistory[i];

    historyItem.addEventListener("click", function () {
      getWeatherData(searchHistory[i]);
    });

    searchHistoryContainer.appendChild(historyItem);
  }
}

displaySearchHistory();
