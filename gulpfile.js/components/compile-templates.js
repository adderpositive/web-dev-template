const { src, dest } = require('gulp');
const fs = require('fs');
const twig = require('gulp-twig');
const prettyHtml = require("gulp-pretty-html");

const createTemplates = (srcTemp, destTemp) => {
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

    getFiles(`${ destTemp }/css`, cssFiles);

    return src(`${ srcTemp }/*.twig`)
        .pipe( twig({
            data: {
                title: '',
                description: ' ',
                version: '',
                robots: '',
                currentPath: '',
                twitter: '',
                ogImage: '',
                email: '',
                path: '.',
                cssFiles,
                jsFiles
            }
        }))
        .pipe(prettyHtml({
            // wrap_attributes: 'force-expand-multiline',
            preserve_newlines: false // remove redundant lines
        }) )
        .pipe(dest(destTemp));
};


exports.createTemplates = createTemplates;
