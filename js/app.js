//global Variables
const API_KEY = '&appid=6ff9318fee80ae559827385ab850e862'
const wheaterUrl = 'https://api.openweathermap.org/data/2.5/'

//global elements
const searchField = document.getElementById('search-field')
const searchInput = document.getElementById('search-input')
const section = document.querySelector('section')

// helper funtions
async function fetchFromWheater(endpoint, query) {
    return await fetch(
        `${wheaterUrl}${endpoint}?${query}&units=metric${API_KEY}`
    )
        .then((response) => response.json())
        .catch((error) => console.error(error))
}

// https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&exclude={part}&appid={API key}

// fetchFromWheater('weather', 'q=Oberkochen&units=metric').then((data) =>
//     console.log(data.main.temp)
// )

searchInput.addEventListener('focus', () => searchField.classList.add('active'))
searchInput.addEventListener('blur', (event) => {
    if (!event.target.value) searchField.classList.remove('active')
})

function setData(data) {
    searchField.classList.add('active')
    searchInput.value = data.name
    section.textContent = JSON.stringify(data)
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
getLocation()
