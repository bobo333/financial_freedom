<!DOCTYPE HTML>

<html ng-app="FinancialFreedom">

	<head>
		<link rel="stylesheet" type="text/css" href="css/main.css">
	
		<script type="text/javascript" src="vendor/javascript/angular.min.js"></script>
		<script type="text/javascript" src="javascript/app.js"></script>
	
		<title>Financial Freedom</title>
	</head>
	
	<body>
		<div ng-controller="SandboxController" class="first-div">
			Hello, my name is {{ my_name }}.
			<br><br>
			<?php echo "this is php" ?>
		</div>
	</body>

</html>