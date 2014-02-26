var fs = require('fs');
fs.readFile('path/to/file.js', function(err, code) {
  console.log(code);
});
