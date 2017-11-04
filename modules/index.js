var app = angular.module("chauffage", ['rzModule', 'googlechart', 'ngMaterial', 'ngMessages', 'ui.router', 'uiSwitch']);

app.component('chauffage', {
	templateUrl: 'main.html',
	controller: 'chauffage'
});

app.component('desktop', {
	templateUrl: 'desktop.html',
	controller: 'desktop'
});

app.component('configuration', {
	templateUrl: "configPlanning.html",
	controller: 'Config'
});

app.component('graphique', {
	templateUrl: "graphique.html",
	controller: 'Graphique'
});

app.component('configTempConsigne', {
	templateUrl: "configTempConsigne.html",
	controller: 'ConfigTempConsigne'
});

app.config(function ($stateProvider, $urlRouterProvider) {
	// An array of state definitions
	var states = [
		{
			name: 'chauffage',
			url: '/',
			component: 'chauffage'
		},

		{
			name: 'desktop',
			url: '/desktop',
			component: 'desktop'
		},

		{
			name: 'configuration',
			url: '/configuration',
			component: 'configuration'
		},

		{
			name: 'configTempConsigne',
			url: '/configTempConsigne',
			component: 'configTempConsigne'
		},

		{
			name: 'graphique',
			url: '/graphique',
			component: 'graphique'
		}
	]

	// Loop over the state definitions and register them
	states.forEach(function (state) {
		$stateProvider.state(state);
	});

	$urlRouterProvider.otherwise('/');

});

/*
app.config(function ($routeProvider) {
	$routeProvider
		.when("/", {
			templateUrl: "main.html",
			controller: "chauffage"
		})
		.when("/configuration", {
			templateUrl: "configPlanning.html",
			controller: "Config"
		})
		.when("/graphique", {
			templateUrl: "graphique.html",
			controller: "Graphique"
		})
		.when("/blue", {
			templateUrl: "blue.htm"
		});
});
*/


app.filter('partieNombre', function () {
	return function (nombre, pos) {
		if (null == nombre) {
			return '';
		}
		var _temp = nombre.toString().trim();
		var _tempActuelle = parseFloat(_temp);
		var _tempActuelle1 = parseInt(_temp);
		var _tempActuelle2 = 0;
		if (_temp.indexOf(".") != -1) {
			_tempActuelle2 = parseInt(_temp.substring(_temp.indexOf(".") + 1));
		}
		return pos == 1 ? _tempActuelle1 : _tempActuelle2;
	};
});
