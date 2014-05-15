# decmdify

>  Transform [CMD module](https://github.com/seajs/seajs/issues/242) to CommonJS, inspired of [deamdify](https://github.com/jaredhanson/deamdify)

[![Build Status](https://travis-ci.org/popomore/decmdify.png?branch=master)](https://travis-ci.org/popomore/decmdify)
[![Coverage Status](https://coveralls.io/repos/popomore/decmdify/badge.png?branch=master)](https://coveralls.io/r/popomore/decmdify?branch=master)

---

## Install

```
$ npm install decmdify -g
```

## Usage

Normal use

```
var decmdify = require('decmdify');
decmdify.transform('path/to/file.js', function (err, code) {
  console.log(code)
});
```

Use it as stream

```
var fs = require('fs');
var decmdify = require('decmdify');

fs.createReadStream(source)
  .pipe(decmdify())
  .pipe(fs.createWriteStream(dest));
```

use in gulp

```
gulp.src('*.js')
  .pipe(decmdify({gulp: true}))
  .pipe(gulp.dest(dest));
```

## Thanks

https://github.com/jaredhanson/deamdify

## History

### 0.3.2

fix later semicolon

### 0.3.1

- throw error when pass through obj and not specify gulp
- fix return statemen

### 0.3.0

use falafel support comment

### 0.2.0

- use stream2 api
- support gulp

### 0.1.0

first version

## License

MIT
