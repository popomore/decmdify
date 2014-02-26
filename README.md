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

## Thanks

https://github.com/jaredhanson/deamdify

## License

MIT
