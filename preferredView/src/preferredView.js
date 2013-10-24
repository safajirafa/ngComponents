/**
 * @module: IMS Preferred View
*/
/* global angular */
var IMSPreferredView = angular.module('com.ims.preferredView', []);

IMSPreferredView.run(function ($templateCache) {
	// template that directive will use to render component
	// update this string everytime the real template is manipulated
	$templateCache.put('preferredView.tmpl.html', '<div class="com-preferred-view"><button class="btn" ng-click="togglePopover()">{{btnLabel}}</button><div class="popover-container" ng-show="showPopover"><div class="span5"><div class="input-append"><input placeholder="save current view as..." type="text" ng-model="preferredViewTitle" class="span4" maxlength="58" ng-trim="true"><button class="btn btn-info" ng-click="savePreferredView()" ng-disabled="preferredViewTitle.length < 3">Save</button></div></div><table class="table"><tbody><thead ng-show="preferredViews.length > 0"><th>&nbsp;</th><th>Filter Name</th><th>Creation date</th><th>&nbsp;</th></thead><tr ng-repeat="pv in preferredViews | orderBy:pv.timestamp"><td><button class="btn btn-success" ng-click="restorePreferredView($event)" data-keys="{{pv.selectedKeys}}"><i class="icon-play"></i></button></td><td>{{pv.title}}</td><td>{{pv.timestamp | date:"short"}}</td><td><button class="btn btn-danger" ng-click="deletePreferredView($event)" data-guid="{{pv.guid}}" data-view-name="{{pv.viewName}}"><i class="icon-remove"></i></button></td></tr></tbody></table></div></div>');
});


// Service
IMSPreferredView.factory('preferredViewServices', function($q, $http) {

	var SERVICE_URL = 'PreferredViews.aspx';

	return {
		/**
		* saves a preferred view
		*/
		save: function(pv) {

			// encode using jQuery
			var data = $.param({
				userId: pv.userId,
				viewName: pv.viewName,
				title: pv.title,
				selectedKeys: angular.toJson(pv.selectedKeys)
			});

			var config = {
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
			};

			var dfd = $q.defer();

			$http.post(SERVICE_URL + '/save', data, config)
				.success(function(data, status, headers) {
					dfd.resolve(data);
				})
				// if something goes wrong
				.error(function(data, status, headers) {
					throw 'Preferred view could not be saved';
				});

			return dfd.promise;
		},

		/**
		* gets a list of preferredViews
		*/
		getList: function(viewName) {

			var config = {
				params: {
					'viewName' : viewName
				}
			};

			var dfd = $q.defer();

			$http.get(SERVICE_URL + '/getList', config)
				.success(function (data) {
					dfd.resolve(data);
				})
				.error(function (data, status, headers) {
					dfd.reject();
					throw 'There was a problem loading your preferred views, please try again later';
				});

			return dfd.promise;
		},

		/**
		* delete a selectedKeys obj for a given guid
		*/
		delete: function(guid, viewName) {

			var data = $.param({
				'guid': guid,
				'viewName': viewName
			});

			var dfd = $q.defer();

			var config = {
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
			};

			$http.post(SERVICE_URL + '/remove', data, config)
				.success(function(data, status, headers) {
					dfd.resolve(data);
				})
				// if something goes wrong
				.error(function() {
					dfd.reject();
					throw new Error('The preferred view was not deleted');
				});

			return dfd.promise;
		}
	};
});

// Directive
IMSPreferredView.directive('preferredView', function(preferredViewServices){
	'use strict';

	return {
		restrict: 'EA',
		replace: true,
		scope: {
			// string for the button label
			btnLabel: '@',
			// Expression to be executed on the parent scope
			// will be binded as "on-saving" on the html
			getPreferredViewObj: '&onSaving',
			// Expresssion to be executed on the parent scope
			onRestore: '&'
		},
		// the template is cached in the module.run()
		templateUrl: 'preferredView.tmpl.html',
		link: function(scope, iElement, iAttrs) {

			// by default don't show the popover
			scope.showPopover = false;

			// this is the model binded to the input:text on the UI
			scope.preferredViewTitle = '';

			// preferred view obj array
			scope.preferredViews = [];

			scope.loadPreferredViews = function(viewName) {
				// get list
				preferredViewServices.getList(viewName).then(function(pvList){
					// update the model
					scope.preferredViews = pvList;
				});
			};

			scope.togglePopover = function() {
				// toggle model state
				scope.showPopover = !scope.showPopover;
			};

			scope.savePreferredView = function() {

				try {
					// this is the value coming from the function binded on the parent scope
					var pv = scope.getPreferredViewObj();

					// add the custom title set by the user to the obj
					pv.title = scope.preferredViewTitle;

					// save
					preferredViewServices.save(pv).then(function(response){
						// clear the current title
						scope.preferredViewTitle = '';

						// (re)load
						scope.loadPreferredViews(pv.viewName);
					});
				}
				catch(err) {
					alert('We are having problems saving preferred views at this time, please try again later');
					console.log(err.message);
				}
			};

			scope.restorePreferredView = function(e) {

				var dataKeys = e.currentTarget.getAttribute('data-keys');

				// TODO: deserialize data-keys
				dataKeys = JSON.parse(dataKeys);

				// execute function on parent scope
				scope.onRestore({'selectedKeys': dataKeys });

				// hide popover after selection
				scope.showPopover = false;
			};

			scope.deletePreferredView = function(e) {

				try {

					var confirmDelete = window.confirm('Are you sure you want to permanently delete the selected item?');

					if(confirmDelete) {

						var guid = e.currentTarget.getAttribute('data-guid');
						var viewName = e.currentTarget.getAttribute('data-view-name');

						// delete
						preferredViewServices.delete(guid, viewName).then(function(response) {
							// (re)load
							scope.loadPreferredViews(viewName);
						});
					}
				}
				catch(err) {
					console.log(err.message);

					alert('We are having problems deleting the preferred view, try again later');
				}
			};

			// load the list of preferred views
			scope.$on('preferredViews:load', function(event, viewName) {
				try {
					// (re)load
					scope.loadPreferredViews(viewName);
				}
				catch(err) {
					console.log(err.message);
					alert('We are having problems getting the list of preferred views, please try again later');
				}
			});

			// Bind enter to save
			iElement.find('input').bind('keypress', function(e){
				if(e.which === 13 && scope.preferredViewTitle.length >= 3) {
					scope.$apply(function(){
						scope.savePreferredView();
					});
				}
			});
		}
	};
});