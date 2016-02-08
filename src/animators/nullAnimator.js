var Plottable;
(function (Plottable) {
    var Animators;
    (function (Animators) {
        /**
         * An animator implementation with no animation. The attributes are
         * immediately set on the selection.
         */
        var Null = (function () {
            function Null() {
            }
            Null.prototype.totalTime = function (selection) {
                return 0;
            };
            Null.prototype.animate = function (selection, attrToAppliedProjector) {
                return selection.attr(attrToAppliedProjector);
            };
            return Null;
        })();
        Animators.Null = Null;
    })(Animators = Plottable.Animators || (Plottable.Animators = {}));
})(Plottable || (Plottable = {}));
