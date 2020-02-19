/* eslint-env node, mocha, browser */
/* eslint-disable prefer-arrow-callback */
"use strict";
const {deepStrictEqual} = require("assert");
const {readFileSync} = require("fs");
const {join} = require("path");
const puppeteer = require("puppeteer");

const fixturesFolder = join(__dirname, "fixtures");
const script1 = join(__dirname, "../packages/snapshot-dom/lib/browser.js");
const script2 = join(__dirname, "../packages/snapshot-dom/removeEmptyAttributes/browser.js");
const script3 = join(__dirname, "../packages/snapshot-dom/sortAttributes/browser.js");

function testInvalidScript1(id, input) {
	it(
		id,
		/* @this */ async function() {
			this.slow(5000);
			this.timeout(5000);
			let actualNodes;
			const browser = await puppeteer.launch();
			try {
				const page = await browser.newPage();
				await page.addScriptTag({path: script1});
				actualNodes = await page.evaluate(input_ => window.snapshotToJSON(input_), input);
			} finally {
				await browser.close();
			}
			deepStrictEqual(actualNodes, {});
		}
	);
}

function testInvalidScript2(id, input, expectedOutput) {
	it(
		id,
		/* @this */ async function() {
			this.slow(5000);
			this.timeout(5000);
			let actualNodes;
			const browser = await puppeteer.launch();
			try {
				const page = await browser.newPage();
				await page.addScriptTag({path: script2});
				actualNodes = await page.evaluate(input_ => {
					window.snapshotRemoveEmptyAttributes(input_);
					return input_;
				}, input);
			} finally {
				await browser.close();
			}
			deepStrictEqual(actualNodes, expectedOutput);
		}
	);
}

function testInvalidScript3(id, input, expectedOutput) {
	it(
		id,
		/* @this */ async function() {
			this.slow(5000);
			this.timeout(5000);
			let actualNodes;
			const browser = await puppeteer.launch();
			try {
				const page = await browser.newPage();
				await page.addScriptTag({path: script3});
				actualNodes = await page.evaluate(input_ => {
					window.snapshotSortAttributes(input_);
					return input_;
				}, input);
			} finally {
				await browser.close();
			}
			deepStrictEqual(actualNodes, expectedOutput);
		}
	);
}

function testFixture(id, removeEmpty = false, sorted = false, sortNames) {
	it(
		id,
		/* @this */ async function() {
			this.slow(5000);
			this.timeout(5000);
			let actualNodes;
			const browser = await puppeteer.launch();
			try {
				const page = await browser.newPage();
				const html = readFileSync(join(fixturesFolder, `${id}.html`), "utf8");
				await page.setContent(html, {waitUntil: "load"});
				await page.addScriptTag({path: script1});
				await page.addScriptTag({path: script2});
				await page.addScriptTag({path: script3});
				actualNodes = await page.evaluate(
					(removeEmpty_, sorted_, sortNames_) => {
						// eslint-disable-next-line no-var
						var tree = window.snapshotToJSON(document.body);
						if (removeEmpty_) {
							window.snapshotRemoveEmptyAttributes(tree);
						}
						if (sorted_) {
							window.snapshotSortAttributes(tree, sortNames_);
						}
						return tree;
					},
					removeEmpty,
					sorted,
					sortNames
				);
			} finally {
				await browser.close();
			}
			const expectedNodes = JSON.parse(readFileSync(join(fixturesFolder, `${id}.json`), "utf8"));
			deepStrictEqual(actualNodes, expectedNodes);
		}
	);
}

describe("Puppeteer", () => {
	describe("window.snapshotToJSON", () => {
		testInvalidScript1("undefined", undefined);
		testInvalidScript1("0", 0);
		testInvalidScript1("1", 1);
		testInvalidScript1("false", false);
		testInvalidScript1("true", true);
		testInvalidScript1("null", null);
	});
	describe("window.snapshotRemoveEmptyAttributes", () => {
		testInvalidScript2("undefined", undefined, undefined);
		testInvalidScript2("0", 0, 0);
		testInvalidScript2("1", 1, 1);
		testInvalidScript2("false", false, false);
		testInvalidScript2("true", true, true);
		testInvalidScript2("null", null, null);
	});
	describe("window.snapshotSortAttributes", () => {
		testInvalidScript3("undefined", undefined, undefined);
		testInvalidScript3("0", 0, 0);
		testInvalidScript3("1", 1, 1);
		testInvalidScript3("false", false, false);
		testInvalidScript3("true", true, true);
		testInvalidScript3("null", null, null);
	});
	describe("Fixtures", () => {
		testFixture("empty_body");
		testFixture("single_paragraph_in_body");
		testFixture("nested_elements_in_body");
		testFixture("text_fragment");
		testFixture("attributes");
		testFixture("duplicated_attribute_alphabetic_order");
		testFixture("duplicated_attribute_reverse_order");
		testFixture("remove_empty_false", false);
		testFixture("remove_empty_true", true);
		testFixture("sort_false", false, false);
		testFixture("sort_empty", false, true, []);
		testFixture("sort_undefined", false, true, undefined);
		testFixture("sort_null", false, true, null);
		testFixture("sort_true", false, true, ["data-sorted-1", "data-sorted-2"]);
	});
});
