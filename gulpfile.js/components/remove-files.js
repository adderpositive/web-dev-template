const del = require('del');

const removeFiles = (config) => del([
        `${config.production.dir}/**`,
    ], {
        force: true,
    }).then( paths => {
        console.log('Deleted files and folders:\n', paths.join('\n'));
    });


exports.removeFiles = removeFiles;
