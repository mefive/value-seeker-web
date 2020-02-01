"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var _ = __importStar(require("lodash"));
var react_1 = require("react");
function useTree(treeData, defaultExpandedKeys) {
    if (defaultExpandedKeys === void 0) { defaultExpandedKeys = []; }
    var _a = react_1.useState(defaultExpandedKeys), expandedKeys = _a[0], setExpandedKeys = _a[1];
    var dataSource = react_1.useMemo(function () {
        var lns = [];
        var walk = function (nodes, level) {
            if (level === void 0) { level = 0; }
            nodes.forEach(function (node) {
                var children = node.children;
                lns.push(__assign(__assign({}, _.omit(node, ['children'])), { level: level, children: children && children.map(function (c) { return c.key; }) }));
                if (children && expandedKeys.includes(node.key)) {
                    walk(children, level + 1);
                }
            });
        };
        if (treeData != null) {
            walk(treeData);
        }
        return lns;
    }, [treeData, expandedKeys]);
    var expandToLevel = react_1.useCallback(function (level) {
        var keys = [];
        var walk = function (nodes, l) {
            if (l === void 0) { l = 0; }
            if (l > level) {
                return;
            }
            nodes.forEach(function (node) {
                keys.push(node.key);
                var children = node.children;
                if (children && children.length > 0) {
                    walk(children, level + 1);
                }
            });
        };
        if (treeData != null) {
            walk(treeData);
        }
        setExpandedKeys(keys);
    }, [treeData]);
    return {
        dataSource: dataSource,
        expandedKeys: expandedKeys,
        setExpandedKeys: setExpandedKeys,
        expandToLevel: expandToLevel,
    };
}
exports.default = useTree;
