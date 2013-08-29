/**
 * @directive: treeSelector
*/
/* global IMSTreeSelector */
IMSTreeSelector.directive('treeSelector', function (selectorServices) {
	'use strict';

	return {
		restrict: 'EA',
		replace: true,
		scope: {
			context: '@',
			config: '='
		},
		templateUrl: 'treeSelector.tmpl.html',
		link: function(scope, iElement, iAttrs) {

			// Indicates that the item array with the nodes is loaded
			scope.itemArrayLoaded = false;

			// the popover is not displayed by default
			scope.displayPopover = false;

			// by default the selector is not enable until we get data from server
			scope.config.enabled = false;

			// toggle popover
			scope.togglePopover = function () {
				if(scope.displayPopover) {
					// if is open, then close it
					scope.closePopover();
				}
				else {
					// if is closed then open it
					scope.openPopover();
				}
			};

			// hide popover
			scope.closePopover = function () {
				scope.displayPopover = false;
			};

			// show popover
			scope.openPopover = function () {
				scope.displayPopover = true;
			};

			// enable selector
			scope.enableSelector = function () {
				scope.config.enabled = true;
			};

			// disable selector
			scope.disableSelector = function () {
				scope.config.enabled = false;
			};

			// watch for changes on item array
			scope.$watch('config.itemArray', function (newVal, oldVal) {
				scope.itemArrayLoaded = (newVal.length > 0) ? true : false ;
			});

			// watch for itemArrayLoaded changes
			scope.$watch('itemArrayLoaded', function (newVal, oldVal) {
				if(newVal === true) {
					scope.enableSelector();
				}
			});

			// watch if component is enabled or disabled to trigger actions
			scope.$watch('config.enabled', function (newVal, oldVal) {

				// if not enabled, the popover should not be visible
				if(newVal === false) {
					scope.config.activeTitle = scope.config.label;
					scope.closePopover();
				}
			});

			// call service to get data
			selectorServices.getItemArray(scope.config).then(function (itemArray) {
				scope.config.itemArray = itemArray;
			});

			// listen for change event that matches the radio group
			document.addEventListener('change', function(e) {
				// match the input name <input type="radio" name="objName" />
				if(e.target.name === scope.config.label) {
                    // inform angular about changes outside the framework
					scope.$apply(function() {
						// set new title
						scope.config.activeTitle = e.target.parentElement.querySelector('span').textContent;

						// find and set the text in the span sibling
						scope.config.activeKey = e.target.value;

						scope.closePopover();
					});
				}
			});
		}
	};
});