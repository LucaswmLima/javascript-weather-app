const timeElement = document.getElementById('time')
const dateElement = document.getElementById('date')
const currentWeatherElement = document.getElementById('current-weather-items')
const timeZoneElement = document.getElementById('time-zone')
const countryElement = document.getElementById('country')
const weatherForecastElement = document.getElementById('weather-forecast')
const currentTempElement = document.getElementById('current-temp')

const days = ['Domingo', 'Segunda-Feira', 'Terça-Feira', 'Quarta-Feira', 'Quinta-Feira', 'Sexta-Feira', 'Sábado']
const daysMin = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado','Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']
const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
const d = new Date();


const API_KEY = '49cc8c821cd2aff9af04c9f98c36eb74'
setInterval(() => {
    const time = new Date()
    const month = time.getMonth()
    const date = time.getDate()
    const day = time.getDay()
    const hour = time.getHours()
    const hoursIn12HrFormat = hour >= 13 ? hour % 12 : hour
    const minutes = time.getMinutes()
    const ampm = hour >= 12 ? 'PM' : 'AM'

    timeElement.innerHTML = (hoursIn12HrFormat < 10 ? '0' + hoursIn12HrFormat : hoursIn12HrFormat) + ':' + (minutes < 10 ? '0' + minutes : minutes) + ' ' + `<span id="am-pm">${ampm}</span>`

    dateElement.innerHTML = days[day] + ', ' + date + ' ' + months[month]


}, 1000)

getWeatherData()
function getWeatherData() {
    navigator.geolocation.getCurrentPosition((success) => {

        let { latitude, longitude } = success.coords;

        fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=hourly,minutely&units=metric&appid=${API_KEY}`).then(res => res.json()).then(data => {

            console.log(data)
            showWeatherData(data);
        })

    })
}

function showWeatherData(data) {
    let { humidity, pressure, sunrise, sunset, wind_speed } = data.current;

    timeZoneElement.innerHTML = data.timezone;
    countryElement.innerHTML = data.lat + 'N ' + data.lon + 'E'

    currentWeatherElement.innerHTML =
        `<div class="weather-item">
        <div>Umidade</div>
        <div>${humidity} %</div>
    </div>
    <div class="weather-item">
        <div>Pressão</div>
        <div>${pressure} Pa</div>
    </div>
    <div class="weather-item">
        <div>Vento</div>
        <div>${wind_speed} km/h</div>
    </div>
    <div class="weather-item">
        <div>Nascer do sol</div>
        <div>${window.moment(sunrise * 1000).format('HH:mm a')}</div>
    </div>
    <div class="weather-item">
        <div>Por do sol</div>
        <div>${window.moment(sunset * 1000).format('HH:mm a')}</div>
    </div>
    
    
    `
    let otherDayForcast = ''
    data.daily.forEach((day, idx) => {
        if (idx == 0) {
            currentTempElement.innerHTML = `
            <img src="https://openweathermap.org/img/wn//${day.weather[0].icon}@2x.png" alt="weather icon" class="w-icon">
            <div class="other">
                <div class="day">Hoje<br>${daysMin[d.getDay()]}</div>
                <div class="temp">Noite -<br>${day.temp.night} &#176;C</div>
                <div class="temp">Dia -<br>${day.temp.day} &#176;C</div>
            </div>
            
            `
        } else {
            otherDayForcast += `
            <div class="weather-forecast-item">
                <div class="day">${daysMin[d.getDay()+idx]}</div>
                <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="weather icon" class="w-icon">
                <div class="temp">Noite - ${day.temp.night} &#176;C</div>
                <div class="temp">Dia - ${day.temp.day} &#176;C</div>
            </div>
            
            `
        }
    })


    weatherForecastElement.innerHTML = otherDayForcast;



}