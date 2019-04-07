const { series, parallel, src, dest, watch } = require('gulp');
const del = require('del');
const twig = require('gulp-twig');

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
    return src(`${ dirs.src }/*.twig`)
        .pipe( twig({
            // TODO: should be main settings - title, robots, metas, etc.
            data: {
                title: 'Gulp and Twig',
                benefits: [
                    'Fast',
                    'Flexible',
                    'Secure'
                ]
            }
        }))
        // TODO: maybe for production reason
        .pipe(prettyHtml({
            wrap_attributes: 'force-expand-multiline',
            preserve_newlines: false // remove redundant lines
        }) )
        .pipe(dest(dirs.dest));
}

function serve() {
    browserSync.init({
        server: {
            baseDir: dirs.dest
        }
    });

    watch( `${ dirs.src }/**/*.twig`, templates )
        .on( 'change', browserSync.reload );
}

exports.default = series(removeFiles, templates, serve);
