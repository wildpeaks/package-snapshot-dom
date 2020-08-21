/* eslint-env node, mocha */
/* eslint-disable prefer-arrow-callback */
/* eslint-disable no-empty */
"use strict";
const {strictEqual} = require("assert");
const {mkdirSync, readFileSync, writeFileSync} = require("fs");
const {join} = require("path");
const {minify} = require("terser");
const {rmdirSync} = require("rimraf");
const baseFolder = join(__dirname, "../packages/snapshot-dom");

function build(folderName, nodeName, browserName) {
	describe(`Build "${nodeName}"`, function () {
		const folder = join(baseFolder, folderName);
		const codeNode = readFileSync(join(__dirname, `${nodeName}.js`), "utf8");
		before("Reset", function () {
			try {
				rmdirSync(folder);
			} catch (e) {}
			try {
				mkdirSync(folder);
			} catch (e) {}
		});
		it("Node", function () {
			const minified = minify(codeNode);
			strictEqual(typeof minified.code, "string", "minified code is a string");
			writeFileSync(join(folder, `index.js`), minified.code, "utf8");
		});
		it("Browser", function () {
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
			const minified = minify(codeBrowser);
			strictEqual(typeof minified.code, "string", "minified code is a string");
			writeFileSync(join(folder, `browser.js`), minified.code, "utf8");
		});
	});
}

build("lib", "toJSON", "snapshotToJSON");
build("removeEmptyAttributes", "removeEmptyAttributes", "snapshotRemoveEmptyAttributes");
build("sortAttributes", "sortAttributes", "snapshotSortAttributes");
