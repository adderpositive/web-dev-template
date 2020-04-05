const { src, dest } = require('gulp');
const sourcemaps = require('gulp-sourcemaps');
const concat = require('gulp-concat');
const npmDist = require('gulp-npm-dist');
const rename = require('gulp-rename');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const standard = require('gulp-standard')


const copyScripts = (config) => {
    const destTemp = config[config.enviroment].dir;

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

const compileScripts = (config) => {
    const srcTemp = config.dirSource;
    const destTemp = config[config.enviroment].dir;

    return src([`${ srcTemp }/js/**/*.js`, `!${ srcTemp }/js/**/_*.js`])
        .pipe(standard())
        .pipe(standard.reporter('default'), {
            breakOnError: true,
            quite: true,
        })
        .pipe(babel({
            presets: ['@babel/preset-env']
        }))
        // .pipe(concat('script.js'))
        // .pipe(uglify())
        .pipe(dest(`${ destTemp }/js`));
};

exports.copyScripts = copyScripts;
exports.compileScripts = compileScripts;
