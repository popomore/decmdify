define('a', ['a', 'b'], function (require, exports, module) {
  var a = require('a'), b = require('b');
  module.exports = {
    a: a,
    b: b
  };

});
