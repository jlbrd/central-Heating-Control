angular
    .module('chauffage')
    .factory('chartservice', chartservice);

chartservice.$inject = ['$http'];

function chartservice($http) {
    return {
        getRelayState: getRelayState,
        getData: getData
    };

    function getRelayState(dateDebut, dateFin) {
        return $http({
            method: 'GET',
            url: 'php/relaystate.php',
            params: {
                dateDebut: dateDebut,
                dateFin: dateFin
            }
        })
            .then(getRelayStateComplete)
            .catch(getRelayStateFailed);

        function getRelayStateComplete(response) {
            return response.data;
        }

        function getRelayStateFailed(error) {
            //logger.error('XHR Failed for getCurrentWeather.' + error.data);
        }
    }

    function getData(dateDebut, dateFin, intervalEnMinute) {
        return $http({
            method: 'GET',
            url: 'php/releveperiode.php',
            params: {
                dateDebut: dateDebut,
                dateFin: dateFin,
                intervalEnMinute: intervalEnMinute
            }
        })
            .then(getDataComplete)
            .catch(getDataFailed);

        function getDataComplete(response) {
            return response.data;
        }

        function getDataFailed(error) {
            //logger.error('XHR Failed for getCurrentWeather.' + error.data);
        }
    }
}