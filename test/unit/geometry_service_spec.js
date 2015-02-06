describe('Unit: GeometryService', function() {
    var DateService;

    beforeEach(module('FinancialFreedom'));

    beforeEach(inject(function(_GeometryService_) {
        GeometryService = _GeometryService_
    }));

    // calculateSlope
    it('returns 1 for slope of line with slope 1', function() {
        var y1 = 1;
        var y2 = 2;
        var dx = 1;

        var slope = GeometryService.calculateSlope(y1, y2, dx);

        expect(slope).toBe(1);
    });

    it('returns -1 for slope of line with slope 1', function() {
        var y1 = 2;
        var y2 = 1;
        var dx = 1;

        var slope = GeometryService.calculateSlope(y1, y2, dx);

        expect(slope).toBe(-1);
    });

    it('returns 10 for slope of line with slope 10', function() {
        var y1 = 0;
        var y2 = 100;
        var dx = 10;

        var slope = GeometryService.calculateSlope(y1, y2, dx);

        expect(slope).toBe(10);
    });

    // calculateIntersection
    it('returns (0,0) for y = 3x and y = 4x', function() {
        var x1 = 0;
        var y1 = 0;
        var m1 = 3;
        var x2 = 0;
        var y2 = 0;
        var m2 = 4;
        var expected_x_intersection = 0;
        var expected_y_intersection = 0;

        var line_data1 = GeometryService.formatLineData(x1, y1, m1);
        var line_data2 = GeometryService.formatLineData(x2, y2, m2);
        var intersection = GeometryService.calculateIntersection(line_data1, line_data2);

        expect(intersection.x).toBe(expected_x_intersection);
        expect(intersection.y).toBe(expected_y_intersection);
    });

    it('returns (0,0) for y = 3x and y = -4x', function() {
        var x1 = 0;
        var y1 = 0;
        var m1 = 3;
        var x2 = 0;
        var y2 = 0;
        var m2 = -4;
        var expected_x_intersection = 0;
        var expected_y_intersection = 0;

        var line_data1 = GeometryService.formatLineData(x1, y1, m1);
        var line_data2 = GeometryService.formatLineData(x2, y2, m2);
        var intersection = GeometryService.calculateIntersection(line_data1, line_data2);

        expect(intersection.x).toBe(expected_x_intersection);
        expect(intersection.y).toBe(expected_y_intersection);
    });

    it('returns (2.5, -8.5) for y-5=3(x-7) and y-9=7(x-5)', function() {
        var x1 = 7;
        var y1 = 5;
        var m1 = 3;
        var x2 = 5;
        var y2 = 9;
        var m2 = 7;
        var expected_x_intersection = 2.5;
        var expected_y_intersection = -8.5;

        var line_data1 = GeometryService.formatLineData(x1, y1, m1);
        var line_data2 = GeometryService.formatLineData(x2, y2, m2);
        var intersection = GeometryService.calculateIntersection(line_data1, line_data2);

        expect(intersection.x).toBe(expected_x_intersection);
        expect(intersection.y).toBe(expected_y_intersection);
    });

    it('returns (-2.8, -24.4) for y-5=3(x-7) and y+9= -7(x+5)', function() {
        var x1 = 7;
        var y1 = 5;
        var m1 = 3;
        var x2 = -5;
        var y2 = -9;
        var m2 = -7;
        var expected_x_intersection = -2.8;
        var expected_y_intersection = -24.4;

        var line_data1 = GeometryService.formatLineData(x1, y1, m1);
        var line_data2 = GeometryService.formatLineData(x2, y2, m2);
        var intersection = GeometryService.calculateIntersection(line_data1, line_data2);

        expect(intersection.x).toBe(expected_x_intersection);
        expect(intersection.y).toBe(expected_y_intersection);
    });
});