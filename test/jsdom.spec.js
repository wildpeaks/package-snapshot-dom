/* eslint-env node, mocha */
"use strict";
const {join} = require("path");
const {readFileSync} = require("fs");
const {deepStrictEqual} = require("assert");
const {JSDOM} = require("jsdom");
const snapshot = require("..");
const fixturesFolder = join(__dirname, "fixtures");

describe("Invalid", () => {
	it("Missing element", () => {
		deepStrictEqual(snapshot.toJSON(), {});
	});
	it("Invalid element (0)", () => {
		deepStrictEqual(snapshot.toJSON(0), {});
	});
	it("Invalid element (1)", () => {
		deepStrictEqual(snapshot.toJSON(1), {});
	});
	it("Invalid element (false)", () => {
		deepStrictEqual(snapshot.toJSON(false), {});
	});
	it("Invalid element (true)", () => {
		deepStrictEqual(snapshot.toJSON(true), {});
	});
	it("Invalid element (null)", () => {
		deepStrictEqual(snapshot.toJSON(null), {});
	});
	it("Invalid element (undefined)", () => {
		deepStrictEqual(snapshot.toJSON(undefined), {});
	});
});

function testFixture(id, skip) {
	it(`Fixture: ${id}`, () => {
		const html = readFileSync(join(fixturesFolder, `${id}.html`), "utf8");
		const expected = JSON.parse(readFileSync(join(fixturesFolder, `${id}.json`), "utf8"));
		const dom = new JSDOM(html);
		const actual = snapshot.toJSON(dom.window.document.body, skip);
		deepStrictEqual(actual, expected);
	});
}

describe("JSDOM: Valid", () => {
	it("Single paragraph in detached element", () => {
		const dom = new JSDOM("<!DOCTYPE html><html><head></head><body></body></html>");
		const {document} = dom.window;
		const element = document.createElement("p");
		element.className = "test2";
		deepStrictEqual(snapshot.toJSON(element), {
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
	testFixture("empty_attributes_default_behavior");
	testFixture("empty_attributes_skip_false", false);
	testFixture("empty_attributes_skip_true", true);
});
