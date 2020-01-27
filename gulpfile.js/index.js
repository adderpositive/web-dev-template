const { series, parallel, src, dest, watch } = require('gulp');
const development = require('./development');
const production = require('./production');

exports.default = development.development;

exports.production = production.production;
exports.productionUpdate = production.productionUpdate;
exports.productionDeploy = production.productionDeploy;
