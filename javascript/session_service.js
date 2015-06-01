FinancialFreedom.service('Session', function() {

	this.create = function(email) {
		this.email = email;
	};

	this.destroy = function() {
		this.email = null;
	};

});