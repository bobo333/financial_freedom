# API Documentation #

Last Updated: 5/11/2015

----------

This is a JSON API, it accepts and returns JSON. All calls will have the following fields in their returns unless the status code is not 200:

	{
		success: [boolean],
		errors: [list of error message strings, will be empty if success is true]
	}

If the status code is 403 Forbidden, the type of request is likely incorrect. Ex: using GET instead of POST.

## Available Endpoints ##

### Log In ###
**POST /api/login.php**

Log in a user with the provided credentials.

Parameters:

- `email` [string, required]
- `password` [string, required]

Returns:

- `success` [boolean] indicating if log in was successful or not
- `errors` [array of strings] messages indicating why call was unsuccessful (will be empty when success is `true`)

Potential errors include:

- no email address provided
- no password provided
- no account with provided email address found
- incorrect password for provided email address
- user already logged in

### Log Out ###
**GET /api/logout.php**

Log out the current user.

Parameters:

- (none)

Returns:

- `success` [boolean] indicating if log out was successful or not
- `errors` [array of strings] messages indicating why call was unsuccessful (will be empty when success is `true`)


### Sign Up ###
**POST /api/signup.php**

Create a new user.

Parameters:

- `email` [string, required] email address of the new user being created
- `password` [string, required] password for the new user being created

Returns: 

- `success` [boolean] indicating if log out was successful or not
- `errors` [array of strings] messages indicating why call was unsuccessful (will be empty when success is `true`)

Potential errors include:

- user already logged in
- no email address provided
- no password provided
- email address already in use
- provided email address is not a valid email address
- password less than 6 characters

### Get User Data ###
**GET /api/get-user-data.php**

Get user data for the currently logged in user. User must be logged in.

Parameters:

- (none)

Returns:

- `success` [boolean] indicating if retrieving user data was successful
- `errors` [array of strings] messages indicating why call was unsuccessful (will be empty when success is `true`)
- `user_data` [object]
	- `id` [int], id of the current user
	- `email` [string], email address of the current user
	- `monthly_income` [int], monthly income of the current user. Can be `null`.
	- `total_assets` [int], total assets of the current user. Can be `null`.
	- `monthly_expenses` [int], monthly expenses of the current user. Can be `null`.
	- `income_growth_rate` [float], current user's annual income growth rate. Can be `null`.
	- `investment_growth_rate` [float], current user's annual investment growth rate. Can be `null`.
	- `expenses_growth_rate` [float], current user's annual expenses growth rate. Can be `null`.
	- `created_at` [string], date and time of user's account creation at GMT. Format is YYYY-MM-DD HH:MM:SS. Time will be in 24-hour format.

Potential errors include:

- no user currently logged in

### Update User Data ###
**POST /api/update-user-data.php**

Updates user data for the currently logged in user.

Parameters:

- `monthly_income` [int, optional], monthly income of the current user.
- `total_assets` [int, optional], total assets of the current user.
- `monthly_expenses` [int, optional], monthly expenses of the current user.
- `income_growth_rate` [float, optional], current user's annual income growth rate.
- `investment_growth_rate` [float, optional], current user's annual investment growth rate.
- `expenses_growth_rate` [float, optional], current user's annual expenses growth rate.

Returns:

- `success` [boolean] indicating if updating user data was successful
- `errors` [array of strings] messages indicating why call was unsuccessful (will be empty when success is `true`)
- `user_data` [object]
	- `id` [int], id of the current user
	- `email` [string], email address of the current user
	- `monthly_income` [int], monthly income of the current user. Can be `null`.
	- `total_assets` [int], total assets of the current user. Can be `null`.
	- `monthly_expenses` [int], monthly expenses of the current user. Can be `null`.
	- `income_growth_rate` [float], current user's annual income growth rate. Can be `null`.
	- `investment_growth_rate` [float], current user's annual investment growth rate. Can be `null`.
	- `expenses_growth_rate` [float], current user's annual expenses growth rate. Can be `null`.
	- `created_at` [string], date and time of user's account creation at GMT. Format is YYYY-MM-DD HH:MM:SS. Time will be in 24-hour format.

Potential errors include:

- no user currently logged in
- `expenses_growth_rate` is negative
- `expenses_growth_rate` is not a decimal
- `income_growth_rate` is negative
- `income_growth_rate` is not a decimal
- `investment_growth_rate` is negative
- `investment_growth_rate` is not a decimal
- `monthly_expenses` is negative
- `monthly_expenses` is not an integer
- `montly_income` is negative
- `monthly_income` is not an integer
- `total_assets` is negative
- `total_assets` is not an integer

### Change Password ###
**POST /api/change-password.php**

Updates password for the current user.

Parameters:

- `old_password` [string, required], existing password the current user.
- `new_password` [string, required], desired new password for the current user.

Returns:

- `success` [boolean] indicating if updating user data was successful
- `errors` [array of strings] messages indicating why call was unsuccessful (will be empty when success is `true`)

Potential errors include:

- no user currently logged in
- `old_password` is not present
- `new_password` is not present
- `old_password` is incorrect
- `new_password` is shorter than 6 characters