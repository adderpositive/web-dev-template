const { series, parallel } = require('gulp');

// components
const cDelFiles = require('./components/remove-files');
const cTemplates = require('./components/compile-templates');
const cSass = require('./components/compile-sass');
const cAssets = require('./components/process-assets');
const cScripts = require('./components/compile-scripts');
const cServer = require('./components/server');

// config
const dirs = {
    src: './src',
    dest: './dev',
    prod: './prod'
};

// functions
const removeFiles = () => cDelFiles.removeFiles(dirs.dest);
const createTemplates = () => cTemplates.createTemplates(dirs.src, dirs.dest);
const compileSass = () => cSass.compileSass(dirs.src, dirs.dest);
const processImages = () => cAssets.processImages(dirs.src, dirs.dest);
const processIcons = () => cAssets.processIcons(dirs.src, dirs.dest);
const processOtherAssets = () => cAssets.processOtherAssets(dirs.src, dirs.dest);
const copyScripts = () => cScripts.copyScripts(dirs.dest);
const compileScripts = () => cScripts.compileScripts(dirs.src, dirs.dest);
const createServer = () => cServer.createServer(
    dirs.src,
    dirs.dest,
    createTemplates,
    compileSass,
    compileScripts,
    processImages,
    processIcons,
    processOtherAssets,
);

// exports
exports.development = series(
    removeFiles,
    compileSass,
    copyScripts,
    compileScripts,
    processImages,
    processIcons,
    processOtherAssets,
    createTemplates,
    createServer,
);
