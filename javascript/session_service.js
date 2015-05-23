FinancialFreedom.service('Session', function() {

	this.create = function(email) {
		this.email = email;
	};

	this.destroy = function() {
		this.email = null;
	};
	
	// var returningUser = null;

	// return {
	// 	assumeReturningUser: function() {
	// 		returningUser = true;
	// 	},
	// 	assumeNewUser: function() {
	// 		returningUser = null;
	// 	},
	// 	isReturningUser: function() {
	// 		return returningUser;
	// 	}
	// }
});