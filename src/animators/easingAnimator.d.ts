declare module Plottable.Animators {
    /**
     * An Animator with easing and configurable durations and delays.
     */
    class Easing implements Animator {
        /**
         * The default starting delay of the animation in milliseconds
         */
        private static _DEFAULT_START_DELAY_MILLISECONDS;
        /**
         * The default duration of one animation step in milliseconds
         */
        private static _DEFAULT_STEP_DURATION_MILLISECONDS;
        /**
         * The default maximum start delay between each step of an animation
         */
        private static _DEFAULT_ITERATIVE_DELAY_MILLISECONDS;
        /**
         * The default maximum total animation duration
         */
        private static _DEFAULT_MAX_TOTAL_DURATION_MILLISECONDS;
        /**
         * The default easing of the animation
         */
        private static _DEFAULT_EASING_MODE;
        private _startDelay;
        private _stepDuration;
        private _stepDelay;
        private _maxTotalDuration;
        private _easingMode;
        /**
         * Constructs the default animator
         *
         * @constructor
         */
        constructor();
        totalTime(numberOfSteps: number): number;
        animate(selection: d3.Selection<any>, attrToAppliedProjector: AttributeToAppliedProjector): d3.Transition<any>;
        /**
         * Gets the start delay of the animation in milliseconds.
         *
         * @returns {number} The current start delay.
         */
        startDelay(): number;
        /**
         * Sets the start delay of the animation in milliseconds.
         *
         * @param {number} startDelay The start delay in milliseconds.
         * @returns {Easing} The calling Easing Animator.
         */
        startDelay(startDelay: number): this;
        /**
         * Gets the duration of one animation step in milliseconds.
         *
         * @returns {number} The current duration.
         */
        stepDuration(): number;
        /**
         * Sets the duration of one animation step in milliseconds.
         *
         * @param {number} stepDuration The duration in milliseconds.
         * @returns {Easing} The calling Easing Animator.
         */
        stepDuration(stepDuration: number): this;
        /**
         * Gets the maximum start delay between animation steps in milliseconds.
         *
         * @returns {number} The current maximum iterative delay.
         */
        stepDelay(): number;
        /**
         * Sets the maximum start delay between animation steps in milliseconds.
         *
         * @param {number} stepDelay The maximum iterative delay in milliseconds.
         * @returns {Easing} The calling Easing Animator.
         */
        stepDelay(stepDelay: number): this;
        /**
         * Gets the maximum total animation duration constraint in milliseconds.
         *
         * If the animation time would exceed the specified time, the duration of each step
         * and the delay between each step will be reduced until the animation fits within
         * the specified time.
         *
         * @returns {number} The current maximum total animation duration.
         */
        maxTotalDuration(): number;
        /**
         * Sets the maximum total animation duration constraint in miliseconds.
         *
         * If the animation time would exceed the specified time, the duration of each step
         * and the delay between each step will be reduced until the animation fits within
         * the specified time.
         *
         * @param {number} maxTotalDuration The maximum total animation duration in milliseconds.
         * @returns {Easing} The calling Easing Animator.
         */
        maxTotalDuration(maxTotalDuration: number): this;
        /**
         * Gets the current easing mode of the animation.
         *
         * @returns {string} the current easing mode.
         */
        easingMode(): string;
        /**
         * Sets the easing mode of the animation.
         *
         * @param {string} easingMode The desired easing mode.
         * @returns {Easing} The calling Easing Animator.
         */
        easingMode(easingMode: string): this;
        /**
         * Adjust the iterative delay, such that it takes into account the maxTotalDuration constraint
         */
        private _getAdjustedIterativeDelay(numberOfSteps);
    }
}
