'use strict';

var fs = require('fs');
var through = require('through2');
var falafel = require('falafel');

module.exports = decmdify;
module.exports.transform = transform;

/*
  Transform CMD module to CommonJS
*/

function decmdify(options) {
  options || (options = {});
  var isGulp = !!options.gulp;
  var data = '';

  return through.obj(function transform (file, enc, callback) {
    if (isGulp) {
      var code = parse(file.contents.toString());
      file.contents = new Buffer(code);
      this.push(file);
      return callback();
    }

    if (typeof file !== 'string' && !(file instanceof Buffer)) {
      return callback(new Error('not string, you can specify gulp to support object.'));
    }
    data += file;
    callback();
  }, function flush(callback) {
    if (!isGulp) {
      this.push(parse(data));
    }
    callback();
  });
}

function transform(src, cb) {
  var data = '';
  fs.createReadStream(src)
    .on('error', cb)
    .pipe(decmdify())
    .on('data', function (buf) {
      data += buf;
    })
    .on('end', function () {
      cb(null, data);
    });
}

function parse(data) {
  var isCMD = false;
  var opt = {comment: true};
  var output = falafel(data, opt, function (node) {
    if (isDefine(node) && isRoot(node.parent)) {
      isCMD = true;
      var args = node.arguments;

      // define(factory)
      // define(object)
      if (args.length === 1 &&
        (args[0].type === 'FunctionExpression' || args[0].type === 'ObjectExpression')) {
        return node.update(createFactory(args[0]));
      }

      // define(id, factory)
      // define(id, object)
      // define(deps, factory)
      // define(deps, object)
      else if (args.length === 2 &&
        (args[0].type === 'Literal' || args[0].type === 'ArrayExpression') &&
        (args[1].type === 'FunctionExpression' || args[1].type === 'ObjectExpression')) {
        return node.update(createFactory(args[1]));
      }

      // define(id, deps, factory)
      // define(id, deps, object)
      else if (args.length === 3 &&
        args[0].type === 'Literal' && args[1].type === 'ArrayExpression' &&
        (args[2].type === 'FunctionExpression' || args[2].type === 'ObjectExpression')) {
        return node.update(createFactory(args[2]));
      }
    } else if (isReturn(node)) {
      return node.update(createExports(node.argument));
    }
  });

  return isCMD ? output.toString().replace(/(;\s*)*$/, ';') : data;
}

function isDefine(node) {
  var callee = node.callee;
  return callee &&
    node.type === 'CallExpression' &&
    callee.type === 'Identifier' &&
    callee.name === 'define';
}

function isRoot(node) {
  var parent = node.parent;
  return node.type === 'ExpressionStatement' &&
    parent && parent.type === 'Program';
}

function isReturn(node) {
  try {
    var parent = node.parent.parent.parent;
    return node.type === 'ReturnStatement' &&
       parent.type === 'CallExpression' &&
       parent.callee.name === 'define';
  } catch(e) {
    return false;
  }
}

function createFactory(node) {
  if (node.type === 'FunctionExpression') {
    return node.body.source()
      .replace(/^\s*\{/, '')
      .replace(/\}\s*;?\s*$/, '');
  } else {
    return createExports(node);
  }

  // if (ret.type === 'Program') {
  //   ret.body.forEach(function(item, index) {
  //     if (item.type === 'ReturnStatement') {
  //       ret.body[index] = createModuleExport(item.argument);
  //     }
  //   });
  // }
}

function createExports(node) {
  return 'module.exports = ' + node.source() + ';';
}
