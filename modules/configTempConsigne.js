app.controller("ConfigTempConsigne", function ($scope, $http, $interval, $state) {
    function temperatures() {
        $http.get("php/temperatures.php")
            .then(function (response) {
                $scope.temperatures = response.data;
                for(var i=0; i<$scope.temperatures.length; i++) {
                    $scope.temperatures[ i ].valeur = parseFloat( $scope.temperatures[ i ].valeur )
                }
            }
            )
            .catch(function (data, status, headers, config) {
                console.log('error');
            });
    }

    $scope.valider = function() {
        $http.post('php/changeTempConsigne.php', $scope.temperatures)
        .then(function (data, status, headers, config) {
            $state.go('chauffage');
        })
        .catch(function (data, status, headers, config) {
            console.log('error');
        });

    }

    temperatures();
});