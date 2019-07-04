const { series, parallel, src, dest, watch } = require('gulp');
const del = require('del');
const twig = require('gulp-twig');
const sass = require('gulp-sass');
const fs = require('fs');

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
    let jsFiles = [];

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
            // TODO: should be main settings - title, robots, metas, etc.
            data: {
                title: 'Gulp and Twig',
                benefits: [
                    'Fast',
                    'Flexible',
                    'Secure'
                ],
                cssFiles,
                jsFiles
            }
        }))
        // TODO: maybe for production reason
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
}

exports.default = series(removeFiles, compileSass, templates, serve);
