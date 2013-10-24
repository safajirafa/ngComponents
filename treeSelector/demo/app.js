angular.module('Dashboard', ['com.ims.treeSelector'])

.controller('myViewCtrl', function ($scope) {

	$scope.context = "PRX";

	$scope.alignment = {
		label: 'Alignment',
		icon: 'icon-chevron-sign-right',
		itemArray: [],
		activeKey: '',
		activeTitle: '',
		resource: {
			url: '/services/alignments',
			params: {}
		}
	};

	// Geo selector
	$scope.geo = {
		label: 'Geo',
		icon: 'icon-map-marker',
		itemArray: [],
		activeKey: '',
		activeTitle: '',
		resource: {
			url: '/services/geos',
			params: {}
		}
	};

	// Time period selector
	$scope.timePeriod = {
		label: 'Time Period',
		icon: 'icon-calendar-empty',
		itemArray: [],
		activeKey: '',
		activeTitle: '',
		resource: {
			url: '/services/timePeriods',
			params: {}
		}
	};

	// metric selector
	$scope.metric = {
		label: 'Metric',
		icon: 'icon-tasks',
		itemArray: [],
		activeKey: '',
		activeTitle: '',
		resource: {
			url: '/services/metrics',
			params: {}
		}
	};

	// Kick off dashboard initial load
	// let the scope digest for the first time before firing load
	$scope.$evalAsync(function() {

		// set a loading title on the selectors while data comes from server
		$scope.alignment.activeTitle = $scope.geo.activeTitle = $scope.timePeriod.activeTitle = $scope.metric.activeTitle = 'Loading...';

		// load selectors without dependencies
		$scope.$broadcast('load_selector_alignment');
		$scope.$broadcast('load_selector_timePeriod');
		$scope.$broadcast('load_selector_metric');
	});

	// watch for changes to the alignment
	$scope.$watch('alignment.activeKey', function(newVal, oldVal) {

		if(newVal) {
			// then load geo selector
			$scope.$broadcast('load_selector_geo', { alignmentId: newVal });
		}

	});

	// filters ready?
	$scope.$watch('[alignment.activeKey, geo.activeKey, timePeriod.activeKey, metric.activeKey]', function(newVal) {

		// map array items to ids
		var alignmentId =	newVal[0],
			geoId =			newVal[1],
			timePeriodId =	newVal[2],
			metricId =		newVal[3];

		//console.log('Alignment: %o - Geo %o - TimePeriod %o - Metric %o', alignmentId, geoId, timePeriodId, metricId);

		if (alignmentId === '' || geoId === '' || timePeriodId === '' || metricId === '' ) { return; }

		// TODO filters are ready at this point
		// emit event to reload charts and grids...
		//console.log('Filters are ready, (re)load charts and grids %o', newVal);

	}, true);

});