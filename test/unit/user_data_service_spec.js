describe('Unit: UserDataService', function() {

	var UserDataService;

	beforeEach(module('FinancialFreedom', function($provide) {

	}));

	beforeEach(inject(function(_UserDataService_, _$httpBackend_) {

	    UserDataService = _UserDataService_;
	    $httpBackend = _$httpBackend_;

	}));

	it('has a get data function', function() {
		expect(angular.isFunction(UserDataService.data.getUserData)).toBe(true);	
	});

	it('has a logout function', function() {
		expect(angular.isFunction(UserDataService.data.updateUserData)).toBe(true);	
	});

});