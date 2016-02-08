declare module Plottable {
    /**
     * A SymbolFactory is a function that takes in a symbolSize which is the edge length of the render area
     * and returns a string representing the 'd' attribute of the resultant 'path' element
     */
    type SymbolFactory = (symbolSize: number) => string;
}
declare module Plottable.SymbolFactories {
    function circle(): SymbolFactory;
    function square(): SymbolFactory;
    function cross(): SymbolFactory;
    function diamond(): SymbolFactory;
    function triangleUp(): SymbolFactory;
    function triangleDown(): SymbolFactory;
}
