const searchInput = document.getElementById('input-search');
const cityName = document.getElementById('city-name');
const codeOfCountry = document.getElementById('country-code');
const tempOfCity = document.getElementById('temperature');
const searchButton = document.querySelector('.fa-search')
const dayTimeIcon = document.getElementById('day-Time-Icon')
const apiKey = "YOUR_API_KEY";


async function getWeather({ city = null, lat = null, lon = null }) {
    let url

    if (city) {
        url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;;
    } else if (lat && lon) {
        url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    } else {
        throw new Error('Не указаны ни координаты, ни название города');
    }

    try {
        const response = await fetch(url);
        if (!response.ok) {
            if (response.status === 404) {
                alert(`City ${searchInput.value.trim()} is not defined`)
            }
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log(data)
        const temperature = data.main.temp;
        const countryCode = data.sys.country;
        const nameOfCity = data.name;

        const sunrise = data.sys.sunrise * 1000
        const sunset = data.sys.sunset * 1000

        const currentTime = Date.now()
        console.log(sunrise, sunset, currentTime)

        const isDaytime = currentTime >= sunrise && currentTime < sunset
        console.log(isDaytime)

        return { temperature, countryCode, nameOfCity, isDaytime };
    } catch (error) {
        console.error(error);
    }
}

async function updateWeatherByCity(city) {
    try {
        const { temperature, countryCode, nameOfCity, isDaytime } = await getWeather({ city });
        cityName.textContent = nameOfCity;
        codeOfCountry.textContent = countryCode;
        tempOfCity.textContent = `${temperature}°C`;

        dayTimeIcon.classList.remove('fa-sun')
        dayTimeIcon.classList.remove('fa-moon')
        if (isDaytime) {
            console.log('day')
            dayTimeIcon.classList.add('fa-sun')
        } else {
            console.log('night')
            dayTimeIcon.classList.add('fa-moon')
        }
    } catch (error) {
        console.error('Ошибка при обновлении информации о погоде:', error);
    }
}


async function updateWeatherByGeolocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            try {
                const { temperature, countryCode, nameOfCity, isDaytime } = await getWeather({ lat, lon });
                cityName.textContent = nameOfCity;
                codeOfCountry.textContent = countryCode;
                tempOfCity.textContent = `${temperature}°C`;

                dayTimeIcon.classList.remove('fa-sun')
                dayTimeIcon.classList.remove('fa-moon')
                if (isDaytime) {
                    console.log('day')
                    dayTimeIcon.classList.add('fa-sun')
                } else {
                    console.log('night')
                    dayTimeIcon.classList.add('fa-moon')
                }
            } catch (error) {
                console.error('Ошибка при обновлении информации о погоде с геолокацией:', error);
            } finally {

            }
        }, (error) => {
            console.error('Ошибка получения геолокации:', error);
        });
    } else {
        console.error('Геолокация не поддерживается этим браузером.');
    }
}

searchInput.addEventListener('keydown', async (event) => {
    if (event.key === 'Enter') {
        await updateWeatherByCity(searchInput.value.trim());
        searchInput.value = ''
    }
});

window.addEventListener('load', updateWeatherByGeolocation);

searchButton.addEventListener('click', async () => {
    await updateWeatherByCity(searchInput.value.trim())
    searchInput.value = ''
}
)