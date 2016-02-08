var Plottable;
(function (Plottable) {
    var Animators;
    (function (Animators) {
        /**
         * An Animator with easing and configurable durations and delays.
         */
        var Easing = (function () {
            /**
             * Constructs the default animator
             *
             * @constructor
             */
            function Easing() {
                this._startDelay = Easing._DEFAULT_START_DELAY_MILLISECONDS;
                this._stepDuration = Easing._DEFAULT_STEP_DURATION_MILLISECONDS;
                this._stepDelay = Easing._DEFAULT_ITERATIVE_DELAY_MILLISECONDS;
                this._maxTotalDuration = Easing._DEFAULT_MAX_TOTAL_DURATION_MILLISECONDS;
                this._easingMode = Easing._DEFAULT_EASING_MODE;
            }
            Easing.prototype.totalTime = function (numberOfSteps) {
                var adjustedIterativeDelay = this._getAdjustedIterativeDelay(numberOfSteps);
                return this.startDelay() + adjustedIterativeDelay * (Math.max(numberOfSteps - 1, 0)) + this.stepDuration();
            };
            Easing.prototype.animate = function (selection, attrToAppliedProjector) {
                var _this = this;
                var numberOfSteps = selection[0].length;
                var adjustedIterativeDelay = this._getAdjustedIterativeDelay(numberOfSteps);
                return selection.transition()
                    .ease(this.easingMode())
                    .duration(this.stepDuration())
                    .delay(function (d, i) { return _this.startDelay() + adjustedIterativeDelay * i; })
                    .attr(attrToAppliedProjector);
            };
            Easing.prototype.startDelay = function (startDelay) {
                if (startDelay == null) {
                    return this._startDelay;
                }
                else {
                    this._startDelay = startDelay;
                    return this;
                }
            };
            Easing.prototype.stepDuration = function (stepDuration) {
                if (stepDuration == null) {
                    return Math.min(this._stepDuration, this._maxTotalDuration);
                }
                else {
                    this._stepDuration = stepDuration;
                    return this;
                }
            };
            Easing.prototype.stepDelay = function (stepDelay) {
                if (stepDelay == null) {
                    return this._stepDelay;
                }
                else {
                    this._stepDelay = stepDelay;
                    return this;
                }
            };
            Easing.prototype.maxTotalDuration = function (maxTotalDuration) {
                if (maxTotalDuration == null) {
                    return this._maxTotalDuration;
                }
                else {
                    this._maxTotalDuration = maxTotalDuration;
                    return this;
                }
            };
            Easing.prototype.easingMode = function (easingMode) {
                if (easingMode == null) {
                    return this._easingMode;
                }
                else {
                    this._easingMode = easingMode;
                    return this;
                }
            };
            /**
             * Adjust the iterative delay, such that it takes into account the maxTotalDuration constraint
             */
            Easing.prototype._getAdjustedIterativeDelay = function (numberOfSteps) {
                var stepStartTimeInterval = this.maxTotalDuration() - this.stepDuration();
                stepStartTimeInterval = Math.max(stepStartTimeInterval, 0);
                var maxPossibleIterativeDelay = stepStartTimeInterval / Math.max(numberOfSteps - 1, 1);
                return Math.min(this.stepDelay(), maxPossibleIterativeDelay);
            };
            /**
             * The default starting delay of the animation in milliseconds
             */
            Easing._DEFAULT_START_DELAY_MILLISECONDS = 0;
            /**
             * The default duration of one animation step in milliseconds
             */
            Easing._DEFAULT_STEP_DURATION_MILLISECONDS = 300;
            /**
             * The default maximum start delay between each step of an animation
             */
            Easing._DEFAULT_ITERATIVE_DELAY_MILLISECONDS = 15;
            /**
             * The default maximum total animation duration
             */
            Easing._DEFAULT_MAX_TOTAL_DURATION_MILLISECONDS = Infinity;
            /**
             * The default easing of the animation
             */
            Easing._DEFAULT_EASING_MODE = "exp-out";
            return Easing;
        })();
        Animators.Easing = Easing;
    })(Animators = Plottable.Animators || (Plottable.Animators = {}));
})(Plottable || (Plottable = {}));
