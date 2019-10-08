const { src, dest } = require('gulp');
var replace = require('gulp-replace')

exports.default = function (cb) {  
    //This task is necessary becasue Angular 8 doesn't include the MIME type for <script src"", required when file is not served by a web server,
    //Read this: https://github.com/angular/angular/issues/30835  
    src(['UI/index.html'])
        .pipe(replace('type="module"', 'type="text/javascript"'))
        .pipe(dest('UI/'));
    cb();
};