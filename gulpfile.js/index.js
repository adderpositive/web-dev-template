const { series, parallel } = require('gulp');
const argv = require('minimist')(process.argv.slice(2));

// components
const cRequireConfig = require('./components/config-load');
const cDelFiles = require('./components/remove-files');
const cTemplates = require('./components/compile-templates');
const cSass = require('./components/compile-sass');
const cAssets = require('./components/process-assets');
const cScripts = require('./components/compile-scripts');
const cDeploy = require('./components/deploy');
const cServer = require('./components/server');

// config
const config = cRequireConfig.requireConfig(`${__dirname.replace('gulpfile.js', '')}config.json`);
config.enviroment = argv.env || 'development';

// if config doesn't exist - throw error
if (!config) {
    throw "config.json - file doesn't exist or file contains typos. Create or repaire the issue.";
}

// functions
const removeFiles = () => cDelFiles.removeFiles(config);
const createTemplates = () => cTemplates.createTemplates(config);
const compileSass = () => cSass.compileSass(config);
const processImages = () => cAssets.processImages(config);
const processNewImages = () => cAssets.processNewImages(config);
const processIcons = () => cAssets.processIcons(config);
const processOtherAssets = () => cAssets.processOtherAssets(config);
const copyScripts = () => cScripts.copyScripts(config);
const compileScripts = () => cScripts.compileScripts(config);
const deploy = () => cDeploy.deploy(config);
const createServer = () => cServer.createServer(
    config,
    createTemplates,
    compileSass,
    compileScripts,
    processNewImages,
    processIcons,
    processOtherAssets,
);

exports.default = series(
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
    deploy,
);

exports.productionUpdate = parallel(
    compileSass,
    copyScripts,
    compileScripts,
    deploy,
);

exports.productionExport = series(
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
