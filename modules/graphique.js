app.controller("Graphique", function ($scope, $http, $location, $filter) {
    $scope.dateDebut = new Date();
    $scope.dateFin = new Date();

    $scope.myChartObject = {
        "type": "AreaChart",
        "displayed": false,
        "data": {
            "cols": [
                {
                    "id": "heure",
                    "label": "Heure",
                    "type": "string",
                    "p": {}
                },
                {
                    "id": "ext",
                    "label": "Extérieur",
                    "type": "number",
                    "p": {}
                },
                {
                    "id": "int",
                    "label": "Intérieur",
                    "type": "number",
                    "p": {}
                },
                {
                    "id": "consigne",
                    "label": "Consigne",
                    "type": "number",
                    "p": {}
                },
            ],
            "rows": [
            ]
        },
        "formatters": {}
    };

    $scope.graphe = function () {
        //var today = $filter('date')(new Date(), "yyyyMMdd");
        var intervalEnMinute = 60;
        var timeDiff = Math.abs($scope.dateDebut.getTime() - $scope.dateFin.getTime());
        var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

        if (diffDays <= 2) {
            intervalEnMinute = 5;
        }
        $http({
            method: 'GET',
            url: 'php/releveperiode.php',
            params: {
                dateDebut: $filter('date')($scope.dateDebut, "yyyyMMdd"),
                dateFin: $filter('date')($scope.dateFin, "yyyyMMdd"),
                intervalEnMinute: intervalEnMinute
            }
        }).then(function successCallback(response) {
            $scope.myChartObject.data.rows = [];
            response.data.forEach(function (entry) {
                var dateCreation = $filter('date')(new Date(entry.dateCreation), "HH:mm");
                if (dateCreation == "00:00") {
                    dateCreation = $filter('date')(new Date(entry.dateCreation), "dd/MM");
                }
                var data = {
                    "c": [
                        {
                            "v": dateCreation
                        }, {
                            "v": entry.exterieur
                        }, {
                            "v": entry.valeur
                        }, {
                            "v": entry.consigne
                        }
                    ]
                };
                $scope.myChartObject.data.rows.push(data);
            });
            $scope.myChartObject.options = {
                displayAnnotations: true,
                legend: {position: 'top', textStyle: {fontSize: 16}},
                "height": 600,
                //width: '100%',
                "titlePosition": 'none',
                "vAxis": {
                    //"title": "Température",
                    "gridlines": {
                        "count": 20
                    }
                }
            };
        }, function errorCallback(response) {
        });
    };

    $scope.graphe();

});

app.config(function ($mdDateLocaleProvider) {
    $mdDateLocaleProvider.shortMonths = ['janv', 'févr', 'mars', 'avri', 'mai', 'juin', 'juil', 'août', 'sept', 'octo', 'nove', 'déce'];
    $mdDateLocaleProvider.formatDate = function (date) {

        var day = date.getDate();
        var monthIndex = date.getMonth();
        var year = date.getFullYear();

        return day + '/' + (monthIndex + 1) + '/' + year;

    };
});