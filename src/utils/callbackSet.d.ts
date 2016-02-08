declare module Plottable.Utils {
    /**
     * A set of callbacks which can be all invoked at once.
     * Each callback exists at most once in the set (based on reference equality).
     * All callbacks should have the same signature.
     */
    class CallbackSet<CB extends Function> extends Set<CB> {
        callCallbacks(...args: any[]): this;
    }
}
