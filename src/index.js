// Credentials
const openWeatherApiKey = "a95c2c6739994ba4903e007ee817e7d1"

// DOM Elements
const inputElement = document.querySelector("#city-input")
const searchFormElement = document.querySelector(".search-box")
const dateElement = document.querySelector("#date")
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
	// Calc hour and date like: "Sunday, 4:12 PM. Sep, 11, 2022"
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

	let months = [
		"Jan",
		"Feb",
		"March",
		"April",
		"May",
		"June",
		"July",
		"Aug",
		"Sep",
		"Oct",
		"Nov",
		"Dec",
	]

	let currentDay = days[currentTime.getDay()]
	let currentMinutes = currentTime.getMinutes()
	let currentHour = currentTime.getHours()
	if (currentHour > 12) {
		currentHour = `${currentHour - 12}:${currentMinutes} PM`
	} else {
		currentHour = `${currentHour}:${currentMinutes} AM`
	}
	let currentMonth = months[currentTime.getMonth()]

	let hourData = `${currentDay}, ${currentHour}. ${currentMonth}, ${currentTime.getDate()}, ${currentTime.getFullYear()}`

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
			updateUI({
				name,
				temp,
				windSpeed,
				humidity
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
			updateUI({
				name: enteredCity,
				temp,
				windSpeed,
				humidity,
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
}

// next steps:
// the picture should be changed depending on what weather like
// 5 day forecast 


