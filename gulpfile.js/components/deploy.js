const { src } = require('gulp');
const gutil = require('gulp-util');
const ftp = require('vinyl-ftp');

const deploy = (srcTemp, config) => {
    const conn = ftp.create({
        host: config.host,
        user: config.user,
        password: config.password,
        parallel: config.parallel,
        log: gutil.log
    });

    return src(`${ srcTemp }/**`, { buffer: false } )
        .pipe(conn.newer(config.hostingDirectory))
        .pipe(conn.dest(config.hostingDirectory));
};

exports.deploy = deploy;
