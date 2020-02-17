/* eslint-env node */
/* eslint-disable no-empty */
"use strict";
const {mkdirSync, readFileSync, writeFileSync} = require("fs");
const {join, relative} = require("path");
const {minify} = require("terser");
const {rmdirSync} = require("rimraf");
const baseFolder = join(__dirname, "../packages/snapshot-dom");

function writeMinified(code, filepath) {
	const minified = minify(code);
	writeFileSync(filepath, minified.code, "utf8");
	console.log("OK", relative(baseFolder, filepath));
}

function build(nodeName, browserName, folder) {
	try {
		rmdirSync(folder);
	} catch (e) {}
	try {
		mkdirSync(folder);
	} catch (e) {}
	const codeNode = readFileSync(join(__dirname, `${nodeName}.js`), "utf8");
	const codeFunction = codeNode
		.replace('"use strict";', "")
		.replace(`module.exports.${nodeName} = ${nodeName};`, "");
	const codeBrowser = `
		"use strict";
		(function(){
			${codeFunction}
			window.${browserName} = ${nodeName};
		})();
	`;
	writeMinified(codeNode, join(folder, `index.js`));
	writeMinified(codeBrowser, join(folder, `browser.js`));
}

build("toJSON", "snapshotToJSON", join(baseFolder, "lib"));
build("removeEmptyAttributes", "snapshotRemoveEmptyAttributes", join(baseFolder, "removeEmptyAttributes"));
