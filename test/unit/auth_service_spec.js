describe('Unit: AuthService', function() {

	var AuthService;

	beforeEach(module('FinancialFreedom', function($provide) {

	}));

	beforeEach(inject(function(_AuthService_, _$httpBackend_) {

	    AuthService = _AuthService_;
	    $httpBackend = _$httpBackend_;

	}));

	it('has a login function', function() {
		expect(angular.isFunction(AuthService.data.login)).toBe(true);	
	});

	it('has a logout function', function() {
		expect(angular.isFunction(AuthService.data.logout)).toBe(true);	
	});

	it('has a create account function', function() {
		expect(angular.isFunction(AuthService.data.createAccount)).toBe(true);	
	});

});