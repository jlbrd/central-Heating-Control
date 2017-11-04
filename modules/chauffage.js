app.controller("chauffage", function ($scope, $http, $interval, Weather) {
	$scope.absent = false;
	$scope.horsgel = false;
	$scope.priceSlider = 150;
	$scope.tempsConsigneManuelle = {
		value: 3,
		options: {
			floor: 1,
			ceil: 12,
			step: 1,
			minLimit: 1,
			maxLimit: 12,
			onChange: function () {
				var _v = $scope.tempsConsigneManuelle.value;
				$scope.changeConsigne('MANUELLE', null, _v);
			}
		}
	};
	releve();
	tempConsigne();
	weather();

	$interval(function () {
		releve();
		tempConsigne();
		weather();
	}, 60000);

	$scope.absentChange = function () {
		if ($scope.absent == true) {
			$scope.changeConsigne('ABSENT');
			$scope.horsgel = false;
			tempConsigne();
		}
		else {
			$scope.annuleConsigneManuelle();
		}
	};

	$scope.horsgelChange = function () {
		if ($scope.horsgel == true) {
			$scope.changeConsigne('HORSGEL');
			$scope.absent = false;
			tempConsigne();
		}
		else {
			$scope.annuleConsigneManuelle();
		}
	};

	$scope.annuleConsigneManuelle = function () {
		$http.post('php/annuleConsigneManuelle.php')
			.then(function () {
				tempConsigne();
			})
			.catch(function () {
				console.log('error');
			});

	}

	$scope.changeConsigne = function (type, valeur, duree) {
		if (duree == null) {
			duree = 3;
		}
		if (valeur == null) {
			valeur = 0;
		}
		data = {
			'valeur': $scope.tempConsigne + valeur
			, 'type': type
			, 'duree': duree
		};

		$http.post('php/changeConsigne.php', data)
			.then(function (data, status, headers, config) {
				tempConsigne();
			})
			.catch(function (data, status, headers, config) {
				console.log('error');
			});


	};


	function releve() {
		$http.get("php/releve.php")
			.then(function (response) {
				$scope.tempActuelle = parseFloat(response.data.valeur.trim());
				dateMajReleve(response.data.dateCreation);
				$scope.relai = response.data.relai;
			}
			)
			.catch(function (data, status, headers, config) {
				console.log('error');
			});
	}

	function dateMajReleve(dateCreation) {
		dateCreation = new Date(dateCreation);
		var hours = (dateCreation.getHours() < 10 ? "0" : "") + dateCreation.getHours();
		var minutes = (dateCreation.getMinutes() < 10 ? "0" : "") + dateCreation.getMinutes();;
		$scope.dateMajReleve = hours + ":" + minutes;

		var diff = Math.abs(dateCreation - new Date());
		var minutesDiff = Math.floor((diff / 1000) / 60);
		if (minutesDiff > 10) {
			$scope.alert = 1;
		}
		else {
			$scope.alert = 0;
		}
	}

	function tempConsigne() {
		$http.get("php/tempConsigne.php")
			.then(function (response) {
				var _temp = response.data.valeur.trim();
				$scope.tempConsigne = parseFloat(_temp);
				$scope.absent = false;
				$scope.horsgel = false;
				$scope.modeConsigne = response.data.mode;
				switch ($scope.modeConsigne) {
					case "MANUELLE":
						$scope.libelleConsigne = "Consigne manuelle"
						$scope.showSliderConsigneManuelle = 1;
						break;
					case 'ABSENT':
						$scope.libelleConsigne = "Mode absent jusqu'à nouvel ordre";
						$scope.showSliderConsigneManuelle = 0;
						$scope.absent = true;
						break;
					case 'HORSGEL':
						$scope.libelleConsigne = "Mode hors-gel jusqu'à nouvel ordre";
						$scope.showSliderConsigneManuelle = 0;
						$scope.horsgel = true;
						break;
					default:
						$scope.libelleConsigne = "Mode " + $scope.modeConsigne;
						$scope.showSliderConsigneManuelle = 0;
						break;
				}
				var time = response.data.heureFin.split(':');

				var d = new Date(); // creates a Date Object using the clients current time

				d.setHours(+time[0]); // set Time accordingly, using implicit type coercion
				d.setMinutes(time[1]); // you can pass Number or String, it doesn't matter
				d.setSeconds(time[2]);
				d = new Date(d.toString());
				$scope.heureFinConsigne = d;

				$scope.tempsConsigneManuelle.value = response.data.duree;
			}
			);
	}

	function weather() {
		Weather.getCurrentWeather().then(function (response) {
			$scope.weather = response;
		});
	}

	function localToUTC(local) {
		var date = new Date(local);
		var localOffset = date.getTimezoneOffset() * 60000;
		var localTime = date.getTime();
		date = localTime + localOffset;
		date = new Date(date);
		console.log("localToUTC Local " + local + "UTC: " + date);
		return date;
	}

	function utcToLocal(utc) {
		var date = new Date(utc);
		var localOffset = date.getTimezoneOffset() * 60000;
		var localTime = date.getTime();
		date = localTime - localOffset;
		date = new Date(date);
		console.log("utcToLocal UTC :" + utc + " Local: " + date);
		return date;
	}

});
