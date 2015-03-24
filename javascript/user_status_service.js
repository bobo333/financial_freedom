FinancialFreedom.factory('UserStatusService', function() {
	
	var returningUser = null;

	return {
		assumeReturningUser: function() {
			returningUser = true;
		},
		assumeNewUser: function() {
			returningUser = null;
		},
		isReturningUser: function() {
			return returningUser;
		}
	}
});