describe('Unit: UserDataCache', function() {

	var UserDataCache;

	beforeEach(module('FinancialFreedom', function($provide) {

	}));

	beforeEach(inject(function(_UserDataCache_, _$httpBackend_) {

	    UserDataCache = _UserDataCache_;
	    $httpBackend = _$httpBackend_;

	}));

	it('has a get data function', function() {
		expect(angular.isFunction(UserDataCache.userData.getUserData)).toBe(true);	
	});

	it('has a fetch data function', function() {
		expect(angular.isFunction(UserDataCache.userData.fetchUserData)).toBe(true);	
	});

	it('has a reset data function', function() {
		expect(angular.isFunction(UserDataCache.userData.resetUserData)).toBe(true);	
	});

});