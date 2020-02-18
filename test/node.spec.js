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

function testFixture(id, removeEmpty = false, sorted = false, sortNames) {
	it(`Fixture: ${id}`, () => {
		const html = readFileSync(join(fixturesFolder, `${id}.html`), "utf8");
		const expected = JSON.parse(readFileSync(join(fixturesFolder, `${id}.json`), "utf8"));
		const dom = new JSDOM(html);
		let actual = toJSON(dom.window.document.body);
		if (removeEmpty) {
			actual = removeEmptyAttributes(actual);
		}
		if (sorted) {
			actual = sortAttributes(actual, sortNames);
		}
		deepStrictEqual(actual, expected);
	});
}

describe("Invalid", () => {
	it("Missing element", () => {
		deepStrictEqual(toJSON(), {});
	});
	it("Invalid element (0)", () => {
		deepStrictEqual(toJSON(0), {});
	});
	it("Invalid element (1)", () => {
		deepStrictEqual(toJSON(1), {});
	});
	it("Invalid element (false)", () => {
		deepStrictEqual(toJSON(false), {});
	});
	it("Invalid element (true)", () => {
		deepStrictEqual(toJSON(true), {});
	});
	it("Invalid element (null)", () => {
		deepStrictEqual(toJSON(null), {});
	});
	it("Invalid element (undefined)", () => {
		deepStrictEqual(toJSON(undefined), {});
	});
});

describe("JSDOM", () => {
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
