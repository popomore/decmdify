# decmdify

>  Transform [CMD module](https://github.com/seajs/seajs/issues/242) to CommonJS, inspired of [deamdify](https://github.com/jaredhanson/deamdify)

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
