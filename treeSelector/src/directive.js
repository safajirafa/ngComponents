/**
 * @directive: treeSelector
*/
/* global IMSTreeSelector */
IMSTreeSelector.directive('treeSelector', function (selectorServices, $timeout) {
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

			// selects the first/default item in the itemArray
			scope.selectDefaultItem = function () {
				// find the element and click it!
				document.querySelector('input[name="'+ scope.config.label +'"]').click();
			};

			// watch for changes on item array
			scope.$watch('config.itemArray', function (newVal, oldVal) {
				scope.itemArrayLoaded = (newVal.length > 0) ? true : false ;
			});

			// watch for itemArrayLoaded changes
			scope.$watch('itemArrayLoaded', function (newVal, oldVal) {
				if(newVal === true) {
					scope.enableSelector();

					$timeout(function() {
						scope.selectDefaultItem();
					}, 800);
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

			// add native js event listener
			document.addEventListener('change', function(e) {
				// match the input name <input type="radio" name="objName" />
				if(e.target.name === scope.config.label) {
					scope.$apply(function() {
						// set new title which is in the adjacent
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