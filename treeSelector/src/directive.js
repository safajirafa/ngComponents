/**
 * @directive: treeSelector
*/
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

            // togglePopover
            scope.togglePopover = function () {
                scope.displayPopover = !scope.displayPopover;
            };

            // hide popover
            scope.closePopover = function () {
                scope.displayPopover = false;
            };

            // show popover
            scope.openPopover = function () {
                scope.displayPopover = true;

                // focus dom element...
                console.log(iElement.find('.popover-container'));
            };

            scope.enableSelector = function () {
                scope.config.enabled = true;
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

            // Register a custom event that listens to the radio group change event
            $(document).on('change', 'input[name="'+ scope.config.label +'"]', function () {

                // new title value
                var newTitle = $(this).siblings('span').text();

                // new key value
                var newKey = $(this).val();

                // inform angular of changes outside the framework
                scope.$apply(function () {
                   scope.config.activeTitle = newTitle;
                   scope.config.activeKey = newKey;

                   // close popover after selection
                   scope.closePopover();
                });
            });

		}
    };
});