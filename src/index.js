// Credentials
const openWeatherApiKey = "a95c2c6739994ba4903e007ee817e7d1"

// DOM Elements
const inputElement = document.querySelector("#city-input")
const searchFormElement = document.querySelector(".search-box")
const dateElement = document.querySelector("#date")
const descriptionElement = document.querySelector("#description")
const currentButton = document.querySelector(".current-btn")
const cityElement = document.querySelector(".current-city")
const tempElement = document.querySelector("#temp")
const windElement = document.querySelector("#wind")
const humidityElement = document.querySelector("#humidity")

// Events
searchFormElement.addEventListener("submit", searchCityHandler)
currentButton.addEventListener("click", updateCurrentHandler)

// Codes which needs to be executed initially:
dateElement.innerHTML = getLocalTime()
let lat, lon;
navigator.geolocation.getCurrentPosition((position) => {
		lat = position.coords.latitude
		lon = position.coords.longitude
		updateCurrentHandler() 
})

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
		.then((response) => {
			console.log(response)
			let name = response.data.name
			let temp = Math.round(response.data.main.temp)
			let windSpeed = Math.round(response.data.wind.speed)
			let humidity = response.data.main.humidity
			let description = response.data.weather[0].description
			
			updateUI({
				name,
				temp,
				windSpeed,
				humidity,
				description
			})
		})
}

function searchCityHandler(event) {
	event.preventDefault()
	let enteredCity = inputElement.value

	axios
		.get(
			`https://api.openweathermap.org/data/2.5/weather?q=${enteredCity}&appid=${openWeatherApiKey}&units=metric`
		)
		.then((response) => {			
			let temp = Math.round(response.data.main.temp)
			let windSpeed = Math.round(response.data.wind.speed)
			let humidity = response.data.main.humidity
			let description = response.data.weather[0].description
			updateUI({
				name: enteredCity,
				temp,
				windSpeed,
				humidity,
				description,
			})
		})
}

function updateCurrentHandler() {
	dateElement.innerHTML = getLocalTime()
	getLocalWeather()
}

function updateUI(cityData) {
	cityElement.innerHTML = cityData.name
	tempElement.innerHTML = cityData.temp 
	windElement.innerHTML = cityData.windSpeed
	humidityElement.innerHTML = cityData.humidity
	console.log(cityData)
	console.log(descriptionElement)
	descriptionElement.innerHTML = cityData.description

}

// next steps:
// the picture should be changed depending on what weather like
// 5 day forecast 


