app.controller("Config", function ($scope, $http, $interval, $state) {
	$scope.menuJours = [
		{ id: 1, "name": "Dimanche" }
		, { id: 2, "name": "Lundi" }
		, { id: 3, "name": "Mardi" }
		, { id: 4, "name": "Mercredi" }
		, { id: 5, "name": "Jeudi" }
		, { id: 6, "name": "Vendredi" }
		, { id: 7, "name": "Samedi" }
	]
	var d = new Date();
	$scope.jour = d.getDay() + 1;
	$scope.tabSliders = {};
	$scope.tabSlidersCache = [];

	$scope.planning = function (jour) {
		if (Object.keys($scope.tabSliders).length > 0) {
			$scope.tabSlidersCache[$scope.jour] = $scope.tabSliders;
		}

		$scope.jour = jour;
		$scope.tabSliders = {};
		if ($scope.tabSlidersCache.length > 0) {
			$scope.tabSliders = $scope.tabSlidersCache[jour];
		}
		else {
			$http.get("php/planning.php")
				.then(function (response) {
					var sliderId = 0;
					var jourActuel = 1;
					response.data.forEach(function (entry) {
						if (jourActuel != entry.jour) {
							$scope.tabSliders = {};
							jourActuel = entry.jour;
							sliderId = 0;
						}
						var nouveau = $scope.nouveauSlider();
						nouveau.options.jour = entry.jour;
						nouveau.options.planning_id = sliderId;
						nouveau.options.temperature_id = entry.temperature_id;
						var tdeb = entry.heureDebut.split(":");
						nouveau.minValue = (tdeb[0].valueOf() * 60) + (tdeb[1].valueOf() * 1);
						var tfin = entry.heureFin.split(":");
						nouveau.maxValue = (tfin[0].valueOf() * 60) + (tfin[1].valueOf() * 1);
						$scope.tabSliders[sliderId++] = nouveau;
						$scope.tabSlidersCache[entry.jour] = $scope.tabSliders;
					});
					$scope.tabSliders = $scope.tabSlidersCache[jour];
				}
				)
				.catch(function (data, status, headers, config) {
					console.log('error');
				});
		}
	}

	function temperatures() {
		$http.get("php/temperatures.php")
			.then(function (response) {
				$scope.temperatures = response.data;
			}
			)
			.catch(function (data, status, headers, config) {
				console.log('error');
			});
	}


	function length(obj) {
		return Object.keys(obj).length;
	}

	$scope.supprimePlage = function (id) {
		var nouvTabSliders = {};
		var num = 0;
		for (var i = 0; i < length($scope.tabSliders); i++) {
			if ($scope.tabSliders[i].options.planning_id != id) {
				nouvTabSliders[num] = $scope.tabSliders[i];
				nouvTabSliders[num].options.planning_id = num;
				num++;
			}
			else {
				$scope.tabSliders[i - 1].maxValue = $scope.tabSliders[i].maxValue
			}
		}
		$scope.tabSliders = nouvTabSliders;
	}
	$scope.ajoutePlage = function (id) {
		var sliderActuel = $scope.tabSliders[id];
		var nouveau = $scope.nouveauSlider();
		var nouvId = id + 1;
		nouveau.options.planning_id = nouvId;
		nouveau.options.jour = sliderActuel.options.jour;
		nouveau.options.temperature_id = sliderActuel.options.temperature_id;
		nouveau.minValue = sliderActuel.minValue + ((sliderActuel.maxValue - sliderActuel.minValue) / 2);
		nouveau.maxValue = sliderActuel.maxValue;
		sliderActuel.maxValue = nouveau.minValue;
		var nouvTabSliders = {};
		for (var i = 0; i <= id; i++) {
			if ($scope.tabSliders[i] != null) {
				nouvTabSliders[i] = $scope.tabSliders[i];
			}
		}
		nouvTabSliders[id + 1] = nouveau;
		for (i = id + 1; i < length($scope.tabSliders); i++) {
			nouvTabSliders[i + 1] = $scope.tabSliders[i];
			nouvTabSliders[i + 1].options.planning_id = i + 1;
		}
		$scope.tabSliders = nouvTabSliders;
	};
	$scope.valider = function () {
		if (Object.keys($scope.tabSliders).length > 0) {
			$scope.tabSlidersCache[$scope.jour] = $scope.tabSliders;
		}
		for (var jour = 1; jour < 8; jour++) {
			if ($scope.tabSlidersCache[jour] != null) {
				$http.post('php/majPlanning.php', $scope.tabSlidersCache[jour])
					.then(function (data, status, headers, config) {
						
					})
					.catch(function (data, status, headers, config) {
						console.log('error');
					});
			}
		}
		$state.go('chauffage');
	}
	$scope.nouveauSlider = function () {
		var nouveau = {
			options: {
				showSelectionBar: true,
				ceil: 1439,
				step: 15,
				translate: function (value) {
					if (value == this.options.ceil && this.options.planning_id + 1 < length($scope.tabSliders)) {
						return '';
					}
					else if (value == 0 && this.options.planning_id != 0) {
						return '';
					}
					else if (value == this.highValue && this.options.planning_id + 1 < length($scope.tabSliders)) {
						return '';
					}
					if (value == this.highValue && this.options.planning_id + 1 == length($scope.tabSliders) && value != 1439) {
						value--;
					}
					var hours = Math.trunc((value) / 60);
					var minutes = (value) % 60;
					return hours.toString() + "h" + (minutes.toString() > 0 ? minutes.toString() : '');
				},
				onChange: function () {
					var slider = this;
					if ($scope.tabSliders[slider.planning_id].maxValue == $scope.tabSliders[slider.planning_id].minValue) {
						if ($scope.tabSliders[slider.planning_id].maxValue == 1439) {
							$scope.tabSliders[slider.planning_id].minValue = $scope.tabSliders[slider.planning_id].maxValue - 1;
						}
						else {
							$scope.tabSliders[slider.planning_id].maxValue = $scope.tabSliders[slider.planning_id].minValue + 1;
						}
						$scope.tabSliders[slider.planning_id].maxValue = $scope.tabSliders[slider.planning_id].minValue + 1;
					}
					if (0 == slider.planning_id) {
						// Le premier
						$scope.tabSliders[0].minValue = 0;
					}
					if (length($scope.tabSliders) - 1 == slider.planning_id) {
						// Le dernier
						$scope.tabSliders[length($scope.tabSliders) - 1].maxValue = 1439;
					}
					if (0 != slider.planning_id && length($scope.tabSliders) - 1 != slider.planning_id) {
						// Au milieu
						if ($scope.tabSliders[slider.planning_id].minValue == 0) {
							$scope.tabSliders[slider.planning_id].minValue = 15;
						}
						if ($scope.tabSliders[slider.planning_id].maxValue == 1439) {
							$scope.tabSliders[slider.planning_id].maxValue = 1439 - 15;
						}
					}
					if (slider.planning_id > 0) {
						$scope.tabSliders[slider.planning_id - 1].maxValue = $scope.tabSliders[slider.planning_id].minValue;
					}
					if (length($scope.tabSliders) - 1 > slider.planning_id) {
						$scope.tabSliders[slider.planning_id + 1].minValue = $scope.tabSliders[slider.planning_id].maxValue;
					}

				}
			}
		};
		return nouveau;
	}

	temperatures();
	$scope.planning($scope.jour);

});

