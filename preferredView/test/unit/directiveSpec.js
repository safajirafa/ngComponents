/**
* test/unit/directiveSpec.js
*/
describe('Unit: Preferred view directive', function() {
	var $compile, scope, iElement;

	beforeEach(module('com.ims.preferredView'));

	beforeEach(inject(function($injector) {
		$compile = $injector.get('$compile');
		scope = $injector.get('$rootScope');

		iElement = angular.element(
			'<div>' +
				'<button>{{config.btnLabel}}</button>' +
				'<div class="popover-container" ng-show="{{showPopover}}">' +
				'</div>' +
			'</div>'
		);

		scope.showPopover = false;
		scope.config = {
			btnLabel: 'My Preferred Views'
		};

		$compile(iElement)(scope);
		scope.$apply();
	}));

	it('should be hidden by default', function() {
		expect(scope.showPopover).toBe(false);
	});

	it('should display text on the button', function() {
		var button = iElement.find('button');

		expect(button.text()).toBe('My Preferred Views');
	});
});