var db    = require('./db');

module.exports.weighted = item => {
	var weighted = {};
	var max = 0;
	var cur;

	for(var prop in item)
		if(isFinite(item[prop]))
			max = Math.max(max, item[prop]);
		else
			weighted[prop] = item[prop];

	for(var prop in item)
		if(isFinite(item[prop]))
			weighted[prop] = item[prop] / max;

	weighted._max = max;

	return weighted;
};

module.exports.variance = (sample, ideal) => {
	var n = 0, v = 0;

	for(var prop in ideal) {
		n++;
		v += Math.pow(ideal[prop] - sample[prop], 2);
	}

	return v / n;
};

module.exports.closest = (ideal, callback) => {
	db.find({}, (err, docs) => {
		var lowVar;
		var closest;

		docs.forEach(item => {
			var variance = module.exports.variance(item, ideal);

			if(typeof lowVar == 'undefined' || variance < lowVar) {
				lowVar = variance;
				closest = item;
			}
		});

		callback(null, closest);
	});
};
