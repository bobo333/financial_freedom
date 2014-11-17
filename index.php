<!DOCTYPE HTML>

<html ng-app="FinancialFreedom">

    <head>
        
        <link rel="stylesheet" type="text/css" href="bower_components/bootstrap/dist/css/bootstrap.min.css">
        <link rel="stylesheet" type="text/css" href="stylesheets/output/screen.css">

        <script type="text/javascript" src="vendor/javascript/angular.min.js"></script>
        <script type="text/javascript" src="javascript/retirement_calculator_module.js"></script>
        <script type="text/javascript" src="javascript/app.js"></script>
    
        <title>Financial Freedom</title>
    </head>
    
    <body>

        <div class="header navbar navbar-default">
            <p class="productName">Beanstalk</p>
            <p class="tagLine">Countdown to retirement</p>
        </div>

        <div ng-controller="RetirementCalculatorController" class="first-div">
            
            <br><br>
            
            <form ng-submit="calculateYearsToRetirement()">
                Net worth: $<input placeholder="50000" ng-model="retirement.net_worth" /><br>
                Annual expenses: $<input placeholder="40000" ng-model="retirement.annual_expenses" /><br>
                Annual salary: $<input placeholder="70000" ng-model="retirement.annual_salary" /><br>
                <input type="submit">
            </form>
            
            <br><br>
            
            Time to retire: <span class="retirement-years" ng-bind="retirement.years_to_retirement + ' years'"></span>

            <br>
            <?php echo "this is php" ?>
            
        </div>
    </body>

</html>