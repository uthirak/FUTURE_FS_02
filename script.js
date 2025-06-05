const API_KEY = "YOUR_API_KEY";

// Trigger weather fetch when Enter is pressed
window.onload = function () {
  document.getElementById("cityInput").addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent default Enter behavior
      getWeather();
    }
  });
};

function getWeather() {
  const city = document.getElementById("cityInput").value.trim();

  if (city === "") {
    alert("Please enter a city name.");
    return;
  }

  const weatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`;
  const forecastURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${API_KEY}`;

  // Fetch current weather
  fetch(weatherURL)
    .then((response) => {
      if (!response.ok) throw new Error("City not found");
      return response.json();
    })
    .then((data) => {
      if (data.cod !== 200) {
        alert(data.message || "Weather data error.");
        return;
      }

      console.log("Weather data:", data);

      document.getElementById("temperature").textContent = `Temperature: ${data.main.temp}°C`;
      document.getElementById("description").textContent = `Description: ${data.weather[0].description}`;
      document.getElementById("humidity").textContent = `Humidity: ${data.main.humidity}%`;
      document.getElementById("wind").textContent = `Wind Speed: ${data.wind.speed} km/h`;

      const sunriseTime = new Date(data.sys.sunrise * 1000).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
      const sunsetTime = new Date(data.sys.sunset * 1000).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });

      document.getElementById("sunrise").textContent = sunriseTime;
      document.getElementById("sunset").textContent = sunsetTime;

      document.getElementById("visibility").textContent = `${data.visibility / 1000} km`;
      document.getElementById("dewpoint").textContent = `${calculateDewPoint(data.main.temp, data.main.humidity)}°C`;
      document.getElementById("wind-speed").textContent = `${data.wind.speed} km/h`;
      document.getElementById("humidity-detail").textContent = `${data.main.humidity}%`;
      document.getElementById("cloudiness").textContent = `${data.clouds.all}%`;
    })
    .catch((error) => {
      console.error("Weather fetch error:", error);
      alert("Error: " + error.message);
    });

  // Fetch 5-day forecast
  fetch(forecastURL)
    .then((response) => {
      if (!response.ok) throw new Error("Forecast data not found");
      return response.json();
    })
    .then((forecastData) => {
      if (forecastData.cod !== "200") {
        alert(forecastData.message || "Forecast data error.");
        return;
      }

      const forecastContainer = document.getElementById("forecastBoxes");
      forecastContainer.innerHTML = "";

      const dailyData = forecastData.list.filter((item, index) => index % 8 === 0).slice(0, 5);

      dailyData.forEach((item) => {
        const date = new Date(item.dt * 1000);
        const dayName = date.toLocaleDateString(undefined, { weekday: "short" });
        const iconUrl = `https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`;
        const temp = `${Math.round(item.main.temp)}°C`;

        const forecastBox = document.createElement("div");
        forecastBox.className = "forecast-day";
        forecastBox.innerHTML = `
          <h4>${dayName}</h4>
          <img src="${iconUrl}" alt="${item.weather[0].description}" />
          <p>${temp}</p>
        `;
        forecastContainer.appendChild(forecastBox);
      });
    })
    .catch((error) => {
      console.error("Forecast fetch error:", error);
      alert("Error fetching forecast: " + error.message);
    });
}

// Dew Point Calculation
function calculateDewPoint(temp, humidity) {
  const a = 17.27;
  const b = 237.7;
  const alpha = (a * temp) / (b + temp) + Math.log(humidity / 100);
  return (b * alpha) / (a - alpha);
}


