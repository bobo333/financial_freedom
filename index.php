<!DOCTYPE HTML>

<html ng-app="FinancialFreedom">

	<head>
		<link rel="stylesheet" type="text/css" href="css/main.css">
	
		<script type="text/javascript" src="vendor/javascript/angular.min.js"></script>
		<script type="text/javascript" src="javascript/retirement_calculator_module.js"></script>
		<script type="text/javascript" src="javascript/app.js"></script>
	
		<title>Financial Freedom</title>
	</head>
	
	<body>
		<div ng-controller="SandboxController" class="first-div">
			<?php echo "this is php" ?>
			<br><br>
			Time to retire: {{ time_to_retire }} years.
		</div>
	</body>

</html>