var Plottable;
(function (Plottable) {
    var Utils;
    (function (Utils) {
        var DOM;
        (function (DOM) {
            var nativeMath = window.Math;
            /**
             * Gets the bounding box of an element.
             * @param {d3.Selection} element
             * @returns {SVGRed} The bounding box.
             */
            function elementBBox(element) {
                var bbox;
                // HACKHACK: Firefox won't correctly measure nodes with style "display: none" or their descendents (FF Bug 612118).
                try {
                    bbox = element.node().getBBox();
                }
                catch (err) {
                    bbox = { x: 0, y: 0, width: 0, height: 0 };
                }
                return bbox;
            }
            DOM.elementBBox = elementBBox;
            /**
             * Screen refresh rate which is assumed to be 60fps
             */
            DOM.SCREEN_REFRESH_RATE_MILLISECONDS = 1000 / 60;
            /**
             * Polyfill for `window.requestAnimationFrame`.
             * If the function exists, then we use the function directly.
             * Otherwise, we set a timeout on `SCREEN_REFRESH_RATE_MILLISECONDS` and then perform the function.
             *
             * @param {() => void} callback The callback to call in the next animation frame
             */
            function requestAnimationFramePolyfill(callback) {
                if (window.requestAnimationFrame != null) {
                    window.requestAnimationFrame(callback);
                }
                else {
                    setTimeout(callback, DOM.SCREEN_REFRESH_RATE_MILLISECONDS);
                }
            }
            DOM.requestAnimationFramePolyfill = requestAnimationFramePolyfill;
            /**
             * Calculates the width of the element.
             * The width includes the padding and the border on the element's left and right sides.
             *
             * @param {Element} element The element to query
             * @returns {number} The width of the element.
             */
            function elementWidth(element) {
                var style = window.getComputedStyle(element);
                return _parseStyleValue(style, "width")
                    + _parseStyleValue(style, "padding-left")
                    + _parseStyleValue(style, "padding-right")
                    + _parseStyleValue(style, "border-left-width")
                    + _parseStyleValue(style, "border-right-width");
            }
            DOM.elementWidth = elementWidth;
            /**
             * Calculates the height of the element.
             * The height includes the padding the and the border on the element's top and bottom sides.
             *
             * @param {Element} element The element to query
             * @returns {number} The height of the element
             */
            function elementHeight(element) {
                var style = window.getComputedStyle(element);
                return _parseStyleValue(style, "height")
                    + _parseStyleValue(style, "padding-top")
                    + _parseStyleValue(style, "padding-bottom")
                    + _parseStyleValue(style, "border-top-width")
                    + _parseStyleValue(style, "border-bottom-width");
            }
            DOM.elementHeight = elementHeight;
            function translate(selection, x, y) {
                var transformMatrix = d3.transform(selection.attr("transform"));
                if (x == null) {
                    return transformMatrix.translate;
                }
                y = (y == null) ? 0 : y;
                transformMatrix.translate[0] = x;
                transformMatrix.translate[1] = y;
                selection.attr("transform", transformMatrix.toString());
                return selection;
            }
            DOM.translate = translate;
            /**
             * Checks if the first ClientRect overlaps the second.
             *
             * @param {ClientRect} clientRectA The first ClientRect
             * @param {ClientRect} clientRectB The second ClientRect
             * @returns {boolean} If the ClientRects overlap each other.
             */
            function clientRectsOverlap(clientRectA, clientRectB) {
                if (nativeMath.floor(clientRectA.right) <= nativeMath.ceil(clientRectB.left)) {
                    return false;
                }
                if (nativeMath.ceil(clientRectA.left) >= nativeMath.floor(clientRectB.right)) {
                    return false;
                }
                if (nativeMath.floor(clientRectA.bottom) <= nativeMath.ceil(clientRectB.top)) {
                    return false;
                }
                if (nativeMath.ceil(clientRectA.top) >= nativeMath.floor(clientRectB.bottom)) {
                    return false;
                }
                return true;
            }
            DOM.clientRectsOverlap = clientRectsOverlap;
            /**
             * Returns true if and only if innerClientRect is inside outerClientRect.
             *
             * @param {ClientRect} innerClientRect The first ClientRect
             * @param {ClientRect} outerClientRect The second ClientRect
             * @returns {boolean} If and only if the innerClientRect is inside outerClientRect.
             */
            function clientRectInside(innerClientRect, outerClientRect) {
                return (nativeMath.floor(outerClientRect.left) <= nativeMath.ceil(innerClientRect.left) &&
                    nativeMath.floor(outerClientRect.top) <= nativeMath.ceil(innerClientRect.top) &&
                    nativeMath.floor(innerClientRect.right) <= nativeMath.ceil(outerClientRect.right) &&
                    nativeMath.floor(innerClientRect.bottom) <= nativeMath.ceil(outerClientRect.bottom));
            }
            DOM.clientRectInside = clientRectInside;
            /**
             * Retrieves the bounding svg of the input element
             *
             * @param {SVGElement} element The element to query
             * @returns {SVGElement} The bounding svg
             */
            function boundingSVG(element) {
                var ownerSVG = element.ownerSVGElement;
                if (ownerSVG != null) {
                    return ownerSVG;
                }
                if (element.nodeName.toLowerCase() === "svg") {
                    return element;
                }
                return null; // not in the DOM
            }
            DOM.boundingSVG = boundingSVG;
            var _latestClipPathId = 0;
            /**
             * Generates a ClipPath ID that is unique for this instance of Plottable
             */
            function generateUniqueClipPathId() {
                return "plottableClipPath" + ++_latestClipPathId;
            }
            DOM.generateUniqueClipPathId = generateUniqueClipPathId;
            /**
             * Returns true if the supplied coordinates or Ranges intersect or are contained by bbox.
             *
             * @param {number | Range} xValOrRange The x coordinate or Range to test
             * @param {number | Range} yValOrRange The y coordinate or Range to test
             * @param {SVGRect} bbox The bbox
             * @param {number} tolerance Amount by which to expand bbox, in each dimension, before
             * testing intersection
             *
             * @returns {boolean} True if the supplied coordinates or Ranges intersect or are
             * contained by bbox, false otherwise.
             */
            function intersectsBBox(xValOrRange, yValOrRange, bbox, tolerance) {
                if (tolerance === void 0) { tolerance = 0.5; }
                var xRange = _parseRange(xValOrRange);
                var yRange = _parseRange(yValOrRange);
                // SVGRects are positioned with sub-pixel accuracy (the default unit
                // for the x, y, height & width attributes), but user selections (e.g. via
                // mouse events) usually have pixel accuracy. A tolerance of half-a-pixel
                // seems appropriate.
                return bbox.x + bbox.width >= xRange.min - tolerance &&
                    bbox.x <= xRange.max + tolerance &&
                    bbox.y + bbox.height >= yRange.min - tolerance &&
                    bbox.y <= yRange.max + tolerance;
            }
            DOM.intersectsBBox = intersectsBBox;
            /**
             * Create a Range from a number or an object with "min" and "max" defined.
             *
             * @param {any} input The object to parse
             *
             * @returns {Range} The generated Range
             */
            function _parseRange(input) {
                if (typeof (input) === "number") {
                    var value = input;
                    return { min: value, max: value };
                }
                var range = input;
                if (range instanceof Object && "min" in range && "max" in range) {
                    return range;
                }
                throw new Error("input '" + input + "' can't be parsed as an Range");
            }
            function _parseStyleValue(style, property) {
                var value = style.getPropertyValue(property);
                var parsedValue = parseFloat(value);
                return parsedValue || 0;
            }
        })(DOM = Utils.DOM || (Utils.DOM = {}));
    })(Utils = Plottable.Utils || (Plottable.Utils = {}));
})(Plottable || (Plottable = {}));
