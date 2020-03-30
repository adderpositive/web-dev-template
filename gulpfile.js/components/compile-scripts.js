const { src, dest } = require('gulp');
const sourcemaps = require('gulp-sourcemaps');
const concat = require('gulp-concat');
const npmDist = require('gulp-npm-dist');
const rename = require('gulp-rename');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');


const copyScripts = (destTemp) => {
    // Copy dependencies to ./dev/js/
    return src(npmDist({
            copyUnminified: false,
            excludes: ['/**/*.txt']
        }), {base:'./node_modules'})
        .pipe(rename(function(path) {
            path.dirname = path.dirname.replace(/\/dist/, '').replace(/\\dist/, '');
        }))
        .pipe(dest(`${ destTemp }/js`));
};

const compileScripts = (srcTemp, destTemp) => {
    return src(`${ srcTemp }/js/**/*.js`)
        .pipe(babel({
            presets: ['@babel/preset-env']
        }))
        // .pipe(concat('script.js'))
        // .pipe(uglify())
        .pipe(dest(`${ destTemp }/js`));
};

exports.copyScripts = copyScripts;
exports.compileScripts = compileScripts;
