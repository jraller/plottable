var Plottable;
(function (Plottable) {
    var SymbolFactories;
    (function (SymbolFactories) {
        function circle() {
            return function (symbolSize) { return d3.svg.symbol().type("circle").size(Math.PI * Math.pow(symbolSize / 2, 2))(null); };
        }
        SymbolFactories.circle = circle;
        function square() {
            return function (symbolSize) { return d3.svg.symbol().type("square").size(Math.pow(symbolSize, 2))(null); };
        }
        SymbolFactories.square = square;
        function cross() {
            return function (symbolSize) { return d3.svg.symbol().type("cross").size((5 / 9) * Math.pow(symbolSize, 2))(null); };
        }
        SymbolFactories.cross = cross;
        function diamond() {
            return function (symbolSize) { return d3.svg.symbol().type("diamond").size(Math.tan(Math.PI / 6) * Math.pow(symbolSize, 2) / 2)(null); };
        }
        SymbolFactories.diamond = diamond;
        function triangleUp() {
            return function (symbolSize) { return d3.svg.symbol().type("triangle-up").size(Math.sqrt(3) * Math.pow(symbolSize / 2, 2))(null); };
        }
        SymbolFactories.triangleUp = triangleUp;
        function triangleDown() {
            return function (symbolSize) { return d3.svg.symbol().type("triangle-down").size(Math.sqrt(3) * Math.pow(symbolSize / 2, 2))(null); };
        }
        SymbolFactories.triangleDown = triangleDown;
    })(SymbolFactories = Plottable.SymbolFactories || (Plottable.SymbolFactories = {}));
})(Plottable || (Plottable = {}));
