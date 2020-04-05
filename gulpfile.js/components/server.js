const { src, dest, watch } = require('gulp');
const browserSync = require('browser-sync').create();

const createServer = (
    config,
    createTemplates,
    compileSass,
    compileScripts,
    processImages,
    processIcons,
    processOtherAssets
) => {
    const srcTemp = config.dirSource;
    const destTemp = config[config.enviroment].dir;

    browserSync.init({
        server: {
            baseDir: destTemp,
        },
        https: true,
        port: 8000,
        open: true,
    });

    watch(`${ srcTemp }/**/*.twig`, createTemplates)
        .on('change', browserSync.reload);

    watch(`${ srcTemp }/sass/**/*.scss`, compileSass)
        .on('change', browserSync.reload)

    watch(`${ srcTemp }/js/**/*.js`, compileScripts)
        .on('change', browserSync.reload)

    watch(`${ srcTemp }/img/**/*`, processImages)
        .on('change', browserSync.reload)

    watch(`${ srcTemp }/icons/*.svg`, processIcons)
        .on('change', browserSync.reload)

    watch(`${ srcTemp }/other/**/*`, processOtherAssets)
        .on('change', browserSync.reload)
};

exports.createServer = createServer;
