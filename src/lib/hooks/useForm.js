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
var defaultErrorMessage = {
    required: '必填项需填写',
    pattern: '格式不匹配',
    validate: '验证未通过',
};
function formatRuleType(ruleType, name) {
    if (typeof ruleType === 'object' && 'value' in ruleType) {
        return ruleType;
    }
    return {
        value: ruleType,
        message: defaultErrorMessage[name],
    };
}
function validate(value, rule) {
    if (rule.required) {
        var _a = formatRuleType(rule.required, 'required'), ruleValue = _a.value, message = _a.message;
        if (ruleValue && (value == null || "" + value === '' || (Array.isArray(value) && _.isEmpty(value)))) {
            return message;
        }
    }
    if (rule.pattern) {
        var _b = formatRuleType(rule.pattern, 'pattern'), ruleValue = _b.value, message = _b.message;
        if (!ruleValue.test("" + value)) {
            return message;
        }
    }
    if (rule.validate) {
        var _c = formatRuleType(rule.validate, 'validate'), ruleValue = _c.value, message = _c.message;
        if (!ruleValue(value)) {
            return message;
        }
    }
    return null;
}
function useForm(options) {
    var _a = react_1.useState(options.defaultValues || {}), defaultValues = _a[0], setDefaultValues = _a[1];
    var _b = react_1.useState(defaultValues), values = _b[0], setValues = _b[1];
    var _c = react_1.useState({}), errors = _c[0], setErrors = _c[1];
    var dirty = react_1.useMemo(function () { return !_.isEqualWith(defaultValues, values, options.compare); }, [defaultValues, values]);
    var rules = {};
    var bind = react_1.useCallback(function (name, rule) {
        if (rule) {
            rules["" + name] = rule;
        }
        return {
            value: values && values[name],
            onChange: function (valueOrEvent) {
                var _a;
                if (valueOrEvent != null) {
                    var value = (typeof valueOrEvent === 'object' && 'target' in valueOrEvent)
                        ? valueOrEvent.target.value : valueOrEvent;
                    var valuesNew = __assign(__assign({}, values), (_a = {}, _a[name] = value, _a));
                    if (name in errors) {
                        setErrors(_.omit(errors, ["" + name]));
                    }
                    setValues(valuesNew);
                }
            },
        };
    }, [values, rules, errors]);
    var triggerValidation = react_1.useCallback(function (k) {
        var keys = k || Object.keys(rules);
        var errs = {};
        keys.forEach(function (key) {
            var rule = rules["" + key];
            if (rule == null) {
                return;
            }
            var value = values[key];
            var message = validate(value, rule);
            if (message) {
                errs["" + key] = message;
            }
        });
        setErrors(errs);
        return Object.keys(errs).length === 0;
    }, [values, rules]);
    var getValues = react_1.useCallback(function () { return values; }, [values]);
    var setValue = react_1.useCallback(function (name, value) {
        var _a;
        setValues(__assign(__assign({}, values), (_a = {}, _a[name] = value, _a)));
    }, [values]);
    var reset = react_1.useCallback(function (values1) {
        var d = values1 || {};
        setDefaultValues(d);
        setValues(d);
        setErrors({});
    }, []);
    return {
        bind: bind,
        reset: reset,
        values: values,
        triggerValidation: triggerValidation,
        dirty: dirty,
        errors: errors,
        setErrors: setErrors,
        getValues: getValues,
        setValue: setValue,
        setValues: setValues,
    };
}
exports.default = useForm;
