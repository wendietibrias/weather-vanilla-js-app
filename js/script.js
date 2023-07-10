//constanta API
const API_KEY = 'e42ff2c687be44738b7153101231306';
const BASE_URL = 'http://api.weatherapi.com/v1';
const randomCity = [
    "makassar",
    "medan",
    "surabaya",
    "tokyo",
    "washington",
    "london",
    "pontianak",
    "bandung",
    "surabaya"
]

//variabel
let loading = false;

//DOMElement
const weatherContainer = document.querySelector('.weather-container');
const weatherContent  = document.querySelector('.weather-display-container');
const searchInput = document.getElementById('search-input');

//icon display by weather condition

function displayIcon(condition) {
    if(!condition) return;

    if(condition.includes("rain")) {
        return `<img width="96" height="96" src="https://img.icons8.com/fluency/96/heavy-rain.png" alt="heavy-rain"/>`;
    }

    if(condition.includes("sunny")) {
        return `<img width="96" height="96" src="https://img.icons8.com/fluency/96/sun.png" alt="sun"/>`;
    }

    if(condition.includes("cloudy") || condition.includes("clear")) {
        return `<img width="96" height="96" src="https://img.icons8.com/fluency/96/partly-cloudy-day.png" alt="partly-cloudy-day"/>`;
    }

    if(condition.includes("snow")) {
        return `<img width="96" height="96" src="https://img.icons8.com/fluency/96/snow.png" alt="snow"/>`;
    }

    if(condition.includes("fog")) {
        return `<img width="96" height="96" src="https://img.icons8.com/fluency/96/foggy-night-1.png" alt="foggy-night-1"/>`;
    }

    if(condition.includes("haze")) {
        return `<img width="96" height="96" src="https://img.icons8.com/fluency/96/wind.png" alt="wind"/>`;
    }

    if(condition.includes("mist")) {

    }

    else {
        return `<img width="96" height="96" src="https://img.icons8.com/fluency/96/wet.png" alt="wet"/>`;
    }
}

//function for renderHTML
function displayWeatherInfo({ current,location }) {
     let temp = '';

     temp += `
       <div class="weather-content">
          <div class="weather-location-info">
          <div class="weather-location-mark">
          <i class="ri-map-pin-2-line"></i>
           <h5>${location?.name}</h5>
          </div>
           <p>${current?.last_updated}</p>
          </div>
          <div class="weather-condition-info">
            ${displayIcon(current?.condition?.text?.toLowerCase())}
            <h3 class="weather_temp">
            ${Math.floor(current?.temp_c)}C
            <span class="celcius_circle"></span>
            </h3>
            <p>${current?.condition?.text}</p>
            <div class="other-weather-info">
              <span>
              <i class="ri-cloud-windy-line"></i>
              <p>${current?.wind_degree}</p>
              </span>
              <span>
              <i class="ri-water-flash-line"></i>
              <p>${current?.humidity}</p>
              </span>
              <span>
              <i class="ri-cloud-windy-line"></i>
              <p>${current?.cloud}</p>
              </span>
            </div>
          </div>
       </div>
    `;

    weatherContent.innerHTML = temp;
}

function displayLoadingLoad() {
   let temp = '';

   temp = `
      <div class="loading-alert">
       <h4>Wait..</h4>
      </div>
   `;


   weatherContent.innerHTML = temp;
}

function displayErrorAlert(message = "City not found") {
   let temp = `
     <div class="error-alert">
       <i class="ri-close-circle-line"></i>
       <h4>${message}</h4>
    </div>
   `;

   weatherContent.innerHTML = temp;
}

//function api request
async function getWeatherData(q) {

   let request;

   displayLoadingLoad();

    try {
        if(typeof q === 'string') {
           request = await fetch(`${BASE_URL}/forecast.json?key=${API_KEY}&q=${q}`);
        } else {
           request = await fetch(`${BASE_URL}/forecast.json?key=${API_KEY}&q=${q.latitude} ${q.longitude}`);
        }

        const weatherData = await request.json();

        if(!weatherData.error) {
            const { current,location } = weatherData;
            displayWeatherInfo({ current,location });
        } else {
            displayErrorAlert(weatherData.error.message);
        }

    } catch(err) {
        displayErrorAlert("City is not found")
        return err;
    }
}

async function handleSearch(e) {
   e.preventDefault();
    
   if(e.keyCode === 13) {
      getWeatherData(e.target.value);
   }
}

window.addEventListener('load' , function() {
      this.navigator.geolocation.getCurrentPosition(({ coords }) => {
          const { latitude,longitude } = coords;
          getWeatherData({ latitude,longitude });

      }, (error) => {
          const getCity = randomCity[Math.floor(Math.random() * randomCity.length)];
          getWeatherData(getCity);
      })
});

searchInput.addEventListener('keyup' , handleSearch);