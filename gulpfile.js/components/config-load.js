const requireConfig = (modulePath) => { // force require
    try {
        return require(modulePath);
    }
    catch (e) {
        return false;
    }
}

exports.requireConfig = requireConfig;
