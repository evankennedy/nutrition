var async     = require('async');
var fs        = require('fs');
var program   = require('commander');
var fs        = require('fs');
var csv       = require('fast-csv');
var db        = require('./db');

program
	.version('0.0.1')
	.option('-l, --load <file>', 'Load a CSV file')
	.parse(process.argv);

/*

search by ideal

search(ideal)
	db(find({}))

database:
	search for ideal

models:
	get original
	get weighted
	calculate deviation from ideal

*/

function variance(sample, ideal) {
	var n = 0, v = 0;

	for(var prop in ideal) {
		n++;
		v += Math.pow(ideal[prop] - sample[prop], 2);
	}

	return v / n;
}

function closest(ideal, callback) {
	db.find({}, (err, docs) => {
		var lowest;
		var closest;

		docs.forEach(item => {
			var v = variance(item, ideal);
			if(typeof lowest == 'undefined' || v < lowest) {
				lowest = v;
				closest = item;
			}
		});

		callback(null, closest);
	});
}

var current = {};

async.series([
	callback => db.loadDatabase(callback),
	callback => {
		if(!program.load) return callback();

		db.remove({}, { multi: true }, callback);
	},
	callback => {
		if(!program.load) return callback();

		fs.createReadStream(program.load)
			.pipe(csv({ headers: true }))
			.on('end', n => callback())
			.on('data', function(data) {
				var max = 0;
				var cur;

				for(var prop in data) {
					cur = parseFloat(data[prop]);
					if(!isNaN(cur)) {
						data[prop] = cur;
						max = Math.max(max, cur);
					}
				}

				for(var prop in data)
					if(!isNaN(data[prop]))
						data[prop] = data[prop] / max;

				data._max = max;
				db.insert(data, err => err && console.log(err));
			});
	},
	callback => {
		closest({a: 1, b: 1, c: 1}, (err, item) => {
			current[item._id] = 1;
		});
	}
]);





