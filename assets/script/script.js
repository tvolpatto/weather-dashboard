var searchBar = $("#search");




searchBar.keypress((event)=>{
   
    var keycode = (event.keyCode ? event.keyCode : event.which);
    if(keycode == '13'){
        event.preventDefault();
        var cityName = searchBar.val();
        apiCall(cityName);

    }

});

function apiCall(cityName) {
    var APIKey = "507a3776f280a2bc0631714df5f208a7";
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?appid=" + APIKey+"&q="+cityName;

    $.ajax({
        url : queryURL,
        method: "GET"
      }).then((response)=>{
          console.log(response);
     
     console.log(response.name);
     console.log("Wind Speed: "+ response.wind.speed);
     console.log("Humidity: "+response.main.humidity);
     console.log("Temp: "+response.main.temp);
  
          
      });
}