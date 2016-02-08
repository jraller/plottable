declare module Plottable.Animators {
    /**
     * An animator implementation with no animation. The attributes are
     * immediately set on the selection.
     */
    class Null implements Animator {
        totalTime(selection: any): number;
        animate(selection: d3.Selection<any>, attrToAppliedProjector: AttributeToAppliedProjector): d3.Selection<any>;
    }
}
