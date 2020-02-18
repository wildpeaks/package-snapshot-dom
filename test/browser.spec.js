/* eslint-env node, mocha, browser */
/* eslint-disable prefer-arrow-callback */
"use strict";
const {deepStrictEqual} = require("assert");
const {readFileSync} = require("fs");
const {join} = require("path");
const express = require("express");
const puppeteer = require("puppeteer");

const fixturesFolder = join(__dirname, "fixtures");
const script1 = join(__dirname, "../packages/snapshot-dom/lib/browser.js");
const script2 = join(__dirname, "../packages/snapshot-dom/removeEmptyAttributes/browser.js");
const script3 = join(__dirname, "../packages/snapshot-dom/sortAttributes/browser.js");

const port = 8888;
const baseurl = `http://localhost:${port}/`;
let app;
let server;

function sleep(duration) {
	return new Promise(resolve => {
		setTimeout(() => {
			resolve();
		}, duration);
	});
}

before(function() {
	return new Promise(resolve => {
		app = express();
		app.use(express.static(fixturesFolder));
		server = app.listen(port, () => {
			resolve();
		});
	});
});
after(function() {
	return new Promise(resolve => {
		server.close(() => {
			resolve();
		});
	});
});

function testFixture(id, removeEmpty = false, sorted = false, sortNames) {
	it(`Fixture: ${id}`, /* @this */ async function() {
		this.slow(15000);
		this.timeout(15000);
		let actualNodes;
		const browser = await puppeteer.launch();
		try {
			const page = await browser.newPage();
			await page.goto(`${baseurl}${id}.html`, {waitUntil: "load"});
			await sleep(300);
			await page.addScriptTag({path: script1});
			await page.addScriptTag({path: script2});
			await page.addScriptTag({path: script3});
			await sleep(300);
			actualNodes = await page.evaluate((removeEmpty_, sorted_, sortNames_) => {
				// eslint-disable-next-line no-var
				var tree = window.snapshotToJSON(document.body);
				if (removeEmpty_) {
					tree = window.snapshotRemoveEmptyAttributes(tree);
				}
				if (sorted_) {
					tree = window.snapshotSortAttributes(tree, sortNames_);
				}
				return tree;
			}, removeEmpty, sorted, sortNames);
		} finally {
			await browser.close();
		}
		const expectedNodes = JSON.parse(readFileSync(join(fixturesFolder, `${id}.json`), "utf8"));
		deepStrictEqual(actualNodes, expectedNodes);
	});
}

describe("Puppeteer", () => {
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
