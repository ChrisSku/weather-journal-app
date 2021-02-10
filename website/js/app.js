//global Variables
const API_KEY = '&appid=6ff9318fee80ae559827385ab850e862'
const weatherUrl = 'https://api.openweathermap.org/data/2.5/'

//global elements
const searchField = document.getElementById('search-field')
const zipInput = document.getElementById('zip')
const feelingsText = document.getElementById('feelings')
const weatherPlace = document.getElementById('currentWeather-place')
const currentWeather = document.getElementById('currentWeather')
const lat = document.getElementById('lat')
const lon = document.getElementById('lon')
const date = document.getElementById('date')
const temp = document.getElementById('temp')
const content = document.getElementById('content')
const noDataText = document.getElementById('noDataText')
const savedFeelingSection = document.getElementById('saved-feeling-section')

// helper funtions
function formatToFeelingsTemplateAndDisplayOnUI(dataList) {
    let insertHTML = '<h1>Saved Feelings:</h1>'
    for (const data of dataList) {
        insertHTML += `<div class="weather saved-feeling">
                        <h2>${data.name} (${data.zip})</h2>
                        <p class="weather-coords">
                            <b>Coordinates:</b> <span>${data.coord.lat}° N</span>
                            <span class="lon">${data.coord.lon}° E</span>
                        </p>
                        <div>
                            <div>Date:${data.date}</div>
                            <div>Current Temperature: ${data.temp}°C</div>
                            <div>Feelings for this place and weather are: ${data.content}</div>
                        </div>
                    </div>`
    }
    savedFeelingSection.innerHTML = insertHTML
}

function formatWeatherDataToServerData(weatherData) {
    return {
        zip: zipInput.value,
        name: weatherData.name,
        coord: weatherData.coord,
        date: new Date(weatherData.dt).toLocaleString(),
        temp: weatherData.main.temp,
        content: feelingsText.value
    }
}

// set Data from server in the UI
function setData(data) {
    weatherPlace.innerHTML = `${data.name} (${data.zip})`
    lat.innerHTML = `${data.coord.lat}° N`
    lon.innerHTML = `${data.coord.lon}° E`
    date.innerHTML = 'Date: ' + data.date
    temp.innerHTML = `Current Temperature: ${data.temp}°C`
    content.innerHTML = `Feelings for this place and weather are: ${data.content}`
}

// if response is not ok it will show the error in the UI
function checkWheaterResponse(response) {
    if (!response.ok) {
        noDataText.innerHTML = `Error ${response.status}: ${response.statusText}`
        noDataText.classList.remove('hidden')
        currentWeather.classList.add('hidden')
    }

    return response.json()
}

// main functions
async function getAllDataFromServerAndDisplayOnUI() {
    const data = await fetch('/all').then((response) => response.json())
    formatToFeelingsTemplateAndDisplayOnUI(data)
}

function fetchFromWheater(endpoint, query) {
    return fetch(`${weatherUrl}${endpoint}?${query}&units=metric${API_KEY}`)
        .then(checkWheaterResponse)
        .catch((error) => console.error(error))
}

function saveDataAtServer(data) {
    return fetch('/', {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then((response) => response.json())
        .catch((error) => console.error(error))
}

searchField.addEventListener('submit', (event) => {
    event.preventDefault()
    fetchFromWheater('weather', 'zip=' + zipInput.value) // get weather data from the weather api
        .then(formatWeatherDataToServerData) // formats the data from the weather api the the needed data and adds the user inputs
        .then(saveDataAtServer) // save the data at the server
        .then(setData) // updates the UI with the new data
        .then(() => {
            noDataText.classList.add('hidden')
            currentWeather.classList.remove('hidden')
        })
        .then(getAllDataFromServerAndDisplayOnUI)
        .catch((error) => console.error(error))
})

getAllDataFromServerAndDisplayOnUI()
