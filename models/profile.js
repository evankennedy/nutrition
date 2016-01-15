'use strict';

var utils = require('../utils');

const priv = new WeakMap();

class Profile {
	constructor() {
		priv.set(this, {});
	}

	get quantities() {
		var $priv = priv.get(this);

		if(!$priv.quantities)
			$priv.quantities = [];

		return $priv.quantities;
	}
	get profile() {
		var $priv = priv.get(this);

		if(!$priv.profile)
			$priv.profile = {};

		return $priv.profile;
	}

	get needed() {
		var max = 0;
		var needed = {};

		for(var prop in this.profile)
			if(isFinite(this.profile[prop]))
				max = Math.max(max, this.profile[prop]);

		for(var prop in this.profile)
			if(isFinite(this.profile[prop]))
				needed[prop] = max - this.profile[prop];

		return needed;
	}

	get ideal() {
		return utils.weighted(this.needed);
	}

	add(item, quantity) {
		this.quantities[item._id] = (this.quantities[item._id]||0) + quantity;

		for(var prop in item)
			if(prop[0] != '_' && isFinite(item[prop]))
				this.profile[prop] = (this.profile[prop]||0) + item[prop] * quantity;
	}
}

exports = module.exports = Profile;
