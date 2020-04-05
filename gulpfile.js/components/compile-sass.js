const { src, dest } = require('gulp');
const sass = require('gulp-sass');
const cleanCSS = require('gulp-clean-css');
var gulpif = require('gulp-if');

sass.compiler = require('node-sass');

const compileSass = (config) => {
    const srcTemp = config.dirSource;
    const destTemp = config[config.enviroment].dir;
    return src(`${ srcTemp }/sass/**/*.scss`)
        .pipe(sass().on('error', sass.logError))
        .pipe(
            gulpif(config.enviroment !== 'production',
                cleanCSS({
                    compatibility: 'ie11',
                    debug: true,
                }, (details) => {
                    console.log(`${details.name}: ${details.stats.originalSize}`);
                    console.log(`${details.name}: ${details.stats.minifiedSize}`);
                })
            )
        ).pipe(dest(`${ destTemp }/css`));
};

exports.compileSass = compileSass;
