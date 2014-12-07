var FinancialFreedom = angular.module('FinancialFreedom', ['ngRoute', 'RetirementCalculatorModule', 'ng-currency','ngAnimate']);

FinancialFreedom.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

    $routeProvider.when('/income', {
        templateUrl: 'partials/income_input.html',
        controller: 'IncomeInputController'
    })
    .when('/assets', {
        templateUrl: 'partials/assets_input.html',
        controller: 'AssetsInputController'
    })
    .when('/expenses', {
        templateUrl: 'partials/expenses_input.html',
        controller: 'ExpensesInputController'
    })
    .when('/time-to-retirement', {
        templateUrl: 'partials/time_to_retirement.html',
        controller: 'TimeToRetirementController'
    })
    .otherwise({
        redirectTo: '/income'
    });
}]);

FinancialFreedom.directive('nextButton', ['$location', function($location) {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            inputValue: '@',
            nextRoute: '@'
        },
        template: '<div ng-click="goToNextRoute()" ng-class="{active: isButtonActive()}" class="next-button"><div class="text">Next</div></div>',
        link: function(scope, element, attributes) {
            scope.goToNextRoute = function() {
                if (scope.isButtonActive()) {
                    $location.path(scope.nextRoute);
                }
            };
            
            scope.isButtonActive = function() {
                return (scope.inputValue != undefined) && (scope.inputValue != '') && (!isNaN(scope.inputValue));
            };
        }
    }
}]);

FinancialFreedom.directive('autofocus', ['$timeout', function($timeout) {
  return {
    restrict: 'A',
    link : function($scope, $element) {
      $timeout(function() {
        $element[0].focus();
      });
    }
  }
}]);

FinancialFreedom.controller('bodyController', ['$location',  function($location) {
    $location.path("/")
}]);

FinancialFreedom.controller('HeaderController', ['$scope', '$location',  function($scope, $location) {
    $scope.isActive = function(route) {
        return route == $location.path();
    };
    
    $scope.goToRoute = function(route) {
        $location.path(route);
    };

}]);

FinancialFreedom.controller('IncomeInputController', ['$scope', 'RetirementCalculatorService', function($scope, RetirementCalculatorService) {
    $scope.income = {};
    $scope.income.value = RetirementCalculatorService.getMonthlyIncome();
    
    $scope.$watch('income.value', function(new_value) {
        RetirementCalculatorService.setMonthlyIncome(new_value);
    });

}]);

FinancialFreedom.controller('AssetsInputController', ['$scope', 'RetirementCalculatorService', function($scope, RetirementCalculatorService) {
    $scope.assets = {};
    $scope.assets.value = RetirementCalculatorService.getTotalAssets();
    
    $scope.$watch('assets.value', function(new_value) {
        RetirementCalculatorService.setTotalAssets(new_value);
    });
}]);

FinancialFreedom.controller('ExpensesInputController', ['$scope', 'RetirementCalculatorService', function($scope, RetirementCalculatorService) {
    $scope.expenses = {};
    $scope.expenses.value = RetirementCalculatorService.getMonthlyExpenses();
    
    $scope.$watch('expenses.value', function(new_value) {
        RetirementCalculatorService.setMonthlyExpenses(new_value);
    });
}]);

FinancialFreedom.controller('TimeToRetirementController', ['$scope', 'RetirementCalculatorService', function($scope, RetirementCalculatorService) {
    $scope.retirement = {};
    var tooltip_selector;
    
    var retirement_data = RetirementCalculatorService.calculateRetirementInfo();
    var months_to_retirement = retirement_data['months'];
    $scope.retirement.years_to_retirement = Math.floor(months_to_retirement / 12);
    $scope.retirement.months_to_retirement = months_to_retirement % 12;
    $scope.retirement.graph_shown = retirement_data.can_retire && !retirement_data.can_retire_immediately;
    $scope.retirement.never_retire_shown = !retirement_data.can_retire && !retirement_data.can_retire_immediately;
    $scope.retirement.already_retired_shown = retirement_data.can_retire_immediately;

    console.log("graph shown " + $scope.retirement.graph_shown);
    console.log("never retire " + $scope.retirement.never_retire_shown);
    console.log("already_retired_show " + $scope.retirement.already_retired_show);
    
    createRetirementGraph(retirement_data['graph_points'], retirement_data['intersection_point']);
    
    $(window).resize(function() {
        if ($(".tooltip").length > 0) {
            $(tooltip_selector).tooltip('destroy');
        }
        
        createRetirementGraph(retirement_data['graph_points'], retirement_data['intersection_point']);
    });
    
    function createRetirementGraph(graph_points, intersection_point) {
        var show_tooltip = false;
        container_width = $('#graph-wrapper').width();
        minimum_graph_height = 500;
        aspect_ratio = 16 / 9;
        scroll_bar_width = 20;
        pixels_per_axis_label = 55;
    
        var margin = {top: 20, right: 10, bottom: 30, left: 75},
            width = container_width - margin.left - margin.right - scroll_bar_width,
            height = width / aspect_ratio - margin.top - margin.bottom;
            
        if (height < minimum_graph_height) {
            height = minimum_graph_height;
        }
        
        number_of_x_ticks = Math.min(width / pixels_per_axis_label);
        function yTickFormat(tick_value) {
            return '$' + tick_value;
        };
        
        var customTimeFormat = d3.time.format.multi([
            [".%L", function(d) { return d.getMilliseconds(); }],
            [":%S", function(d) { return d.getSeconds(); }],
            ["%I:%M", function(d) { return d.getMinutes(); }],
            ["%I %p", function(d) { return d.getHours(); }],
            ["%a %d", function(d) { return d.getDay() && d.getDate() != 1; }],
            ["%b %d", function(d) { return d.getDate() != 1; }],
            ["%b", function(d) { return d.getMonth(); }],
            ["%Y", function() { return true; }]
        ]);
        
        var cur_date = new Date();
        var end_date = new Date();
        end_date.setMonth(end_date.getMonth() + graph_points.length);
        
        var max_value = d3.max(graph_points, function(d) { return d.withdraw_limit; });
        
        d3.select("#retirement-graph svg").remove();
        
        var chart = d3.select('#retirement-graph').append('svg');
        chart.selectAll("*").remove();
        chart.attr('width', width + margin.left + margin.right)
                .attr('height', height + margin.bottom + margin.top);
            
        var xScale = d3.time.scale()
            .domain([cur_date, end_date])
            .range([0, width]);
            
        var yScale = d3.scale.linear()
            .domain([0, max_value])
            .range([height, 0]);
            
        var xAxis = d3.svg.axis()
            .scale(xScale)
            .orient('bottom')
            .tickFormat(customTimeFormat)
            .ticks(number_of_x_ticks);
            
        var yAxis = d3.svg.axis()
            .scale(yScale)
            .orient("left")
            .tickFormat(yTickFormat);
            
        chart.append("g")
            .attr("class", "axis x-axis")
            .attr("transform", "translate(" + margin.left + ", " + (height + margin.top) + ")")
            .call(xAxis);
        
        chart.append("g")
            .attr("class", "axis y-axis")
            .attr("transform", "translate(" + margin.left + ", " + margin.top + ")")
            .call(yAxis);
        
        var expense_line = d3.svg.line()
            .x(function(d, i) {
                return xScale(d.date);
            })
            .y(function(d) {
                return yScale(d.expenses);
            });
            
        var withdraw_line = d3.svg.line()
            .x(function(d, i) {
                return xScale(d.date);
            })
            .y(function(d) {
                return yScale(d.withdraw_limit);
            });
            
        chart.append("path")
            .attr("class", "expense-line")
            .attr("d", expense_line(graph_points))
            .attr("transform", "translate(" + margin.left + ", " + margin.top + ") ");
        chart.append("path")
            .attr("class", "withdraw-line")
            .attr("d", withdraw_line(graph_points))
            .attr("transform", "translate(" + margin.left + ", " + margin.top + ") ");
        
        if (intersection_point) {
            chart.selectAll('circle')
                .data([intersection_point])
                .enter()
                .append('circle')
                .attr('cx', function(d) {
                    return xScale(d.x);
                })
                .attr('cy', function(d) {
                    return yScale(d.y);
                })
                .attr('r', 5)
                .attr('class', 'intersection-point')
                .attr("transform", "translate(" + margin.left + ", " + margin.top + ") ");
                
            show_tooltip = true;
            tooltip_selector = ".intersection-point";
        }
            
        var legend = chart.append("g")
            .attr("class", "legend")
            .attr("width", 200)
            .attr("height", 100)
            .attr("transform", "translate(" + (margin.left + width - 110) + ", " + (margin.top + height - 45) + ") ");

        legend.append("rect")
            .attr("width", 18)
            .attr("height", 18)
            .attr("class", "expense-label");
            
        legend.append("rect")
            .attr("width", 18)
            .attr("height", 18)
            .attr("transform", "translate(0," + 20 + ") ")
            .attr("class", "withdraw-label");

        legend.append("text")
            .attr("x", 24)
            .attr("y", 9)
            .attr("dy", ".35em")
            .text(function(d) { return 'Expenses'; });
            
        legend.append("text")
            .attr("x", 24)
            .attr("y", 29)
            .attr("dy", ".35em")
            .text(function(d) { return '4% of Assets'; });
            
        if (show_tooltip) {
            addToolTip('.intersection-point');
        };
            
    };
    
    function addToolTip(selector) {
        var date = retirement_data.intersection_point.x;
        var expenses = retirement_data.intersection_point.y;
        var asset_need = 25 * expenses * 12;
        asset_need = Math.round(asset_need * 100) / 100;
        
        var tooltip_text = "In <span class='bold'>" + date.getFullYear() + "</span> your assets will reach 25 times your expenses -- <span class='bold'>$"  + numberWithCommas(asset_need) + "</span>. You can then safely live off passive investment gains instead of working income."
        
        $(selector).tooltip({
            container: "#graph-wrapper",
            title: tooltip_text,
            html: true,
            trigger: ''
        });
        
        $(selector).tooltip('show');
    };
    
    function numberWithCommas(x) {
        var parts = x.toString().split(".");
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        return parts.join(".");
    }
}]);