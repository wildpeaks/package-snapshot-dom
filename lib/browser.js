/* eslint-env browser */
"use strict";
(function() {
	function snapshotToJson(node, skipEmpty) {
		const serialized = {};
		const isValid = typeof node === "object" && node !== null;
		if (isValid) {
			if (node.tagName) {
				serialized.tagName = node.tagName.toLowerCase();
			} else if (node.nodeName) {
				serialized.nodeName = node.nodeName;
			}
			if (node.nodeValue) {
				serialized.nodeValue = node.nodeValue;
			}

			const attrs = node.attributes;
			if (attrs) {
				const l = attrs.length;
				if (l > 0) {
					const aggregated = {};
					for (let i = 0; i < l; i++) {
						const attr = attrs[i];
						const skip = skipEmpty && !attr.nodeValue;
						if (!skip) {
							aggregated[attr.nodeName] = attr.nodeValue;
						}
					}
					serialized.attributes = aggregated;
				}
			}

			const {childNodes} = node;
			if (childNodes) {
				const l = childNodes.length;
				if (l > 0) {
					const aggregated = new Array(l);
					for (let i = 0; i < l; i++) {
						aggregated[i] = snapshotToJson(childNodes[i], skipEmpty);
					}
					serialized.childNodes = aggregated;
				}
			}
		}
		return serialized;
	}
	window.snapshotToJson = snapshotToJson;
})();
