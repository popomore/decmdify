var fs = require('fs');
var through = require('through');
var esprima = require('esprima');
var estraverse = require('estraverse');
var escodegen = require('escodegen');

module.exports = decmdify;
module.exports.transform = transform;

/*
  Transform CMD module to CommonJS
*/

function decmdify() {
  var data = '',
    stream = through(write, end);
  return stream;

  function write(buf) {
    data += buf;
  }

  function end() {
    var isCMD = false,
      ret;
    var ast = esprima.parse(data);

    estraverse.replace(ast, {
      enter: function(node) {
        if (isDefine(node)) {
          var parents = this.parents();
          if (parents.length === 2 &&
            parents[0].type === 'Program' &&
            parents[1].type === 'ExpressionStatement') {
            isCMD = true;
          }
        }
      },
      leave: function(node) {
        if (isDefine(node)) {
          var args = node.arguments;

          // define(factory)
          // define(object)
          if (args.length === 1 &&
            (args[0].type === 'FunctionExpression' || args[0].type === 'ObjectExpression')) {
            ret = createFactory(args[0]);
            this.break ();
          }

          // define(id, factory)
          // define(id, object)
          // define(deps, factory)
          // define(deps, object)
          else if (args.length === 2 &&
            (args[0].type === 'Literal' || args[0].type === 'ArrayExpression') &&
            (args[1].type === 'FunctionExpression' || args[1].type === 'ObjectExpression')) {
            ret = createFactory(args[1]);
            this.break();
          }

          // define(id, deps, factory)
          // define(id, deps, object)
          else if (args.length === 3 &&
            args[0].type === 'Literal' && args[1].type === 'ArrayExpression' &&
            (args[2].type === 'FunctionExpression' || args[2].type === 'ObjectExpression')) {
            ret = createFactory(args[2]);
            this.break();
          }
        }
      }
    });

    if (!isCMD) {
      stream.queue(data);
    } else {
      var options = {
        format: {
          indent: {
            style: '  ',
          },
          newline: '\n'
        }
      };
      stream.queue(escodegen.generate(ret, options));
    }

    stream.queue(null);
  }
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

function isDefine(node) {
  var callee = node.callee;
  return callee &&
    node.type === 'CallExpression' &&
    callee.type === 'Identifier' &&
    callee.name === 'define';
}

function createFactory(factory) {
  var ret = factory.type === 'FunctionExpression' ?
    createProgram(factory.body.body) : createModuleExport(factory);

  if (ret.type === 'Program') {
    ret.body.forEach(function(item, index) {
      if (item.type === 'ReturnStatement') {
        ret.body[index] = createModuleExport(item.argument);
      }
    });
  }
  return ret;
}

function createProgram(body) {
  return {
    type: 'Program',
    body: body
  };
}

function createModuleExport(obj) {
  return {
    type: 'ExpressionStatement',
    expression: {
      type: 'AssignmentExpression',
      operator: '=',
      left: {
        type: 'MemberExpression',
        computed: false,
        object: {
          type: 'Identifier',
          name: 'module'
        },
        property: {
          type: 'Identifier',
          name: 'exports'
        }
      },
      right: obj
    }
  };
}
