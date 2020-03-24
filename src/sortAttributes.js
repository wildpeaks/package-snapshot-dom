/* eslint-env shared-node-browser */
"use strict";

function sortAttributeValue(value) {
	return typeof value === "string" ? value.trim().replace(/[\s]+/g, " ").split(" ").sort().join(" ") : value;
}

function sortAttributes(tree, attributeIds) {
	if (typeof tree === "object" && tree !== null && Array.isArray(attributeIds)) {
		if (Array.isArray(tree.childNodes)) {
			tree.childNodes.forEach((child) => sortAttributes(child, attributeIds));
		}
		if (tree && tree.attributes) {
			for (const key in tree.attributes) {
				if (attributeIds.includes(key)) {
					tree.attributes[key] = sortAttributeValue(tree.attributes[key]);
				}
			}
		}
	}
}

module.exports.sortAttributes = sortAttributes;
