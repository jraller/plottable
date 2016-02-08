var Plottable;
(function (Plottable) {
    var RenderPolicies;
    (function (RenderPolicies) {
        /**
         * Renders Components immediately after they are enqueued.
         * Useful for debugging, horrible for performance.
         */
        var Immediate = (function () {
            function Immediate() {
            }
            Immediate.prototype.render = function () {
                Plottable.RenderController.flush();
            };
            return Immediate;
        })();
        RenderPolicies.Immediate = Immediate;
        /**
         * The default way to render, which only tries to render every frame
         * (usually, 1/60th of a second).
         */
        var AnimationFrame = (function () {
            function AnimationFrame() {
            }
            AnimationFrame.prototype.render = function () {
                Plottable.Utils.DOM.requestAnimationFramePolyfill(Plottable.RenderController.flush);
            };
            return AnimationFrame;
        })();
        RenderPolicies.AnimationFrame = AnimationFrame;
        /**
         * Renders with `setTimeout()`.
         * Generally an inferior way to render compared to `requestAnimationFrame`,
         * but useful for browsers that don't suppoort `requestAnimationFrame`.
         */
        var Timeout = (function () {
            function Timeout() {
                this._timeoutMsec = Plottable.Utils.DOM.SCREEN_REFRESH_RATE_MILLISECONDS;
            }
            Timeout.prototype.render = function () {
                setTimeout(Plottable.RenderController.flush, this._timeoutMsec);
            };
            return Timeout;
        })();
        RenderPolicies.Timeout = Timeout;
    })(RenderPolicies = Plottable.RenderPolicies || (Plottable.RenderPolicies = {}));
})(Plottable || (Plottable = {}));
