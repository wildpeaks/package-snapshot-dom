/* eslint-env node, mocha */
"use strict";
const {join} = require("path");
const {readFileSync} = require("fs");
const {deepStrictEqual} = require("assert");
const {JSDOM} = require("jsdom");
const {toJSON} = require("../packages/snapshot-dom/lib");
const {removeEmptyAttributes} = require("../packages/snapshot-dom/removeEmptyAttributes");
const {sortAttributes} = require("../packages/snapshot-dom/sortAttributes");
const fixturesFolder = join(__dirname, "fixtures");

function testInvalidScript1(id, input) {
	it(id, () => {
		deepStrictEqual(toJSON(input), {});
	});
}

function testInvalidScript2(id, input, expectedOutput) {
	it(id, () => {
		removeEmptyAttributes(input);
		deepStrictEqual(input, expectedOutput);
	});
}

function testInvalidScript3(id, input, expectedOutput) {
	it(id, () => {
		sortAttributes(input);
		deepStrictEqual(input, expectedOutput);
	});
}

function testFixture(id, removeEmpty = false, sorted = false, sortNames) {
	it(`Fixture: ${id}`, () => {
		const html = readFileSync(join(fixturesFolder, `${id}.html`), "utf8");
		const expected = JSON.parse(readFileSync(join(fixturesFolder, `${id}.json`), "utf8"));
		const dom = new JSDOM(html);
		const actual = toJSON(dom.window.document.body);
		if (removeEmpty) {
			removeEmptyAttributes(actual);
		}
		if (sorted) {
			sortAttributes(actual, sortNames);
		}
		deepStrictEqual(actual, expected);
	});
}

describe("JSDOM", () => {
	describe("toJSON", () => {
		testInvalidScript1("undefined", undefined);
		testInvalidScript1("0", 0);
		testInvalidScript1("1", 1);
		testInvalidScript1("false", false);
		testInvalidScript1("true", true);
		testInvalidScript1("null", null);
	});
	describe("removeEmptyAttributes", () => {
		testInvalidScript2("undefined", undefined, undefined);
		testInvalidScript2("0", 0, 0);
		testInvalidScript2("1", 1, 1);
		testInvalidScript2("false", false, false);
		testInvalidScript2("true", true, true);
		testInvalidScript2("null", null, null);
	});
	describe("sortAttributes", () => {
		testInvalidScript3("undefined", undefined, undefined);
		testInvalidScript3("0", 0, 0);
		testInvalidScript3("1", 1, 1);
		testInvalidScript3("false", false, false);
		testInvalidScript3("true", true, true);
		testInvalidScript3("null", null, null);
	});
	describe("Fixtures", () => {
		it("Single paragraph in detached element", () => {
			const dom = new JSDOM("<!DOCTYPE html><html><head></head><body></body></html>");
			const {document} = dom.window;
			const element = document.createElement("p");
			element.className = "test2";
			deepStrictEqual(toJSON(element), {
				tagName: "p",
				attributes: {
					class: "test2"
				}
			});
		});
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
