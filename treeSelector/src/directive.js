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

			if(!scope.config) {
				throw new Error('Directive has no configuration object');
			}

			// A raw reference to the DOM element
			var _rawDOMContainer = iElement[0];

			// Indicates that the item array is loaded with nodes
			scope.itemArrayLoaded = false;

			// the popover is not displayed by default
			scope.displayPopover = false;

			// by default the selector is not enable until we get data from the service
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
			}, true);

			// watch for itemArrayLoaded changes
			scope.$watch('itemArrayLoaded', function (newVal, oldVal) {
				if(newVal === true) {
					scope.enableSelector();

					$timeout(function() {
						scope.selectDefaultItem();
					}, 0);
				}
			});

			// watch if component is enabled or disabled to trigger actions
			scope.$watch('config.enabled', function (newVal, oldVal) {

				// if not enabled, the popover should not be visible
				if(newVal === false) {
					scope.closePopover();
				}
			});

			// add native js event listener to changes on the radio group
			_rawDOMContainer.addEventListener('change', function(e) {
				// match the input name <input type="radio" name="objName" />
				if(e.target.name === scope.config.label) {
					scope.$apply(function() {
						// the active title text is in the next sibling
						scope.config.activeTitle = e.target.nextElementSibling.textContent;

						// find and set the text in the span sibling
						scope.config.activeKey = e.target.value;

						scope.closePopover();
					});
				}
			});

			// angular custom listener to (re)load the selector from outside the directive
			// the event should be called "load_selector_[your_selector_name]"
			var loadEventName = 'load_selector_' + iAttrs.config;
			scope.$on(loadEventName, function(event, args) {

				scope.disableSelector();

				// clear the current activeKey
				scope.config.activeKey = '';

				// display a loading msg while fetching data from service
				scope.config.activeTitle = scope.config.loadingText || 'Loading...';

				// flush the item array
				scope.config.itemArray.length = 0;

				if(!scope.context) {
					throw new Error('Scope not set for ' + iAttrs.config + ' directive');
				}

				// add the context to the resource config
				scope.config.resource.context = scope.context;

				// call service to get data
				selectorServices.getItemArray(scope.config.resource).then(function (itemArray) {
					scope.config.itemArray = itemArray;
				});
			});

			// add listener to handle the list toggle
			_rawDOMContainer.addEventListener('click', function(e) {
				// match the event triggered from elements with class "node-toggler"
				if(e.target.className.match(/\bnode-toggler\b/)) {

					// check the current status of the node-toggler
					var displayChildrenLists = (e.target.className.match(/\bicon-expand\b/)) ? true : false;

					// get the all the children ul(s) of the closest clicked element
					var elementCollection = e.target.parentElement.parentElement.children;

					for (var i=0; i < elementCollection.length; i++) {
						if (elementCollection[i].nodeName === 'UL') {

							if (displayChildrenLists) {
								elementCollection[i].style.display = 'block';

								// change the class (IE10+)
								e.target.classList.remove('icon-expand');
								e.target.classList.add('icon-collapse');
							}
							else {
								elementCollection[i].style.display = 'none';

								// change the class (IE10+)
								e.target.classList.remove('icon-collapse');
								e.target.classList.add('icon-expand');
							}
						}
					}
				}
			});
		}
	};
});