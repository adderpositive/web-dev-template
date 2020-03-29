const del = require('del');

const removeFiles = (dir) => del([
        `${dir}/**`,
    ], {
        force: true,
    }).then( paths => {
        console.log('Deleted files and folders:\n', paths.join('\n'));
    });


exports.removeFiles = removeFiles;
