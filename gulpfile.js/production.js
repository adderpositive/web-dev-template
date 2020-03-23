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
const cleanCSS = require('gulp-clean-css');
const minify = require('gulp-minify');
const gutil = require( 'gulp-util' );
const ftp = require( 'vinyl-ftp' );

sass.compiler = require('node-sass');

const prettyHtml = require("gulp-pretty-html");

const dirs = {
    src: './src',
    dest: './dev',
    prod: './prod'
};

const removeFiles = () => {
    return del([
            `${dirs.prod}/**`,
            `!${dirs.prod}/demo`,
        ], {
            force: true,
        }).then( paths => {
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
                files.push(path.replace('./prod', ''));
            }
        });

        return files;
    };

    getFiles(`${ dirs.prod }/css`, cssFiles);

    return src(`${ dirs.src }/*.twig`)
        .pipe( twig({
            data: {
                title: 'Default template',
                description: '',
                version: '0.0.1',
                robots: 'noindex, nofollow',
                currentPath: 'https://example.com',
                twitter: '@example',
                imageHP: 'https://example.com/img/hp.jpg',
                email: 'info@example.com',
                path: '.',
                cssFiles,
                jsFiles
            }
        }))
        .pipe(prettyHtml({
            // wrap_attributes: 'force-expand-multiline',
            preserve_newlines: false // remove redundant lines
        }) )
        .pipe(dest(dirs.prod));
};

const compileSass = () => {
    return src(`${ dirs.src }/sass/**/*.scss`)
        .pipe(sass().on('error', sass.logError))
        .pipe(cleanCSS({
            compatibility: 'ie11',
            debug: true,
        }, (details) => {
            console.log(`${details.name}: ${details.stats.originalSize}`);
            console.log(`${details.name}: ${details.stats.minifiedSize}`);
        }))
        .pipe(dest(`${ dirs.prod }/css`));
};

const compileScript = () => {
    return src(`${ dirs.src }/js/**/*.js`)
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(sourcemaps.init())
        .pipe(rollup({ plugins: [babel(), resolve(), commonjs()] }, 'umd'))
        .pipe(concat('script.js'))
        .pipe(minify())
        .pipe(sourcemaps.write('.'))
        .pipe(dest(`${ dirs.prod }/js`));
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
        .pipe(dest((`${ dirs.prod }/img`)));
};

const processIcons = () => {
    return src(`${ dirs.src }/icons/*`)
        .pipe(svgstore())
        .pipe(dest(`${ dirs.prod }/img`));
};

const processOtherAssets = () => {
    return src(`${ dirs.src }/other/**/*`)
        .pipe(dest(`${ dirs.prod }/other`));
};

const deploy = () => {
    const conn = ftp.create({
        host:       '',
        user:       '',
        password:   '',
        parallel:   10,
        log:        gutil.log
    });

    // ADD remove all files
    // using base = '.' will transfer everything to /public_html correctly
    // turn off buffering in gulp.src for best performance
    return src(`${ dirs.prod }/**`, { buffer: false } )
        .pipe(conn.newer('/')) // only upload newer files
        .pipe(conn.dest('/'));

};

exports.production = series(
    removeFiles,
    compileSass,
    compileScript,
    processImages,
    processIcons,
    processOtherAssets,
    templates,
);

exports.productionUpdate = series(
    compileSass,
    compileScript,
);

exports.productionDeploy = series(
    removeFiles,
    compileSass,
    compileScript,
    processImages,
    processIcons,
    processOtherAssets,
    templates,
    deploy,
);
