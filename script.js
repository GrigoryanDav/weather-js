const searchInput = document.getElementById('input-search')
const cityName = document.getElementById('city-name')
const codeOfCountry = document.getElementById('country-code')
const tempOfCity = document.getElementById('temperature')

async function getWeather() {
    const apiKey = 'YOUR_API_KEY'
    const city = searchInput.value.trim()
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`

    try {
        const response = await fetch(url)
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        const temperature = data.main.temp
        const countryCode = data.sys.country
        console.log(`Температура в Ереване: ${temperature}°C`);
        console.log(`Код страны: ${countryCode}`)
        return [temperature, countryCode]
    } catch (error) {
        console.error(error);
    }
}

async function updateWeatherInfo() {
    try {
        const [temperature, countryCodeValue] = await getWeather()
        cityName.textContent = searchInput.value.trim()
        codeOfCountry.textContent = countryCodeValue
        tempOfCity.textContent = `${temperature}°C`
    } catch (error) {
        console.error('Ошибка при обновлении информации о погоде:', error);
    }
}

searchInput.addEventListener('keydown', async (event) => {
    if(event.key === 'Enter') {
        await updateWeatherInfo()
    }
})