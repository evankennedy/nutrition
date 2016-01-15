var Datastore = require('nedb');
exports = module.exports = new Datastore({
	filename: '.db',
	autoload: true
});
