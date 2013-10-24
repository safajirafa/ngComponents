/**
* test/unit/services/servicesSpec.js
*/
describe("Unit: Testing Services", function() {

	beforeEach(angular.mock.module('com.ims.treeSelector'));

  	it('should contain a selectorServices defined', inject(function(selectorServices) {
		expect(selectorServices).toBeDefined();
	}));

});