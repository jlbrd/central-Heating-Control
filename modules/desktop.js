app.controller("desktop", function ($scope, $http, $interval, $controller, $location, $filter) {
    $controller('chauffage', {$scope: $scope, $http: $http, $interval: $interval}); 
    $controller('Graphique', {$scope: $scope, $http: $http, $location: $location, $filter: $filter}); 
    //app.controller("Graphique", function ($scope, $http, $location, $filter) {
    $scope.desktop = true;
});