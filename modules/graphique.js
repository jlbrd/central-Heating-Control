app.controller("Graphique", function ($scope, $http, $location, $filter, chartservice) {
    $scope.dateDebut = new Date();
    $scope.dateFin = new Date();

    $scope.piechartObject = {};
    $scope.piechartObject.type = "PieChart";
    $scope.piechartObject.options = {
        is3D: true,
        width: 600
    }
    $scope.areaChartObject = {
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
                /*{
                    "id": "wunderground",
                    "label": "wunderground",
                    "type": "number",
                    "p": {}
                },
                {
                    "id": "openweathermap",
                    "label": "openweathermap",
                    "type": "number",
                    "p": {}
                },*/
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

    $scope.areaChartObject.options = {
        displayAnnotations: true,
        legend: { position: 'top', textStyle: { fontSize: 16 } },
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

    function areaChart() {
        var dateDebut = $filter('date')($scope.dateDebut, "yyyyMMdd");
        var dateFin = $filter('date')($scope.dateFin, "yyyyMMdd");
        var intervalEnMinute = 60;
        var timeDiff = Math.abs($scope.dateDebut.getTime() - $scope.dateFin.getTime());
        var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

        if (diffDays <= 2) {
            intervalEnMinute = 5;
        }
        chartservice.getData(dateDebut, dateFin, intervalEnMinute).then(function (response) {
            if (response.length == 0) {
                return;
            };
            $scope.areaChartObject.data.rows = [];
            response.forEach(function (entry) {
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
                            /*}, {
                                "v": entry.wunderground
                            }, {
                                "v": entry.openweathermap*/
                        }, {
                            "v": entry.valeur
                        }, {
                            "v": entry.consigne
                        }
                    ]
                };
                $scope.areaChartObject.data.rows.push(data);
            });
        }, function errorCallback(response) {
        });
    };

    function relayState() {

        var dateDebut = $filter('date')($scope.dateDebut, "yyyyMMdd");
        var dateFin = $filter('date')($scope.dateFin, "yyyyMMdd");
        chartservice.getRelayState(dateDebut, dateFin).then(function (response) {
            if (response.length == 0) {
                return;
            };
            $scope.piechartObject.data = {
                "cols": [
                    { id: "t", label: "Topping", type: "string" },
                    { id: "s", label: "Slices", type: "number" }
                ], "rows": [
                    {
                        c: [
                            { v: "En marche" },
                            { v: parseInt(response[1] == null ? 0 : response[1].nbre) },
                        ]
                    },
                    {
                        c: [
                            { v: "Arrêté" },
                            { v: parseInt(response[0] == null ? 0 : response[0].nbre) }
                        ]
                    },
                ]
            };

        });
    }


    $scope.graphe = function () {
        $scope.chargement = true;
        areaChart();
        relayState();
        $scope.chargement = false;
    }

    $scope.graphe();

});

app.config(function ($mdDateLocaleProvider) {
    $mdDateLocaleProvider.shortMonths = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
    $mdDateLocaleProvider.formatDate = function (date) {

        var day = date.getDate();
        var monthIndex = date.getMonth();
        var year = date.getFullYear();

        return day + '/' + (monthIndex + 1) + '/' + year;

    };
});