const cityInput = document.querySelector('input');
const apiKey = 'b80b52c331368860cdc190459543327e';
let units = 'C';

const unitsButton = document.getElementById('units_button')

let city = cityInput.value || 'Medellin';

const weatherName = document.getElementById('weather_name');
const cityName = document.getElementById('city_name');
const date = document.getElementById('date');
const time = document.getElementById('time');
const temperature = document.getElementById('temperature');
const mainIcon = document.getElementById('main_icon');

const dayNames = Array.from(document.getElementsByClassName('daily_day-name'));
const dayTemp = Array.from(document.getElementsByClassName('daily_temp'));
const dayMinTemp = Array.from(document.getElementsByClassName('daily_min-temp'));
const dayIcons = Array.from(document.getElementsByClassName('daily_icon'));

const icons = {
  '01d': 'sun.svg',
  '01n': 'moon.svg',
  '02d': 'cloudy-day.svg',
  '02n': 'cloudy-night.svg',
  '03d': 'cloud.svg',
  '03n': 'cloud.svg',
  '04d': 'cloudy.svg',
  '04n': 'cloudy.svg',
  '09d': 'rainy.svg',
  '09n': 'rainy.svg',
  '10d': 'rainy.svg',
  '10n': 'rainy.svg',
  '11d': 'lightning.svg',
  '11n': 'lightning.svg',
  '13d': 'snow.svg',
  '13n': 'snow.svg',
  '50d': 'mist.svg',
  '50n': 'mist.svg'
};

const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const capitalize = (string) => {
  let arr = string.split(' ');
  let newArr = [];
  for (let word of arr) {
    let upperCaseWord = word[0].toUpperCase() + word.slice(1);
    newArr.push(upperCaseWord);
  }
  return newArr.join(' ');
}

const getWeather = () => {
  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${units === 'C' ? 'metric' : 'imperial'}`, {mode: 'cors'})
  .then(function (response) {
    return response.json();
  })
  .then(function (response) {
    const now = new Date();
    weatherName.textContent = capitalize(response.weather[0].description);
    cityName.textContent = `${response.name}. ${response.sys.country}`;
    date.textContent = `${weekDays[now.getDay()]}, ${now.getDate()}th ${months[now.getMonth()]} ${now.getFullYear()}`;
    time.textContent = `${now.getHours()}:${now.getMinutes()}`;
    temperature.textContent = `${response.main.temp.toFixed(1)} °${units}`;
    /* mainIcon.src = `./assets/SVG/${icons['01n']}`; */
    mainIcon.src = `./assets/SVG/${icons[response.weather[0].icon]}`;
    console.log(response);
  })
  .catch(function (err) {
    throw new Error(err);
  })
}

const getForecast = () => {
  fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=${units === 'C' ? 'metric' : 'imperial'}`, {mode: 'cors'})
  .then(function (response) {
    return response.json();
  })
  .then(function (response) {
    for (let i = 0; i < dayNames.length; i++) {
      const index = 6 + (i * 8);
      const forecastDate = response.list[index].dt_txt;
      const dayNumb = new Date(forecastDate).getDay();
      const day = weekDays[dayNumb];
      const temp = response.list[index].main.temp.toFixed(1);
      const minTemp = response.list[index].main.temp_min.toFixed(1);
      const iconCode = response.list[index].weather[0].icon;
      const iconSrc = `./assets/SVG/${icons[iconCode]}`;
      console.log(iconSrc);
      
      dayNames[i].textContent = day;
      dayTemp[i].textContent = `${temp} °${units}`;
      dayMinTemp[i].textContent = `${minTemp} °${units}`;
      dayIcons[i].src = iconSrc;
    }
    console.log(response);
  })
  .catch(function (err) {
    throw new Error(err);
  })
}

getWeather()
getForecast()

const changeUnits = () => {
  if (units === 'C') {
    units = 'F';
  } else if (units === 'F') {
    units = 'C';
  }
  unitsButton.textContent = `Temp in °${units === 'C' ? 'F' : 'C'}`;
  getWeather();
  getForecast();
}

const changeCity = (e) => {
  console.log(e)
  console.log(cityInput.value)
  if (e.key === 'Enter') {
    city = cityInput.value;
    cityInput.value = '';
    getWeather();
    getForecast();
  }
}

unitsButton.addEventListener('click', changeUnits);
cityInput.addEventListener('keydown', changeCity);