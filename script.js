function getWeather() {
    const apiKey = 'api key goes here'; // API key for OpenWeatherMap
    const city = document.getElementById('city').value; // Get the city from the input field
    const province = document.getElementById('province').value; // Get the province from the input field
    const country = document.getElementById('country').value; // Get the country from the input field

    if (!city || !country) { // Check if city and country are provided
        alert('Please enter a city and a country'); // Alert the user if not
        return;
    }

    const location = `${city},${province},${country}`; // Format the location string
    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}`; // URL for current weather
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${apiKey}`; // URL for weather forecast

    fetch(currentWeatherUrl) // Fetch current weather data
        .then(response => response.json())
        .then(data => {
            displayWeather(data); // Display the current weather
        })
        .catch(error => {
            console.error('Error fetching current weather data:', error); // Log errors
            alert('Error fetching current weather data. Please try again.'); // Alert the user
        });

    fetch(forecastUrl) // Fetch weather forecast data
        .then(response => response.json())
        .then(data => {
            displayHourlyForecast(data.list); // Display the hourly forecast
        })
        .catch(error => {
            console.error('Error fetching hourly forecast data:', error); // Log errors
            alert('Error fetching hourly forecast data. Please try again.'); // Alert the user
        });
}

function displayWeather(data) {
    const tempDivInfo = document.getElementById('temp-div'); // Get the temperature div
    const weatherInfoDiv = document.getElementById('weather-info'); // Get the weather info div
    const weatherIcon = document.getElementById('weather-icon'); // Get the weather icon image
    const hourlyForecastDiv = document.getElementById('hourly-forecast'); // Get the hourly forecast div

    // Clear previous content
    weatherInfoDiv.innerHTML = '';
    hourlyForecastDiv.innerHTML = '';
    tempDivInfo.innerHTML = '';

    if (data.cod === '404') { // Check if the city was not found
        weatherInfoDiv.innerHTML = `<p>${data.message}</p>`; // Display error message
    } else {
        const cityName = data.name; // Get the city name
        const temperature = Math.round(data.main.temp - 273.15); // Convert temperature to Celsius
        const description = data.weather[0].description; // Get the weather description
        const iconCode = data.weather[0].icon; // Get the weather icon code
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@4x.png`; // URL for the weather icon

        const temperatureHTML = `
            <p>${temperature}°C</p>
        `; // HTML for temperature

        const weatherHtml = `
            <p>${cityName}</p>
            <p>${description}</p>
        `; // HTML for weather info

        tempDivInfo.innerHTML = temperatureHTML; // Display temperature
        weatherInfoDiv.innerHTML = weatherHtml; // Display weather info
        weatherIcon.src = iconUrl; // Set the weather icon source
        weatherIcon.alt = description; // Set the alt text for the icon

        showImage(); // Show the weather icon
    }
}

function displayHourlyForecast(hourlyData) {
    const hourlyForecastDiv = document.getElementById('hourly-forecast'); // Get the hourly forecast div

    const next24Hours = hourlyData.slice(0, 8); // Display the next 24 hours (3-hour intervals)

    next24Hours.forEach(item => { // Loop through the next 24 hours
        const dateTime = new Date(item.dt * 1000); // Convert timestamp to milliseconds
        const hour = dateTime.getHours(); // Get the hour
        const temperature = Math.round(item.main.temp - 273.15); // Convert temperature to Celsius
        const iconCode = item.weather[0].icon; // Get the weather icon code
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`; // URL for the weather icon

        const hourlyItemHtml = `
            <div class="hourly-item">
                <span>${hour}:00</span>
                <img src="${iconUrl}" alt="Hourly Weather Icon">
                <span>${temperature}°C</span>
            </div>
        `; // HTML for hourly forecast item

        hourlyForecastDiv.innerHTML += hourlyItemHtml; // Append the hourly forecast item
    });
}

function showImage() {
    const weatherIcon = document.getElementById('weather-icon'); // Get the weather icon image
    weatherIcon.style.display = 'block'; // Make the image visible once it's loaded
}
