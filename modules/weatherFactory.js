angular
    .module('chauffage')
    .factory('weatherservice', weatherservice);

    weatherservice.$inject = ['$http'];

function weatherservice($http) {
    return {
        getCurrentWeather: getCurrentWeather
    };

    function getCurrentWeather() {
        var urlOpenweathermap = ""; // Enter here the api.openweathermap.org URL
        var urlWunderground = ""; // Enter here the api.wunderground.com URL
        var urlWeather = urlWunderground;
        return $http.get(urlWeather)
            .then(getCurrentWeatherComplete)
            .catch(getCurrentWeatherFailed);

        function getCurrentWeatherComplete(response) {
            var _data = response.data;
            var weather = {};
            if (urlWeather === urlOpenweathermap) {
                weather.temp = _data.main.temp;
                weather.icon = "http://openweathermap.org/img/w/" + _data.weather[0].icon + ".png";
                weather.description = _data.weather[0].description;
            }
            else if (urlWeather === urlWunderground) {
                weather.temp = _data.current_observation.temp_c;
                weather.icon = _data.current_observation.icon_url;
                weather.description = _data.current_observation.weather;
            }
            return weather;
        }

        function getCurrentWeatherFailed(error) {
            //logger.error('XHR Failed for getCurrentWeather.' + error.data);
        }
    }
}