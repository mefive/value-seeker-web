"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var useMedia = function (query) {
    var _a = react_1.useState(function () { return window.matchMedia(query).matches; }), state = _a[0], setState = _a[1];
    react_1.useEffect(function () {
        var mounted = true;
        var mql = window.matchMedia(query);
        var onChange = function () {
            if (!mounted) {
                return;
            }
            setState(!!mql.matches);
        };
        mql.addListener(onChange);
        setState(mql.matches);
        return function () {
            mounted = false;
            mql.removeListener(onChange);
        };
    }, [query]);
    return state;
};
exports.default = useMedia;
