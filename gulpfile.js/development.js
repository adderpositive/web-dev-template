const { series, parallel, src, dest, watch } = require('gulp');
const del = require('del');
const twig = require('gulp-twig');
const sass = require('gulp-sass');
const fs = require('fs');
const sourcemaps = require('gulp-sourcemaps');
const concat = require('gulp-concat');
const imagemin = require('gulp-imagemin');
const imageminJpegRecompress = require('imagemin-jpeg-recompress');
const svgstore = require('gulp-svgstore');
const npmDist = require('gulp-npm-dist');
const rename = require('gulp-rename');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');

sass.compiler = require('node-sass');

const browserSync = require('browser-sync').create();
const prettyHtml = require("gulp-pretty-html");

const dirs = {
    src: './src',
    dest: './dev',
    prod: './prod'
};

const removeFiles = () => {
    return del(dirs.dest).then( paths => {
        console.log('Deleted files and folders:\n', paths.join('\n'));
    });
};

const templates = () => {
    let cssFiles = [];
    let jsFiles = [
        'script.js'
    ];

    // get files in file system by destination
    // @return found files
    const getFiles = (destination, files) => {
        let directoryItems = fs.readdirSync(destination);

        directoryItems.forEach( function(element, index) {
            const path = `${destination}/${element}`;

            if(path && fs.lstatSync(path).isDirectory()) {
                getFiles(path, files);
            }

            if(path && fs.lstatSync(path).isFile()) {
                files.push(path.replace('./dev', ''));
            }
        });

        return files;
    };

    getFiles(`${ dirs.dest }/css`, cssFiles);

    return src(`${ dirs.src }/*.twig`)
        .pipe( twig({
            data: {
                title: 'Default template',
                version: '0.0.1',
                path: '.',
                cssFiles,
                jsFiles
            }
        }))
        .pipe(prettyHtml({
            // wrap_attributes: 'force-expand-multiline',
            preserve_newlines: false // remove redundant lines
        }) )
        .pipe(dest(dirs.dest));
};

const compileSass = () => {
    return src(`${ dirs.src }/sass/**/*.scss`)
        .pipe(sass().on('error', sass.logError))
        .pipe(dest(`${ dirs.dest }/css`));
};


const processImages = () => {
    return src(`${ dirs.src }/img/**/*`)
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
};

const processIcons = () => {
    return src(`${ dirs.src }/icons/*`)
        .pipe(svgstore())
        .pipe(dest(`${ dirs.dest }/img`));
};

const processOtherAssets = () => {
    return src(`${ dirs.src }/other/**/*`)
        .pipe(dest(`${ dirs.dest }/other`));
};

const copyScripts = () => {
    // Copy dependencies to ./dev/js/
    return src(npmDist({
            copyUnminified: false,
            excludes: ['/**/*.txt']
        }), {base:'./node_modules'})
        .pipe(rename(function(path) {
            path.dirname = path.dirname.replace(/\/dist/, '').replace(/\\dist/, '');
        }))
        .pipe(dest(`${ dirs.dest }/js`));
};

const compileScripts = () => {
    return src(`${ dirs.src }/js/**/*.js`)
        .pipe(babel({
            presets: ['@babel/preset-env']
        }))
        // .pipe(concat('script.js'))
        // .pipe(uglify())
        .pipe(dest(`${ dirs.dest }/js`));
};

const serve = () => {
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

    watch(`${ dirs.src }/js/**/*.js`, compileScripts)
        .on('change', browserSync.reload)

    watch(`${ dirs.src }/img/**/*`, processImages)
        .on('change', browserSync.reload)

    watch(`${ dirs.src }/icons/*.svg`, processIcons)
        .on('change', browserSync.reload)

    watch(`${ dirs.src }/other/**/*`, processOtherAssets)
        .on('change', browserSync.reload)
};

exports.development = series(
    removeFiles,
    compileSass,
    copyScripts,
    compileScripts,
    processImages,
    processIcons,
    processOtherAssets,
    templates,
    serve,
);
