FinancialFreedom.service('CreateRetirementGraphService', function() {

    this.createRetirementGraph = function(retirement_data) { //graph_points, intersection_point

        var graph_points = retirement_data['graph_points'];
        var intersection_point = retirement_data['intersection_point'];
        var show_tooltip = false;
        var tooltip_selector;
        container_width = $('#graph-wrapper').width();
        minimum_graph_height = 300;
        aspect_ratio = 16 / 9;
        scroll_bar_width = 20;
        pixels_per_axis_label = 75;

        if ($(".tooltip").length > 0) {
            $( ".tooltip" ).remove();
        }

        var margin = {top: 20, right: 10, bottom: 30, left: 75},
            width = container_width - margin.left - margin.right - scroll_bar_width,
            height = width / aspect_ratio - margin.top - margin.bottom;
            
        if (height < minimum_graph_height) {
            height = minimum_graph_height;
        }
        
        number_of_x_ticks = Math.min(width / pixels_per_axis_label);
        
        function yTickFormat(tick_value) {
            tick_value = numberWithCommas(tick_value);
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
            .attr("transform", "translate(" + (margin.left + 40) + ", " + (margin.top + 20) + ") ");

        legend.append("rect")
            .attr("width", 18)
            .attr("height", 2)
            .attr("class", "expense-label");
            
        legend.append("rect")
            .attr("width", 18)
            .attr("height", 2)
            .attr("transform", "translate(0," + 20 + ") ")
            .attr("class", "withdraw-label");

        legend.append("text")
            .attr("x", 24)
            .attr("y", 0)
            .attr("dy", ".35em")
            .text(function(d) { return 'Monthly expenses'; });
            
        legend.append("text")
            .attr("x", 24)
            .attr("y", 20)
            .attr("dy", ".35em")
            .text(function(d) { return 'Monthly passive income'; });
        
        if (show_tooltip) {
            addToolTip(tooltip_selector, retirement_data);
        }
    }  
    
    function addToolTip(selector, retirement_data) {
        var date = retirement_data.intersection_point.x;
        var expenses = retirement_data.intersection_point.y;
        var asset_need = 25 * expenses * 12;
        asset_need = Math.round(asset_need);
        
        var tooltip_text = "You will be able to safely live off passive income in <span class='bold'>" + date.getFullYear() + "</span>, when you have total assets of <span class='bold'>$" + numberWithCommas(asset_need) + "</span>.";

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
    };
});