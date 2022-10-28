// Credentials
const openWeatherApiKey = "a95c2c6739994ba4903e007ee817e7d1"

// DOM Elements
const inputElement = document.querySelector("#city-input")
const searchFormElement = document.querySelector(".search-box")
const dateElement = document.querySelector("#date")
const descriptionElement = document.querySelector("#description")
const reloadButton = document.querySelector("#reload")
const cityElement = document.querySelector(".current-city")
const tempElement = document.querySelector("#temp")
const windElement = document.querySelector("#wind")
const humidityElement = document.querySelector("#humidity")
const iconElement = document.querySelector("#icon")
const fahrenheitElement = document.querySelector("#fahrenheit")
const celciusElement = document.querySelector("#celcius")

// Events
searchFormElement.addEventListener("submit", searchCityHandler)
reloadButton.addEventListener("click", getLocalWeather)
fahrenheitElement.addEventListener("click", displayFahrenheit)
celciusElement.addEventListener("click", displayCelcius)

// Codes which needs to be executed initially:
dateElement.innerHTML = getLocalTime()
let lat, lon;
navigator.geolocation.getCurrentPosition((position) => {
		lat = position.coords.latitude
		lon = position.coords.longitude
		getLocalWeather() 
})

// global variables:
let tempInCelcius;

// Functions:
function getLocalTime() {
	// Calc hour and date like: "Sunday, 04:12 PM"
	let currentTime = new Date()
	const days = [
		"Sunday",
		"Monday",
		"Tuesday",
		"Wednesday",
		"Thursday",
		"Friday",
		"Saturday",
	]

	let currentDay = days[currentTime.getDay()]
	let currentMinutes = currentTime.getMinutes()
	if (currentMinutes < 10) {
		currentMinutes = `0${currentMinutes}`
	}
	let currentHour = currentTime.getHours()
	if (currentHour < 10) {
		currentHour = `0${currentHour}`
	}
	let hourData = `${currentDay}, ${currentHour}:${currentMinutes}`

	return hourData
}

function getLocalWeather() {	
	axios
		.get(
			`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=1ee4264117b73d2263eecd562f31ef5c&units=metric`
		)
		.then((response) => updateUI(analyzeResponse(response)))
}

function searchCityHandler(event) {
	event.preventDefault()
	let enteredCity = inputElement.value
	searchCity(enteredCity)
	inputElement.value = ""
}

function searchCity(city) {
	axios
		.get(
			`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${openWeatherApiKey}&units=metric`
		)
		.then((response) => updateUI(analyzeResponse(response)))
}

function analyzeResponse(response) {
	let name = response.data.name
	tempInCelcius = Math.round(response.data.main.temp)
	let windSpeed = Math.round(response.data.wind.speed)
	let humidity = response.data.main.humidity
	let description = response.data.weather[0].description
	let icon = response.data.weather[0].icon

	return {
		name,
		temp: tempInCelcius,
		windSpeed,
		humidity,
		description,
		icon,
	}
}

function updateUI(cityData) {
	cityElement.innerHTML = cityData.name
	tempElement.innerHTML = cityData.temp 
	windElement.innerHTML = cityData.windSpeed
	humidityElement.innerHTML = cityData.humidity
	descriptionElement.innerHTML = cityData.description
	iconElement.setAttribute(
		"src",
		`https://www.openweathermap.org/img/wn/${cityData.icon}@2x.png`
	)
	dateElement.innerHTML = getLocalTime()
}

function displayFahrenheit() {
	let tempInFahrenheit = Math.round(tempInCelcius * 1.8 + 32)
	tempElement.innerHTML = tempInFahrenheit
	celciusElement.classList.add('active');
	fahrenheitElement.classList.remove('active');
}

function displayCelcius() {
	tempElement.innerHTML = tempInCelcius
	celciusElement.classList.remove("active")
	fahrenheitElement.classList.add("active")
}



