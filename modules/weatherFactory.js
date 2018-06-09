angular
    .module('chauffage')
    .factory('weatherservice', weatherservice);

weatherservice.$inject = ['$http'];

function weatherservice($http) {
    return {
        getCurrentWeather: getCurrentWeather
    };

    function getCurrentWeather() {
        var urlOpenweathermap = "https://api.openweathermap.org/data/2.5/weather?q=saran,fr&appid=6b0983d0c55676e15f32d1e491394e86&lang=fr&units=metric";
        var urlWunderground = "https://api.wunderground.com/api/d1214dcc64f75d9d/lang:FR/conditions/q/pws:ISARAN10.json";
        var urlWeather = urlOpenweathermap;
        return $http.get(urlWeather)
            .then(getCurrentWeatherComplete)
            .catch(getCurrentWeatherFailed);

        function getCurrentWeatherComplete(response) {
            var _data = response.data;
            var weather = {};
            if (urlWeather === urlOpenweathermap) {
                weather.temp = _data.main.temp;
                weather.icon = "https://openweathermap.org/img/w/" + _data.weather[0].icon + ".png";
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
            //console.log('Failed for getCurrentWeather.', error.data);
        }
    }
}