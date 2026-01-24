const { src, dest } = require('gulp');
const replace = require('gulp-replace');

function fixModuleType(cb) {
    // NOTE: Angular 21+ generates ES modules that REQUIRE type="module"
    // The old workaround of converting to type="text/javascript" is no longer needed
    // and actually breaks modern Angular apps in Electron.
    // Keeping this task as a no-op for backwards compatibility with build scripts.
    cb();
}

exports.default = fixModuleType;