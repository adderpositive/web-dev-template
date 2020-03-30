const { series, parallel } = require('gulp');
const path = require('path');

// components
const cRequireConfig = require('./components/config-load');
const cDelFiles = require('./components/remove-files');
const cTemplates = require('./components/compile-templates');
const cSass = require('./components/compile-sass');
const cAssets = require('./components/process-assets');
const cScripts = require('./components/compile-scripts');
const cServer = require('./components/server');

// config
const config = cRequireConfig.requireConfig(`${__dirname.replace('gulpfile.js', '')}config.json`);
const enviroment = 'development';

if (!config) {
    return;
}

// functions
const removeFiles = () => cDelFiles.removeFiles(config.development.dir);
const createTemplates = () => cTemplates.createTemplates(config.dirSource, config.development.dir, config, enviroment);
const compileSass = () => cSass.compileSass(config.dirSource, config.development.dir, enviroment);
const processImages = () => cAssets.processImages(config.dirSource, config.development.dir);
const processNewImages = () => cAssets.processNewImages(config.dirSource, config.development.dir);
const processIcons = () => cAssets.processIcons(config.dirSource, config.development.dir);
const processOtherAssets = () => cAssets.processOtherAssets(config.dirSource, config.development.dir);
const copyScripts = () => cScripts.copyScripts(config.development.dir);
const compileScripts = () => cScripts.compileScripts(config.dirSource, config.development.dir);
const createServer = () => cServer.createServer(
    config.dirSource,
    config.development.dir,
    createTemplates,
    compileSass,
    compileScripts,
    processNewImages,
    processIcons,
    processOtherAssets,
);

// exports
exports.development = series(
    removeFiles,
    parallel(
        compileSass,
        copyScripts,
        compileScripts,
        processImages,
        processIcons,
        processOtherAssets,
    ),
    createTemplates,
    createServer,
);
