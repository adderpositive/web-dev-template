const { src } = require('gulp');
const gutil = require('gulp-util');
const ftp = require('vinyl-ftp');

const deploy = (config) => {
    const data = config[config.enviroment];
    const {
        host,
        user,
        password,
        parallel,
        hostingDirectory
    } = data.hosting
    const dir = data.dir;

    const conn = ftp.create({
        host: host,
        user: user,
        password: password,
        parallel: parallel,
        log: gutil.log
    });

    console.log(conn, `${ dir }/**`)

    return src(`${ dir }/**`, { buffer: false } )
        .pipe(conn.newer(hostingDirectory))
        .pipe(conn.dest(hostingDirectory));
};

exports.deploy = deploy;
