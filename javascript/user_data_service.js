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

	data.updateUserData = function(key, newVal) {

		data.user_values[key] = newVal;

		form_data = {
			key : newVal
		}

		console.log(form_data);

		var req = {
			method: 'POST',
			url: 'api/update-user-data.php',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			data: $.param(form_data)
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