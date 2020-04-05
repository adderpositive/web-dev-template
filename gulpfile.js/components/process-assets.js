const { src, dest } = require('gulp');
const imagemin = require('gulp-imagemin');
const imageminJpegRecompress = require('imagemin-jpeg-recompress');
const svgstore = require('gulp-svgstore');
const newer = require('gulp-newer');

const processImages = (config) => {
    const srcTemp = config.dirSource;
    const destTemp = config[config.enviroment].dir;

    return src(`${ srcTemp }/img/**/*`)
        .pipe(imagemin([
            imagemin.gifsicle({
                interlaced: true,
            }),
            imageminJpegRecompress({
                quality: 'high',
                min: 65,
                max: 85,
            }),
            imagemin.optipng({
                optimizationLevel: 2
            }),
            imagemin.svgo({
                plugins: [
                    {
                        removeViewBox: true
                    },
                    {
                        cleanupIDs: false
                    },
                ],
            })
        ]))
        .pipe(dest((`${ destTemp }/img`)));
};

const processNewImages = (config) => {
    const srcTemp = config.dirSource;
    const destTemp = config[config.enviroment].dir;

    return src(`${ srcTemp }/img/**/*`)
      .pipe(newer(`${ destTemp }/img`))
      .pipe(imagemin())
      .pipe(dest((`${ destTemp }/img`)));
};


const processIcons = (config) => {
    const srcTemp = config.dirSource;
    const destTemp = config[config.enviroment].dir;

    return src(`${ srcTemp }/icons/*`)
        .pipe(svgstore())
        .pipe(dest(`${ destTemp }/img`));
};

const processOtherAssets = (config) => {
    const srcTemp = config.dirSource;
    const destTemp = config[config.enviroment].dir;

    return src(`${ srcTemp }/other/**/*`)
        .pipe(dest(`${ destTemp }/other`));
};

exports.processImages = processImages;
exports.processNewImages = processNewImages;
exports.processIcons = processIcons;
exports.processOtherAssets = processOtherAssets;
