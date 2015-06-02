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

		return $http.get('api/get-user-data.php').success(function(data, status, headers, config) {

  			console.log(data.user_data);

      		return data.user_data;
	  	}).
	  	error(function(data, status, headers, config) {

	    	this.data = data || "Request failed";
	    	console.log(this.data);
      		return this.data;
	  	});
	}

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