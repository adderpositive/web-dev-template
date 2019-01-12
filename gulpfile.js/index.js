const { series, parallel, src, dest } = require('gulp');
const del = require('del');
const twig = require('gulp-twig');

const dirs = {
    src: './src',
    dest: './dev'
};

function removeFiles() {
    return del( dirs.dest).then( paths => {
        console.log('Deleted files and folders:\n', paths.join('\n'));
    });
}

function templates() {
    return src(`${ dirs.src }/*.twig`)
        .pipe( twig({
            data: {
                title: 'Gulp and Twig',
                benefits: [
                    'Fast',
                    'Flexible',
                    'Secure'
                ]
            }
        }))
        .pipe( dest( dirs.dest ) );
    }

exports.default = series( removeFiles, templates);