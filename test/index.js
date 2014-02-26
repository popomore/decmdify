var fs = require('fs');
var decmdify = require('..');
var should = require('should');

describe('decmdify', function() {

  it('should return a stream', function() {
    decmdify().should.be.an.instanceOf(require('stream'));
  });
  
  it('define-factory', function(done) {
    compare('define-factory.js', done);
  });

  it('define-object', function(done) {
    compare('define-object.js', done);
  });

  it('define-id-factory', function(done) {
    compare('define-id-factory.js', done);
  });

  it('define-deps-factory', function(done) {
    compare('define-deps-factory.js', done);
  });

  it('define-id-deps-factory', function(done) {
    compare('define-id-deps-factory.js', done);
  });


  it('define-factory-return', function(done) {
    compare('define-factory-return.js', done);
  });

  it('not transform when detect no cmd', function(done) {
    compare('commonjs.js', done);
  });

  it('transform', function(done) {
    decmdify.transform(__dirname + '/fixture/define-factory.js', function (err, result) {
      result.should.be.eql(
        fs.readFileSync(__dirname + '/fixture/define-factory.expect.js').toString()
      );
      done();
    });
  });

  it('transform not found', function(done) {
    decmdify.transform(__dirname + '/fixture/not-found.js', function (err) {
      should.exist(err);
      done();
    });
  });

  function compare (file, cb) {
    var data = '', path = __dirname + '/fixture/' + file;
    fs.createReadStream(path)
      .pipe(decmdify())
      .on('data', function (buf) {
        data += buf;
      })
      .on('end', function() {
        (data).should.be.eql(
          fs.readFileSync(path.replace(/(\.js)$/, '.expect$1')).toString()
        );
        cb();
      });
  }

});
