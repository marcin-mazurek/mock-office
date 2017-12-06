'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.default = extractSubTree;
function extractSubTree(source, target) {
  var subTree = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  var res = subTree || {};
  var targetKeys = Object.keys(target);

  targetKeys.forEach(function (key) {
    if (_typeof(target[key]) === 'object' && _typeof(source[key]) === 'object' && !Array.isArray(source[key])) {
      res[key] = {};
      extractSubTree(source[key], target[key], res[key]);
    } else {
      res[key] = source[key];
    }
  });

  return res;
}
//# sourceMappingURL=extractSubTree.js.map