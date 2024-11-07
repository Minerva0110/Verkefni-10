import './style.css'

const apiKey = 'c012d6b1f6371dd54c159ca5630bd11c';
const weatherApiUrl = 'https://api.openweathermap.org/data/2.5/weather';

async function fetchWeather(city) {
  const response = await fetch(`${weatherApiUrl}?q=${city}&appid=${apiKey}&units=metric`);
  const data = await response.json();
  
  if (data.cod === 200) {
    return data;
  } else {
    return { error: "City not found" };
  }
}

document.querySelector('#app').innerHTML = `
  <main>
    <h1>Weather App</h1>
    <div class="weather">
      <button id="fetchWeatherButton" class="locations__button" type="button">Get Weather</button>
      <div id="weatherInfo" class="results"></div>
      <!-- Add a div to hold the map -->
      <div id="map" style="height: 300px; width: 100%;"></div>
    </div>
  </main>
`;

document.getElementById('fetchWeatherButton').addEventListener('click', async () => {
  const city = prompt("Enter city name:");
  const weatherData = await fetchWeather(city);

  const weatherInfoDiv = document.getElementById('weatherInfo');
  if (weatherData.error) {
    weatherInfoDiv.innerHTML = `<p>${weatherData.error}</p>`;
  } else {
    weatherInfoDiv.innerHTML = `
      <div class="forecast">
        <p><strong>City:</strong> ${weatherData.name}</p>
        <p><strong>Temperature:</strong> ${weatherData.main.temp}°C</p>
        <p><strong>Weather:</strong> ${weatherData.weather[0].description}</p>
      </div>
    `;
  
    const lat = weatherData.coord.lat;
    const lon = weatherData.coord.lon;
    const map = L.map('map').setView([lat, lon], 10);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    L.marker([lat, lon]).addTo(map)
      .bindPopup(`<b>${weatherData.name}</b><br>${weatherData.weather[0].description}`)
      .openPopup();
  }
});
