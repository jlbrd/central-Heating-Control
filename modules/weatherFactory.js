angular
    .module('chauffage')
    .factory('Weather', ['$http', function ($http) {
        var getCurrentWeather = function () {
            var urlOpenweathermap = "http://api.openweathermap.org/data/2.5/weather?q=XXX,fr&appid=APPID&lang=fr&units=metric";
            return $http.get(urlOpenweathermap)
                .then(function (response) {
                    var _data = response.data;
                    var weather = {};
                    weather.temp = _data.main.temp;
                    weather.icon = _data.weather[0].icon;
                    weather.description = _data.weather[0].description;
                    return weather;
                });
        }
        return {
            getCurrentWeather: getCurrentWeather
        };
    }]);
