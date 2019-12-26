/* eslint-env node, mocha, browser */
/* eslint-disable prefer-arrow-callback */
"use strict";
const {deepStrictEqual} = require("assert");
const {readFileSync} = require("fs");
const {join} = require("path");
const express = require("express");
const puppeteer = require("puppeteer");

const fixturesFolder = join(__dirname, "fixtures");
const script = join(__dirname, "../lib/browser.js");

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

function testFixture(id, skip) {
	it(`Fixture: ${id}`, /* @this */ async function() {
		this.slow(15000);
		this.timeout(15000);
		let actualNodes;
		const browser = await puppeteer.launch();
		try {
			const page = await browser.newPage();
			await page.goto(`${baseurl}${id}.html`, {waitUntil: "load"});
			await sleep(300);
			await page.addScriptTag({path: script});
			await sleep(300);
			actualNodes = await page.evaluate(opt => window.snapshotToJson(document.body, opt), skip);
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
	testFixture("empty_attributes_default_behavior");
	testFixture("empty_attributes_skip_false", false);
	testFixture("empty_attributes_skip_true", true);
});
