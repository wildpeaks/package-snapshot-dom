'use strict';

function snapshot(element){
	let serialized = {};
	const isHTMLElement = (element !== null) && (typeof element === 'object') && (typeof element.tagName === 'string');
	if (isHTMLElement){
		//
		// TODO text fragments
		//
		serialized = {
			tagName: element.tagName.toLowerCase()
		};
		if (element.className !== ''){
			serialized.className = element.className;
		}
		if (element.hasChildNodes()){
			const children = [];
			const srcChildren = element.children;
			const l = srcChildren.length;
			for (let i = 0; i < l; i++){
				children[i] = snapshot(srcChildren[i]);
			}
			serialized.children = children;
		}
	}
	return serialized;
};

module.exports = snapshot;
