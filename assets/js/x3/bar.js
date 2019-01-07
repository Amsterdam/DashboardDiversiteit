/*
 *  Copyright (C) 2016 X Gemeente
 *                     X Amsterdam
 *                     X Onderzoek, Informatie en Statistiek
 *
 *  This Source Code Form is subject to the terms of the Mozilla Public
 *  License, v. 2.0. If a copy of the MPL was not distributed with this
 *  file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

x3.bar=function() {
	var self = this;
	this.parent = undefined;
	this.transition = false;
	this.group = undefined;
	this.entergroup = undefined;
	this.exitgroup = undefined;
	this.container = undefined;
	this.firstrun = false;

	this.id = this.uniqID();

	/*
	 * Call these functions when one of
	 * the corresponding setters is used.
	 */
	this.trigger("data", this._setData);

	/*
	 * Set default values
	 */
	this.set("width", 0);
	this.set("end", 0);
	this.set("start", 0);
	this.set("left", 0);
	this.set("class", '');
}

x3.bar = x3.bar.extendsFrom(Function.extensions);

x3.bar.prototype.create=function() {
	var self = this;
	
	this.group = this.get("parent").get("svg").selectAll('#'+this.id)
		.data([null]).enter()
			.append('g')
				.attr('id', this.id)
				.attr('class', this.get("class"));
	
	this.firstrun = true;
}

x3.bar.prototype._setData=function(data) {
	var self = this;
	this.data = data;

	this.container = d3.select('#'+this.id).selectAll('.datagroup')
		.data(this.data);

	this.exitgroup = this.container.exit()
	this.entergroup = this.container.enter()
		.append('g')
			.attr("class", function(d, i) {
				return "datagroup"
			})
	var tmp = this.entergroup.append('rect')
	this._transition(tmp, 0);
}

x3.bar.prototype.redraw=function() {
	this.transition = true;
	this.draw();
	this.transition = false;
}

x3.bar.prototype._transition=function(tmp, stage) {
	var self = this;
	if(this.get("parent").get("transitionSpeed") > 0 && this.transition == true) {
		tmp = tmp.transition().duration(this.get("parent").get("transitionSpeed"))
	}

	tmp
		.attr("width", function(d, i) {
			if('x' in d) {
				var w = self.get("width", d, i, stage);
				if(w === false) {
					return d3.select(this).attr("width");
				} else {
					return w;
				}
			} else {
				return d3.select(this).attr("width");
			}
		})
		.attr("fill", function(d, i) {
			if('color' in d) {
				return d['color'];
			} else {
				return d3.select(this).attr("fill");
			}
		})
		.attr("x", function(d, i) {
			if('x' in d) {
				var x = self.get('left', d, i, stage);
				if(x === false) {
					return d3.select(this).attr("x");
				} else {
					return x;
				}
			} else {
				return d3.select(this).attr("x");
			}
		})
		.attr("height", function(d, i) {
			if('y' in d) {
				var y = Math.abs(self.get('end', d, i, stage));
				if(y === false) {
					return d3.select(this).attr("height");
				} else {
					return y;
				}
			} else {
				return d3.select(this).attr("height");
			}
		})
		.attr("y", function(d, i) {
			if('y' in d) {
				var height = self.get('end', d, i, stage);
				var start = self.get('start', d, i, stage);
				if(height === false || start === false) {
					return d3.select(this).attr("y");
				} else {
					if(height > 0) {
						return start-height;
					} else {
						return start;
					}
				}
			} else {
				return d3.select(this).attr("y");
			}
		})
}

x3.bar.prototype.draw=function() {
	var self = this;

	if(this.container !== undefined) {
		var tmp = this.exitgroup;
		var rect = tmp.select("rect");
		if(this.get("parent").get("transitionSpeed") > 0 && this.transition == true) {
			tmp = tmp.transition().duration(this.get("parent").get("transitionSpeed"))
		}
		this._transition(rect, 2); // exit
		tmp.remove();
	}

	this.firstrun = false;

	if(this.container == undefined) {
		return;
	}

	var rect = this.container.select('rect')
	this._transition(rect, 1); // update
}