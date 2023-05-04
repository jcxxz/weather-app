const key = '62f623f9ee5ba081c1e5e5f6340f67a9';
let city = 'Houston';

const date = moment().format('dddd, MMMM Do YYYY');
const dateTime = moment().format('dddd, MMMM Do YYYY, H:MM:SS ');

const cityHist = [];
const searchBtn = $('.search');
const textVal = $('.textVal');
const contHistEl = $('.cityHist');
const cardTodayBody = $('.cardBodyToday');
const fiveForecastEl = $('.fiveForecast');

searchBtn.on('click', function (event) {
  event.preventDefault();
  city = textVal.val();
  cityHist.push(city);
  localStorage.setItem('cityHist', JSON.stringify(cityHist));
  renderCityHist();
  getWeather();
});

function renderCityHist() {
	  contHistEl.empty();
  for (let i = 0; i < cityHist.length; i++) {
	const cityHistBtn = $('<button>');
	cityHistBtn.addClass('btn btn-secondary btn-block');
	cityHistBtn.text(cityHist[i]);
	contHistEl.append(cityHistBtn);
  }
}

function getHistory() {
  const storedHistory = JSON.parse(localStorage.getItem('cityHist'));
  if (storedHistory !== null) {
	cityHist = storedHistory;
  }
  renderCityHist();
}

function getWeatherToday() {
	const getUrlCurrent = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${key}`;
	cardTodayBody.empty();
	fetch(getUrlCurrent)
	  .then((response) => response.json())
	  .then((response) => {
		$('.cardTodayCityName').text(response.name);
		$('.cardTodayDate').text(date);
		$('.icons').attr(
		  'src',
		  `https://openweathermap.org/img/wn/${response.weather[0].icon}@2x.png`
		);
		const pEl = $('<p>').text(`Temperature: ${response.main.temp} °F`);
		cardTodayBody.append(pEl);
		const pElTemp = $('<p>').text(`Feels Like: ${response.main.feels_like} °F`);
		cardTodayBody.append(pElTemp);
		const pElHumid = $('<p>').text(`Humidity: ${response.main.humidity} %`);
		cardTodayBody.append(pElHumid);
		const pElWind = $('<p>').text(`Wind Speed: ${response.wind.speed} MPH`);
		cardTodayBody.append(pElWind);
		const cityLon = response.coord.lon;
		const cityLat = response.coord.lat;
		const getUrlUvi = `https://api.openweathermap.org/data/2.5/onecall?lat=${cityLat}&lon=${cityLon}&exclude=hourly,daily,minutely&appid=${key}`;
		fetch(getUrlUvi)
		  .then((response) => response.json())
		  .then((response) => {
			const pElUvi = $('<p>').text('UV Index: ');
			const uviSpan = $('<span>').text(response.current.uvi);
			const uvi = response.current.uvi;
			pElUvi.append(uviSpan);
			cardTodayBody.append(pElUvi);
			if (uvi >= 0 && uvi <= 2) {
			  uviSpan.attr('class', 'green');
			} else if (uvi >= 3 && uvi <= 5) {
			  uviSpan.attr('class', 'yellow');
			} else if (uvi >= 6 && uvi <= 7) {
			  uviSpan.attr('class', 'orange');
			} else if (uvi >= 8 && uvi <= 10) {
			  uviSpan.attr('class', 'red');
			} else if (uvi >= 11) {
			  uviSpan.attr('class', 'purple');
			} else {
			  uviSpan.attr('class', 'black');
			}
		});
	});
}

function getWeather() {
  getWeatherToday();
  getWeatherForecast();
}

function getFiveDayForecast () { 
	const getUrlForecast = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=${key}`;
	fiveForecastEl.empty();
	fetch(getUrlForecast)
	  .then((response) => response.json())
	  .then((response) => {
		const forecast = response.list;
		for (let i = 0; i < forecast.length; i++) {
		  if (forecast[i].dt_txt.indexOf('15:00:00') !== -1) {
			const cardEl = $('<div>').attr('class', 'card text-white bg-primary mb-3');
			const cardBodyEl = $('<div>').attr('class', 'card-body');
			const cardTitleEl = $('<h5>').attr('class', 'card-title');
			cardTitleEl.text(new Date(forecast[i].dt_txt).toLocaleDateString());
			const cardImgEl = $('<img>').attr(
			  'src',
			  `https://openweathermap.org/img/wn/${forecast[i].weather[0].icon}.png`
			);
			const cardTempEl = $('<p>').text(`Temp: ${forecast[i].main.temp_max} °F`);
			const cardHumidEl = $('<p>').text(`Humidity: ${forecast[i].main.humidity} %`);
			cardBodyEl.append(cardTitleEl, cardImgEl, cardTempEl, cardHumidEl);
			cardEl.append(cardBodyEl);
			fiveForecastEl.append(cardEl);
		  }
		}
	  });
}

function getWeatherForecast() {
	  getFiveDayForecast();
}

getHistory();
getWeather();




		



