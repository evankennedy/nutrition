var csv   = require('fast-csv');
var fs    = require('fs');
var db    = require('./db');
var utils = require('./utils');

module.exports = (file, callback) => {
	if(!file)
		return callback();

	if(!fs.existsSync(file))
		return callback('FileNotFound')

	db.remove({}, { multi: true }, err => {
		if(err)
			console.error(err);

		fs.createReadStream(file)
			.pipe(csv({
				headers: true,
				ignoreEmpty: true,
				discardUnmappedColumns: false
			}))
			.on('end', n => callback())
			.on('data', function(data) {
				for(var prop in data)
					if(isFinite(data[prop]))
						data[prop] = parseFloat(data[prop]);

				db.insert(utils.weighted(data), err => err && console.log(err));
			});
	});
};
