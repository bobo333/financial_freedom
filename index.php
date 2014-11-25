<!DOCTYPE HTML>

<html ng-app="FinancialFreedom">

    <head>
        <link href='http://fonts.googleapis.com/css?family=Oxygen:400,300,700' rel='stylesheet' type='text/css'>
        <link rel="stylesheet" type="text/css" href="bower_components/bootstrap/dist/css/bootstrap.min.css">
        <link rel="stylesheet" type="text/css" href="stylesheets/output/screen.css">
        
        <script type="text/javascript" src="bower_components/jquery/dist/jquery.min.js"></script>
        <script type="text/javascript" src="bower_components/d3/d3.min.js"></script>
        <script type="text/javascript" src="bower_components/angular/angular.min.js"></script>
        <script type="text/javascript" src="bower_components/angular-route/angular-route.min.js"></script>
        <script type="text/javascript" src="bower_components/angular-i18n/angular-locale_en-us.js"></script>
        
        <script type="text/javascript" src="javascript/custom/ng-currency.js"></script>
        
        
        <script type="text/javascript" src="javascript/retirement_calculator_module.js"></script>
        <script type="text/javascript" src="javascript/app.js"></script>
    
        <title>Financial Freedom</title>
    </head>
    
    <body>

        <div class="header-wrap">
            <div class="header navbar navbar-default">
                <div class="headerText">
                    <p class="productName">Beanstalk</p>
                    <p class="tagLine">Countdown to retirement</p>
                </div>
            </div>
            
            <div class="header-tabs">
                <div class="tab income-tab">
                    Income
                </div><div class="tab assets-tab">
                    Assets
                </div><div class="tab expenses-tab">
                    Expenses
                </div>
            </div>
        </div>
        
        <div ng-view></div>

    </body>

</html>