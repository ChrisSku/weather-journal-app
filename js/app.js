//global Variables
const API_KEY = '&appid=6ff9318fee80ae559827385ab850e862'
const wheaterUrl = 'https://api.openweathermap.org/data/2.5/'

//global elements
const searchField = document.getElementById('search-field')
const searchInput = document.getElementById('zip')
const weatherPlace = document.getElementById('weather-place')
const weather = document.getElementById('weather')
const lat = document.getElementById('lat')
const lon = document.getElementById('lon')
const date = document.getElementById('date')
const temp = document.getElementById('temp')
const content = document.getElementById('content')
const noDataText = document.getElementById('noDataText')
const feelingsForm = document.getElementById('feelings-form')

// helper funtions
function fetchFromWheater(endpoint, query) {
    return fetch(`${wheaterUrl}${endpoint}?${query}&units=metric${API_KEY}`)
        .then((response) => response.json())
        .catch((error) => console.error(error))
}

// https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&exclude={part}&appid={API key}

// fetchFromWheater('weather', 'q=Oberkochen&units=metric').then((data) =>
//     console.log(data.main.temp)
// )

searchField.addEventListener('submit', (event) => {
    event.preventDefault()
    fetchFromWheater('weather', 'zip=' + searchInput.value)
        .then(setData)
        .then(() => {
            noDataText.classList.add('hidden')
            weather.classList.remove('hidden')
            feelingsForm.classList.remove('hidden')
        })
})

function setData(data) {
    weatherPlace.textContent = `${data.name} (${searchInput.value})`
    lat.textContent = `${data.coord.lat}° N`
    lon.textContent = `${data.coord.lon}° E`
    date.textContent = 'Date: ' + new Date(data.dt).toLocaleString()
    temp.textContent = `Current Temperature: ${data.main.temp}°C (Feels like ${data.main.feels_like}°C)`
    content.innerHTML = `<p>Maximum Temperature: ${data.main.temp_min}°C</p>
    <p>Minimum Temperature: ${data.main.temp_max}°C</p>
    <p>Pressure: ${data.main.pressure} hPa</p>
    <p>Humidity: ${data.main.humidity} %</p>`
}

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (data) =>
                fetchFromWheater(
                    'weather',
                    `lat=${data.coords.latitude}&lon=${data.coords.longitude}`
                ).then(setData),
            () => fetchFromWheater('weather', `q=Stuttgart`).then(setData)
        )
    } else {
        console.log('Geolocation is not supported by this browser.')
        fetchFromWheater('weather', `q=Stuttgart`).then(setData)
    }
}
// getLocation()
