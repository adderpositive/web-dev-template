const { src, dest } = require('gulp');
const imagemin = require('gulp-imagemin');
const imageminJpegRecompress = require('imagemin-jpeg-recompress');
const svgstore = require('gulp-svgstore');

const processImages = (srcTemp, destTemp) => {
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

const processIcons = (srcTemp, destTemp) => {
    return src(`${ srcTemp }/icons/*`)
        .pipe(svgstore())
        .pipe(dest(`${ destTemp }/img`));
};

const processOtherAssets = (srcTemp, destTemp) => {
    return src(`${ srcTemp }/other/**/*`)
        .pipe(dest(`${ destTemp }/other`));
};

exports.processImages = processImages;
exports.processIcons = processIcons;
exports.processOtherAssets = processOtherAssets;
