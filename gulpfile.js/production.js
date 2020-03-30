const { series, parallel } = require('gulp');

// components
const cDelFiles = require('./components/remove-files');
const cTemplates = require('./components/compile-templates');
const cSass = require('./components/compile-sass');
const cAssets = require('./components/process-assets');
const cScripts = require('./components/compile-scripts');
const cDeploy = require('./components/deploy');

// config
const dirs = {
    src: './src',
    dest: './dev',
    prod: './prod'
};

const config = {
    hosting: {
        host: '',
        user: '',
        password: '',
        parallel: 3,
        hostingDirectory: '/',
    },
};

// functions
const removeFiles = () => cDelFiles.removeFiles(dirs.prod);
const createTemplates = () => cTemplates.createTemplates(dirs.src, dirs.prod);
const compileSass = () => cSass.compileSass(dirs.src, dirs.prod, 'production');
const processImages = () => cAssets.processImages(dirs.src, dirs.prod);
const processIcons = () => cAssets.processIcons(dirs.src, dirs.prod);
const processOtherAssets = () => cAssets.processOtherAssets(dirs.src, dirs.prod);
const copyScripts = () => cScripts.copyScripts(dirs.prod);
const compileScripts = () => cScripts.compileScripts(dirs.src, dirs.prod);
const deploy = () => cDeploy.deploy(dirs.prod, config.hosting);

exports.production = series(
    removeFiles,
    compileSass,
    copyScripts,
    compileScripts,
    processImages,
    processIcons,
    processOtherAssets,
    createTemplates,
);

exports.productionUpdate = series(
    compileSass,
    copyScripts,
    compileScripts,
);

exports.productionDeploy = series(
    removeFiles,
    compileSass,
    copyScripts,
    compileScripts,
    processImages,
    processIcons,
    processOtherAssets,
    createTemplates,
    deploy,
);
