FinancialFreedom.factory('UserDataService', function($http, Session) {
	
	var data = {
		user_values : {
			'monthly_income': null,
			'total_assets': null,
			'monthly_expenses': null,
			'income_growth_rate': null,
			'investment_growth_rate': null,
			'expenses_growth_rate': null
		}
		
	}

	data.getUserData = function() {

		// need client-side check if authenticated ??

		var req = {
			method: 'GET',
			url: 'get-user-data.php',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			}
		}

		return $http(req).
  		success(function(user_data, status, headers, config) {

      		this.user_data = user_data;
  			console.log(this.user_data);

      		return this.user_data;

	  	}).
	  	error(function(data, status, headers, config) {

	    	this.data = data || "Request failed";
	    	console.log(this.data);
      		return this.data;
	  	});

	}

	// data.initializeConstants = function() {

	// 	var income_growth_rate = RetirementCalculatorService.getIncomeIncreaseRate();
	// 	var expenses_increase_rate = RetirementCalculatorService.getExpensesIncreaseRate();
	// 	var investment_growth_rate = RetirementCalculatorService.getGrowthRate();

	// 	var initials = {
	// 		'income_growth_rate' : income_growth_rate,
	// 		'expenses_growth_rate' : expenses_increase_rate,
	// 		'investment_growth_rate' : investment_growth_rate
	// 	}

	// 	return initials;
	// }

	data.updateUserData = function(new_user_data) {

		var req = {
			method: 'POST',
			url: 'api/update-user-data.php',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			data: $.param(new_user_data)
		}

		if (Session.data.currentUser) {
			return $http(req).
	  		success(function(data, status, headers, config) {

	      		this.data = data;
	      		
	  			console.log(this.data);

	      		return this.data;

		  	}).
		  	error(function(data, status, headers, config) {

		    	this.data = data || "Request failed";
		    	console.log(this.data);
	      		return this.data;
		  	});
		}
			

	}

	return {
		data: data
	}
});