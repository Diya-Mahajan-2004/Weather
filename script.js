const apiKey = "cb3d879115ab955b04ffe42eb39b438d";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";
const forecastUrl = "https://api.openweathermap.org/data/2.5/forecast?units=metric&q=";

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

        const forecastResponse = await fetch(forecastUrl + correctedCity + `&appid=${apiKey}`);
        if (forecastResponse.ok) {
            const forecastData = await forecastResponse.json();
            renderTemperatureChart(forecastData.list);
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

// Function to render temperature forecast chart
function renderTemperatureChart(data) {
    const ctx = document.getElementById('temperature-chart').getContext('2d');
    const labels = data.map(item => {
        const date = new Date(item.dt_txt);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    });
    const temperatures = data.map(item => item.main.temp);

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Temperature (°C)',
                data: temperatures,
                backgroundColor: 'rgba(70, 116, 232, 0.2)',
                borderColor: 'rgba(0, 102, 204, 1)',
                borderWidth: 3,
                pointBackgroundColor: 'rgba(0, 102, 204, 1)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgba(0, 102, 204, 1)'
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: true,
                    labels: {
                        color: '#fff',
                        font: {
                            size: 16
                        }
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: '#fff',
                        font: {
                            size: 14
                        }
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    }
                },
                y: {
                    ticks: {
                        color: '#fff',
                        font: {
                            size: 14
                        }
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    }
                }
            }
        }
    });
}

// Function to get weather data based on geolocation
function getWeatherByGeolocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            const geoApiUrl = `https://api.openweathermap.org/data/2.5/weather?units=metric&lat=${latitude}&lon=${longitude}&appid=${apiKey}`;

            try {
                const response = await fetch(geoApiUrl);
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

function updateWeatherData(data) {
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
}

// Call the geolocation function to get weather data based on user's location
getWeatherByGeolocation();
