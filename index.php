<!DOCTYPE HTML>

<html ng-app="FinancialFreedom">

    <head>
        <link href='http://fonts.googleapis.com/css?family=Oxygen:400,300,700' rel='stylesheet' type='text/css'>
        <link rel="stylesheet" type="text/css" href="bower_components/bootstrap/dist/css/bootstrap.min.css">
        <link rel="stylesheet" type="text/css" href="stylesheets/output/screen.css">
        <script type="text/javascript" src="bower_components/d3/d3.min.js"></script>
        <script type="text/javascript" src="vendor/javascript/angular.min.js"></script>
        <script type="text/javascript" src="javascript/retirement_calculator_module.js"></script>
        <script type="text/javascript" src="javascript/app.js"></script>
    
        <title>Financial Freedom</title>
    </head>
    
    <body>

        <div class="header navbar navbar-default">
            <div class="headerText">
                <p class="productName">Beanstalk</p>
                <p class="tagLine">Countdown to retirement</p>
            </div>
        </div>

        <div ng-controller="RetirementCalculatorController" class="first-div">
            
            <br><br>
            
            <form ng-submit="calculateMonthsToRetirement()">
                Net worth: $<input placeholder="50000" ng-model="retirement.net_worth" /><br>
                Monthly expenses: $<input placeholder="2000" ng-model="retirement.monthly_expenses" /><br>
                Monthly pay: $<input placeholder="5000" ng-model="retirement.monthly_pay" /><br>
                <input type="submit">
            </form>
            
            <br><br>
            
            Months to retire: <span class="retirement-years" ng-bind="retirement.months_to_retirement"></span>
            
            <br><br>
            
            <svg id="retirement-graph"></svg>
            
        </div>
    </body>

</html>