var program = require('commander');
var async   = require('async');
var db      = require('./db');
var utils   = require('./utils');
var profile = require('./models/profile');

program
	.version('0.0.1')
	.option('-l, --load <file>', 'Load a CSV file')
	.parse(process.argv);

var current = new profile();

async.series([
	callback => db.loadDatabase(callback),
	callback => require('./loadCsv')(program.load, callback),
	callback => {
		async.waterfall([
			callback => utils.closest({a: 1, b: 1, c: 1}, callback),
			(item, callback) => {
				current.add(item, 1);
				utils.closest(current.ideal, callback);
			},
			(item, callback) => {
				current.add(item, current.ideal._max);
				utils.closest(current.ideal, callback);
			},
			(item, callback) => {
				current.add(item, current.ideal._max);
				utils.closest(current.ideal, callback);
			},
			(item, callback) => {
				current.add(item, current.ideal._max);
				utils.closest(current.ideal, callback);
			},
			(item, callback) => {
				current.add(item, current.ideal._max);
				utils.closest(current.ideal, callback);
			},
			(item, callback) => {
				current.add(item, current.ideal._max);
				utils.closest(current.ideal, callback);
			},
			(item, callback) => {
				current.add(item, current.ideal._max);
				utils.closest(current.ideal, callback);
			},
			(item, callback) => {
				current.add(item, current.ideal._max);
				utils.closest(current.ideal, callback);
			}
		], err => {
			console.log(current.quantities);
			console.log(utils.weighted(current.profile));
		});
	}
]);





