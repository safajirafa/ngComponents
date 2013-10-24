/**
* test/unit/servicesSpec.js
*/
describe('Unit: Preferred view services', function() {
	var service, $httpBackend, $rootScope, userId, guid, selectedKeys, viewName;

	beforeEach(module('com.ims.preferredView'));

	beforeEach(inject(function($injector) {
		service = $injector.get('preferredViewServices');
		$httpBackend = $injector.get('$httpBackend');
		$rootScope = $injector.get('$rootScope');

		userId = 'guest-az@ca.imshealth.com';
		guid = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';
		selectedKeys = []; // fake obj returned from server
		viewName = 'prescribers';
	}));


	it('should have a working service', function () {
		expect(service).toBeDefined();
	});


	describe('Saving the view state', function() {
		var formData;

		beforeEach(function() {

			formData = $.param({
				'userId': userId,
				'viewName': viewName,
				'title': 'my preferred view',
				'selectedKeys': JSON.stringify(selectedKeys)
			});

			$httpBackend.whenPOST('PreferredViews.aspx/save', formData).respond(200, '');
		});

		it('should save a preferred view', function() {

			expect(service.save).toBeDefined();

			// mock the call to backend
			$httpBackend.expectPOST('PreferredViews.aspx/save', formData);

			// call the service
			var pv = {
				'userId': userId,
				'viewName': viewName,
				'title': 'my preferred view',
				'selectedKeys': selectedKeys
			};

			service.save(pv);

			$httpBackend.flush();
		});
	});


	describe('List view states', function() {

		beforeEach(function() {
			$httpBackend.whenGET('PreferredViews.aspx/getList?viewName=' + viewName)
			.respond([{geoId: '', metricId: ''}, {geoId: '', metricId: ''}, {geoId: '', metricId: ''}]);
		});

		it('should get the list of selectedKeys for a given view', function() {

			expect(service.getList).toBeDefined();

			var selectedKeyList;

			// mock the call to backend
			$httpBackend.expectGET('PreferredViews.aspx/getList?viewName=' + viewName);

			// call the service
			service.getList(viewName).then(function(result){
				selectedKeyList = result;
			});

			$httpBackend.flush();

			expect(selectedKeyList).toEqual(jasmine.any(Array));
			expect(selectedKeyList.length).toEqual(3);
		});
	});


	describe('Deleting a view state', function() {
		var formData;

		beforeEach(function() {

			formData = $.param({
				'guid': guid,
				'viewName': viewName
			});

			$httpBackend.whenPOST('PreferredViews.aspx/remove', formData).respond(200, '');
		});

		it('should delete a preferredView for a given guid', function() {

			expect(service.delete).toBeDefined();

			// mock the call to backend
			$httpBackend.expectPOST('PreferredViews.aspx/remove', formData);

			// call the service
			service.delete(guid, viewName);

			$httpBackend.flush();
		});
	});


	afterEach(function() {
		$httpBackend.verifyNoOutstandingExpectation();
		$httpBackend.verifyNoOutstandingRequest();
	});
});