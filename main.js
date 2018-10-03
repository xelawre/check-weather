const AppID = "&appid=d4795049322d07773d0b562079fabdad";

$.ajax({
  url: "http://ip-api.com/json",
  success: function(response) {
    request(response.regionName);
    $('.location').val(response.regionName);
  }
});

function request(location) {
  $.ajax({
    url: "http://api.openweathermap.org/data/2.5/weather?q="+location+'&units=metric'+AppID,
    dataType: 'jsonp',
    success: function(results) {
      if(window.lastSearch){
        historyWeatherStatus(window.lastSearch.city, window.lastSearch.temp, window.lastSearch.iconCode);
      }
      window.lastSearch = {
        temp: results.main.temp,
        city: results.name,
        iconCode: results.weather[0].icon
      };
      weatherStatus(results.name, results.main.temp, results.weather[0].icon);
    },
    fail: function() {
      alert('request failed');
    },
    complete: function() {
      $('.loading-spinner').hide();
      $('.i-sun').show();
    }
  });
}

function getWeather(event) {
  event.stopPropagation();
  let location = $('.location').val().toString();
  if(location.length > 1) {
  $('.i-sun').hide();
  $('.loading-spinner').show();
  request(location);
  }
}

function weatherStatus(city, temp, iconCode) {
  if($(".weather-history-status > p:contains('" + city + "')")) {
    $('.' + city.toLowerCase()).remove();
  }
  let contentHtml = `
    <div class='weather-status'>
      <img src='`+ "http://openweathermap.org/img/w/" + iconCode + ".png" +`' alt='Weather icon'></img>
      <h1>` + Math.round(temp) + `<h2>C°<h2>` + `</h1>
      <p>` + city + `</p>
    </div>
  `;
  $('.content').html(contentHtml);
}

function historyWeatherStatus(city, temp, iconCode) {
  $('.recent-search-label').show();
  let contentHtml = `
    <div class='weather-history-status ` + city.toLowerCase() + `'>
      <h1>` + Math.round(temp) + `<h2>C°<h2>` + `</h1>
      <img src='`+ "http://openweathermap.org/img/w/" + iconCode + ".png" +`' alt='Weather icon'></img>
      <p>` + city + `</p>
    </div>
  `;
  $('.history-content').prepend(contentHtml);
}

$(document).keypress(function(e) {
  if(e.which == 13) {
    getWeather(event);
  }
});
