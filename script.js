const searchInput = document.getElementById('input-search');
const cityName = document.getElementById('city-name');
const codeOfCountry = document.getElementById('country-code');
const tempOfCity = document.getElementById('temperature');
const searchButton = document.querySelector('.fa-search')



async function getWeather({ city = null, lat = null, lon = null }) {
    const apiKey = 'YOUR_API_KEY';
    let url;

    if (city) {
        url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    } else if (lat && lon) {
        url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    } else {
        throw new Error('Не указаны ни координаты, ни название города');
    }

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log(data)
        const temperature = data.main.temp;
        const countryCode = data.sys.country;
        const nameOfCity = data.name;

        return { temperature, countryCode, nameOfCity };
    } catch (error) {
        console.error(error);
    }
}

async function updateWeatherByCity(city) {
    try {
        const { temperature, countryCode, nameOfCity } = await getWeather({ city });
        cityName.textContent = nameOfCity;
        codeOfCountry.textContent = countryCode;
        tempOfCity.textContent = `${temperature}°C`;
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
                const { temperature, countryCode, nameOfCity } = await getWeather({ lat, lon });
                cityName.textContent = nameOfCity;
                codeOfCountry.textContent = countryCode;
                tempOfCity.textContent = `${temperature}°C`;
            } catch (error) {
                console.error('Ошибка при обновлении информации о погоде с геолокацией:', error);
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
    }
});

window.addEventListener('load', updateWeatherByGeolocation);

searchButton.addEventListener('click',  async() => { 
    await updateWeatherByCity(searchInput.value.trim())
}
)