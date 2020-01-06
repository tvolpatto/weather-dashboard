var searchBar = $("#search");
var citiesUl = $("#cities"); 
var citiesHistory = localStorage.getItem("citiesHistory") != null
        ? JSON.parse(localStorage.getItem("citiesHistory")) : [];
var APIKey = "507a3776f280a2bc0631714df5f208a7";


searchBar.keypress((event)=>{  
    var keycode = (event.keyCode ? event.keyCode : event.which);
    if(keycode == '13'){
        event.preventDefault();
        var cityName = searchBar.val();
        apiCall(cityName);

    }

});

function apiCall(cityName) {
    todayApiCall(cityName);
    
}


function todayApiCall(cityName) {
   
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?appid=" + APIKey+"&q="+cityName;

    $.ajax({
        url : queryURL,
        method: "GET"
      }).then((response)=>{
         
          saveCity(response.name);
          renderTodaysForecast(response);
          uvApiCall(response.coord);
          fiveDaysApiCall(response.id);
      });
}

function uvApiCall(coord) {
    var queryURL = "https://api.openweathermap.org/data/2.5/uvi/forecast?cnt=1&appid=" + APIKey+"&lat="+coord.lat+"&lon="+coord.lon;

    $.ajax({
        url : queryURL,
        method: "GET"
      }).then((response)=>{
          renderUvIndex(response[0]);      
      });
}

function fiveDaysApiCall(cityId) {
   
    var queryURL = `https://api.openweathermap.org/data/2.5/forecast?appid=${APIKey}&id=${cityId}`;

    $.ajax({
        url : queryURL,
        method: "GET"
      }).then((response)=>{
         console.log(response);      
         render5DayForecast(response.list);
      });
}

function loadSearchHistory(){ 
    citiesUl.empty();   
    citiesHistory.forEach(city => {
        var li = $("<li>");
        li.text(city);
        li.click(cityClick);
        citiesUl.append(li);
            
    });  
}

function cityClick() {
    var cityName = $(this).text();
    apiCall(cityName);
}

$(document).ready(()=>{
    loadSearchHistory();
});

function renderTodaysForecast(forecast) {
    var city = $("#city-name");
    city.text(forecast.name);

    var temp = $("#temp");
    temp.text(`Temperature: ${kelvinToFahrenheit(forecast.main.temp)} °F`);

    var hum = $("#humidity");
    hum.text(`Humidity: ${forecast.main.humidity}%`);
    
    var wind = $("#wind");
    wind.text(`Wind Speed: ${forecast.wind.speed} MPH`);  
}

function renderUvIndex(uv){
    var uvIndex = $("#uv-index");
    uvIndex.text(`UV Index: ${uv.value}`);

}

function render5DayForecast(forecastList) {
    var cardsDiv = $("#5-day-cards");
    cardsDiv.empty();
    var day = moment("01/01/1900").format("MM/DD/YYYY");
    forecastList.forEach((weather) =>{
        var newDay = moment(weather.dt_txt).format("MM/DD/YYYY");
        if(day !== newDay) {
            day = newDay;
            var card = $("<div class='card col-2'></div>");
            var date = $(`<h5 class='card-title'>${day}</h5>`);
            var temp = $(`<div class="card-temp">Temp: ${kelvinToFahrenheit(weather.main.temp)} °F</div>`);
            var hum =  $(`<div class="card-hum">Humidity: ${weather.main.humidity}%</div>`);
            card.append(date, temp, hum);
            cardsDiv.append(card);

        }
    });

}

function kelvinToFahrenheit(temp){
   return Math.round(((temp - 273.15) * 9/5 + 32), 2); 
}

function saveCity(city) {
    if(citiesHistory.indexOf(city) === -1){
        if (citiesHistory.length >=10) {
            citiesHistory.pop(0);
        } 
        citiesHistory.push(city);
        localStorage.setItem("citiesHistory", JSON.stringify(citiesHistory));
        loadSearchHistory();
    }
}
