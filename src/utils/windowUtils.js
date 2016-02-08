var Plottable;
(function (Plottable) {
    var Utils;
    (function (Utils) {
        var Window;
        (function (Window) {
            /**
             * Print a warning message to the console, if it is available.
             *
             * @param {string} The warnings to print
             */
            function warn(warning) {
                if (!Plottable.Configs.SHOW_WARNINGS) {
                    return;
                }
                /* tslint:disable:no-console */
                if (window.console != null) {
                    if (window.console.warn != null) {
                        console.warn(warning);
                    }
                    else if (window.console.log != null) {
                        console.log(warning);
                    }
                }
                /* tslint:enable:no-console */
            }
            Window.warn = warn;
            /**
             * Is like setTimeout, but activates synchronously if time=0
             * We special case 0 because of an observed issue where calling setTimeout causes visible flickering.
             * We believe this is because when requestAnimationFrame calls into the paint function, as soon as that function finishes
             * evaluating, the results are painted to the screen. As a result, if we want something to occur immediately but call setTimeout
             * with time=0, then it is pushed to the call stack and rendered in the next frame, so the component that was rendered via
             * setTimeout appears out-of-sync with the rest of the plot.
             */
            function setTimeout(f, time) {
                var args = [];
                for (var _i = 2; _i < arguments.length; _i++) {
                    args[_i - 2] = arguments[_i];
                }
                if (time === 0) {
                    f(args);
                    return -1;
                }
                else {
                    return window.setTimeout(f, time, args);
                }
            }
            Window.setTimeout = setTimeout;
            /**
             * Sends a deprecation warning to the console. The warning includes the name of the deprecated method,
             * version number of the deprecation, and an optional message.
             *
             * To be used in the first line of a deprecated method.
             *
             * @param {string} callingMethod The name of the method being deprecated
             * @param {string} version The version when the tagged method became obsolete
             * @param {string?} message Optional message to be shown with the warning
             */
            function deprecated(callingMethod, version, message) {
                if (message === void 0) { message = ""; }
                Utils.Window.warn("Method " + callingMethod + " has been deprecated in version " + version +
                    ". Please refer to the release notes. " + message);
            }
            Window.deprecated = deprecated;
        })(Window = Utils.Window || (Utils.Window = {}));
    })(Utils = Plottable.Utils || (Plottable.Utils = {}));
})(Plottable || (Plottable = {}));
