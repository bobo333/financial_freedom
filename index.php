<!DOCTYPE HTML>

<html ng-app="FinancialFreedom">

    <head>

        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">

        <link href='http://fonts.googleapis.com/css?family=Oxygen:400,300,700' rel='stylesheet' type='text/css'>
        <link href='http://fonts.googleapis.com/css?family=Open+Sans:400,300,300italic,600' rel='stylesheet' type='text/css'>
        <link rel="stylesheet" type="text/css" href="bower_components/bootstrap/dist/css/bootstrap.min.css">
        <link rel="stylesheet" type="text/css" href="stylesheets/output/screen.css">
        
        <script type="text/javascript" src="bower_components/jquery/dist/jquery.min.js"></script>
        <script type="text/javascript" src="bower_components/d3/d3.min.js"></script>
        <script type="text/javascript" src="bower_components/angular/angular.min.js"></script>
        <script type="text/javascript" src="bower_components/angular-animate/angular-animate.min.js"></script>
        <script type="text/javascript" src="bower_components/angular-route/angular-route.min.js"></script>
        <script type="text/javascript" src="bower_components/angular-i18n/angular-locale_en-us.js"></script>
        
        <script type="text/javascript" src="javascript/custom/ng-currency.js"></script>
        
        <script type="text/javascript" src="javascript/retirement_calculator_module.js"></script>
        <script type="text/javascript" src="javascript/app.js"></script>

        <title>Financial Freedom</title>
    </head>
    
    <body>

        <div class="header-wrap" ng-controller="HeaderController">
            <div class="header navbar navbar-default">
                <div class="header-text" ng-click="goToRoute('/income')">
                    <p class="product-name">Beanstalk</p>
                    <p class="tag-line">Countdown to financial independence</p>
                </div>
            </div>
            <div class="tabs-wrapper">
                <div class="header-tabs">
                    <div class="tab income-tab" ng-class="{'active': isActive('/income')}" ng-click="goToRoute('/income')">
                        <div class="tab-text">1</div>
                    </div><div class="tab assets-tab" ng-class="{'active': isActive('/assets')}" ng-click="goToRoute('/assets')">
                        <div class="tab-text">2</div>
                    </div><div class="tab expenses-tab" ng-class="{'active': isActive('/expenses')}" ng-click="goToRoute('/expenses')">
                        <div class="tab-text">3</div>
                    </div>
                </div>
            </div>
        </div>
        <div ng-view></div>
    </body>

</html>