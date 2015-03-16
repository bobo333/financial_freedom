<!DOCTYPE HTML>

<html ng-app="FinancialFreedom">

    <head>

        <meta name=viewport content="width=device-width, initial-scale=1">

        <link href='http://fonts.googleapis.com/css?family=Oxygen:400,300,700' rel='stylesheet' type='text/css'>
        <link href='http://fonts.googleapis.com/css?family=Open+Sans:400,300,300italic,600' rel='stylesheet' type='text/css'>
        <link href="//maxcdn.bootstrapcdn.com/font-awesome/4.2.0/css/font-awesome.min.css" rel="stylesheet">
        <link rel="stylesheet" type="text/css" href="bower_components/bootstrap/dist/css/bootstrap.min.css">
        <link rel="stylesheet" type="text/css" href="stylesheets/output/screen.css">
        <link rel="icon" type="image/png" href="img/favicon.ico">
        
        <script type="text/javascript" src="bower_components/jquery/dist/jquery.min.js"></script>
        <script type="text/javascript" src="bower_components/d3/d3.min.js"></script>
        <script type="text/javascript" src="bower_components/angular/angular.min.js"></script>
        <script type="text/javascript" src="bower_components/angular-animate/angular-animate.min.js"></script>
        <script type="text/javascript" src="bower_components/angular-route/angular-route.min.js"></script>
        <script type="text/javascript" src="bower_components/angular-i18n/angular-locale_en-us.js"></script>
        <script type="text/javascript" src="bower_components/angular-bootstrap/ui-bootstrap-tpls.js"></script>
        
        <script type="text/javascript" src="javascript/custom/ng-currency.js"></script>
        
        <script type="text/javascript" src="javascript/app.js"></script>
        <script type="text/javascript" src="javascript/date_service.js"></script>
        <script type="text/javascript" src="javascript/interest_service.js"></script>
        <script type="text/javascript" src="javascript/geometry_service.js"></script>
        <script type="text/javascript" src="javascript/retirement_calculator_service.js"></script>
        <script type="text/javascript" src="javascript/create_retirement_graph_service.js"></script>
        <script type="text/javascript" src="javascript/google_analytics_service.js"></script>
        <script type="text/javascript" src="javascript/google_analytics_setup.js"></script>


        <title>Plenti | Free Yourself</title>
    </head>
    
    <body ng-controller="bodyController" ng-class="{'indexpage': isActive('/')}">
        <div class="header-wrapper" ng-controller="HeaderController">
            <div class="navbar-wrapper">
                <nav class="navbar navbar-default navbar-fixed-top navbar-custom">
                    <div class="container-fluid">
                        <div class="navbar-header">
                            <button type="button" class="navbar-toggle" ng-click="isCollapsed = !isCollapsed">
                                <span class="sr-only">Toggle navigation</span>
                                <span class="icon-bar"></span>
                                <span class="icon-bar"></span>
                                <span class="icon-bar"></span>
                            </button>
                            <a class="navbar-brand" ng-click="goToRoute('/income')">
                                <div id="header-brand-wrapper">
                                    <img src="img/curvy-bowl-white-bg.png" id="brand-logo">
                                    <div class="logo-name-wrapper">
                                        <span class="logo-name">Plenti</span>
                                    </div>
                                </div>
                            </a>
                        </div>
                        <div collapse="isCollapsed">
                            <ul class="nav navbar-nav navbar-right">
                                <li><a class="nav-item-custom" ng-click="goToRoute('/about')">About</a></li>
                            </ul>
                        </div>
                        <div class="expanded-nav" >
                            <ul class="nav navbar-nav navbar-right">
                                <li><a class="nav-item-custom" ng-click="goToRoute('/about')">About</a></li>
                            </ul>
                        </div>
                    </div>
                </nav>
            </div>

            <div class="tabs-wrapper" ng-show="tabsAreVisible()">
                <div class="header-tabs">
                    <div class="tab income-tab" ng-class="{'active': isActive('/income')}" ng-click="goToRoute('/income')">
                        <div class="tab-text">1</div>
                    </div>
                    <div class="tab assets-tab" ng-class="{'active': isActive('/assets')}" ng-click="goToRoute('/assets')">
                        <div class="tab-text">2</div>
                    </div>
                    <div class="tab expenses-tab" ng-class="{'active': isActive('/expenses')}" ng-click="goToRoute('/expenses')">
                        <div class="tab-text">3</div>
                    </div>
                </div>
            </div>
        </div>
        
        <div ng-view class="view-animate"></div>
    </body>
</html>