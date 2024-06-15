const apiKey = "cb3d879115ab955b04ffe42eb39b438d";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";

const searchBox = document.querySelector(".search input");
const searchBtn = document.querySelector(".search button");
const weatherIcon = document.querySelector(".weather-icon");
const loading = document.querySelector(".loading");
const error = document.querySelector(".error");
const weather = document.querySelector(".weather");

// Function to perform autocorrection using a predefined map
function autocorrectInput(input) {
    const corrections = {
        "jamu": "jammu",
        // Add more corrections as needed
    };

    // Check if input needs correction
    if (corrections[input.toLowerCase()]) {
        return corrections[input.toLowerCase()];
    } else {
        return input;
    }
}

async function checkWeather(city) {
    loading.style.display = "block";
    weather.style.display = "none";
    error.style.display = "none";

    try {
        // Autocorrect the city input
        const correctedCity = autocorrectInput(city);

        const response = await fetch(apiUrl + correctedCity + `&appid=${apiKey}`);

        if (response.status == 404) {
            throw new Error("City not found");
        }

        const data = await response.json();

        document.querySelector(".city").textContent = data.name;
        document.querySelector(".temp").textContent = Math.round(data.main.temp) + "°C";
        document.querySelector(".humidity").textContent = data.main.humidity + "%";
        document.querySelector(".wind").textContent = data.wind.speed + " km/h";

        switch (data.weather[0].main) {
            case "Clouds":
                weatherIcon.src = "images/clouds.png";
                break;
            case "Clear":
                weatherIcon.src = "images/clear.png";
                break;
            case "Rain":
                weatherIcon.src = "images/rain.png";
                break;
            case "Drizzle":
                weatherIcon.src = "images/drizzle.png";
                break;
            case "Mist":
                weatherIcon.src = "images/mist.png";
                break;
            default:
                weatherIcon.src = "images/default.png";
        }

        weather.style.display = "block";
    } catch (error) {
        error.style.display = "block";
    } finally {
        loading.style.display = "none";
    }
}

searchBtn.addEventListener("click", () => {
    checkWeather(searchBox.value);
});

searchBox.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        checkWeather(searchBox.value);
    }
});


// Function to get weather data based on geolocation
function getWeatherByGeolocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            const apiUrl = `https://api.openweathermap.org/data/2.5/weather?units=metric&lat=${latitude}&lon=${longitude}&appid=${apiKey}`;

            try {
                const response = await fetch(apiUrl);
                if (!response.ok) {
                    throw new Error('Weather data not available');
                }
                const data = await response.json();
                updateWeatherData(data);
            } catch (error) {
                console.error('Error fetching weather data:', error);
            }
        }, (error) => {
            console.error('Geolocation error:', error);
        });
    } else {
        console.error('Geolocation is not supported by this browser.');
    }
}

