angular.module('Dashboard', ['com.ims.preferredView', 'ngMockE2E'])

.run(function($httpBackend){

	var preferredViews = [];

	//setup some fake responses from server
	$httpBackend.whenPOST('PreferredViews.aspx/save').respond(function(method, url, data) {
		var preferredView = angular.fromJson(data);
		preferredView.guid = 'xxxx-xxxx-xxxx';
		preferredView.timestamp = new Date().toISOString();
		preferredViews.push(preferredView);
		return [200, {}, {}];
	});

	//setup some fake responses from server
	$httpBackend.whenPOST('PreferredViews.aspx/getList').respond(function(method, url, data) {
		return [200, preferredViews, {}];
	});

	//setup some fake responses from server
	$httpBackend.whenPOST('PreferredViews.aspx/delete').respond(function(method, url, data) {
		preferredViews.splice(0,1);
		return [200, {}, {}];
	});
})

.controller('myViewCtrl', function ($scope) {

	/**
	* restores the current view selectors based on a preferred view
	*/
	$scope.restorePreferredView = function(selectedKeys) {
		console.log('restoring view with %o', selectedKeys);
	};

	/**
	* this method is binded to the preferred view directive
	*/
	$scope.getPreferredViewObj = function() {
		var pvObj = {
			userId: 'guest-az@ca.imshealth.com',
			viewName: 'Territory Performance Rx',
			selectedKeys: [
				{ selector: 'geo', type: 'single', key: 'XXX' },
				{ selector: 'metric', type: 'single', key: 'XXXX' },
				{ selector: 'timePeriod', type: 'single', key: 'XXX' },
				{ selector: 'brand', type: 'single', key: 'XXX' }
			]
		};

		return pvObj;
	};

	// send the message to load the preferred views
	$scope.$broadcast('preferredViews:load', 'TerritoryPerfRx');
});