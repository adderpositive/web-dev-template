const { src, dest } = require('gulp');
const fs = require('fs');
const twig = require('gulp-twig');
const prettyHtml = require("gulp-pretty-html");

const createTemplates = (config) => {
    const srcTemp = config.dirSource;
    const destTemp = config[config.enviroment].dir;
    const cssFiles = [];
    const jsFiles = [
        'script.js'
    ];

    // get files in file system by destination
    // @return found files
    const getFiles = (destination, files) => {
        const directoryItems = fs.readdirSync(destination);

        directoryItems.forEach( function(element, index) {
            const path = `${destination}/${element}`;

            if(path && fs.lstatSync(path).isDirectory()) {
                getFiles(path, files);
            }

            if(path && fs.lstatSync(path).isFile()) {
                files.push(path.replace(destTemp, ''));
            }
        });

        return files;
    };

    getFiles(`${ destTemp }/css`, cssFiles);

    console.log(config[config.enviroment]);

    return src(`${ srcTemp }/*.twig`)
        .pipe( twig({
            data: {
                title: config.title,
                description: config.description,
                version: config.version,
                robots: config.enviroment === 'production' ? 'index, follow' : 'noindex, nofollow',
                currentPath: config.currentPath,
                twitter: config.twitter,
                ogImage: config.ogImage,
                email: config.email,
                logoWithPath: config.logoWithPath,
                path: config.pathToAssets,
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
