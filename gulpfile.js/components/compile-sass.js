const { src, dest } = require('gulp');
const sass = require('gulp-sass');

sass.compiler = require('node-sass');

const compileSass = (srcTemp, destTemp) => {
    return src(`${ srcTemp }/sass/**/*.scss`)
        .pipe(sass().on('error', sass.logError))
        .pipe(dest(`${ destTemp }/css`));
};

exports.compileSass = compileSass;
