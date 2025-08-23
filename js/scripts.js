const apiKey = "8fed6ca2d186fff3151f92791029d63c";
const unsplashKey = "xA5C464LTg6YjHv1UXtvG1EvH_ZWgyv1H6SgcuB2r_k";

const cityInput = document.querySelector("#city-input");
const searchBtn = document.querySelector("#search");
const cityElement = document.querySelector("#city");
const countryElement = document.querySelector("#country");
const tempElement = document.querySelector("#temperature span");
const descElement = document.querySelector("#description");
const humidityElement = document.querySelector("#humidity");
const windElement = document.querySelector("#wind");
const weatherIconElement = document.querySelector("#weather-icon");
const weatherContainer = document.querySelector("#weather-data");
const errorMessage = document.querySelector("#error-message");
const body = document.body;
const periodIcon = document.querySelector("#period-icon");
const periodText = document.querySelector("#period-text");

// 🔥 NOVO — Função para pegar lat, lon, estado e país
const getCityData = async (city) => {
  const geoURL = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`;
  const res = await fetch(geoURL);

  if (!res.ok) {
    throw new Error("Cidade não encontrada");
  }

  const data = await res.json();

  if (data.length === 0) {
    throw new Error("Cidade não encontrada");
  }

  return data[0]; // {name, state, country, lat, lon}
};

// 🔥 Atualizada — Busca dados do clima usando lat e lon
const getWeatherData = async (lat, lon) => {
  const apiURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}&lang=pt_br`;

  const res = await fetch(apiURL);

  if (!res.ok) {
    throw new Error("Clima não encontrado");
  }

  const data = await res.json();
  return data;
};

// Função para buscar e definir imagem de fundo do Unsplash conforme o clima
const setBackgroundByWeather = async (weatherMain) => {
  let query = "";

  switch (weatherMain) {
    case "Clear":
      query = "sunny sky";
      break;
    case "Rain":
    case "Drizzle":
      query = "rain";
      break;
    case "Clouds":
      query = "cloudy sky";
      break;
    case "Snow":
      query = "snow";
      break;
    case "Thunderstorm":
      query = "thunderstorm";
      break;
    case "Mist":
    case "Fog":
    case "Smoke":
    case "Haze":
      query = "fog";
      break;
    default:
      query = "weather";
  }

  const unsplashURL = `https://api.unsplash.com/photos/random?query=${query}&client_id=${unsplashKey}`;

  try {
    const res = await fetch(unsplashURL);
    const data = await res.json();
    const imageURL = data.urls.full;

    body.style.backgroundImage = `url(${imageURL})`;
    body.style.backgroundSize = "cover";
    body.style.backgroundPosition = "center";
  } catch (error) {
    console.error("Erro ao buscar imagem do Unsplash", error);
    body.style.background = "#a7a5c2";
  }
};

// 🔥 Atualizada — Mostra dados do clima + estado
const showWeatherData = async (city) => {
  try {
    const locationData = await getCityData(city);
    const data = await getWeatherData(locationData.lat, locationData.lon);

    // Montar nome com estado, se existir
    const stateName = locationData.state ? `, ${locationData.state}` : "";
    const countryCode = locationData.country;

    cityElement.innerText = `${locationData.name}${stateName}`;
    tempElement.innerText = parseInt(data.main.temp);
    descElement.innerText = data.weather[0].description;

    weatherIconElement.setAttribute(
      "src",
      `http://openweathermap.org/img/wn/${data.weather[0].icon}.png`
    );
    weatherIconElement.setAttribute("alt", data.weather[0].description);

    humidityElement.innerText = `${data.main.humidity}%`;
    windElement.innerText = `${data.wind.speed} km/h`;

    countryElement.setAttribute(
      "src",
      `https://flagcdn.com/w80/${countryCode.toLowerCase()}.png`
    );

    await setBackgroundByWeather(data.weather[0].main);

    weatherContainer.classList.remove("hide");
    errorMessage.classList.add("hidden");
  } catch (error) {
    errorMessage.classList.remove("hidden");
    weatherContainer.classList.add("hide");
    body.style.background = "#a7a5c2";
  }
};

// Eventos para busca pelo botão e tecla Enter
searchBtn.addEventListener("click", (e) => {
  e.preventDefault();
  const city = cityInput.value.trim();
  if (city) {
    showWeatherData(city);
  }
});

cityInput.addEventListener("keyup", (e) => {
  if (e.code === "Enter") {
    const city = e.target.value.trim();
    if (city) {
      showWeatherData(city);
    }
  }
});
