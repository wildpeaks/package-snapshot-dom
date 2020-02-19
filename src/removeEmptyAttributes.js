/* eslint-env shared-node-browser */
"use strict";

function removeEmptyAttributes(tree) {
	if (typeof tree === "object" && tree !== null) {
		if (Array.isArray(tree.childNodes)) {
			tree.childNodes.forEach(removeEmptyAttributes);
		}
		if (tree.attributes) {
			const removeKeys = [];
			for (const key in tree.attributes) {
				if (!tree.attributes[key]) {
					removeKeys.push(key);
				}
			}
			removeKeys.forEach(key => delete tree.attributes[key]);
		}
	}
}

module.exports.removeEmptyAttributes = removeEmptyAttributes;
