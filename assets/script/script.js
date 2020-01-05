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
          console.log(response);
          citiesHistory.push(response.name);
          localStorage.setItem("citiesHistory", JSON.stringify(citiesHistory));
          renderTodaysForecast(response);
          uvApiCall(response.coord);
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


function loadSearchHistory(){ 
    
    citiesHistory.forEach(city => {
        var li = $("<li>");
        li.text(city);
        citiesUl.append(li);
            
    });
    
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
    console.log(uv);
    var uvIndex = $("#uv-index");
    uvIndex.text(`UV Index: ${uv.value}`);

}

function kelvinToFahrenheit(temp){
   return Math.round(((temp - 273.15) * 9/5 + 32), 2); 
}