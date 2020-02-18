/* eslint-env shared-node-browser */
"use strict";

function sortAttributeValue(value) {
	return (typeof value === "string") ? value.trim().replace(/[\s]+/g, " ").split(" ").sort().join(" ") : value;
}

function sortAttributes(obj, attributeIds) {
	if (Array.isArray(attributeIds)) {
		if (Array.isArray(obj.childNodes)) {
			obj.childNodes = obj.childNodes.map(child => sortAttributes(child, attributeIds));
		}
		if (obj && obj.attributes) {
			for (const key in obj.attributes) {
				if (attributeIds.includes(key)) {
					obj.attributes[key] = sortAttributeValue(obj.attributes[key]);
				}
			}
		}
	}
	return obj;
}

module.exports.sortAttributes = sortAttributes;
