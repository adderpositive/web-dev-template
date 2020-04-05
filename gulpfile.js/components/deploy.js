const { src } = require('gulp');
const gutil = require('gulp-util');
const ftp = require('vinyl-ftp');

const deploy = (config) => {
    const srcTemp = config.dirSource;
    const conn = ftp.create({
        host: config[config.enviroment].host,
        user: config[config.enviroment].user,
        password: config[config.enviroment].password,
        parallel: config[config.enviroment].parallel,
        log: gutil.log
    });

    return src(`${ srcTemp }/**`, { buffer: false } )
        .pipe(conn.newer(config[config.enviroment].hostingDirectory))
        .pipe(conn.dest(config[config.enviroment].hostingDirectory));
};

exports.deploy = deploy;
