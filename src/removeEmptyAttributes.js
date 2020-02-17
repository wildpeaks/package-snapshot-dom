/* eslint-env shared-node-browser */
"use strict";

function removeEmptyAttributes(obj) {
	if (Array.isArray(obj.childNodes)) {
		obj.childNodes = obj.childNodes.map(removeEmptyAttributes);
	}
	if (obj && obj.attributes) {
		const removeKeys = [];
		for (const key in obj.attributes) {
			if (!obj.attributes[key]) {
				removeKeys.push(key);
			}
		}
		removeKeys.forEach(key => delete obj.attributes[key]);
	}
	return obj;
}

module.exports.removeEmptyAttributes = removeEmptyAttributes;
