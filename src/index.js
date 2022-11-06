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
const celsiusElement = document.querySelector("#celsius")
const forecastWrapper = document.querySelector("#forecast-wrapper")

// Events
searchFormElement.addEventListener("submit", searchCityHandler)
reloadButton.addEventListener("click", getLocalWeather)
fahrenheitElement.addEventListener("click", displayFahrenheit)
celsiusElement.addEventListener("click", displayCelsius)

// Codes which needs to be executed initially:
dateElement.innerHTML = getLocalTime()
navigator.geolocation.getCurrentPosition((position) => {
	let lat = position.coords.latitude
	let lon = position.coords.longitude
	getLocalWeather({
		lat,
		lon
	})
})

// global variables:
let tempInCelsius

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

function getLocalWeather(coords) {
	axios
		.get(
			`https://api.openweathermap.org/data/2.5/weather?lat=${coords.lat}&lon=${coords.lon}&appid=1ee4264117b73d2263eecd562f31ef5c&units=metric`
		)
		.then((response) => {
			updateUI(analyzeResponse(response))
			getForecastData(coords)
		})
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
		.then((response) => {
			updateUI(analyzeResponse(response))
			getForecastData(response.data.coord)

		})
}

function getForecastData(coords) {
	let apiURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${coords.lat}&lon=${coords.lon}&exclude=hourly,minutely&appid=${openWeatherApiKey}&units=metric`
	axios
		.get(apiURL)
		.then((response) => updateForecastUI(analyzeForecastData(response)))
}

function analyzeResponse(response) {
	let name = response.data.name
	tempInCelsius = Math.round(response.data.main.temp)
	let windSpeed = Math.round(response.data.wind.speed)
	let humidity = response.data.main.humidity
	let description = response.data.weather[0].description
	let icon = response.data.weather[0].icon

	return {
		name,
		temp: tempInCelsius,
		windSpeed,
		humidity,
		description,
		icon,
	}
}

function analyzeForecastData(responseData) {
	const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
	return responseData.data.daily.map((day) => {
		return {
			weekDay: days[new Date(day.dt * 1000).getDay()],
			min: Math.round(day.temp.min),
			max: Math.round(day.temp.max),
			icon: day.weather[0].icon,
		}
	})
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

function updateForecastUI(daysArray) {
	let forecastHTML = '<div class="row">'
	daysArray.forEach((day, index) => {
		if (index < 6) {
			forecastHTML += `
			<div class="col-2">
				<div class="forecast">
						<div class="forecast-day">${day.weekDay}</div>
						<div><img class="forecast-img" src="https://www.openweathermap.org/img/wn/${day.icon}@2x.png"/></div>
						<div class="forecast-temp">
							<span class="max">${day.max}°</span>
							<span class="min">${day.min}°</span>
						</div>
				</div>
			</div>`
		}
	})
	forecastHTML += "</div>"
	forecastWrapper.innerHTML = forecastHTML
}

function displayFahrenheit() {
	let tempInFahrenheit = Math.round(tempInCelcius * 1.8 + 32)
	tempElement.innerHTML = tempInFahrenheit
	celciusElement.classList.add("active")
	fahrenheitElement.classList.remove("active")
}

function displayCelsius() {
	tempElement.innerHTML = tempInCelcius
	celciusElement.classList.remove("active")
	fahrenheitElement.classList.add("active")
}
