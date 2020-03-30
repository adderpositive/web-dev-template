const { series, parallel } = require('gulp');

// components
const cRequireConfig = require('./components/config-load');
const cDelFiles = require('./components/remove-files');
const cTemplates = require('./components/compile-templates');
const cSass = require('./components/compile-sass');
const cAssets = require('./components/process-assets');
const cScripts = require('./components/compile-scripts');
const cDeploy = require('./components/deploy');

// config
const config = cRequireConfig.requireConfig(`${__dirname.replace('gulpfile.js', '')}config.json`);
const enviroment = 'production';

if (!config) {
    return;
}

// functions
const removeFiles = () => cDelFiles.removeFiles(config.production.dir);
const createTemplates = () => cTemplates.createTemplates(config.dirSource, config.production.dir, config, enviroment);
const compileSass = () => cSass.compileSass(config.dirSource, config.production.dir, enviroment);
const processImages = () => cAssets.processImages(config.dirSource, config.production.dir);
const processIcons = () => cAssets.processIcons(config.dirSource, config.production.dir);
const processOtherAssets = () => cAssets.processOtherAssets(config.dirSource, config.production.dir);
const copyScripts = () => cScripts.copyScripts(config.production.dir);
const compileScripts = () => cScripts.compileScripts(config.dirSource, config.production.dir);
const deploy = () => cDeploy.deploy(config.production.dir, config.production.hosting);

exports.production = series(
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
);

exports.productionUpdate = parallel(
    compileSass,
    copyScripts,
    compileScripts,
);

exports.productionDeploy = series(
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
    deploy,
);

