/**
 * The RenderController is responsible for enqueueing and synchronizing
 * layout and render calls for Components.
 *
 * Layout and render calls occur inside an animation callback
 * (window.requestAnimationFrame if available).
 *
 * RenderController.flush() immediately lays out and renders all Components currently enqueued.
 *
 * To always have immediate rendering (useful for debugging), call
 * ```typescript
 * Plottable.RenderController.setRenderPolicy(
 *   new Plottable.RenderPolicies.Immediate()
 * );
 * ```
 */
var Plottable;
(function (Plottable) {
    var RenderController;
    (function (RenderController) {
        var _componentsNeedingRender = new Plottable.Utils.Set();
        var _componentsNeedingComputeLayout = new Plottable.Utils.Set();
        var _animationRequested = false;
        var _isCurrentlyFlushing = false;
        var Policy;
        (function (Policy) {
            Policy.IMMEDIATE = "immediate";
            Policy.ANIMATION_FRAME = "animationframe";
            Policy.TIMEOUT = "timeout";
        })(Policy = RenderController.Policy || (RenderController.Policy = {}));
        var _renderPolicy = new Plottable.RenderPolicies.AnimationFrame();
        function renderPolicy(renderPolicy) {
            if (renderPolicy == null) {
                return _renderPolicy;
            }
            switch (renderPolicy.toLowerCase()) {
                case Policy.IMMEDIATE:
                    _renderPolicy = new Plottable.RenderPolicies.Immediate();
                    break;
                case Policy.ANIMATION_FRAME:
                    _renderPolicy = new Plottable.RenderPolicies.AnimationFrame();
                    break;
                case Policy.TIMEOUT:
                    _renderPolicy = new Plottable.RenderPolicies.Timeout();
                    break;
                default:
                    Plottable.Utils.Window.warn("Unrecognized renderPolicy: " + renderPolicy);
            }
        }
        RenderController.renderPolicy = renderPolicy;
        /**
         * Enqueues the Component for rendering.
         *
         * @param {Component} component
         */
        function registerToRender(component) {
            if (_isCurrentlyFlushing) {
                Plottable.Utils.Window.warn("Registered to render while other components are flushing: request may be ignored");
            }
            _componentsNeedingRender.add(component);
            requestRender();
        }
        RenderController.registerToRender = registerToRender;
        /**
         * Enqueues the Component for layout and rendering.
         *
         * @param {Component} component
         */
        function registerToComputeLayout(component) {
            _componentsNeedingComputeLayout.add(component);
            _componentsNeedingRender.add(component);
            requestRender();
        }
        RenderController.registerToComputeLayout = registerToComputeLayout;
        function requestRender() {
            // Only run or enqueue flush on first request.
            if (!_animationRequested) {
                _animationRequested = true;
                _renderPolicy.render();
            }
        }
        /**
         * Renders all Components waiting to be rendered immediately
         * instead of waiting until the next frame.
         *
         * Useful to call when debugging.
         */
        function flush() {
            if (_animationRequested) {
                // Layout
                _componentsNeedingComputeLayout.forEach(function (component) { return component.computeLayout(); });
                // Top level render; Containers will put their children in the toRender queue
                _componentsNeedingRender.forEach(function (component) { return component.render(); });
                _isCurrentlyFlushing = true;
                var failed = new Plottable.Utils.Set();
                _componentsNeedingRender.forEach(function (component) {
                    try {
                        component.renderImmediately();
                    }
                    catch (err) {
                        // throw error with timeout to avoid interrupting further renders
                        window.setTimeout(function () { throw err; }, 0);
                        failed.add(component);
                    }
                });
                _componentsNeedingComputeLayout = new Plottable.Utils.Set();
                _componentsNeedingRender = failed;
                _animationRequested = false;
                _isCurrentlyFlushing = false;
            }
        }
        RenderController.flush = flush;
    })(RenderController = Plottable.RenderController || (Plottable.RenderController = {}));
})(Plottable || (Plottable = {}));
