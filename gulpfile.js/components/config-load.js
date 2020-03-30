const requireConfig = (modulePath) => { // force require
    try {
        return require(modulePath);
    }
    catch (e) {
        console.log('-------');
        console.log("config.json - file doesn't exist or file contains typos. More:");
        console.log(e.message);
        console.log('-------');
        return false;
    }
}

exports.requireConfig = requireConfig;
