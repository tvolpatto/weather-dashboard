var searchBar = $("#search");
var citiesUl = $("#cities"); 
var citiesHistory = localStorage.getItem("citiesHistory") != null
        ? JSON.parse(localStorage.getItem("citiesHistory")) : [];


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
          citiesHistory.push(response.name);
          localStorage.setItem("citiesHistory", JSON.stringify(citiesHistory));
        
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