const { series, parallel, src, dest, watch } = require('gulp');
const del = require('del');
const twig = require('gulp-twig');
const sass = require('gulp-sass');
const fs = require('fs');
const rollup = require('gulp-better-rollup');
const babel = require('rollup-plugin-babel');
const resolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const sourcemaps = require('gulp-sourcemaps');
const concat = require('gulp-concat');
const imagemin = require('gulp-imagemin');
const imageminJpegRecompress = require('imagemin-jpeg-recompress');
const svgstore = require('gulp-svgstore');
const eslint = require('gulp-eslint');

sass.compiler = require('node-sass');

const browserSync = require('browser-sync').create();
const prettyHtml = require("gulp-pretty-html");

const dirs = {
    src: './src',
    dest: './dev',
    prod: './prod'
};

function removeFiles() {
    return del(dirs.dest).then( paths => {
        console.log('Deleted files and folders:\n', paths.join('\n'));
    });
}

function templates() {
    let cssFiles = [];
    let jsFiles = [
        'script.js'
    ];

    getFiles(`${ dirs.dest }/css`, cssFiles);

    // get files in file system by destination
    // @return found files
    function getFiles(destination, files) {
        let directoryItems = fs.readdirSync(destination);

        directoryItems.forEach( function(element, index) {
            const path = `${destination}/${element}`;

            if(path && fs.lstatSync(path).isDirectory()) {
                getFiles(path, files);
            }

            if(path && fs.lstatSync(path).isFile()) {
                files.push(path.replace('./dev', '.'));
            }
        });

        return files;
    }

    return src(`${ dirs.src }/*.twig`)
        .pipe( twig({
            data: {
                title: 'Gulp and Twig',
                version: '0.0.1',
                benefits: [
                    'Fast',
                    'Flexible',
                    'Secure'
                ],
                cssFiles,
                jsFiles
            }
        }))
        .pipe(prettyHtml({
            wrap_attributes: 'force-expand-multiline',
            preserve_newlines: false // remove redundant lines
        }) )
        .pipe(dest(dirs.dest));
}

function compileSass() {
    return src(`${ dirs.src }/sass/**/*.scss`)
        .pipe(sass().on('error', sass.logError))
        .pipe(dest(`${ dirs.dest }/css`));
}

function compileScript() {
    return src(`${ dirs.src }/js/**/*.js`)
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(sourcemaps.init())
        .pipe(rollup({ plugins: [babel(), resolve(), commonjs()] }, 'umd'))
        .pipe(concat('script.js'))
        .pipe(sourcemaps.write('.'))
        .pipe(dest(`${ dirs.dest }/js`));
}

function processImages() {
    return src(`${ dirs.src }/img/*`)
        .pipe(imagemin([
            imagemin.gifsicle({
                interlaced: true,
            }),
            imageminJpegRecompress({
                quality: 'high',
                min: 65,
                max: 85,
            }),
            imagemin.optipng({
                optimizationLevel: 2
            }),
            imagemin.svgo({
                plugins: [
                    {
                        removeViewBox: true
                    },
                    {
                        cleanupIDs: false
                    },
                ],
            })
        ]))
        .pipe(dest((`${ dirs.dest }/img`)));
}

function processIcons() {
    return src(`${ dirs.src }/icons/*`)
        .pipe(svgstore())
        .pipe(dest(`${ dirs.dest }/img`));
}

function processOtherAssets() {
    return src(`${ dirs.src }/other/**`)
        .pipe(dest(`${ dirs.dest }/other`));
}

function serve() {
    browserSync.init({
        server: {
            port: 8000,
            baseDir: dirs.dest
        },
        open: false
    });

    watch(`${ dirs.src }/**/*.twig`, templates)
        .on('change', browserSync.reload);

    watch(`${ dirs.src }/sass/**/*.scss`, compileSass)
        .on('change', browserSync.reload)

    watch(`${ dirs.src }/js/**/*.js`, compileScript)
        .on('change', browserSync.reload)
}

exports.default = series(
    removeFiles,
    compileSass,
    compileScript,
    processImages,
    processIcons,
    processOtherAssets,
    templates,
    serve,
);
